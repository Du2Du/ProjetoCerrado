from sqlalchemy import func
from app.pricing import bp
from app.extensions import db
from app.models.culture import Culture
from app.models.price_record import PriceRecord
from app.pricing.helper import serialize_culture, serialize_price_record
from flask import jsonify, request

@bp.route('/cultures', methods=['GET'])
def get_cultures():
    """
    Lista todas as culturas agrícolas disponíveis
    ---
    tags:
      - Pricing
    summary: Retorna as culturas cadastradas
    description: >
      Endpoint para consultar todas as culturas agrícolas disponíveis no sistema.
    produces:
      - application/json
    responses:
      200:
        description: Lista de culturas retornada com sucesso
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
              name:
                type: string
                example: Soja
            required:
              - id
              - name
        examples:
          application/json:
            - id: 1
              name: Soja
            - id: 2
              name: Milho
            - id: 3
              name: Eucalipto
    """
    cultures = Culture.query.all()
    return jsonify([serialize_culture(culture) for culture in cultures])

@bp.route('/prices', methods=['GET'])
def get_prices():
    """
    Retorna os registros de preço de uma cultura específica
    ---
    tags:
      - Pricing
    summary: Consulta preços por cultura
    description: >
      Endpoint para listar os registros de preço associados a uma cultura agrícola
      específica, informada pelo parâmetro culture_id.
    produces:
      - application/json
    parameters:
      - in: query
        name: culture_id
        type: integer
        required: true
        description: ID da cultura agrícola
        example: 1
    responses:
      200:
        description: Lista de preços retornada com sucesso
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 10
              culture_id:
                type: integer
                example: 1
              city:
                type: string
                example: Rio Verde
              state:
                type: string
                example: GO
              price:
                type: number
                format: float
                example: 135.75
              start_date:
                type: string
                format: date
                example: 2026-05-01
              end_date:
                type: string
                format: date
                example: 2026-05-15
            required:
              - id
              - culture_id
              - city
              - state
              - price
              - start_date
              - end_date
        examples:
          application/json:
            - id: 10
              culture_id: 1
              city: Rio Verde
              state: GO
              price: 135.75
              start_date: 2026-05-01
              end_date: 2026-05-15
            - id: 11
              culture_id: 1
              city: Jataí
              state: GO
              price: 132.40
              start_date: 2026-05-01
              end_date: 2026-05-15
      400:
        description: Parâmetro obrigatório não informado
        schema:
          type: object
          properties:
            error:
              type: string
              example: culture_id parameter is required
        examples:
          application/json:
            error: culture_id parameter is required
    """
    culture_id = request.args.get('culture_id', type=int)
    
    if not culture_id:
        return jsonify({"error": "culture_id parameter is required"}), 400
    
    prices = PriceRecord.query.filter_by(culture_id=culture_id).all()
    
    return jsonify([serialize_price_record(price) for price in prices])

@bp.route('/prices-by-location', methods=['GET'])
def get_prices_by_location():
    """
    Retorna preços de todas as culturas para uma localização específica
    ---
    tags:
      - Pricing
    summary: Consulta preços por localização
    description: >
      Endpoint para listar os registros de preço de todas as culturas agrícolas
      para uma cidade e estado específicos.
    produces:
      - application/json
    parameters:
      - in: query
        name: state
        type: string
        required: true
        description: Sigla do estado
        example: GO
      - in: query
        name: city
        type: string
        required: true
        description: Nome da cidade
        example: Rio Verde
    responses:
      200:
        description: Lista de preços da localização retornada com sucesso
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 21
              culture_id:
                type: integer
                example: 2
              city:
                type: string
                example: Rio Verde
              state:
                type: string
                example: GO
              price:
                type: number
                format: float
                example: 98.30
              start_date:
                type: string
                format: date
                example: 2026-05-01
              end_date:
                type: string
                format: date
                example: 2026-05-15
            required:
              - id
              - culture_id
              - city
              - state
              - price
              - start_date
              - end_date
        examples:
          application/json:
            - id: 21
              culture_id: 2
              city: Rio Verde
              state: GO
              price: 98.30
              start_date: 2026-05-01
              end_date: 2026-05-15
            - id: 22
              culture_id: 5
              city: Rio Verde
              state: GO
              price: 145.90
              start_date: 2026-05-01
              end_date: 2026-05-15
      400:
        description: Parâmetros obrigatórios não informados
        schema:
          type: object
          properties:
            error:
              type: string
              example: Both state and city parameters are required
        examples:
          application/json:
            error: Both state and city parameters are required
    """
    state = request.args.get('state')
    city = request.args.get('city')
    
    if not state or not city:
        return jsonify({"error": "Both state and city parameters are required"}), 400
    
    prices = PriceRecord.query.filter_by(state=state, city=city).all()
    
    return jsonify([serialize_price_record(price) for price in prices])

@bp.route('/cities', methods=['GET'])
def get_cities():
    """
    Lista todas as cidades disponíveis com seus respectivos estados
    ---
    tags:
      - Pricing
    summary: Retorna cidades únicas cadastradas
    description: >
      Endpoint para consultar todas as combinações distintas de cidade e estado
      presentes nos registros de preços.
    produces:
      - application/json
    responses:
      200:
        description: Lista de cidades retornada com sucesso
        schema:
          type: array
          items:
            type: object
            properties:
              city:
                type: string
                example: Rio Verde
              state:
                type: string
                example: GO
            required:
              - city
              - state
        examples:
          application/json:
            - city: Rio Verde
              state: GO
            - city: Jataí
              state: GO
            - city: Luís Eduardo Magalhães
              state: BA
    """
    city_state_records = db.session.query(
        PriceRecord.city,
        PriceRecord.state
    ).distinct().all()

    result = [{'city': city, 'state': state} for city, state in city_state_records]

    return jsonify(result)

@bp.route('/states', methods=['GET'])
def get_states():
    """
    Lista todos os estados disponíveis
    ---
    tags:
      - Pricing
    summary: Retorna estados únicos cadastrados
    description: >
      Endpoint para consultar todas as siglas de estados distintas presentes
      nos registros de preços, ordenadas alfabeticamente.
    produces:
      - application/json
    responses:
      200:
        description: Lista de estados retornada com sucesso
        schema:
          type: array
          items:
            type: string
            example: GO
        examples:
          application/json:
            - GO
            - BA
            - MT
            - MS
    """
    states = db.session.query(PriceRecord.state).distinct().order_by(PriceRecord.state).all()
    
    state_list = [state[0] for state in states]
    
    return jsonify(state_list)

@bp.route('/cities-by-state', methods=['GET'])
def get_cities_by_state():
    """
    Lista todas as cidades de um estado específico
    ---
    tags:
      - Pricing
    summary: Retorna cidades por estado
    description: >
      Endpoint para consultar todas as cidades distintas associadas a um estado
      específico nos registros de preços, ordenadas alfabeticamente.
    produces:
      - application/json
    parameters:
      - in: query
        name: state
        type: string
        required: true
        description: Sigla do estado
        example: GO
    responses:
      200:
        description: Lista de cidades retornada com sucesso
        schema:
          type: array
          items:
            type: string
            example: Rio Verde
        examples:
          application/json:
            - Goiânia
            - Jataí
            - Rio Verde
      400:
        description: Parâmetro obrigatório não informado
        schema:
          type: object
          properties:
            error:
              type: string
              example: state parameter is required
        examples:
          application/json:
            error: state parameter is required
    """
    state = request.args.get('state')
    
    if not state:
        return jsonify({"error": "state parameter is required"}), 400
    
    cities = db.session.query(PriceRecord.city).filter_by(state=state).distinct().order_by(PriceRecord.city).all()
    
    city_list = [city[0] for city in cities]
    
    return jsonify(city_list)

@bp.route('/price-stats', methods=['GET'])
def get_price_stats():
    """
    Retorna estatísticas de preços por cultura
    ---
    tags:
      - Pricing
    summary: Consulta estatísticas de preços
    description: >
      Endpoint para consultar estatísticas agregadas de preços por cultura,
      incluindo valor mínimo, máximo e médio. Os resultados podem ser
      filtrados opcionalmente por estado e cidade.
    produces:
      - application/json
    parameters:
      - in: query
        name: state
        type: string
        required: false
        description: Sigla do estado para filtrar os resultados
        example: GO
      - in: query
        name: city
        type: string
        required: false
        description: Nome da cidade para filtrar os resultados
        example: Rio Verde
    responses:
      200:
        description: Estatísticas de preços retornadas com sucesso
        schema:
          type: array
          items:
            type: object
            properties:
              culture_id:
                type: integer
                example: 1
              culture_name:
                type: string
                example: Soja
              min_price:
                type: number
                format: float
                example: 120.5
              max_price:
                type: number
                format: float
                example: 145.9
              avg_price:
                type: number
                format: float
                example: 133.2
            required:
              - culture_id
              - culture_name
              - min_price
              - max_price
              - avg_price
        examples:
          application/json:
            - culture_id: 1
              culture_name: Soja
              min_price: 120.5
              max_price: 145.9
              avg_price: 133.2
            - culture_id: 2
              culture_name: Milho
              min_price: 89.0
              max_price: 102.4
              avg_price: 95.7
    """
    state = request.args.get('state')
    city = request.args.get('city')
    
    query = db.session.query(
        PriceRecord.culture_id,
        func.min(PriceRecord.price).label('min_price'),
        func.max(PriceRecord.price).label('max_price'),
        func.avg(PriceRecord.price).label('avg_price')
    )
    
    if state:
        query = query.filter(PriceRecord.state == state)
    if city:
        query = query.filter(PriceRecord.city == city)
    
    stats = query.group_by(PriceRecord.culture_id).all()
    
    culture_map = {culture.id: culture.name for culture in Culture.query.all()}
    
    result = [{
        'culture_id': stat.culture_id,
        'culture_name': culture_map.get(stat.culture_id, 'Unknown'),
        'min_price': stat.min_price,
        'max_price': stat.max_price,
        'avg_price': round(stat.avg_price, 2)
    } for stat in stats]
    
    return jsonify(result)

@bp.route('/recent-prices', methods=['GET'])
def get_recent_prices():
    """
    Retorna os registros de preço mais recentes por cultura e localização
    ---
    tags:
      - Pricing
    summary: Consulta os preços mais recentes por estado
    description: >
      Endpoint para consultar os registros de preço mais recentes para cada
      combinação de cultura e cidade dentro de um estado específico, com base
      na maior data final disponível.
    produces:
      - application/json
    parameters:
      - in: query
        name: state
        type: string
        required: true
        description: Sigla do estado usado no filtro
        example: GO
    responses:
      200:
        description: Lista de registros mais recentes retornada com sucesso
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 101
              culture_id:
                type: integer
                example: 1
              city:
                type: string
                example: Rio Verde
              state:
                type: string
                example: GO
              price:
                type: number
                format: float
                example: 138.2
              start_date:
                type: string
                format: date
                example: 2026-05-01
              end_date:
                type: string
                format: date
                example: 2026-05-15
            required:
              - id
              - culture_id
              - city
              - state
              - price
              - start_date
              - end_date
        examples:
          application/json:
            - id: 101
              culture_id: 1
              city: Rio Verde
              state: GO
              price: 138.2
              start_date: 2026-05-01
              end_date: 2026-05-15
            - id: 102
              culture_id: 2
              city: Jataí
              state: GO
              price: 97.4
              start_date: 2026-05-01
              end_date: 2026-05-15
      400:
        description: Parâmetro obrigatório não informado
        schema:
          type: object
          properties:
            error:
              type: string
              example: state parameter is required
        examples:
          application/json:
            error: state parameter is required
    """
    state = request.args.get('state')

    if not state:
        return jsonify({"error": "state parameter is required"}), 400

    latest_dates = db.session.query(
        PriceRecord.culture_id,
        PriceRecord.city,
        PriceRecord.state,
        func.max(PriceRecord.end_date).label('max_date')
    ).filter(
        PriceRecord.state == state
    ).group_by(
        PriceRecord.culture_id,
        PriceRecord.city,
        PriceRecord.state
    ).subquery()

    latest_prices = db.session.query(PriceRecord).join(
        latest_dates,
        db.and_(
            PriceRecord.culture_id == latest_dates.c.culture_id,
            PriceRecord.city == latest_dates.c.city,
            PriceRecord.state == latest_dates.c.state,
            PriceRecord.end_date == latest_dates.c.max_date
        )
    ).all()

    return jsonify([serialize_price_record(price) for price in latest_prices])


@bp.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response