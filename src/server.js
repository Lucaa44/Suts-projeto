const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes'); // Rotas para hospitais

// Carrega as variáveis de ambiente
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

// Middleware para permitir CORS (cross-origin resource sharing)
app.use(cors());

// Middleware para parsear JSON do corpo das requisições
app.use(express.json());

// Rotas para usuários
app.use('/api/users', userRoutes);

// Rotas para hospitais
app.use('/api/hospitals', hospitalRoutes); 

// Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('API está rodando...');
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
