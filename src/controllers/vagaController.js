// vacancyController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar uma nova vaga
const createVacancy = async (req, res) => {
  try {
    const { bloodType, quantity, urgency, deadline, description, location, contact, hospitalId } = req.body;

    // Certifique-se de que todos os campos obrigatórios estão presentes
    if (!bloodType || !quantity || !urgency || !deadline || !hospitalId) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const newVacancy = await prisma.vacancy.create({
      data: {
        bloodType,
        quantity,
        urgency,
        deadline: new Date(deadline),
        description,
        location,
        contact,
        hospitalId: parseInt(hospitalId, 10), // Converte para número para garantir compatibilidade
      },
    });

    res.status(201).json({ message: 'Vaga criada com sucesso!', vacancy: newVacancy });
  } catch (error) {
    console.error('Erro ao criar vaga:', error); // Adiciona um log do erro para melhor depuração
    res.status(500).json({ error: 'Erro ao criar vaga.' });
  }
};

// Função para listar todas as vagas
const getVacancies = async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany();
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Erro ao listar vagas:', error); // Adiciona um log do erro para melhor depuração
    res.status(500).json({ error: 'Erro ao listar vagas.' });
  }
};

// Função para editar uma vaga
const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodType, quantity, urgency, deadline, description, location, contact } = req.body;

    // Validações dos campos obrigatórios
    if (!id || !bloodType || !quantity || !urgency || !deadline) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const updatedVacancy = await prisma.vacancy.update({
      where: { id: parseInt(id, 10) },
      data: {
        bloodType,
        quantity,
        urgency,
        deadline: new Date(deadline),
        description,
        location,
        contact,
      },
    });

    res.status(200).json({ message: 'Vaga atualizada com sucesso!', vacancy: updatedVacancy });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error); // Adiciona um log do erro para melhor depuração
    res.status(500).json({ error: 'Erro ao atualizar vaga.' });
  }
};

// Função para excluir uma vaga
const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID é obrigatório para excluir a vaga.' });
    }

    await prisma.vacancy.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: 'Vaga excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir vaga:', error); // Adiciona um log do erro para melhor depuração
    res.status(500).json({ error: 'Erro ao excluir vaga.' });
  }
};

module.exports = {
  createVacancy,
  getVacancies,
  updateVacancy,
  deleteVacancy,
};
