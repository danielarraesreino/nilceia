import urllib.request, json
req = urllib.request.Request(
    'https://api.freellmapi.com/v1/models',
    headers={'Authorization': 'Bearer freellmapi-c58abc73c90a86d5b0bbf9c22761664f161ff0c2cba0352c'}
)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        models = [m['id'] for m in data.get('data', [])]
        print(f"Models: {models[:20]}...")
except Exception as e:
    print(e)
