// controllers/vagaController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar uma nova vaga
const createVacancy = async (req, res) => {
  try {
    const { bloodType, quantity, urgency, deadline, description, location, contact } = req.body;
    const hospitalId = req.hospital.id;

    // Certifique-se de que todos os campos obrigatórios estão presentes
    if (!bloodType || !quantity || !urgency || !deadline) {
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
        hospitalId: hospitalId,
      },
    });

    res.status(201).json({ message: 'Vaga criada com sucesso!', vacancy: newVacancy });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ error: 'Erro ao criar vaga.' });
  }
};

// Função para listar as vagas do hospital logado com filtros
const getVacancies = async (req, res) => {
  try {
    const hospitalId = req.hospital.id;
    const { bloodType, urgency, isClosed } = req.query;

    // Construir objeto de condições
    const conditions = {
      hospitalId: hospitalId,
    };

    if (bloodType) {
      conditions.bloodType = bloodType;
    }

    if (urgency) {
      conditions.urgency = urgency;
    }

    if (isClosed !== undefined) {
      conditions.isClosed = isClosed === 'true';
    }

    const vacancies = await prisma.vacancy.findMany({
      where: conditions,
    });
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Erro ao listar vagas:', error);
    res.status(500).json({ error: 'Erro ao listar vagas.' });
  }
};

// Função para editar uma vaga
const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodType, quantity, urgency, deadline, description, location, contact } = req.body;
    const hospitalId = req.hospital.id;

    // Validações dos campos obrigatórios
    if (!id || !bloodType || !quantity || !urgency || !deadline) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    // Verifica se a vaga pertence ao hospital autenticado
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!vacancy || vacancy.hospitalId !== hospitalId) {
      return res.status(404).json({ error: 'Vaga não encontrada ou não pertence ao hospital.' });
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
    console.error('Erro ao atualizar vaga:', error);
    res.status(500).json({ error: 'Erro ao atualizar vaga.' });
  }
};

// Função para concluir uma vaga
const closeVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const hospitalId = req.hospital.id;

    // Verifica se a vaga pertence ao hospital autenticado
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!vacancy || vacancy.hospitalId !== hospitalId) {
      return res.status(404).json({ error: 'Vaga não encontrada ou não pertence ao hospital.' });
    }

    const closedVacancy = await prisma.vacancy.update({
      where: { id: parseInt(id, 10) },
      data: { isClosed: true },
    });

    res.status(200).json({ message: 'Vaga concluída com sucesso!', vacancy: closedVacancy });
  } catch (error) {
    console.error('Erro ao concluir vaga:', error);
    res.status(500).json({ error: 'Erro ao concluir vaga.' });
  }
};

// Função para listar vagas públicas (abertas)
const getPublicVacancies = async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany({
      where: {
        isClosed: false,
      },
      include: {
        hospital: true, // Inclui informações do hospital
      },
    });
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Erro ao listar vagas públicas:', error);
    res.status(500).json({ error: 'Erro ao listar vagas públicas.' });
  }
};

module.exports = {
  createVacancy,
  getVacancies,
  updateVacancy,
  closeVacancy,
  getPublicVacancies,
};
