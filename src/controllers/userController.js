// controllers/userController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de um novo usuário
const registerUser = async (req, res) => {
    const { name, email, cpf, password, bloodType } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        const existingCpf = await prisma.user.findUnique({ where: { cpf } });

        if (existingUser || existingCpf) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                cpf,
                password: hashedPassword,
                bloodType
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

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
    const { email, password, vacancyId } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

            // Se vacancyId estiver presente, criar uma pendência e notificar o hospital
            if (vacancyId) {
                const vacancy = await prisma.vacancy.findUnique({
                    where: { id: parseInt(vacancyId, 10) },
                    include: { hospital: true }
                });

                if (!vacancy) {
                    return res.status(404).json({ message: 'Vaga não encontrada' });
                }

                const existingPending = await prisma.pendingDonation.findFirst({
                    where: {
                        userId: user.id,
                        vacancyId: parseInt(vacancyId, 10),
                        status: 'pendente'
                    }
                });

                if (!existingPending) {
                    // Cria a pendência
                    await prisma.pendingDonation.create({
                        data: {
                            userId: user.id,
                            vacancyId: parseInt(vacancyId, 10),
                            status: 'pendente',
                            createdAt: new Date()
                        }
                    });

                    // Cria notificação para o hospital
                    await prisma.notification.create({
                        data: {
                            hospitalId: vacancy.hospitalId,
                            title: 'Novo Candidato',
                            message: `O usuário ${user.name} (Tipo sanguíneo: ${user.bloodType}, Email: ${user.email}) se candidatou à vaga ${vacancy.bloodType}.`
                        }
                    });
                }
            }

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

// Atualiza o perfil do usuário
const updateUserProfile = async (req, res) => {
    const { email } = req.body;

    try {
        const userId = req.user.id;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email }
        });

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            cpf: updatedUser.cpf,
            bloodType: updatedUser.bloodType,
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar perfil do usuário' });
    }
};

// Obtém as pendências do usuário
const getUserPendings = async (req, res) => {
    try {
        const userId = req.user.id;
        const pendings = await prisma.pendingDonation.findMany({
            where: { userId },
            include: {
                vacancy: {
                    include: { hospital: true },
                },
            },
        });
        res.json(pendings);
    } catch (error) {
        console.error('Erro ao obter pendências do usuário:', error);
        res.status(500).json({ error: 'Erro ao obter pendências do usuário' });
    }
};

// Obtém o histórico de doações do usuário
const getDonationHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const donations = await prisma.donation.findMany({
            where: { userId },
            include: {
                vacancy: {
                    include: { hospital: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(donations);
    } catch (error) {
        console.error('Erro ao obter histórico de doações:', error);
        res.status(500).json({ message: 'Erro ao obter histórico de doações' });
    }
};

// Obtém as insígnias do usuário
const getUserBadges = async (req, res) => {
    try {
        const userId = req.user.id;
        const userBadges = await prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true },
            orderBy: { earnedAt: 'desc' },
        });
        res.json(userBadges);
    } catch (error) {
        console.error('Erro ao obter insígnias do usuário:', error);
        res.status(500).json({ message: 'Erro ao obter insígnias do usuário' });
    }
};

// Obtém as notificações do usuário
const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    } catch (error) {
        console.error('Erro ao obter notificações do usuário:', error);
        res.status(500).json({ message: 'Erro ao obter notificações do usuário' });
    }
};

// Função para o usuário concluir uma pendência manualmente
const concludeDonationFromUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { pendingDonationId } = req.params;

        const pending = await prisma.pendingDonation.findUnique({
            where: { id: parseInt(pendingDonationId, 10) },
            include: { vacancy: true },
        });

        if (!pending) {
            return res.status(404).json({ error: 'Pendência não encontrada.' });
        }

        if (pending.userId !== userId) {
            return res.status(403).json({ error: 'Não autorizado a concluir esta pendência.' });
        }

        if (pending.status !== 'pendente') {
            return res.status(400).json({ error: 'Esta pendência já foi concluída ou não está mais pendente.' });
        }

        await prisma.donation.create({
            data: {
                userId: userId,
                vacancyId: pending.vacancyId,
                status: 'concluída pelo usuário',
            }
        });

        await prisma.pendingDonation.delete({ where: { id: pending.id } });

        res.status(200).json({ message: 'Doação concluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao concluir a doação pelo usuário:', error);
        res.status(500).json({ error: 'Erro ao concluir a doação.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserPendings,
    getDonationHistory,
    getUserBadges,
    getUserNotifications,
    concludeDonationFromUser,
};
