// routes/userRoutes.js

const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserPendings,
    getDonationHistory,
    getUserBadges,
    getUserNotifications
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para obter o perfil do usuário autenticado
router.get('/profile', protect, getUserProfile);

// Rota para atualizar o perfil do usuário autenticado
router.put('/profile', protect, updateUserProfile);

// Rota para obter as pendências do usuário autenticado
router.get('/pendings', protect, getUserPendings);

// Rota para obter o histórico de doações do usuário autenticado
router.get('/donations', protect, getDonationHistory);

// Rota para obter as insígnias do usuário autenticado
router.get('/badges', protect, getUserBadges);

// Rota para obter as notificações do usuário autenticado
router.get('/notifications', protect, getUserNotifications);

module.exports = router;
