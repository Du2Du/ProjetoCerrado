from flask import Blueprint
from apscheduler.schedulers.background import BackgroundScheduler
from app.pricing.helper import fetch_and_process_data


bp = Blueprint('pricing', __name__)

scheduler = BackgroundScheduler()

def start_scheduler(app, db, logger):
    if not scheduler.running:
        fetch_and_process_data(app, db, logger)  # Initial fetch and process
        scheduler.add_job(fetch_and_process_data, 'cron', hour=0, minute=0, args=[app, db, logger])
        scheduler.start()

from app.pricing import routes
