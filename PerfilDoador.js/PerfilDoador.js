document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para acessar essa página.');
        window.location.href = 'AcessoDoador.html';
        return;
    }

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
        } else {
            alert('Erro ao carregar os dados do perfil.');
        }
    } catch (error) {
        console.error('Erro ao carregar os dados do perfil:', error);
        alert('Erro ao carregar os dados do perfil. Por favor, tente novamente.');
    }
});

function showTab(tabId) {
    // Esconde todo o conteúdo das abas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');

    // Remove a classe 'active' de todos os botões de aba
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    // Mostra o conteúdo da aba clicada e adiciona a classe 'active' ao botão correspondente
    document.getElementById(tabId).style.display = 'block';
    this.classList.add('active'); // Usando 'this' para referenciar o botão clicado
}

// Mostra a primeira aba por padrão
document.addEventListener('DOMContentLoaded', function() {
    const firstTabButton = document.querySelector('.tab-button.active');
    if (firstTabButton) {
        firstTabButton.dispatchEvent(new Event('click'));
    }
});
