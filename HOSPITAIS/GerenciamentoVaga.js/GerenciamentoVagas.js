// gerenciamentoDeVagas.js

document.addEventListener('DOMContentLoaded', function() {
    const apiCreateUrl = 'http://localhost:5000/api/vacancies/create';
    const apiFetchUrl = 'http://localhost:5000/api/vacancies';
    const token = localStorage.getItem('hospitalToken');

    if (!token) {
        window.location.href = 'loginHospitais.html'; // Redireciona se não estiver autenticado
        return;
    }

    // Função para mostrar a aba selecionada
    function showTab(tabId) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));

        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach(button => button.classList.remove('active'));

        const tabElement = document.getElementById(tabId);
        if (tabElement) {
            tabElement.classList.add('active');
        } else {
            console.error(`Erro: Elemento com ID ${tabId} não encontrado.`);
        }

        const buttonElement = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
        if (buttonElement) {
            buttonElement.classList.add('active');
        } else {
            console.error(`Erro: Botão com onclick para ${tabId} não encontrado.`);
        }
    }

    // Selecionando elementos para o modal de adicionar vaga
    const addVacancyModal = document.getElementById('addVacancyModal');
    const addVacancyBtn = document.getElementById('addVacancyBtn');
    const closeVacancyModalBtn = document.getElementById('closeVacancyModalBtn');

    if (addVacancyBtn) {
        addVacancyBtn.addEventListener('click', function() {
            if (addVacancyModal) {
                addVacancyModal.style.display = 'flex';
            }
        });
    } else {
        console.error('Erro: Botão de adicionar vaga não encontrado.');
    }

    if (closeVacancyModalBtn) {
        closeVacancyModalBtn.addEventListener('click', function() {
            if (addVacancyModal) {
                addVacancyModal.style.display = 'none';
            }
        });
    } else {
        console.error('Erro: Botão de fechar modal não encontrado.');
    }

    window.addEventListener('click', function(event) {
        if (event.target === addVacancyModal) {
            addVacancyModal.style.display = 'none';
        }
    });

    // Lógica para salvar a nova vaga
    const addVacancyForm = document.getElementById('addVacancyForm');
    if (addVacancyForm) {
        addVacancyForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const bloodType = document.getElementById('bloodType')?.value;
            const quantity = parseInt(document.getElementById('quantity')?.value);
            const urgency = document.getElementById('urgency')?.value;
            const deadline = document.getElementById('deadline')?.value;
            const description = document.getElementById('description')?.value;
            const location = document.getElementById('location')?.value;
            const contact = document.getElementById('contact')?.value;

            const newVacancy = {
                bloodType,
                quantity,
                urgency,
                deadline,
                description,
                location,
                contact
            };

            try {
                const response = await fetch(apiCreateUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newVacancy)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Nova vaga salva com sucesso:', result);
                    if (addVacancyModal) addVacancyModal.style.display = 'none';
                    addVacancyForm.reset();
                    fetchVacancies();
                } else {
                    const errorData = await response.json();
                    console.error('Erro ao salvar a vaga:', errorData.error || response.statusText);
                }
            } catch (error) {
                console.error('Erro ao conectar com o servidor:', error);
            }
        });
    } else {
        console.error("Erro: Formulário de adicionar vaga não encontrado no DOM.");
    }

    // Função para buscar vagas do backend e mostrar na página
    async function fetchVacancies(filters = {}) {
        let queryString = '';

        if (filters.bloodType || filters.urgency) {
            queryString = '?';
            if (filters.bloodType) {
                queryString += `bloodType=${filters.bloodType}&`;
            }
            if (filters.urgency) {
                queryString += `urgency=${filters.urgency}`;
            }
        }

        try {
            const response = await fetch(apiFetchUrl + queryString, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const vacancies = await response.json();
                updateVacanciesList(vacancies);
            } else {
                const errorData = await response.json();
                console.error('Erro ao buscar vagas:', errorData.error || response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar a lista de vagas na página
    function updateVacanciesList(vacancies) {
        const vacanciesList = document.querySelector('.vacancies-list');
        if (vacanciesList) {
            vacanciesList.innerHTML = ''; // Limpa a lista atual

            if (vacancies.length === 0) {
                vacanciesList.innerHTML = '<p>Nenhuma vaga encontrada.</p>';
                return;
            }

            vacancies.forEach(vacancy => {
                const vacancyItem = document.createElement('div');
                vacancyItem.classList.add('vacancy-item');
                vacancyItem.innerHTML = `
                    <p><strong>Tipo Sanguíneo:</strong> ${vacancy.bloodType}</p>
                    <p><strong>Quantidade Necessária:</strong> ${vacancy.quantity}</p>
                    <p><strong>Urgência:</strong> ${vacancy.urgency}</p>
                    <p><strong>Data Limite:</strong> ${new Date(vacancy.deadline).toLocaleDateString()}</p>
                    <p><strong>Descrição:</strong> ${vacancy.description}</p>
                    <p><strong>Local da Coleta:</strong> ${vacancy.location}</p>
                    <p><strong>Contato:</strong> ${vacancy.contact}</p>
                `;
                vacanciesList.appendChild(vacancyItem);
            });
        } else {
            console.error("Erro: Lista de vagas não encontrada.");
        }
    }

    // Evento para aplicar filtros
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const bloodTypeFilter = document.getElementById('bloodTypeFilter')?.value;
            const urgencyFilter = document.getElementById('urgencyFilter')?.value;

            fetchVacancies({
                bloodType: bloodTypeFilter,
                urgency: urgencyFilter
            });
        });
    } else {
        console.error('Erro: Botão de aplicar filtros não encontrado.');
    }

    // Buscar e mostrar as vagas ao carregar a página
    fetchVacancies();

    // Mostra a primeira aba ao carregar a página
    showTab('manageVacancies');
});
