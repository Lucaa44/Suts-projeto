const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protectHospital = async (req, res, next) => {
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

            // Busca o hospital no banco de dados
            req.hospital = await prisma.hospital.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    specialties: true
                }
            });

            // Verifica se o hospital existe
            if (!req.hospital) {
                return res.status(401).json({ message: 'Não autorizado, hospital não encontrado' });
            }

            // Passa para o próximo middleware/rota
            next();
        } catch (error) {
            console.error('Erro ao verificar token:', error.message || error);
            res.status(401).json({ message: 'Não autorizado, token inválido' });
        }
    } else {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

module.exports = { protectHospital };
