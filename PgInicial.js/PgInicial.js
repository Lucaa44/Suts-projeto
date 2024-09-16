document.addEventListener('DOMContentLoaded', function() {
    // Carrossel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const indicators = document.querySelectorAll('.indicator');

    function updateSlide(index) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    document.querySelector('.next').addEventListener('click', () => {
        updateSlide((currentSlide + 1) % totalSlides);
    });

    document.querySelector('.prev').addEventListener('click', () => {
        updateSlide((currentSlide - 1 + totalSlides) % totalSlides);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateSlide(index);
        });
    });

    // Modais
    const infoButtons = document.querySelectorAll('.info-button');
    const modals = document.querySelectorAll('.info-modal');
    const closeButtons = document.querySelectorAll('.close');

    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'flex';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.info-modal').style.display = 'none';
        });
    });

    window.addEventListener('click', event => {
        if (event.target.classList.contains('info-modal')) {
            event.target.style.display = 'none';
        }
    });

    // Sempre mostrar o modal de login
    const accessProfileBtn = document.getElementById('accessProfileBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const closeModalBtn = document.querySelector('.close');

    if (accessProfileBtn && loginModal && loginForm && closeModalBtn) {
        accessProfileBtn.addEventListener('click', function() {
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
        });

        closeModalBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            loginModal.setAttribute('aria-hidden', 'true');
        });

        // Manipula o login no modal
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Armazena o token no localStorage
                    localStorage.setItem('token', data.token);
                    alert('Login realizado com sucesso!');
                    window.location.href = 'PerfilDoador.html'; // Redireciona para o perfil do doador após o login
                } else {
                    alert(`Erro: ${data.message}`);
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Tente novamente mais tarde.');
            }
        });
    } else {
        console.error("Algum elemento necessário para o modal de login não foi encontrado no DOM.");
    }
});
