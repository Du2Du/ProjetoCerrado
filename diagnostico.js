/**
 * Diagnóstico - Projeto Cerrado
 * Lógica para formulário de diagnóstico e geração de relatórios
 */

document.addEventListener('DOMContentLoaded', () => {
    // ── CONSTANTES E CONFIGURAÇÕES ──────────────────────────
    const API_BASE_URL = 'https://guia-cerrado.onrender.com';
    const api = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    // ── ESTADO DA APLICAÇÃO ────────────────────────────────
    let state = {
        lat: '',
        lng: '',
        culture: '',
        production_stage: '',
        problem_description: '',
        recommendations: null,
        map: null,
        marker: null,
        charts: {}
    };

    // ── ELEMENTOS DO DOM ──────────────────────────────────
    const elements = {
        formSection: document.getElementById('diagnosis-form-section'),
        reportSection: document.getElementById('report-section'),
        form: document.getElementById('diagnosis-form'),
        addressInput: document.getElementById('address-input'),
        searchBtn: document.getElementById('search-address-btn'),
        submitBtn: document.getElementById('submit-btn'),
        loader: document.getElementById('loader'),
        
        // Resultados
        resCulture: document.getElementById('res-culture'),
        resStage: document.getElementById('res-stage'),
        resProblem: document.getElementById('res-problem'),
        recommendationsList: document.getElementById('recommendations-list'),
        climateData: document.getElementById('climate-data'),
        soilData: document.getElementById('soil-data'),
        vegetationData: document.getElementById('vegetation-data'),
        reportDate: document.getElementById('report-current-date'),
        
        // Ações
        downloadPdfBtn: document.getElementById('download-pdf-btn'),
        printBtn: document.getElementById('print-report-btn'),
        newDiagnosisBtn: document.getElementById('new-diagnosis-btn')
    };

    // ── INICIALIZAÇÃO ─────────────────────────────────────
    function init() {
        initMap();
        setupEventListeners();
    }

    function initMap() {
        state.map = L.map('map').setView([-15.7801, -47.9292], 5); // Brasil

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(state.map);

        state.map.on('click', onMapClick);
    }

    function setupEventListeners() {
        elements.searchBtn.addEventListener('click', searchAddress);
        elements.addressInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') searchAddress();
        });

        // Validação em tempo real
        const fields = ['culture', 'production_stage', 'problem_description'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('blur', () => validateField(id));
                el.addEventListener('input', () => {
                    const errorEl = document.getElementById(`${id.replace('_', '-')}-error`);
                    if (errorEl && errorEl.textContent) validateField(id);
                });
            }
        });

        elements.form.addEventListener('submit', handleFormSubmit);

        elements.newDiagnosisBtn.addEventListener('click', () => {
            elements.reportSection.style.display = 'none';
            elements.formSection.style.display = 'block';
            elements.form.reset();
            if (state.marker) {
                state.map.removeLayer(state.marker);
                state.marker = null;
            }
            state.lat = '';
            state.lng = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        elements.printBtn.addEventListener('click', () => window.print());
        elements.downloadPdfBtn.addEventListener('click', downloadPDF);
    }

    // ── LÓGICA DO MAPA E ENDEREÇO ─────────────────────────
    function onMapClick(e) {
        const { lat, lng } = e.latlng;
        setMarker(lat, lng);
    }

    function setMarker(lat, lng) {
        if (state.marker) {
            state.marker.setLatLng([lat, lng]);
        } else {
            state.marker = L.marker([lat, lng]).addTo(state.map);
        }
        state.lat = lat;
        state.lng = lng;
        document.getElementById('map-error').textContent = '';
    }

    async function searchAddress() {
        const address = elements.addressInput.value;
        if (!address) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                state.map.setView([latitude, longitude], 13);
                setMarker(latitude, longitude);
            } else {
                alert('Endereço não encontrado.');
            }
        } catch (error) {
            console.error('Erro na busca de endereço:', error);
        }
    }

    // ── SUBMISSÃO E API ───────────────────────────────────
    function validateField(field) {
        const el = document.getElementById(field);
        const errorEl = document.getElementById(`${field.replace('_', '-')}-error`);
        if (!el || !errorEl) return true;

        let error = '';

        if (field === 'culture') {
            if (!el.value) error = 'A cultura é obrigatória';
        } else if (field === 'production_stage') {
            if (!el.value) {
                error = 'O estágio da produção é obrigatório';
            } else if (el.value.length < 5) {
                error = 'O estágio da produção deve ter pelo menos 5 caracteres';
            }
        } else if (field === 'problem_description') {
            if (!el.value) {
                error = 'A descrição do problema é obrigatória';
            }
        }

        errorEl.textContent = error;
        el.classList.toggle('is-invalid', !!error);
        return !error;
    }

    function validateForm() {
        const isCultureValid = validateField('culture');
        const isStageValid = validateField('production_stage');
        const isProblemValid = validateField('problem_description');
        
        let isMapValid = true;
        const mapErrorEl = document.getElementById('map-error');
        if (!state.lat || !state.lng) {
            if (mapErrorEl) mapErrorEl.textContent = 'Por favor, selecione um local no mapa.';
            isMapValid = false;
        }

        return isCultureValid && isStageValid && isProblemValid && isMapValid;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = {
            lat: state.lat,
            lng: state.lng,
            culture: document.getElementById('culture').value,
            production_stage: document.getElementById('production_stage').value,
            problem_description: document.getElementById('problem_description').value
        };

        showLoader(true);

        try {
            const response = await api.post('/recommendations', formData);
            state.recommendations = parseRecommendations(response.data);
            displayReport(state.recommendations, formData);
        } catch (error) {
            console.error('Erro ao buscar recomendações:', error);
            alert('Erro ao processar diagnóstico. Tente novamente mais tarde.');
        } finally {
            showLoader(false);
        }
    }

    function parseRecommendations(data) {
        if (typeof data === 'string') {
            const sanitized = data.replace(/:NaN/g, ":null");
            return JSON.parse(sanitized);
        }
        return data;
    }

    // ── EXIBIÇÃO DO RELATÓRIO ─────────────────────────────
    function displayReport(data, formData) {
        elements.formSection.style.display = 'none';
        elements.reportSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Dados básicos
        elements.reportDate.textContent = new Date().toLocaleDateString('pt-BR');
        elements.resCulture.textContent = formatCultureLabel(formData.culture);
        elements.resStage.textContent = formData.production_stage;
        elements.resProblem.textContent = formData.problem_description;

        // Recomendações
        elements.recommendationsList.innerHTML = '';
        if (data.recommendations && data.recommendations.length > 0) {
            data.recommendations.forEach(rec => {
                const card = document.createElement('div');
                card.className = 'recommendation-card';
                card.innerHTML = `
                    <h5>${rec.title}</h5>
                    <div>${rec.description}</div>
                `;
                elements.recommendationsList.appendChild(card);
            });
        }

        // Clima
        displayClimateData(data.cerrado_data.climate);
        
        // Gráficos
        initCharts(data.cerrado_data.climate);

        // Solo
        elements.soilData.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <p><b>Tipo:</b> ${data.cerrado_data.soil.type || 'N/A'}</p>
                    <p><b>PH:</b> ${data.cerrado_data.soil.ph_level || 'N/A'}</p>
                    <p><b>Fertilidade:</b> ${data.cerrado_data.soil.fertility || 'N/A'}</p>
                </div>
                <div class="col-md-6">
                    <p><b>Minerais:</b> ${data.cerrado_data.soil.minerals || 'N/A'}</p>
                    <p><b>Descrição:</b> ${data.cerrado_data.soil.description || 'N/A'}</p>
                </div>
            </div>
        `;

        // Vegetação
        elements.vegetationData.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <p><b>Categoria:</b> ${data.cerrado_data.vegetation.category || 'N/A'}</p>
                    <p><b>Estado:</b> ${data.cerrado_data.vegetation.conservation_state || 'N/A'}</p>
                </div>
                <div class="col-md-6">
                    <p><b>Descrição:</b> ${data.cerrado_data.vegetation.description || 'N/A'}</p>
                </div>
            </div>
        `;
    }

    function displayClimateData(climate) {
        const items = [
            { label: 'Precipitação', value: `${climate.current_precipitation} mm`, icon: 'fa-droplet' },
            { label: 'Chuva', value: `${climate.current_rain} mm`, icon: 'fa-cloud-rain' },
            { label: 'Umidade', value: `${Math.round(climate.current_relative_humidity_2m)}%`, icon: 'fa-wind' },
            { label: 'Temp. Solo', value: `${Math.round(climate.current_soil_temperature_0cm)}°C`, icon: 'fa-mountain-sun' },
            { label: 'Temp. Ambiente', value: `${Math.round(climate.current_temperature_2m)}°C`, icon: 'fa-temperature-half' }
        ];

        elements.climateData.innerHTML = items.map(item => `
            <div class="col-6 col-md-4 col-lg-2">
                <div class="kpi-card text-center" style="padding: 1rem;">
                    <div class="mb-2" style="color: var(--verde); font-size: 1.2rem;">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="kpi-label">${item.label}</div>
                    <div class="kpi-value" style="font-size: 1.2rem;">${item.value}</div>
                </div>
            </div>
        `).join('');
    }

    // ── GRÁFICOS (CHART.JS) ───────────────────────────────
    function initCharts(climate) {
        if (!climate.hourly_dataframe) return;

        const df = climate.hourly_dataframe;
        const labels = df.time.map(t => new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        
        // Destruir gráficos anteriores se existirem
        Object.values(state.charts).forEach(chart => chart.destroy());

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: { beginAtZero: true, ticks: { font: { size: 10 } } }
            },
            elements: { line: { tension: 0.3 } }
        };

        state.charts.precipitation = new Chart(document.getElementById('chart-precipitation'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Precipitação (mm)',
                    data: df.precipitation,
                    borderColor: '#4a7c3f',
                    backgroundColor: 'rgba(74, 124, 63, 0.1)',
                    fill: true
                }]
            },
            options: commonOptions
        });

        state.charts.temperature = new Chart(document.getElementById('chart-temperature'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: df.temperature_2m,
                    borderColor: '#c8943a',
                    backgroundColor: 'rgba(200, 148, 58, 0.1)',
                    fill: true
                }]
            },
            options: commonOptions
        });

        state.charts.humidity = new Chart(document.getElementById('chart-humidity'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Umidade (%)',
                    data: df.relative_humidity_2m,
                    borderColor: '#a0622b',
                    backgroundColor: 'rgba(160, 98, 43, 0.1)',
                    fill: true
                }]
            },
            options: commonOptions
        });

        state.charts.soil = new Chart(document.getElementById('chart-soil'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temp. Solo (°C)',
                    data: df.soil_temperature_0cm,
                    borderColor: '#6fa65e',
                    backgroundColor: 'rgba(111, 166, 94, 0.1)',
                    fill: true
                }]
            },
            options: commonOptions
        });
    }

    // ── PDF E AUXILIARES ──────────────────────────────────
    async function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const report = document.getElementById('printable-report');
        
        showLoader(true);
        
        try {
            const canvas = await html2canvas(report, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`diagnostico-cerrado-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Não foi possível gerar o PDF.');
        } finally {
            showLoader(false);
        }
    }

    function showLoader(show) {
        elements.loader.style.display = show ? 'flex' : 'none';
    }

    function formatCultureLabel(value) {
        const labels = {
            'bovinocultura_corte': 'Bovinocultura de Corte',
            'pecuaria_leite': 'Pecuária de Leite',
            'sericicultura': 'Sericicultura',
            'eucalipto': 'Eucalipto'
        };
        return labels[value] || value;
    }

    // Iniciar aplicação
    init();
});
