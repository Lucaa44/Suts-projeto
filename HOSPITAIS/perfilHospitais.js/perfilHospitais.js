document.addEventListener('DOMContentLoaded', async function () {
    // Token JWT armazenado após o login
    const token = localStorage.getItem('hospitalToken');
    
    if (!token) {
        window.location.href = 'loginHospitais.html'; // Redireciona se não estiver autenticado
        return;
    }

    try {
        // Faz requisição para obter o perfil do hospital
        const response = await fetch('http://localhost:5000/api/hospitals/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Preenche os dados reais do hospital
            document.getElementById('hospitalName').textContent = data.name;
            document.getElementById('cnpj').textContent = data.cnpj;
            document.getElementById('email').textContent = data.email;
            document.getElementById('phone').textContent = data.phone;
            document.getElementById('address').textContent = data.address;
            document.getElementById('specialties').textContent = data.specialties;
        } else {
            alert('Erro ao carregar os dados do hospital.');
            window.location.href = 'loginHospitais.html';
        }
    } catch (error) {
        console.error('Erro ao carregar os dados do hospital:', error);
        alert('Erro ao carregar os dados. Tente novamente mais tarde.');
    }

    // Navegação por abas
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            contents[index].classList.add('active');
        });
    });

    // Exemplo estático de vagas (substitua por dados reais da API)
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
        editModal.style.display = 'flex'; // Exibe o modal de edição
    });

    closeModalBtn.addEventListener('click', function () {
        editModal.style.display = 'none'; // Fecha o modal
    });

    // Fechar modal ao clicar fora do conteúdo
    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Evento para salvar as alterações do perfil (futuramente implementar a lógica de atualização)
    document.getElementById('editForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        // Dados do formulário de edição
        const phone = document.getElementById('editPhone').value;
        const address = document.getElementById('editAddress').value;
        const specialties = document.getElementById('editSpecialties').value;

        try {
            // Requisição para atualizar as informações do hospital
            const response = await fetch('http://localhost:5000/api/hospitals/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, address, specialties })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Informações atualizadas com sucesso!');
                // Atualiza os dados na página
                document.getElementById('phone').textContent = phone;
                document.getElementById('address').textContent = address;
                document.getElementById('specialties').textContent = specialties;
                editModal.style.display = 'none'; // Fecha o modal
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar as informações:', error);
            alert('Erro ao tentar atualizar as informações. Tente novamente mais tarde.');
        }
    });
});
