// PgInicial.js

document.addEventListener('DOMContentLoaded', function() {
    let selectedVacancyId = null;
    let vacancies = []; // Armazena as vagas carregadas

    // Função para carregar as vagas com filtros opcionais
    async function loadVacancies(filters = {}) {
        try {
            let url = 'http://localhost:5000/api/vacancies/public';

            const params = new URLSearchParams();

            if (filters.location) {
                params.append('location', filters.location);
            }
            if (filters.bloodType) {
                params.append('bloodType', filters.bloodType);
            }
            if (filters.urgency) {
                params.append('urgency', filters.urgency);
            }

            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await fetch(url);
            if (response.ok) {
                vacancies = await response.json(); // Armazena as vagas
                updateCarousel(vacancies);
            } else {
                console.error('Erro ao buscar vagas:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar o carrossel com as vagas
    function updateCarousel(vacancies) {
        const carousel = document.querySelector('.carousel');
        const indicatorsContainer = document.querySelector('.carousel-indicators');

        // Limpa o carrossel atual
        carousel.innerHTML = `
            <button class="prev" aria-label="Anterior">&#10094;</button>
            <!-- Slides serão inseridos aqui -->
            <button class="next" aria-label="Próximo">&#10095;</button>
        `;
        indicatorsContainer.innerHTML = '';

        // Verifica se há vagas
        if (vacancies.length === 0) {
            const noVacanciesMessage = document.createElement('p');
            noVacanciesMessage.textContent = 'Nenhuma vaga disponível no momento.';
            carousel.appendChild(noVacanciesMessage);
            return;
        }

        // Adiciona as vagas ao carrossel
        vacancies.forEach((vacancy, index) => {
            const slide = document.createElement('article');
            slide.classList.add('slide');
            if (index === 0) slide.classList.add('active');

            slide.innerHTML = `
                <h2>${vacancy.hospital.name}</h2>
                <p><strong>Tipo Sanguíneo Necessário:</strong> ${vacancy.bloodType}</p>
                <p><strong>Urgência:</strong> ${vacancy.urgency}</p>
                <p><strong>Localização:</strong> ${vacancy.location || vacancy.hospital.address}</p>
                <p><strong>Motivo:</strong> ${vacancy.description || 'Doação necessária'}</p>
                <button class="donate-now" data-vacancy-id="${vacancy.id}">Doar agora!</button>
                <button class="info-button" data-vacancy='${JSON.stringify(vacancy)}'>Mais informações</button>
            `;
            carousel.insertBefore(slide, carousel.querySelector('.next'));

            // Cria os indicadores
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.dataset.slide = index;
            indicatorsContainer.appendChild(indicator);
        });

        // Reaplica os eventos do carrossel e dos indicadores
        initializeCarousel();
    }

    // Função para inicializar o carrossel
    function initializeCarousel() {
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

        const nextButton = document.querySelector('.next');
        const prevButton = document.querySelector('.prev');

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                updateSlide((currentSlide + 1) % totalSlides);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                updateSlide((currentSlide - 1 + totalSlides) % totalSlides);
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                updateSlide(index);
            });
        });

        // Eventos para os botões de "Mais informações"
        const infoButtons = document.querySelectorAll('.info-button');
        infoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const vacancyData = JSON.parse(button.getAttribute('data-vacancy'));
                openVacancyModal(vacancyData);
            });
        });

        // Eventos para os botões "Doar agora!"
        const donateButtons = document.querySelectorAll('.donate-now');
        donateButtons.forEach(button => {
            button.addEventListener('click', () => {
                selectedVacancyId = button.getAttribute('data-vacancy-id'); // Armazena o ID da vaga selecionada
                openLoginModal();
            });
        });
    }

    // Função para abrir o modal de login
    function openLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
        } else {
            console.error('Modal de login não encontrado.');
        }
    }

    // Função para abrir o modal com detalhes da vaga
    function openVacancyModal(vacancy) {
        const modal = document.getElementById('vacancyModal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
            <span class="close" aria-label="Fechar">&times;</span>
            <h2>${vacancy.hospital.name}</h2>
            <p><strong>Tipo Sanguíneo Necessário:</strong> ${vacancy.bloodType}</p>
            <p><strong>Quantidade Necessária:</strong> ${vacancy.quantity}</p>
            <p><strong>Urgência:</strong> ${vacancy.urgency}</p>
            <p><strong>Data Limite:</strong> ${new Date(vacancy.deadline).toLocaleDateString()}</p>
            <p><strong>Descrição:</strong> ${vacancy.description || 'N/A'}</p>
            <p><strong>Local da Coleta:</strong> ${vacancy.location || vacancy.hospital.address}</p>
            <p><strong>Contato:</strong> ${vacancy.contact || vacancy.hospital.contact}</p>
        `;

        // Evento para fechar o modal
        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.style.display = 'flex';
    }

    // Evento para fechar o modal ao clicar fora dele
    window.addEventListener('click', event => {
        const vacancyModal = document.getElementById('vacancyModal');
        const loginModal = document.getElementById('loginModal');
        if (event.target === vacancyModal) {
            vacancyModal.style.display = 'none';
        }
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Carrega as vagas ao iniciar a página
    loadVacancies();

    // Função para carregar as estatísticas
    async function loadStats() {
        try {
            const response = await fetch('http://localhost:5000/api/stats');
            if (response.ok) {
                const stats = await response.json();
                updateHighlights(stats);
            } else {
                console.error('Erro ao buscar estatísticas:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    }

    // Função para atualizar a seção de destaques
    function updateHighlights(stats) {
        document.getElementById('donorsCount').textContent = stats.donorsCount;
        document.getElementById('donationsCount').textContent = stats.donationsCount;
        document.getElementById('hospitalsCount').textContent = stats.hospitalsCount;
    }

    // Carrega as estatísticas ao iniciar a página
    loadStats();

    // Manipulação do modal de login
    const accessProfileBtn = document.getElementById('accessProfileBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');

    if (accessProfileBtn && loginModal && loginForm) {
        accessProfileBtn.addEventListener('click', function() {
            selectedVacancyId = null; // Limpa a seleção de vaga se o usuário clicar para acessar o perfil
            openLoginModal();
        });

        loginModal.addEventListener('click', function(event) {
            if (event.target.classList.contains('close') || event.target === loginModal) {
                loginModal.style.display = 'none';
                loginModal.setAttribute('aria-hidden', 'true');
            }
        });

        // Manipula o login no modal
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const body = { email, password };
                if (selectedVacancyId) {
                    body.vacancyId = selectedVacancyId; // Envia o vacancyId se houver uma vaga selecionada
                }

                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok) {
                    // Armazena o token no localStorage
                    localStorage.setItem('token', data.token);
                    alert('Login realizado com sucesso!');
                    window.location.href = 'PerfilDoador.html'; // Redireciona para o perfil do doador após o login
                } else {
                    alert(`Erro: ${data.message || 'Não foi possível fazer o login.'}`);
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Tente novamente mais tarde.');
            }
        });
    } else {
        console.error("Algum elemento necessário para o modal de login não foi encontrado no DOM.");
    }

    // Lógica do filtro
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const location = document.getElementById('filterLocation').value.trim();
        const bloodType = document.getElementById('filterBloodType').value;
        const urgency = document.getElementById('filterUrgency').value;

        const filters = {};
        if (location) filters.location = location;
        if (bloodType) filters.bloodType = bloodType;
        if (urgency) filters.urgency = urgency;

        // Recarrega as vagas com os filtros aplicados
        loadVacancies(filters);
    });
});
