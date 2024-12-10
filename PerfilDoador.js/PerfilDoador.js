// PerfilDoador.js

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para acessar essa página.');
        window.location.href = 'AcessoDoador.html';
        return;
    }

    let userEmail = ''; // Variável para armazenar o email do usuário

    // Função para carregar as informações do usuário
    async function loadUserInfo() {
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Preencha os dados do usuário na página
                document.getElementById('userName').textContent = data.name;
                document.getElementById('userBloodType').textContent = data.bloodType;
                document.getElementById('userEmail').textContent = data.email;
                document.getElementById('userCPF').textContent = data.cpf;

                // Preencher na aba "Informações Pessoais"
                document.getElementById('userNamePersonal').textContent = data.name;
                document.getElementById('userBloodTypePersonal').textContent = data.bloodType;
                document.getElementById('userEmailPersonal').textContent = data.email;
                document.getElementById('userCPFPersonal').textContent = data.cpf;

                userEmail = data.email; // Armazena o email para uso posterior
            } else {
                alert('Erro ao carregar os dados do perfil.');
            }
        } catch (error) {
            console.error('Erro ao carregar os dados do perfil:', error);
            alert('Erro ao carregar os dados do perfil. Por favor, tente novamente.');
        }
    }

    // Chama a função para carregar as informações do usuário
    loadUserInfo();

    // Função para mostrar as abas
    function showTab(tabId) {
        // Esconde todo o conteúdo das abas
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.style.display = 'none');

        // Remove a classe 'active' de todos os botões de aba
        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach(button => button.classList.remove('active'));

        // Mostra o conteúdo da aba clicada e adiciona a classe 'active' ao botão correspondente
        document.getElementById(tabId).style.display = 'block';
        const clickedButton = Array.from(buttons).find(btn => btn.getAttribute('data-tab') === tabId);
        if (clickedButton) clickedButton.classList.add('active');

        // Se a aba for "pendencias", carregar as pendências
        if (tabId === 'pendencias') {
            fetchPendings();
        }

        // Se a aba for "doacoes", carregar o histórico de doações
        if (tabId === 'doacoes') {
            fetchDonationHistory();
        }

        // Se a aba for "recompensas", carregar as insígnias
        if (tabId === 'recompensas') {
            fetchBadges();
        }

        // Se a aba for "notificacoes", carregar as notificações
        if (tabId === 'notificacoes') {
            fetchNotifications();
        }
    }

    // Adicionar event listeners aos botões das abas
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Exibe a primeira aba por padrão
    showTab('infoPersonais');

    // Manipulação do modal de edição de perfil
    const editProfileButton = document.getElementById('editProfileButton');
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');

    editProfileButton.addEventListener('click', function() {
        editProfileModal.style.display = 'block';
        // Preenche o campo de email com o valor atual
        document.getElementById('editEmail').value = userEmail;
    });

    editProfileModal.querySelector('.close').addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    // Manipula o submit do formulário de edição de perfil
    editProfileForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('editEmail').value;

        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email,
                    // Outros campos se necessário
                }),
            });

            if (response.ok) {
                alert('Perfil atualizado com sucesso!');
                editProfileModal.style.display = 'none';
                loadUserInfo(); // Recarrega as informações do usuário
            } else {
                const errorData = await response.json();
                console.error('Erro ao atualizar perfil:', response.statusText);
                alert(`Erro: ${errorData.message || 'Erro ao atualizar perfil.'}`);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });

    // Função para buscar as pendências
    async function fetchPendings() {
        try {
            const response = await fetch('http://localhost:5000/api/users/pendings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const pendings = await response.json();
                updatePendingsList(pendings);
            } else {
                console.error('Erro ao buscar pendências:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar a lista de pendências na página
    function updatePendingsList(pendings) {
        const pendingsList = document.getElementById('pendingsList');

        if (pendingsList) {
            pendingsList.innerHTML = '';

            if (pendings.length === 0) {
                pendingsList.innerHTML = '<p>Você não tem pendências no momento.</p>';
                return;
            }

            pendings.forEach(pending => {
                const pendingItem = document.createElement('div');
                pendingItem.classList.add('pendency');
                pendingItem.innerHTML = `
                    <h4>${pending.vacancy.hospital.name}</h4>
                    <p><strong>Tipo Sanguíneo:</strong> ${pending.vacancy.bloodType}</p>
                    <p><strong>Urgência:</strong> ${pending.vacancy.urgency}</p>
                    <p><strong>Status:</strong> ${pending.status}</p>
                    <p><strong>Data Limite:</strong> ${new Date(pending.vacancy.deadline).toLocaleDateString()}</p>
                `;
                pendingsList.appendChild(pendingItem);
            });
        }
    }

    // Função para buscar o histórico de doações
    async function fetchDonationHistory() {
        try {
            const response = await fetch('http://localhost:5000/api/users/donations', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const donations = await response.json();
                updateDonationHistory(donations);
            } else {
                console.error('Erro ao buscar histórico de doações:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar o histórico de doações na página
    function updateDonationHistory(donations) {
        const donationHistory = document.getElementById('donationHistory');

        if (donationHistory) {
            donationHistory.innerHTML = '';

            if (donations.length === 0) {
                donationHistory.innerHTML = '<tr><td colspan="5">Você ainda não realizou nenhuma doação.</td></tr>';
                return;
            }

            donations.forEach(donation => {
                const donationRow = document.createElement('tr');
                donationRow.innerHTML = `
                    <td>${donation.vacancy.hospital.name}</td>
                    <td>${donation.vacancy.bloodType}</td>
                    <td>${donation.vacancy.urgency}</td>
                    <td>${donation.status}</td>
                    <td>${new Date(donation.createdAt).toLocaleDateString()}</td>
                `;
                donationHistory.appendChild(donationRow);
            });
        }
    }

    // Função para buscar as insígnias
    async function fetchBadges() {
        try {
            const response = await fetch('http://localhost:5000/api/users/badges', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const badges = await response.json();
                updateBadgesList(badges);
            } else {
                console.error('Erro ao buscar insígnias:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar a lista de insígnias na página
    function updateBadgesList(badges) {
        const badgesList = document.getElementById('badgesList');

        if (badgesList) {
            badgesList.innerHTML = '';

            if (badges.length === 0) {
                badgesList.innerHTML = '<p>Você ainda não conquistou nenhuma insígnia.</p>';
                return;
            }

            badges.forEach(badge => {
                const badgeItem = document.createElement('div');
                badgeItem.classList.add('badge');
                badgeItem.innerHTML = `
                    <img src="${badge.badge.imageUrl}" alt="${badge.badge.name}" class="badge-image">
                    <p>${badge.badge.name}</p>
                `;
                badgesList.appendChild(badgeItem);
            });
        }
    }

    // Função para buscar notificações
    async function fetchNotifications() {
        try {
            const response = await fetch('http://localhost:5000/api/users/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const notifications = await response.json();
                updateNotificationsList(notifications);
            } else {
                console.error('Erro ao buscar notificações:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar a lista de notificações na página
    function updateNotificationsList(notifications) {
        const notificationsList = document.getElementById('notificationsList');

        if (notificationsList) {
            notificationsList.innerHTML = '';

            if (notifications.length === 0) {
                notificationsList.innerHTML = '<p>Você não tem notificações no momento.</p>';
                return;
            }

            notifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification');
                notificationItem.innerHTML = `
                    <p><strong>${notification.title}</strong></p>
                    <p>${notification.message}</p>
                `;
                notificationsList.appendChild(notificationItem);
            });
        }
    }

    function updatePendingsList(pendings) {
        const pendingsList = document.getElementById('pendingsList');
    
        if (pendingsList) {
            pendingsList.innerHTML = '';
    
            if (pendings.length === 0) {
                pendingsList.innerHTML = '<p>Você não tem pendências no momento.</p>';
                return;
            }
    
            pendings.forEach(pending => {
                const pendingItem = document.createElement('div');
                pendingItem.classList.add('pendency');
                pendingItem.innerHTML = `
                    <h4>${pending.vacancy.hospital.name}</h4>
                    <p><strong>Tipo Sanguíneo:</strong> ${pending.vacancy.bloodType}</p>
                    <p><strong>Urgência:</strong> ${pending.vacancy.urgency}</p>
                    <p><strong>Status:</strong> ${pending.status}</p>
                    <p><strong>Data Limite:</strong> ${new Date(pending.vacancy.deadline).toLocaleDateString()}</p>
                    <button class="conclude-pending-btn" data-id="${pending.id}">Concluir</button>
                `;
                pendingsList.appendChild(pendingItem);
    
                const concludeButton = pendingItem.querySelector('.conclude-pending-btn');
                concludeButton.addEventListener('click', function() {
                    const pendingDonationId = this.getAttribute('data-id');
                    concludeDonationUserSide(pendingDonationId);
                });
            });
        }
    }
    
    async function concludeDonationUserSide(pendingDonationId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para realizar esta ação.');
            return;
        }
    
        if (!confirm('Deseja realmente concluir esta doação?')) {
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/users/concludeDonation/${pendingDonationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                alert('Doação concluída com sucesso!');
                // Recarrega pendências e histórico
                fetchPendings();
                fetchDonationHistory();
            } else {
                const errorData = await response.json();
                console.error('Erro ao concluir a doação:', errorData.error || response.statusText);
                alert(`Erro: ${errorData.error || 'Não foi possível concluir a doação.'}`);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            alert('Erro ao conectar com o servidor.');
        }
    }

    // Removido o chamado inicial para fetchPendings(), pois agora ele é chamado ao clicar na aba correspondente
});
