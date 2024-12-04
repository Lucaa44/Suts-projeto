// routes/vacancyRoutes.js

const express = require('express');
const { createVacancy, getVacancies, updateVacancy, deleteVacancy } = require('../controllers/vagaController');
const { protectHospital } = require('../middleware/authHospitalMiddleware'); // Importa o middleware de autenticação

const router = express.Router();

// Rota para criar uma nova vaga (protegida)
router.post('/create', protectHospital, createVacancy);

// Rota para listar as vagas do hospital logado (protegida)
router.get('/', protectHospital, getVacancies);

// Rota para editar uma vaga existente (protegida)
router.put('/update/:id', protectHospital, updateVacancy);

// Rota para excluir uma vaga (protegida)
router.delete('/delete/:id', protectHospital, deleteVacancy);

module.exports = router;
