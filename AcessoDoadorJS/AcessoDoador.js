// Função para abrir o modal
document.getElementById('openModalBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o comportamento padrão do link
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('loginModal').setAttribute('aria-hidden', 'false');
});

// Função para fechar o modal
document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginModal').setAttribute('aria-hidden', 'true');
});

// Fechar o modal clicando fora do conteúdo do modal
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginModal').setAttribute('aria-hidden', 'true');
    }
});

// Função de login
document.querySelector('#loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loading = document.getElementById('loading');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Limpa mensagens de erro anteriores
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    // Mostra a animação de carregamento
    loading.style.display = 'block';

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        loading.style.display = 'none'; // Oculta a animação de carregamento

        if (response.ok) {
            // Armazena o token no localStorage para futuras requisições autenticadas
            localStorage.setItem('token', data.token);
            window.location.href = 'PerfilDoador.html'; // Redireciona para o perfil do doador após o login
        } else {
            if (data.message.includes('email')) {
                emailError.textContent = 'E-mail não encontrado.';
                emailError.style.display = 'block';
            } else if (data.message.includes('senha')) {
                passwordError.textContent = 'Senha incorreta.';
                passwordError.style.display = 'block';
            } else {
                emailError.textContent = 'Erro ao tentar fazer login. Verifique suas credenciais.';
                emailError.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        loading.style.display = 'none'; // Oculta a animação de carregamento
        emailError.textContent = 'Erro ao tentar fazer login. Por favor, tente novamente.';
        emailError.style.display = 'block';
    }
});
