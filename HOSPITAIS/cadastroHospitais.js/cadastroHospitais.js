function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordType = passwordInput.getAttribute('type');
    passwordInput.setAttribute('type', passwordType === 'password' ? 'text' : 'password');
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    // Validação básica do CNPJ
    const invalidCNPJs = [
        '00000000000000', '11111111111111', '22222222222222', 
        '33333333333333', '44444444444444', '55555555555555', 
        '66666666666666', '77777777777777', '88888888888888', 
        '99999999999999'
    ];

    if (invalidCNPJs.includes(cnpj)) return false;

    return true; // Implementação simplificada, pode-se expandir essa função
}

document.getElementById('hospitalForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const hospitalName = document.getElementById('hospitalName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cnpj = document.getElementById('cnpj').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const specialties = document.getElementById('specialties').value;

    let hasError = false;

    if (!validarCNPJ(cnpj)) {
        document.getElementById('cnpjError').textContent = 'CNPJ inválido';
        document.getElementById('cnpjError').style.display = 'block';
        hasError = true;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'A senha deve ter no mínimo 6 caracteres.';
        document.getElementById('passwordError').style.display = 'block';
        hasError = true;
    }

    if (hasError) return;

    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5000/api/hospitals/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hospitalName, email, password, cnpj, city, state, phone, address, specialties })
        });

        const data = await response.json();

        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            window.location.href = 'perfilHospital.html';
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
