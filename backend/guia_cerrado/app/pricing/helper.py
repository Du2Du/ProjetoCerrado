import requests
import traceback
import math
import pandas as pd
from app.models.culture import Culture
from app.models.price_record import PriceRecord
from datetime import datetime
from io import StringIO


# Function to fetch and process data
def fetch_and_process_data(app, db, logger):
    with app.app_context():
        url = "https://portaldeinformacoes.conab.gov.br/downloads/arquivos/PrecosSemanalMunicipio.txt"
        
        try:
            # Fetch the data
            response = requests.get(url)
            if response.status_code != 200:
                logger.error(f"Failed to fetch pricing data. Status code: {response.status_code}")
                return
            
            # Convert TXT to CSV format
            csv_data = StringIO(response.text)
            df = pd.read_csv(csv_data, delimiter=';') 
            
            # Process the dataframe
            for _, row in df.iterrows():
                culture_name = row.get('produto').strip()
                city = row.get('nom_municipio').strip().split('-')[0]
                state = row.get('uf').strip()
                price = row.get('valor_produto_kg')
                if type(price) == float and math.isnan(price):
                    continue
                price = float(price.strip().replace(',', '.'))
                date = row.get('data_inicial_final_semana').strip()
                
                if not all([culture_name, city, state, price, date]):
                    continue

                if culture_name != 'BOI' and culture_name != 'LEITE DE VACA' and culture_name != 'LATEX':
                    continue

                if culture_name == 'LEITE DE VACA' and row.get('classificao_produto').strip() != 'IN NATURA':
                    continue

                # Parse dates
                try:
                    start_date = datetime.strptime(date.split(" - ")[0], '%d-%m-%Y')
                    end_date = datetime.strptime(date.split(" - ")[1], '%d-%m-%Y')
                except ValueError:
                    continue
                
                # Find or create culture
                culture = Culture.query.filter_by(name=culture_name).first()
                if not culture:
                    logger.info(f"Culture '{culture_name}' not found. Creating new entry.")
                    culture = Culture(name=culture_name)
                    db.session.add(culture)
                    db.session.commit()
                
                # Check if we already have a price record for this culture, state, and date
                existing_record = PriceRecord.query.filter_by(
                    culture_id=culture.id,
                    city=city,
                    state=state,
                ).first()
                
                if existing_record is None:
                    # Não existe: insere novo
                    logger.info(f"Creating new price record for culture '{culture_name}' in {city}-{state}.")
                    new_record = PriceRecord(
                        culture_id=culture.id,
                        city=city,
                        state=state,
                        price=price,
                        start_date=start_date,
                        end_date=end_date
                    )
                    db.session.add(new_record)
                else:
                    # Existe: verifica a data final
                    if end_date > existing_record.end_date:
                        logger.info(f"Updating existing price record for culture '{culture_name}' in {city}-{state}.")
                        existing_record.price = price
                        existing_record.start_date = start_date
                        existing_record.end_date = end_date
                        db.session.commit()
        
        except Exception as e:
            logger.error(f"Error processing data: {str(e)}")
            traceback.print_exc()
            db.session.rollback()  # Rollback transaction on error

def serialize_price_record(price_record):
    return {
        'id': price_record.id,
        'culture_id': price_record.culture_id,
        'city': price_record.city,
        'state': price_record.state,
        'price': price_record.price,
        'start_date': price_record.start_date.strftime('%Y-%m-%d'),
        'end_date': price_record.end_date.strftime('%Y-%m-%d')
    }

def serialize_culture(culture):
    return {
        'id': culture.id,
        'name': culture.name
    }
