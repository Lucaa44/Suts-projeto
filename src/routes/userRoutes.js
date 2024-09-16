const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para obter o perfil do usuário autenticado
router.get('/profile', protect, getUserProfile);

module.exports = router;
