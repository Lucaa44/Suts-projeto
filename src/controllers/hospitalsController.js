// hospitaiscontroller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerHospital = async (req, res) => {
    const { name, cnpj, email, phone, address, specialties, password } = req.body;

    try {
        const existingHospital = await prisma.hospital.findUnique({
            where: { cnpj }
        });

        if (existingHospital) {
            return res.status(400).json({ message: 'Hospital já existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newHospital = await prisma.hospital.create({
            data: {
                name,
                email,
                cnpj,
                phone,
                address,
                specialties,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ id: newHospital.id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            id: newHospital.id,
            name: newHospital.name,
            email: newHospital.email,
            cnpj: newHospital.cnpj,
            phone: newHospital.phone,
            address: newHospital.address,
            specialties: newHospital.specialties,
            token
        });
    } catch (error) {
        console.error('Erro ao registrar hospital:', error);
        res.status(500).json({ message: 'Erro ao registrar hospital' });
    }
};

const loginHospital = async (req, res) => {
    const { cnpj, password } = req.body;

    try {
        const hospital = await prisma.hospital.findUnique({
            where: { cnpj }
        });

        if (hospital && (await bcrypt.compare(password, hospital.password))) {
            const token = jwt.sign({ id: hospital.id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.json({
                id: hospital.id,
                name: hospital.name,
                cnpj: hospital.cnpj,
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

const getHospitalProfile = async (req, res) => {
    try {
        const hospital = await prisma.hospital.findUnique({
            where: { id: req.hospital.id }
        });

        if (hospital) {
            res.json({
                id: hospital.id,
                name: hospital.name,
                cnpj: hospital.cnpj,
                email: hospital.email,
                phone: hospital.phone,
                address: hospital.address,
                specialties: hospital.specialties
            });
        } else {
            res.status(404).json({ message: 'Hospital não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter perfil do hospital:', error);
        res.status(500).json({ message: 'Erro ao obter perfil do hospital' });
    }
};

// Função para obter as notificações do hospital
const getHospitalNotifications = async (req, res) => {
    try {
        const hospitalId = req.hospital.id;
        const notifications = await prisma.notification.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(notifications);
    } catch (error) {
        console.error('Erro ao obter notificações do hospital:', error);
        res.status(500).json({ message: 'Erro ao obter notificações do hospital' });
    }
};

module.exports = {
    registerHospital,
    loginHospital,
    getHospitalProfile,
    getHospitalNotifications
};
