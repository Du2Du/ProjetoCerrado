FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

# ⚠️ Substitua "guia_cerrado" pelo nome do módulo Django onde fica o wsgi.py
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "guia_cerrado.wsgi:application"]