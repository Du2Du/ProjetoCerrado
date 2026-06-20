import openmeteo_requests
import geopandas as gpd
import requests_cache
import pandas as pd
from retry_requests import retry
from shapely.geometry import Point, Polygon

# Caminho para o arquivo shapefile (somente a base do nome, sem extensão)
SHAPE_PATH = "data/biome_border.shp"

# Cerrado soil types by sub-region
CERRADO_SOIL_REGIONS = [
    {
        "name": "Cerrado Setentrional",
        "polygon": Polygon([[-5.0, -60.0], [-5.0, -45.0], [-10.0, -45.0], [-10.0, -60.0]]),
        "soil": {
            "type": "Latossolos Vermelhos Distróficos",
            "description": "Solos muito profundos, fortemente intemperizados e ácidos, comuns em regiões mais úmidas do norte do Cerrado.",
            "ph_level": "4,0–5,0 (ácido)",
            "fertility": "Muito baixa",
            "minerals": "Óxidos de ferro e alumínio, quartzo",
            "notes": "Alta presença de alumínio tóxico, baixa retenção de nutrientes"
        }
    },
    {
        "name": "Cerrado Central",
        "polygon": Polygon([[-10.0, -60.0], [-10.0, -45.0], [-17.0, -45.0], [-17.0, -60.0]]),
        "soil": {
            "type": "Latossolos Vermelho-Amarelos",
            "description": "Solos bem drenados, com maior variação textural e maior ocorrência de argilas em relação ao norte.",
            "ph_level": "4,5-5,5 (ácido)",
            "fertility": "Baixa a moderada",
            "minerals": "Argilominerais, ferro, alumínio",
            "notes": "Zona típica de uso agrícola com correção de acidez e adubação intensiva"
        }
    },
    {
        "name": "Cerrado Meridional",
        "polygon": Polygon([[-17.0, -60.0], [-17.0, -45.0], [-24.0, -45.0], [-24.0, -60.0]]),
        "soil": {
            "type": "Neossolos Quartzarênicos e Cambissolos",
            "description": "Solos arenosos e rasos, com menor desenvolvimento e presença de minerais mais jovens nas áreas de transição com o sul do Brasil.",
            "ph_level": "5,0-6,0 (moderadamente ácido)",
            "fertility": "Baixa",
            "minerals": "Quartzo predominante, baixos teores de argila",
            "notes": "Alta vulnerabilidade à erosão e baixa capacidade de retenção de água"
        }
    }
]

CERRADO_VEGETATION_REGIONS = [
    {
        "name": "Cerradão",
        "polygon": Polygon([[-7.0, -54.0], [-7.0, -46.0], [-13.0, -46.0], [-13.0, -54.0]]),
        "vegetation": {
            "category": "Cerradão (Savana Florestal)",
            "species": ["Pequi (Caryocar brasiliense)", "Sucupira (Pterodon emarginatus)", "Barbatimão (Stryphnodendron spp.)", "Pau-terra (Qualea spp.)"],
            "description": "Vegetação densa com dossel quase fechado, árvores altas (15–20 m) e maior biomassa que outros tipos de Cerrado.",
            "conservation_status": "Em perigo - Menos de 20% da cobertura original preservada",
            "ecological_notes": "Transição para formações florestais úmidas, importante para conectividade ecológica."
        }
    },
    {
        "name": "Cerrado sensu stricto",
        "polygon": Polygon([[-5.0, -60.0], [-5.0, -42.0], [-18.0, -42.0], [-18.0, -60.0]]),
        "vegetation": {
            "category": "Cerrado típico (Savana arborizada)",
            "species": ["Pequi", "Lobeira", "Ipê", "Canela-de-Ema"],
            "description": "Savana com árvores tortuosas, espaçadas e gramíneas no sub-bosque. Ocupa a maior parte do bioma.",
            "conservation_status": "Vulnerável - Pressionado por agropecuária e expansão urbana",
            "ecological_notes": "Alta diversidade florística e endemismo elevado; manutenção do regime de fogo é essencial."
        }
    },
    {
        "name": "Campo Limpo",
        "polygon": Polygon([[-14.0, -52.0], [-14.0, -44.0], [-22.0, -44.0], [-22.0, -52.0]]),
        "vegetation": {
            "category": "Campo Limpo (Gramíneas herbáceas)",
            "species": ["Andropogon spp.", "Axonopus spp.", "Paspalum spp."],
            "description": "Formação aberta, dominada por gramíneas e ervas. Praticamente sem vegetação lenhosa.",
            "conservation_status": "Criticamente em perigo - Forte conversão para lavouras e pastagens exóticas",
            "ecological_notes": "Alto risco de degradação por superpastejo; solos pobres e suscetíveis à erosão."
        }
    },
    {
        "name": "Campo Sujo",
        "polygon": Polygon([[-10.0, -57.0], [-10.0, -47.0], [-20.0, -47.0], [-20.0, -57.0]]),
        "vegetation": {
            "category": "Campo Sujo (Savana aberta)",
            "species": ["Arbustos dispersos", "Pequenas árvores", "Gramíneas nativas"],
            "description": "Savana mais aberta com arbustos e árvores de pequeno porte intercalados com gramíneas.",
            "conservation_status": "Em perigo - Ameaçado por pecuária extensiva e fogo descontrolado",
            "ecological_notes": "Forma ecótono com o Cerrado típico; importante para espécies do estrato baixo."
        }
    }
]

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

def is_cerrado(lat, lng):
    # Carregando o shapefile
    gdf = gpd.read_file(SHAPE_PATH)

    # Convertendo para WGS84 (lat/lon), se necessário
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs(epsg=4326)

    point = Point(lng, lat)

    # Verifica se o ponto está contido em algum polígono
    return gdf.contains(point).any()

def get_cerrado_data(lat, lng):
    # Get climate data
    climate_data = get_cerrado_climate_data(lat, lng)

    point = Point(lng, lat)
    
    # Get soil type data
    soil_data = get_cerrado_soil_data(point)
    
    # Get vegetation data
    vegetation_data = get_cerrado_vegetation_data(point)
    
    return {
        "climate": climate_data,
        "soil": soil_data,
        "vegetation": vegetation_data
    }

def get_cerrado_climate_data(lat, lng):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lng,
        "hourly": ["temperature_2m", "rain", "precipitation", "relative_humidity_2m", "soil_temperature_0cm"],
        "current": ["temperature_2m", "rain", "precipitation", "relative_humidity_2m", "soil_temperature_0cm"],
        "forecast_days": 14
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]

    coordinates = {
        "latitude": response.Latitude(),
        "longitude": response.Longitude()
    }

    # Current values. The order of variables needs to be the same as requested.
    current = response.Current()
    current_temperature_2m = current.Variables(0).Value()
    current_rain = current.Variables(1).Value()
    current_precipitation = current.Variables(2).Value()
    current_relative_humidity_2m = current.Variables(3).Value()
    current_soil_temperature_0cm = current.Variables(4).Value()

    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_rain = hourly.Variables(1).ValuesAsNumpy()
    hourly_precipitation = hourly.Variables(2).ValuesAsNumpy()
    hourly_relative_humidity_2m = hourly.Variables(3).ValuesAsNumpy()
    hourly_soil_temperature_0cm = hourly.Variables(4).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}

    hourly_data["temperature_2m"] = hourly_temperature_2m
    hourly_data["rain"] = hourly_rain
    hourly_data["precipitation"] = hourly_precipitation
    hourly_data["relative_humidity_2m"] = hourly_relative_humidity_2m
    hourly_data["soil_temperature_0cm"] = hourly_soil_temperature_0cm

    hourly_dataframe = pd.DataFrame(data = hourly_data)

    return {
        "coordinates": coordinates,
        "current_temperature_2m": current_temperature_2m,
        "current_rain": current_rain,
        "current_precipitation": current_precipitation,
        "current_relative_humidity_2m": current_relative_humidity_2m,
        "current_soil_temperature_0cm": current_soil_temperature_0cm,
        "forecasted_temperature_2m": hourly_data["temperature_2m"].mean(),
        "forecasted_rain": hourly_data["rain"].mean(),
        "forecasted_precipitation": hourly_data["precipitation"].mean(),
        "forecasted_relative_humidity_2m": hourly_data["relative_humidity_2m"].mean(),
        "forecasted_soil_temperature_0cm": hourly_data["soil_temperature_0cm"].mean(),
        "hourly_dataframe": hourly_dataframe.to_dict(orient = "records")
    }

def get_cerrado_soil_data(point):
    """Get soil data specific to the Cerrado region"""
    # Find which soil sub-region contains the point
    for region in CERRADO_SOIL_REGIONS:
        if region["polygon"].contains(point):
            return region["soil"]
    
    # Default soil data if point doesn't match any specific sub-region
    return {
        "type": "Latossolos (Cerrado Geral)",
        "description": "Solos profundamente intemperizados e ricos em ferro, típicos do Cerrado brasileiro",
        "ph_level": "4,8-5,2 (ácido)",
        "fertility": "Baixo",
        "minerals": "Óxidos de ferro e alumínio"
    }

def get_cerrado_vegetation_data(point):
    """Get vegetation data specific to the Cerrado region"""
    # Find which vegetation sub-region contains the point
    for region in CERRADO_VEGETATION_REGIONS:
        if region["polygon"].contains(point):
            return region["vegetation"]
    
    # Default vegetation data if point doesn't match any specific sub-region
    return {
        "category": "Cerrado (Formações mistas)",
        "species": "Pequi, Barbatimão, Gramíneas, Palmeiras",
        "description": "Vegetação de savana diversificada com densidade de árvores variável. Árvores retorcidas características e espécies resistentes à seca",
        "conservation_status": "Vulnerável - Perda significativa de biodiversidade devido à expansão agrícola"
    }

def generate_prompt(cerrado_data, culture, production_stage, problem_description):
    prompt = f"""
Você é um especialista técnico em agricultura e pecuária no bioma Cerrado. Um produtor rural relatou um problema específico relacionado à sua produção. A seguir estão os dados ambientais detalhados da localidade onde a propriedade está situada:

Localização e Condições Ambientais
- Clima:
  - Temperatura atual: {cerrado_data['climate']['current_temperature_2m']} °C
  - Chuva atual: {cerrado_data['climate']['current_rain']} mm
  - Precipitação atual: {cerrado_data['climate']['current_precipitation']} mm
  - Umidade relativa do ar atual: {cerrado_data['climate']['current_relative_humidity_2m']} %
  - Temperatura do solo atual: {cerrado_data['climate']['current_soil_temperature_0cm']} °C
  - Previsão da temperatura média para os próximos 14 dias: {cerrado_data['climate']['forecasted_temperature_2m']} °C
  - Previsão da chuva média para os próximos 14 dias: {cerrado_data['climate']['forecasted_rain']} mm
  - Precipitação média para os próximos 14 dias: {cerrado_data['climate']['forecasted_precipitation']} mm
  - Previsão da umidade relativa do ar média para os próximos 14 dias: {cerrado_data['climate']['forecasted_relative_humidity_2m']} %
  - Previsão da temperatura do solo média para os próximos 14 dias: {cerrado_data['climate']['forecasted_soil_temperature_0cm']} °C

- Solo:
  - Tipo: {cerrado_data['soil']['type']}
  - Descrição: {cerrado_data['soil']['description']}
  - Fertilidade: {cerrado_data['soil']['fertility']}
  - pH: {cerrado_data['soil']['ph_level']}
  - Principais minerais: {cerrado_data['soil']['minerals']}

- Vegetação nativa:
  - Categoria: {cerrado_data['vegetation']['category']}
  - Descrição: {cerrado_data['vegetation']['description']}
  - Espécies típicas: {cerrado_data['vegetation']['species']}
  - Estado de conservação: {cerrado_data['vegetation']['conservation_status']}

Produção na propriedade
- Cultura principal: {culture}
- Estágio atual da produção: {production_stage}

Problema relatado pelo produtor ou recomendação solicitada:
"{problem_description}"

---
Com base nas informações acima:

1. Explique tecnicamente as possíveis causas do problema ou aspectos relacionados à recomendação, considerando clima, solo, vegetação e tipo de produção.
2. Sugira soluções práticas e acessíveis para mitigar ou resolver o problema, considerando as condições locais e o perfil do produtor típico da região do Cerrado.
3. Recomende medidas preventivas para evitar recorrência em ciclos futuros.

Use linguagem clara, técnica, mas acessível para produtores rurais. Priorize soluções sustentáveis, de baixo custo e adaptadas ao bioma Cerrado.
"""
    return prompt

