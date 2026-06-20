import json
import os
from app import app

with app.test_client() as client:
    response = client.get('/apispec_1.json')
    spec = json.loads(response.data)

doc_dir = os.path.join(os.path.dirname(__file__), 'docs')
os.makedirs(doc_dir, exist_ok=True)

with open(os.path.join(doc_dir, 'swagger.json'), 'w', encoding='utf-8') as f:
    json.dump(spec, f, indent=2, ensure_ascii=False)

spec_js = json.dumps(spec, ensure_ascii=False)

html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia Cerrado API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
  <style>
    body {{
      margin: 0;
      background: #fafafa;
    }}
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    const spec = {spec_js};

    SwaggerUIBundle({{
      spec: spec,
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: 'BaseLayout',
      deepLinking: true
    }});
  </script>
</body>
</html>"""

with open(os.path.join(doc_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ index.html autocontido gerado com sucesso")