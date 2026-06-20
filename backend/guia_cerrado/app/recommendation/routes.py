import openai
import json
import time
import re
import html
import numpy as np
from app.recommendation import bp
from flask import request, jsonify
from enum import Enum
from typing import List
from pydantic import BaseModel
from config import Config
from app import logger
from app.recommendation.helper import is_cerrado, get_cerrado_data, generate_prompt

class ReportSection(str, Enum):
    diagnosis = "diagnóstico"
    solutions = "soluções"
    preventive_measures = "medidas preventivas"


class Recommendation(BaseModel):
    type: ReportSection
    title: str
    description: str

    def __str__(self):
        return f"{self.type.value.upper()}: {self.title}\n{self.description}\n"

Recommendation.model_rebuild()


class TechnicalReport(BaseModel):
    culture: str
    production_stage: str
    problem_reported: str
    recommendations: List[Recommendation]

    def __str__(self):
        partes = [
            f"CULTURA: {self.culture}",
            f"ESTÁGIO DE PRODUÇÃO: {self.production_stage}",
            f"PROBLEMA: {self.problem_reported}",
            "\nRECOMENDAÇÕES:\n"
        ]
        partes += [str(r) for r in self.recommendations]
        return "\n".join(partes)

client = openai.OpenAI(
    api_key=Config.MARITACA_API_KEY,
    base_url="https://chat.maritaca.ai/api",
)

def convert_np(obj):
    if isinstance(obj, dict):
        return {k: convert_np(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_np(item) for item in obj]
    elif isinstance(obj, np.generic):
        return obj.item()
    return obj

def markdown_to_html(markdown_text):
    """
    Convert markdown text to HTML, handling common patterns from LLM output.
    
    Args:
        markdown_text (str): The markdown text to convert
        
    Returns:
        str: The converted HTML
    """
    if not markdown_text:
        return ""
    
    # Escape HTML entities first to prevent issues
    text = html.escape(markdown_text)
    
    # Convert code blocks (triple backticks) - must be done before inline code
    text = re.sub(r'```(\w+)?\n(.*?)\n```', r'<pre><code class="language-\1">\2</code></pre>', text, flags=re.DOTALL)
    text = re.sub(r'```\n(.*?)\n```', r'<pre><code>\1</code></pre>', text, flags=re.DOTALL)
    text = re.sub(r'```(.*?)```', r'<pre><code>\1</code></pre>', text, flags=re.DOTALL)
    
    # Convert inline code (single backticks)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    
    # Convert headers
    text = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', text, flags=re.MULTILINE)
    text = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', text, flags=re.MULTILINE)
    text = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', text, flags=re.MULTILINE)
    
    # Convert bold text
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__(.*?)__', r'<strong>\1</strong>', text)
    
    # Convert italic text
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    text = re.sub(r'_(.*?)_', r'<em>\1</em>', text)
    
    # Convert strikethrough
    text = re.sub(r'~~(.*?)~~', r'<del>\1</del>', text)
    
    # Convert links
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    
    # Convert images
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1">', text)
    
    # Convert unordered lists
    lines = text.split('\n')
    in_ul = False
    result_lines = []
    
    for line in lines:
        stripped = line.strip()
        
        # Check for unordered list items
        if re.match(r'^[\*\-\+] ', stripped):
            if not in_ul:
                result_lines.append('<ul>')
                in_ul = True
            item_text = re.sub(r'^[\*\-\+] ', '', stripped)
            result_lines.append(f'<li>{item_text}</li>')
        else:
            if in_ul:
                result_lines.append('</ul>')
                in_ul = False
            result_lines.append(line)
    
    if in_ul:
        result_lines.append('</ul>')
    
    text = '\n'.join(result_lines)
    
    # Convert ordered lists
    lines = text.split('\n')
    in_ol = False
    result_lines = []
    
    for line in lines:
        stripped = line.strip()
        
        # Check for ordered list items
        if re.match(r'^\d+\. ', stripped):
            if not in_ol:
                result_lines.append('<ol>')
                in_ol = True
            item_text = re.sub(r'^\d+\. ', '', stripped)
            result_lines.append(f'<li>{item_text}</li>')
        else:
            if in_ol:
                result_lines.append('</ol>')
                in_ol = False
            result_lines.append(line)
    
    if in_ol:
        result_lines.append('</ol>')
    
    text = '\n'.join(result_lines)
    
    # Convert blockquotes
    text = re.sub(r'^> (.*?)$', r'<blockquote>\1</blockquote>', text, flags=re.MULTILINE)
    
    # Convert horizontal rules
    text = re.sub(r'^---+$', r'<hr>', text, flags=re.MULTILINE)
    text = re.sub(r'^\*\*\*+$', r'<hr>', text, flags=re.MULTILINE)
    
    # Convert line breaks (double newlines to paragraphs)
    paragraphs = text.split('\n\n')
    html_paragraphs = []
    
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if paragraph and not paragraph.startswith('<'):
            # Only wrap in <p> if it's not already an HTML element
            paragraph = f'<p>{paragraph}</p>'
        html_paragraphs.append(paragraph)
    
    text = '\n\n'.join(html_paragraphs)
    
    # Clean up extra whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

@bp.route('/recommendations', methods=['POST'])
def recommend():
    """
    Gera recomendações técnicas para culturas no Cerrado
    ---
    tags:
      - Recommendation
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - lat
            - lng
            - culture
            - production_stage
            - problem_description
          properties:
            lat:
              type: number
              format: float
              example: -15.7801
              description: Latitude da localização (deve estar dentro do Cerrado)
            lng:
              type: number
              format: float
              example: -47.9292
              description: Longitude da localização (deve estar dentro do Cerrado)
            culture:
              type: string
              example: "Soja"
              description: Nome da cultura agrícola
            production_stage:
              type: string
              example: "Floração"
              description: Estágio de produção da cultura
            problem_description:
              type: string
              example: "Folhas com manchas amarelas e queda prematura"
              description: Descrição do problema observado
    responses:
      200:
        description: Relatório técnico gerado com sucesso
        schema:
          type: object
          properties:
            culture:
              type: string
              example: "Soja"
            production_stage:
              type: string
              example: "Floração"
            problem_reported:
              type: string
              example: "Folhas com manchas amarelas e queda prematura"
            recommendations:
              type: array
              items:
                type: object
                properties:
                  type:
                    type: string
                    enum:
                      - "diagnóstico"
                      - "soluções"
                      - "medidas preventivas"
                    example: "diagnóstico"
                  title:
                    type: string
                    example: "Possível deficiência de nitrogênio"
                  description:
                    type: string
                    description: Descrição em HTML gerada a partir de Markdown
                    example: "<p>A coloração amarelada nas folhas indica...</p>"
            cerrado_data:
              type: object
              description: Dados ambientais da região do Cerrado para as coordenadas fornecidas
      400:
        description: Requisição inválida
        schema:
          type: object
          properties:
            error:
              type: string
          examples:
            campo_ausente:
              value:
                error: "Campo 'lat' ausente"
            coordenadas_ausentes:
              value:
                error: "Latitude ou longitude ausentes"
            fora_do_cerrado:
              value:
                error: "Localização fora da região do Cerrado"
    """
    data = request.json

    for key in ['lat', 'lng', 'culture', 'production_stage', 'problem_description']:
        if key not in data:
            return jsonify({"error": f"Campo '{key}' ausente"}), 400

    lat = data.get('lat')
    lng = data.get('lng')
    culture = data.get('culture')
    production_stage = data.get('production_stage')
    problem_description = data.get('problem_description')
    
    if not lat or not lng:
        logger.error("Latitude ou longitude ausentes")
        return jsonify({"error": "Latitude ou longitude ausentes"}), 400
    
    if not is_cerrado(lat, lng):
        logger.error("Localização fora da região do Cerrado")
        return jsonify({"error": "Localização fora da região do Cerrado"}), 400
    
    cerrado_data = get_cerrado_data(lat, lng)

    prompt = generate_prompt(
        culture=culture,
        production_stage=production_stage,
        problem_description=problem_description,
        cerrado_data=cerrado_data
    )

    logger.info(f"Prompt gerado: {prompt}")

    schema = {
        "type": "object",
        "schema": {
            "properties": {
                "culture": {"type": "string"},
                "production_stage": {"type": "string"},
                "problem_reported": {"type": "string"},
                "recommendations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": ["diagnóstico", "soluções", "medidas preventivas"]
                            },
                            "title": {"type": "string"},
                            "description": {"type": "string"}
                        },
                        "required": ["type", "title", "description"]
                    }
                }
            },
            "required": ["culture", "production_stage", "problem_reported", "recommendations"]
        }
    }

    completion = client.beta.chat.completions.parse(
        model="sabia-3",
        messages=[
            {"role": "system", "content": "Você é um consultor sobre desenvolvimento de culturas no cerrado. Converta a solicitação do usuário em um relatório estruturado."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_schema", "json_schema": schema}
    )

    logger.info(f"Resposta da API: {completion}")

    technical_report = TechnicalReport.model_validate(json.loads(completion.choices[0].message.content))

    report_dict = technical_report.model_dump()
    for rec in report_dict['recommendations']:
        rec['description'] = markdown_to_html(rec['description'])
        rec['title'] = html.escape(rec['title'])

    report_dict['cerrado_data'] = convert_np(cerrado_data)

    return jsonify(report_dict), 200

@bp.route('/recommendations_fake', methods=['POST'])
def recommend_fake():
    """
    Gera uma recomendação técnica simulada para testes
    ---
    tags:
      - Recommendation
    summary: Gera um relatório técnico mockado
    description: >
      Endpoint de teste que valida os dados de entrada, verifica se a localização
      pertence ao Cerrado e retorna uma resposta simulada com recomendações técnicas.
      Útil para desenvolvimento de frontend, testes de integração e validação do contrato da API.
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: Dados necessários para gerar a recomendação simulada
        schema:
          type: object
          required:
            - lat
            - lng
            - culture
            - production_stage
            - problem_description
          properties:
            lat:
              type: number
              format: float
              example: -16.6869
              description: Latitude da área analisada
            lng:
              type: number
              format: float
              example: -49.2648
              description: Longitude da área analisada
            culture:
              type: string
              example: eucalipto
              description: Cultura agrícola informada pelo usuário
            production_stage:
              type: string
              example: plantio
              description: Estágio atual da produção
            problem_description:
              type: string
              example: caule muito fino
              description: Problema observado na cultura
    responses:
      200:
        description: Relatório técnico simulado retornado com sucesso
        schema:
          type: object
          properties:
            biome_location:
              type: string
              example: Cerrado
              description: Bioma associado à localização analisada
            culture:
              type: string
              example: eucalipto
            problem_reported:
              type: string
              example: caule muito fino
            production_stage:
              type: string
              example: plantio
            recommendations:
              type: array
              items:
                type: object
                required:
                  - type
                  - title
                  - description
                properties:
                  type:
                    type: string
                    enum:
                      - diagnóstico
                      - soluções
                      - medidas preventivas
                    example: diagnóstico
                  title:
                    type: string
                    example: Análise das Possíveis Causas
                  description:
                    type: string
                    example: O caule fino do eucalipto pode ser resultado de várias condições ambientais e de manejo.
            cerrado_data:
              type: object
              description: Dados ambientais e territoriais calculados para as coordenadas fornecidas
        examples:
          application/json:
            biome_location: Cerrado
            culture: eucalipto
            problem_reported: caule muito fino
            production_stage: plantio
            recommendations:
              - type: diagnóstico
                title: Análise das Possíveis Causas
                description: O caule fino do eucalipto pode ser resultado de várias condições ambientais e de manejo.
              - type: soluções
                title: Soluções Práticas para o Problema
                description: Recomenda-se adubação balanceada, irrigação suplementar e controle da vegetação competidora.
              - type: medidas preventivas
                title: Prevenção de Recorrência
                description: Realizar análise periódica do solo e adotar práticas de conservação pode reduzir a recorrência do problema.
            cerrado_data: {}
      400:
        description: Erro de validação da requisição
        schema:
          type: object
          properties:
            error:
              type: string
              example: Campo 'lat' ausente
        examples:
          application/json:
            error: Campo 'lat' ausente
    """
    data = request.json

    for key in ['lat', 'lng', 'culture', 'production_stage', 'problem_description']:
        if key not in data:
            return jsonify({"error": f"Campo '{key}' ausente"}), 400

    lat = data.get('lat')
    lng = data.get('lng')
    culture = data.get('culture')
    production_stage = data.get('production_stage')
    problem_description = data.get('problem_description')
    
    if not lat or not lng:
        logger.error("Latitude ou longitude ausentes")
        return jsonify({"error": "Latitude ou longitude ausentes"}), 400
    
    if not is_cerrado(lat, lng):
        logger.error("Localização fora da região do Cerrado")
        return jsonify({"error": "Localização fora da região do Cerrado"}), 400
    
    cerrado_data = get_cerrado_data(lat, lng)

    prompt = generate_prompt(
        culture=culture,
        production_stage=production_stage,
        problem_description=problem_description,
        cerrado_data=cerrado_data
    )

    logger.info(f"Prompt gerado: {prompt}")

    time.sleep(1)  # Simulate processing time
    
    report_dict = {
        "biome_location": "Cerrado",
        "culture": "eucalipto",
        "problem_reported": "caule muito fino",
        "production_stage": "plantio",
        "recommendations": [
            {
                "description": "O caule fino do eucalipto pode ser resultado de várias condições ambientais e de manejo. No contexto do Cerrado, considerando a baixa fertilidade do solo e o pH ácido dos Latossolos, é possível que haja deficiência nutricional, especialmente de macronutrientes como nitrogênio, fósforo e potássio. Além disso, a ausência de chuvas e umidade relativa do ar moderada podem acentuar o estresse hídrico, afetando o desenvolvimento adequado das plantas. A competição com a vegetação nativa, como gramíneas e outras espécies resistentes à seca, também pode impactar a disponibilidade de nutrientes e água para o eucalipto.",
                "title": "Análise das Possíveis Causas",
                "type": "diagnóstico"
            },
            {
                "description": "Para mitigar o problema do caule fino, recomenda-se a aplicação de adubação balanceada focada em corrigir as deficiências de nutrientes. Utilize adubos ricos em nitrogênio, fósforo e potássio, preferencialmente fontes orgânicas como composto de resíduos vegetais ou esterco curtido, que também ajudam a melhorar a estrutura do solo. A irrigação suplementar pode ser necessária durante o período de estiagem, especialmente se o estresse hídrico for evidente. Realizar o controle da vegetação nativa competidora através de capina seletiva ou uso de herbicidas de baixo impacto ambiental pode ajudar a liberar mais recursos para o desenvolvimento do eucalipto.",
                "title": "Soluções Práticas para o Problema",
                "type": "soluções"
            },
            {
                "description": "Para evitar a recorrência do problema, é importante realizar uma análise de solo periódica para monitorar a fertilidade e ajustar a adubação conforme necessário. Implementar práticas de conservação do solo, como a rotação de culturas e o plantio direto, pode melhorar a retenção de umidade e a saúde geral do solo. Promover a cobertura do solo com matéria orgânica ou plantas de cobertura também auxilia na conservação da umidade e na redução da competição por nutrientes. Além disso, escolher variedades de eucalipto mais adaptadas às condições áridas e solos ácidos do Cerrado pode ser uma estratégia eficaz.",
                "title": "Prevenção de Recorrência",
                "type": "medidas preventivas"
            }
        ]
    }
    report_dict['cerrado_data'] = convert_np(cerrado_data)

    return jsonify(report_dict), 200

@bp.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response