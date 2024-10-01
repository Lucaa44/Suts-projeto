document.getElementById('hospitalLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Limpa mensagens de erro anteriores
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const cnpj = document.getElementById('cnpj').value;
    const password = document.getElementById('password').value;

    let hasError = false;

    // Validação de CNPJ simples (apenas para formato)
    if (cnpj.length !== 14) {
        document.getElementById('cnpjError').textContent = 'CNPJ inválido';
        document.getElementById('cnpjError').style.display = 'block';
        hasError = true;
    }

    // Validação de senha (mínimo de 6 caracteres)
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'A senha deve ter no mínimo 6 caracteres.';
        document.getElementById('passwordError').style.display = 'block';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Exibir animação de carregamento
    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5000/api/hospitals/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cnpj, password })
        });

        const data = await response.json();

        // Oculta a animação de carregamento
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            // Armazena o token do hospital no localStorage
            localStorage.setItem('hospitalToken', data.token);

            // Redireciona para o perfil do hospital após o login
            window.location.href = 'perfilHospitais.html';
        } else {
            document.getElementById('cnpjError').textContent = `Erro: ${data.message}`;
            document.getElementById('cnpjError').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('cnpjError').textContent = 'Erro ao tentar fazer login. Tente novamente mais tarde.';
        document.getElementById('cnpjError').style.display = 'block';
    }
});
