// routes/vacancyRoutes.js

const express = require('express');
const { createVacancy, getVacancies, updateVacancy, deleteVacancy } = require('../controllers/vagaController');

const router = express.Router();

// Rota para criar uma nova vaga
router.post('/create', createVacancy);

// Rota para listar todas as vagas
router.get('/', getVacancies);

// Rota para editar uma vaga existente
router.put('/update/:id', updateVacancy);

// Rota para excluir uma vaga
router.delete('/delete/:id', deleteVacancy);

module.exports = router;
