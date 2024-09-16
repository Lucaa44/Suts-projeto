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

    // Lista de vagas (exemplo estático, substituir com dados da API)
    const vacancies = [
        { bloodType: 'O+', quantity: 5, urgency: 'Alta' },
        { bloodType: 'A-', quantity: 2, urgency: 'Média' }
    ];

    // Renderiza lista resumida de vagas
    const vacanciesContainer = document.querySelector('.vacancies');
    vacanciesContainer.innerHTML = ''; // Limpa conteúdo existente

    vacancies.forEach(vacancy => {
        const vacancyItem = document.createElement('div');
        vacancyItem.classList.add('vacancy-item');
        vacancyItem.innerHTML = `
            <p><i class="fas fa-tint"></i> <strong>Tipo Sanguíneo:</strong> ${vacancy.bloodType}</p>
            <p><i class="fas fa-medkit"></i> <strong>Quantidade Necessária:</strong> ${vacancy.quantity} bolsas</p>
            <p><i class="fas fa-exclamation-triangle"></i> <strong>Urgência:</strong> ${vacancy.urgency}</p>
        `;
        vacanciesContainer.appendChild(vacancyItem);
    });

    // Redirecionar para a página de gerenciamento de vagas
    const goToManageVacanciesBtn = document.getElementById('goToManageVacanciesBtn');
    goToManageVacanciesBtn.addEventListener('click', function () {
        window.location.href = 'GerenciamentoVagas.html'; // Ajuste o caminho conforme necessário
    });

    // Função para abrir e fechar o modal de edição
    const editModal = document.getElementById('editModal');
    const editBtn = document.getElementById('editInfoBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    editBtn.addEventListener('click', function () {
        editModal.style.display = 'flex'; // Certifique-se de que o modal seja exibido corretamente
    });

    closeModalBtn.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    // Fechar modais ao clicar fora do conteúdo
    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Evento para salvar as alterações do perfil
    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault();
        // Ações para salvar as informações (substituir com a lógica de atualização na API)
        alert('Informações do hospital atualizadas com sucesso!');
        editModal.style.display = 'none';
    });
});
