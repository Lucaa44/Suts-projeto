const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// Carrega as variáveis de ambiente
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

// Middleware para permitir CORS (caso esteja servindo frontend de outra origem)
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rotas para usuários
app.use('/api/users', userRoutes);

// Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('API está rodando...');
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
