# 🚀 Deploy — guia-cerrado (Monorepo)

## Estrutura do repositório

```
ProjetoCerrado/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions (deploy automático)
├── frontend/
│   ├── Dockerfile
│   └── index.html, css/, js/ ...
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── .env                  ← criar manualmente na VPS, nunca commitar
│   ├── requirements.txt
│   └── guia_cerrado/         ← módulo Django com wsgi.py
├── docker-compose.yml        ← orquestra os dois serviços
├── nginx.conf                ← copiar para a VPS
└── .gitignore
```

---

## Arquitetura na VPS

```
Internet (80/443)
       │
    [Nginx]  ← reverse proxy + SSL (Let's Encrypt)
       │
       ├── /       → guia-cerrado-frontend (porta 8080)
       └── /api/   → guia-cerrado-backend  (porta 8000)
```

## 🔧 Comandos úteis no dia a dia

```bash
# Ver logs em tempo real
docker logs guia-cerrado-frontend -f
docker logs guia-cerrado-backend -f

# Reiniciar apenas um serviço
docker compose -f /opt/guia-cerrado/docker-compose.yml restart backend
docker compose -f /opt/guia-cerrado/docker-compose.yml restart frontend

# Acessar shell do container Django
docker exec -it guia-cerrado-backend bash

# Rodar comandos Django
docker exec guia-cerrado-backend python manage.py createsuperuser
docker exec guia-cerrado-backend python manage.py shell
docker exec guia-cerrado-backend python manage.py migrate

# Derrubar tudo (raramente necessário)
docker compose -f /opt/guia-cerrado/docker-compose.yml down
```
