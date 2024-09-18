const express = require('express');
const { registerHospital, loginHospital, getHospitalProfile } = require('../controllers/hospitalController');
const { protectHospital } = require('../middleware/authHospitalMiddleware');

const router = express.Router();

// Rota para registrar um novo hospital
router.post('/register', registerHospital);

// Rota para login de hospital
router.post('/login', loginHospital);

// Rota para obter o perfil do hospital autenticado
router.get('/profile', protectHospital, getHospitalProfile);

module.exports = router;
