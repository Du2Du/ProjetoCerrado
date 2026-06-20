import logging
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flasgger import Swagger
from logging import Formatter
from datetime import datetime
from config import Config
from app.extensions import db

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
swagger = Swagger(app)

CORS(app, 
     origins=["http://localhost:5173", "https://guia.projetocerradoifg.org", "https://projetocerradoifg.org"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # List all allowed methods
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],  # Common headers
     supports_credentials=True,  # Allow cookies in cross-origin requests if needed
     max_age=3600  # Cache preflight requests for 1 hour
)

from app.models.culture import Culture
from app.models.price_record import PriceRecord
with app.app_context():
    db.create_all()

# Initialize Flask extensions here
class FlaskFormatter(Formatter):
    def formatTime(self, record, datefmt=None):
        """
        Custom time formatter to match '[12/Jun/2024 08:22:08]' format.
        """
        dt = datetime.fromtimestamp(record.created)
        return dt.strftime('%d/%b/%Y %H:%M:%S')

    def format(self, record):
        record.client_ip = request.remote_addr if request else 'Unknown'
        record.request_line = f'{request.method} {request.path} {request.scheme.upper()}/{request.environ["SERVER_PROTOCOL"]}' if request else ''
        return super().format(record)


formatter = FlaskFormatter(
    '%(client_ip)s - [%(asctime)s] - %(levelname)s "%(request_line)s" %(message)s'
)

handler = logging.StreamHandler()
handler.setFormatter(formatter)
handler.setLevel(logging.DEBUG)

# Obter o logger da aplicação
logger = app.logger

# Remover manipuladores existentes
logger.handlers = []

# Adicionar o novo manipulador
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

# Register blueprints here
from app.recommendation import bp as recommendation_bp
app.register_blueprint(recommendation_bp)
from app.pricing import bp as pricing_bp
app.register_blueprint(pricing_bp)

from app.pricing import start_scheduler
start_scheduler(app, db, logger)

@app.route('/test/')
def test_page():
    return '<h1>Testing the Flask Application Factory Pattern</h1>'