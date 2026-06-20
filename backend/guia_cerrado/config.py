import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    load_dotenv()

    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MARITACA_API_KEY = os.getenv('MARITACA_API_KEY')

    # Flasgger
    SWAGGER = {
        'title': 'Guia Cerrado API',
        'uiversion': 3,
        'version': '1.0.0',
        'description': 'Documentação da API do Guia Cerrado',
        'doc_dir': os.path.join(basedir, 'doc'),
    }