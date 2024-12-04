// routes/vacancyRoutes.js

const express = require('express');
const {
  createVacancy,
  getVacancies,
  updateVacancy,
  closeVacancy,
} = require('../controllers/vagaController');
const { protectHospital } = require('../middleware/authHospitalMiddleware');

const router = express.Router();

// Rota para criar uma nova vaga (protegida)
router.post('/create', protectHospital, createVacancy);

// Rota para listar as vagas do hospital logado (protegida)
router.get('/', protectHospital, getVacancies);

// Rota para editar uma vaga existente (protegida)
router.put('/update/:id', protectHospital, updateVacancy);

// Rota para concluir uma vaga (protegida)
router.put('/close/:id', protectHospital, closeVacancy);

module.exports = router;
