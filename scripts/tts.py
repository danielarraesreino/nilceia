import sys, os, json, urllib.request

if len(sys.argv) < 3:
    print("Uso: python tts.py <output_file> <text_file>")
    sys.exit(1)

out_file = sys.argv[1]
text_file = sys.argv[2]

with open(text_file, 'r', encoding='utf-8') as f:
    text = f.read().strip()

api_key = os.environ.get("NVIDIA_API_KEY")
if not api_key:
    print("Erro: NVIDIA_API_KEY não encontrada.")
    sys.exit(1)

# Descobrir o Function ID correto para o magpie-tts-multilingual
req = urllib.request.Request("https://api.nvcf.nvidia.com/v2/nvcf/functions?visibility=public,authorized")
req.add_header("Authorization", f"Bearer {api_key}")
req.add_header("Accept", "application/json")

fid = None
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        for f in data.get('functions', []):
            if f.get('status') == 'ACTIVE' and f.get('name', '').removeprefix('ai-') == 'magpie-tts-multilingual':
                fid = f['id']
                break
except Exception as e:
    print(f"Erro ao buscar function-id: {e}")
    sys.exit(1)

if not fid:
    print("Função TTS magpie-tts-multilingual não encontrada ou não ativa!")
    sys.exit(1)

print(f"Function ID encontrado: {fid}")

# Agora usamos o riva.client para a síntese gRPC
try:
    import wave, riva.client
except ImportError:
    print("Erro: módulo riva.client não instalado. Rode: pip install nvidia-riva-client")
    sys.exit(1)

server = "grpc.nvcf.nvidia.com:443"
is_cloud = True

md = [["function-id", fid], ["authorization", f"Bearer {api_key}"]]
auth = riva.client.Auth(uri=server, use_ssl=is_cloud, metadata_args=md)
tts = riva.client.SpeechSynthesisService(auth)
sr = 44100

import re

def chunk_text(text, max_len=150):
    # Primeiro quebra por pontuações fortes
    sentences = re.split(r'(?<=[.!?]) +|\n+', text.strip())
    
    chunks = []
    current = ""
    
    for s in sentences:
        if not s.strip(): continue
        
        # Se a própria frase for maior que max_len, quebra por vírgula ou força
        if len(s) > max_len:
            sub_parts = re.split(r'(?<=[,;]) +', s)
            for sub in sub_parts:
                if len(sub) > max_len:
                    # Hard split em pedaços menores
                    for i in range(0, len(sub), max_len):
                        chunks.append(sub[i:i+max_len])
                else:
                    if len(current) + len(sub) < max_len:
                        current += sub + " "
                    else:
                        if current: chunks.append(current.strip())
                        current = sub + " "
        else:
            if len(current) + len(s) < max_len:
                current += s + " "
            else:
                if current: chunks.append(current.strip())
                current = s + " "
            
    if current:
        chunks.append(current.strip())
    return [c for c in chunks if c]

chunks = chunk_text(text)
print(f"Texto dividido em {len(chunks)} partes...")

try:
    with wave.open(out_file, "wb") as w_out:
        w_out.setnchannels(1)
        w_out.setsampwidth(2)
        w_out.setframerate(sr)
        
        for i, chunk in enumerate(chunks):
            print(f"Sintetizando parte {i+1}/{len(chunks)} ({len(chunk)} chars)...")
            resp = tts.synthesize(
                text=chunk,
                voice_name="Magpie-Multilingual",
                language_code="pt-BR",
                encoding=riva.client.AudioEncoding.LINEAR_PCM,
                sample_rate_hz=sr,
            )
            w_out.writeframes(resp.audio)
            
    print(f"Áudio final gravado com sucesso em {out_file}")
except Exception as e:
    print(f"Erro na síntese: {e}")
    sys.exit(1)
