// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

// Função para formatar o nome (primeira letra maiúscula em cada palavra)
function formatarNome(nome) {
    return nome.replace(/\b\w+/g, function(palavra) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    });
}

// Formata o nome conforme o usuário digita
document.getElementById('name').addEventListener('input', function() {
    const nomeFormatado = formatarNome(this.value);
    this.value = nomeFormatado;
});

document.getElementById('donationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Limpa mensagens de erro anteriores
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const password = document.getElementById('password').value;
    const bloodType = document.getElementById('blood-type').value;

    let hasError = false;

    // Validação do CPF
    if (!validarCPF(cpf)) {
        document.getElementById('cpfError').textContent = 'CPF inválido';
        document.getElementById('cpfError').style.display = 'block';
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

    // Limpa o localStorage para remover o token do usuário anterior
    localStorage.removeItem('token');

    // Exibir animação de carregamento
    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, cpf, password, bloodType })
        });

        const data = await response.json();

        // Oculta a animação de carregamento
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            // Armazena o token do novo usuário no localStorage
            localStorage.setItem('token', data.token);

            // Redireciona para o perfil do doador após o cadastro
            window.location.href = 'PerfilDoador.html';
        } else {
            document.getElementById('emailError').textContent = `Erro: ${data.message}`;
            document.getElementById('emailError').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('emailError').textContent = 'Erro ao registrar. Tente novamente mais tarde.';
        document.getElementById('emailError').style.display = 'block';
    }
});
