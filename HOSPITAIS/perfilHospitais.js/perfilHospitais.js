document.addEventListener('DOMContentLoaded', function () {
    // Navegação por abas
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            // Remove 'active' de todas as abas e conteúdo
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Adiciona 'active' à aba clicada e ao conteúdo correspondente
            tab.classList.add('active');
            contents[index].classList.add('active');
        });
    });

    // Preenchendo as informações do hospital no perfil (exemplo estático, você vai substituir com dados da API)
    document.getElementById('hospitalName').textContent = 'Hospital Central';
    document.getElementById('cnpj').textContent = '12.345.678/0001-90';
    document.getElementById('email').textContent = 'contato@hospitalcentral.com.br';
    document.getElementById('phone').textContent = '(11) 1234-5678';
    document.getElementById('address').textContent = 'Rua das Flores, 123';
    document.getElementById('specialties').textContent = 'Cardiologia, Pediatria';
    document.getElementById('city').textContent = 'São Paulo';
    document.getElementById('state').textContent = 'SP';

    // Função para abrir e fechar o modal de edição
    const editModal = document.getElementById('editModal');
    const editBtn = document.getElementById('editInfoBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    editBtn.addEventListener('click', function () {
        editModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    // Função para abrir e fechar o modal de adicionar vaga
    const addVacancyModal = document.getElementById('addVacancyModal');
    const addVacancyBtn = document.getElementById('addVacancyBtn');
    const closeVacancyModalBtn = document.getElementById('closeVacancyModalBtn');

    addVacancyBtn.addEventListener('click', function () {
        addVacancyModal.style.display = 'flex';
    });

    closeVacancyModalBtn.addEventListener('click', function () {
        addVacancyModal.style.display = 'none';
    });

    // Fechar modais ao clicar fora do conteúdo
    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
        if (event.target === addVacancyModal) {
            addVacancyModal.style.display = 'none';
        }
    });

    // Evento para salvar as alterações do perfil
    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault();
        // Ações para salvar as informações (substituir com a lógica de atualização na API)
        alert('Informações do hospital atualizadas com sucesso!');
        editModal.style.display = 'none';
    });

    // Evento para adicionar uma nova vaga de doação
    document.getElementById('vacancyForm').addEventListener('submit', function (e) {
        e.preventDefault();
        // Ações para adicionar a vaga (substituir com a lógica da API)
        alert('Necessidade de doação adicionada com sucesso!');
        addVacancyModal.style.display = 'none';
    });
});
