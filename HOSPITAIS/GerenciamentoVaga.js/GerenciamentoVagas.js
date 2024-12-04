// GerenciamentoVagas.js

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
        if (event.target === editVacancyModal) {
            editVacancyModal.style.display = 'none';
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
    async function fetchVacancies(filters = {}, isClosed = false) {
        let queryString = '';

        const params = new URLSearchParams();

        if (filters.bloodType) {
            params.append('bloodType', filters.bloodType);
        }

        if (filters.urgency) {
            params.append('urgency', filters.urgency);
        }

        params.append('isClosed', isClosed);

        queryString = '?' + params.toString();

        try {
            const response = await fetch(apiFetchUrl + queryString, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const vacancies = await response.json();
                if (isClosed) {
                    updateClosedVacanciesList(vacancies);
                } else {
                    updateVacanciesList(vacancies);
                }
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
        const vacanciesList = document.querySelector('#manageVacanciesList');
        if (vacanciesList) {
            vacanciesList.innerHTML = ''; // Limpa a lista atual

            if (vacancies.length === 0) {
                vacanciesList.innerHTML = '<p>Nenhuma vaga encontrada.</p>';
                return;
            }

            vacancies.forEach(vacancy => {
                if (vacancy.isClosed) return; // Ignora vagas fechadas nesta lista

                const vacancyItem = document.createElement('div');
                vacancyItem.classList.add('vacancy-item');
                vacancyItem.innerHTML = `
                    <div class="vacancy-item-header">
                        <h3>${vacancy.bloodType}</h3>
                        <p><strong>Urgência:</strong> ${vacancy.urgency}</p>
                    </div>
                    <div class="vacancy-item-details">
                        <p><strong>Quantidade Necessária:</strong> ${vacancy.quantity}</p>
                        <p><strong>Data Limite:</strong> ${new Date(vacancy.deadline).toLocaleDateString()}</p>
                        <p><strong>Descrição:</strong> ${vacancy.description || 'N/A'}</p>
                        <p><strong>Local da Coleta:</strong> ${vacancy.location || 'N/A'}</p>
                        <p><strong>Contato:</strong> ${vacancy.contact || 'N/A'}</p>
                    </div>
                    <button class="edit-vacancy-btn" data-id="${vacancy.id}">Editar</button>
                    <button class="close-vacancy-btn" data-id="${vacancy.id}">Concluir</button>
                `;
                vacanciesList.appendChild(vacancyItem);

                // Adiciona eventos aos botões
                vacancyItem.querySelector('.edit-vacancy-btn').addEventListener('click', function() {
                    openEditVacancyModal(vacancy);
                });

                vacancyItem.querySelector('.close-vacancy-btn').addEventListener('click', function() {
                    closeVacancy(vacancy.id);
                });
            });
        } else {
            console.error("Erro: Lista de vagas não encontrada.");
        }
    }

    // Função para atualizar a lista de vagas concluídas
    function updateClosedVacanciesList(vacancies) {
        const closedVacanciesList = document.querySelector('.closed-vacancies-list');
        if (closedVacanciesList) {
            closedVacanciesList.innerHTML = ''; // Limpa a lista atual

            if (vacancies.length === 0) {
                closedVacanciesList.innerHTML = '<p>Nenhuma vaga concluída encontrada.</p>';
                return;
            }

            vacancies.forEach(vacancy => {
                if (!vacancy.isClosed) return; // Ignora vagas abertas nesta lista

                const vacancyItem = document.createElement('div');
                vacancyItem.classList.add('vacancy-item');
                vacancyItem.innerHTML = `
                    <div class="vacancy-item-header">
                        <h3>${vacancy.bloodType}</h3>
                        <p><strong>Urgência:</strong> ${vacancy.urgency}</p>
                    </div>
                    <div class="vacancy-item-details">
                        <p><strong>Quantidade Necessária:</strong> ${vacancy.quantity}</p>
                        <p><strong>Data Limite:</strong> ${new Date(vacancy.deadline).toLocaleDateString()}</p>
                        <p><strong>Descrição:</strong> ${vacancy.description || 'N/A'}</p>
                        <p><strong>Local da Coleta:</strong> ${vacancy.location || 'N/A'}</p>
                        <p><strong>Contato:</strong> ${vacancy.contact || 'N/A'}</p>
                    </div>
                `;
                closedVacanciesList.appendChild(vacancyItem);
            });
        } else {
            console.error("Erro: Lista de vagas concluídas não encontrada.");
        }
    }

    // Função para aplicar filtros
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const bloodTypeFilter = document.getElementById('bloodTypeFilter')?.value || '';
            const urgencyFilter = document.getElementById('urgencyFilter')?.value || '';

            fetchVacancies({
                bloodType: bloodTypeFilter,
                urgency: urgencyFilter
            });
        });
    } else {
        console.error('Erro: Botão de aplicar filtros não encontrado.');
    }

    // Função para abrir o modal de edição
    function openEditVacancyModal(vacancy) {
        const editModal = document.getElementById('editVacancyModal');

        if (editModal) {
            // Preenche os campos do formulário com os dados da vaga
            document.getElementById('editBloodType').value = vacancy.bloodType;
            document.getElementById('editQuantity').value = vacancy.quantity;
            document.getElementById('editUrgency').value = vacancy.urgency;
            document.getElementById('editDeadline').value = new Date(vacancy.deadline).toISOString().split('T')[0];
            document.getElementById('editDescription').value = vacancy.description;
            document.getElementById('editLocation').value = vacancy.location;
            document.getElementById('editContact').value = vacancy.contact;
            document.getElementById('editVacancyId').value = vacancy.id; // Campo oculto para armazenar o ID

            editModal.style.display = 'flex';
        } else {
            console.error('Erro: Modal de editar vaga não encontrado.');
        }
    }

    // Selecionando elementos para o modal de editar vaga
    const editVacancyModal = document.getElementById('editVacancyModal');
    const closeEditVacancyModalBtn = document.getElementById('closeEditVacancyModalBtn');

    if (closeEditVacancyModalBtn) {
        closeEditVacancyModalBtn.addEventListener('click', function() {
            if (editVacancyModal) {
                editVacancyModal.style.display = 'none';
            }
        });
    } else {
        console.error('Erro: Botão de fechar modal de edição não encontrado.');
    }

    // Lógica para salvar as alterações da vaga
    const editVacancyForm = document.getElementById('editVacancyForm');
    if (editVacancyForm) {
        editVacancyForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const vacancyId = document.getElementById('editVacancyId').value;
            const bloodType = document.getElementById('editBloodType').value;
            const quantity = parseInt(document.getElementById('editQuantity').value);
            const urgency = document.getElementById('editUrgency').value;
            const deadline = document.getElementById('editDeadline').value;
            const description = document.getElementById('editDescription').value;
            const location = document.getElementById('editLocation').value;
            const contact = document.getElementById('editContact').value;

            const updatedVacancy = {
                bloodType,
                quantity,
                urgency,
                deadline,
                description,
                location,
                contact
            };

            try {
                const response = await fetch(`http://localhost:5000/api/vacancies/update/${vacancyId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedVacancy)
                });

                if (response.ok) {
                    alert('Vaga atualizada com sucesso!');
                    if (editVacancyModal) editVacancyModal.style.display = 'none';
                    editVacancyForm.reset();
                    fetchVacancies();
                } else {
                    const errorData = await response.json();
                    console.error('Erro ao atualizar a vaga:', errorData.error || response.statusText);
                }
            } catch (error) {
                console.error('Erro ao conectar com o servidor:', error);
            }
        });
    } else {
        console.error('Erro: Formulário de edição de vaga não encontrado.');
    }

    // Função para concluir uma vaga
    async function closeVacancy(vacancyId) {
        if (confirm('Deseja realmente concluir esta vaga?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/vacancies/close/${vacancyId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert('Vaga concluída com sucesso!');
                    fetchVacancies();
                    fetchVacancies({}, true);
                } else {
                    const errorData = await response.json();
                    console.error('Erro ao concluir a vaga:', errorData.error || response.statusText);
                }
            } catch (error) {
                console.error('Erro ao conectar com o servidor:', error);
            }
        }
    }

    // Buscar e mostrar as vagas ao carregar a página
    fetchVacancies();
    fetchVacancies({}, true); // Buscar vagas concluídas

    // Mostra a primeira aba ao carregar a página
    showTab('manageVacancies');
});
