const express = require('express');
const { registerHospital, loginHospital, getHospitalProfile } = require('../routes/');
const { protect } = require('../middleware/authHospitalMiddleware.js');

const router = express.Router();

// Rota para registrar um novo hospital
router.post('/register', registerHospital);

// Rota para login de hospital
router.post('/login', loginHospital);

// Rota para obter o perfil do hospital autenticado
router.get('/profile', protect, getHospitalProfile);

module.exports = router;
