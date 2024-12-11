// routes/hospitalRoutes.js

const express = require('express');
const { registerHospital, loginHospital, getHospitalProfile, getHospitalNotifications } = require('../controllers/hospitalsController');
const { protectHospital } = require('../middleware/authHospitalMiddleware');

const router = express.Router();

router.post('/register', registerHospital);
router.post('/login', loginHospital);
router.get('/profile', protectHospital, getHospitalProfile);

// Nova rota para obter notificações do hospital
router.get('/notifications', protectHospital, getHospitalNotifications);

module.exports = router;
