import sys, os, json, urllib.request

api_key = os.environ.get("NVIDIA_API_KEY")
req = urllib.request.Request("https://api.nvcf.nvidia.com/v2/nvcf/functions?visibility=public,authorized")
req.add_header("Authorization", f"Bearer {api_key}")
req.add_header("Accept", "application/json")

fid = None
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read())
    for f in data.get('functions', []):
        if f.get('status') == 'ACTIVE' and f.get('name', '').removeprefix('ai-') == 'magpie-tts-multilingual':
            fid = f['id']
            break

import riva.client
auth = riva.client.Auth(uri="grpc.nvcf.nvidia.com:443", use_ssl=True, metadata_args=[["function-id", fid], ["authorization", f"Bearer {api_key}"]])
tts = riva.client.SpeechSynthesisService(auth)

cfg = tts.stub.GetRivaSynthesisConfig(riva.client.proto.riva_tts_pb2.RivaSynthesisConfigRequest(), metadata=auth.get_auth_metadata())
for m in cfg.model_config:
    voices = m.parameters.get("voice_name", "")
    langs  = m.parameters.get("language_code", "")
    if "pt-BR" in langs:
        print(f"[{langs}] voices={voices}")
