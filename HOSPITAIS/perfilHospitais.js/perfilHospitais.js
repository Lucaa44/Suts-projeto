document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('hospitalToken');

    if (!token) {
        window.location.href = 'loginHospitais.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/hospitals/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('hospitalName').textContent = data.name;
            document.getElementById('cnpj').textContent = data.cnpj;
            document.getElementById('email').textContent = data.email;
            document.getElementById('phone').textContent = data.phone;
            document.getElementById('address').textContent = data.address;
            document.getElementById('specialties').textContent = data.specialties;
        } else {
            alert(`Erro ao carregar os dados do hospital: ${data.message || 'desconhecido'}`);
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

            // Se a aba for notificaçõesHospitais, buscar notificações
            const tabId = tab.getAttribute('data-tab');
            if (tabId === 'notificationsHospitais') {
                fetchHospitalNotifications();
            }
        });
    });

    // Função de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.clear();
            alert('Você saiu com sucesso.');
            window.location.href = 'loginHospitais.html';
        });
    } else {
        console.error('Botão de logout não encontrado.');
    }

    // Exemplo estático de vagas (substitua por dados reais da API no futuro)
    const vacancies = [
        { bloodType: 'O+', quantity: 5, urgency: 'Alta' },
        { bloodType: 'A-', quantity: 2, urgency: 'Média' }
    ];

    const vacanciesContainer = document.querySelector('.vacancies');
    vacanciesContainer.innerHTML = '';
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

    const goToManageVacanciesBtn = document.getElementById('goToManageVacanciesBtn');
    goToManageVacanciesBtn.addEventListener('click', function () {
        window.location.href = 'GerenciamentoVagas.html';
    });

    const editModal = document.getElementById('editModal');
    const editBtn = document.getElementById('editInfoBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    editBtn.addEventListener('click', function () {
        editModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    document.getElementById('editForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const phone = document.getElementById('editPhone').value;
        const address = document.getElementById('editAddress').value;
        const specialties = document.getElementById('editSpecialties').value;

        try {
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
                document.getElementById('phone').textContent = phone;
                document.getElementById('address').textContent = address;
                document.getElementById('specialties').textContent = specialties;
                editModal.style.display = 'none';
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar as informações:', error);
            alert('Erro ao tentar atualizar as informações. Tente novamente mais tarde.');
        }
    });

    async function fetchHospitalNotifications() {
        const token = localStorage.getItem('hospitalToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/hospitals/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const container = document.getElementById('hospitalNotificationsList');
            if (!container) return;

            if (response.ok) {
                const notifications = await response.json();
                updateHospitalNotificationsList(notifications);
            } else {
                container.innerHTML = '<p>Erro ao carregar notificações.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar notificações do hospital:', error);
        }
    }

    function updateHospitalNotificationsList(notifications) {
        const container = document.getElementById('hospitalNotificationsList');
        container.innerHTML = '';

        if (notifications.length === 0) {
            container.innerHTML = '<p>Você não tem notificações no momento.</p>';
            return;
        }

        notifications.forEach(notif => {
            const notifItem = document.createElement('div');
            notifItem.classList.add('notification');
            notifItem.innerHTML = `
                <p><strong>${notif.title}</strong></p>
                <p>${notif.message}</p>
                <p><small>${new Date(notif.createdAt).toLocaleString()}</small></p>
            `;
            container.appendChild(notifItem);
        });
    }
});
