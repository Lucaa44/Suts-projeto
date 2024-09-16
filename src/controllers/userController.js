const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de um novo usuário
const registerUser = async (req, res) => {
    const { name, email, cpf, password, bloodType } = req.body;

    try {
        // Verifica se o usuário já existe pelo email ou CPF
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        const existingCpf = await prisma.user.findUnique({
            where: { cpf }
        });

        if (existingUser || existingCpf) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o novo usuário
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                cpf,
                password: hashedPassword,
                bloodType
                
            }
        });

        // Gera um token JWT
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            cpf: newUser.cpf,
            bloodType: newUser.bloodType,
            token
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
};

// Login do usuário
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Gera um token JWT
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token
            });
        } else {
            res.status(400).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};

// Obtém perfil do usuário
const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                bloodType: user.bloodType,
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter perfil do usuário:', error);
        res.status(500).json({ message: 'Erro ao obter perfil do usuário' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
