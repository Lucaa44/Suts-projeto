const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token do header Authorization
            token = req.headers.authorization.split(' ')[1];

            // Verifica se o JWT_SECRET está definido
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET não está definido no ambiente.');
            }

            // Verifica e decodifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Busca o usuário no banco de dados
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    cpf: true,       
                    bloodType: true  
                }
            });

            // Verifica se o usuário existe
            if (!req.user) {
                return res.status(401).json({ message: 'Não autorizado, usuário não encontrado' });
            }

            // Passa para o próximo middleware/rota
            next();
        } catch (error) {
            console.error('Erro ao verificar token:', error.message || error);
            res.status(401).json({ message: 'Não autorizado, token falhou' });
        }
    } else {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

module.exports = { protect };
