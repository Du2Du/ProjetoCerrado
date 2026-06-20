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

---

## 1️⃣ Preparar a VPS (fazer uma vez)

```bash
# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Instalar Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Instalar Nginx e Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Criar pasta do projeto
sudo mkdir -p /opt/guia-cerrado
sudo chown -R $USER:$USER /opt/guia-cerrado

# Clonar o repo
git clone https://github.com/seu-usuario/guia-cerrado.git /opt/guia-cerrado
```

---

## 2️⃣ Criar o .env do backend na VPS

```bash
# Criar e editar o arquivo (nunca commitar este arquivo!)
nano /opt/guia-cerrado/backend/.env
```

Conteúdo:
```env
DJANGO_SECRET_KEY=sua-chave-secreta-aqui
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=projetocerradoifg.org,www.projetocerradoifg.org
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 3️⃣ Configurar o Nginx na VPS

```bash
# Copiar a config
sudo cp /opt/guia-cerrado/nginx.conf /etc/nginx/sites-available/guia-cerrado

# Editar e substituir "projetocerradoifg.org" pelo domínio real
sudo nano /etc/nginx/sites-available/guia-cerrado

# Ativar o site
sudo ln -s /etc/nginx/sites-available/guia-cerrado /etc/nginx/sites-enabled/

# Testar e recarregar
sudo nginx -t
sudo systemctl reload nginx

# Gerar SSL
sudo certbot --nginx -d projetocerradoifg.org -d www.projetocerradoifg.org
```

---

## 4️⃣ Subir os containers pela primeira vez

```bash
cd /opt/guia-cerrado
docker compose up -d --build

# Verificar se estão rodando
docker ps
```

---

## 5️⃣ Configurar GitHub Actions

### Gerar chave SSH para o Actions (rodar na VPS)

```bash
ssh-keygen -t ed25519 -C "github-actions-guia-cerrado" -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Copiar o conteúdo abaixo para o Secret VPS_SSH_KEY no GitHub
cat ~/.ssh/github_actions
```

### Adicionar Secrets no GitHub

Vá em **Settings → Secrets and variables → Actions** do repo e adicione:

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP da sua VPS |
| `VPS_USER` | Usuário SSH (ex: `root`) |
| `VPS_SSH_KEY` | Conteúdo da chave privada gerada acima |

### Pronto! O fluxo de deploy será:

```
git push origin main
       ↓
GitHub Actions detecta o push
       ↓
SSH na VPS → git pull → docker compose up --build → migrate
       ↓
✅ Deploy feito!
```

---

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

---

## ✅ Checklist

- [ ] Repo clonado em `/opt/guia-cerrado`
- [ ] `.env` criado manualmente em `backend/.env`
- [ ] `Dockerfile` presente em `frontend/` e `backend/`
- [ ] `guia_cerrado` substituído no CMD do `backend/Dockerfile`
- [ ] `docker compose up -d --build` funcionando
- [ ] Nginx configurado com o domínio real
- [ ] SSL gerado com Certbot
- [ ] Secrets adicionados no GitHub
- [ ] Push na main → deploy automático funcionando ✅
