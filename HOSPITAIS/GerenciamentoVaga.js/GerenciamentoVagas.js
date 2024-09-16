document.addEventListener('DOMContentLoaded', function() {
    // Função para mostrar a aba selecionada
    function showTab(tabId) {
        // Esconde todas as abas
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));

        // Remove a classe 'active' de todos os botões
        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach(button => button.classList.remove('active'));

        // Mostra a aba selecionada e adiciona a classe 'active' ao botão correspondente
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
    }

    // Selecionando elementos para o modal de adicionar vaga
    const addVacancyModal = document.getElementById('addVacancyModal');
    const addVacancyBtn = document.getElementById('addVacancyBtn');
    const closeVacancyModalBtn = document.getElementById('closeVacancyModalBtn');

    // Ocultar o modal por padrão
    addVacancyModal.style.display = 'none';

    // Mostrar o modal de adicionar vaga
    addVacancyBtn.addEventListener('click', function() {
        addVacancyModal.style.display = 'flex';
    });

    // Fechar o modal de adicionar vaga
    closeVacancyModalBtn.addEventListener('click', function() {
        addVacancyModal.style.display = 'none';
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === addVacancyModal) {
            addVacancyModal.style.display = 'none';
        }
    });

    // Lógica para salvar a nova vaga
    document.getElementById('addVacancyForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Obter valores do formulário
        const bloodType = document.getElementById('bloodType').value;
        const quantity = document.getElementById('quantity').value;
        const urgency = document.getElementById('urgency').value;
        const deadline = document.getElementById('deadline').value;
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value;
        const contact = document.getElementById('contact').value;

        // Lógica para enviar os dados ao servidor ou salvar localmente (exemplo)
        const newVacancy = {
            bloodType,
            quantity,
            urgency,
            deadline,
            description,
            location,
            contact
        };

        console.log('Nova Vaga:', newVacancy); // Apenas para depuração

        // Fechar o modal após salvar a vaga
        addVacancyModal.style.display = 'none';

        // Limpar o formulário
        document.getElementById('addVacancyForm').reset();

        // Atualizar a lista de vagas (você deve atualizar a lógica conforme necessário)
        // Exemplo de adicionar vaga diretamente na lista
        addVacancyToList(newVacancy);
    });

    // Função de exemplo para adicionar a vaga à lista na página (substitua pela lógica da sua aplicação)
    function addVacancyToList(vacancy) {
        const vacanciesList = document.querySelector('.vacancies-list');
        
        const vacancyItem = document.createElement('div');
        vacancyItem.classList.add('vacancy-item');
        vacancyItem.innerHTML = `
            <p><strong>Tipo Sanguíneo:</strong> ${vacancy.bloodType}</p>
            <p><strong>Quantidade Necessária:</strong> ${vacancy.quantity}</p>
            <p><strong>Urgência:</strong> ${vacancy.urgency}</p>
            <p><strong>Data Limite:</strong> ${vacancy.deadline}</p>
            <p><strong>Descrição:</strong> ${vacancy.description}</p>
            <p><strong>Local da Coleta:</strong> ${vacancy.location}</p>
            <p><strong>Contato:</strong> ${vacancy.contact}</p>
        `;
        vacanciesList.appendChild(vacancyItem);
    }

    // Evento para aplicar filtros
    document.getElementById('applyFiltersBtn').addEventListener('click', function() {
        // Lógica para filtrar a lista de vagas
        alert('Aplicar filtros de vagas.');
    });

    // Evento para o formulário de edição de informações (ajuste conforme necessário)
    document.getElementById('editInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Informações atualizadas com sucesso!');
    });

    // Mostra a primeira aba ao carregar a página
    showTab('manageVacancies');
});
