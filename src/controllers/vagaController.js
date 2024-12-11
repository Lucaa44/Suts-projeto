// controllers/vagaController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar uma nova vaga
const createVacancy = async (req, res) => {
  try {
    const { bloodType, quantity, urgency, deadline, description, location, contact } = req.body;
    const hospitalId = req.hospital.id;

    if (!bloodType || !quantity || !urgency || !deadline) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const newVacancy = await prisma.vacancy.create({
      data: {
        bloodType,
        quantity: parseInt(quantity, 10),
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

    const conditions = { hospitalId };

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

    if (!id || !bloodType || !quantity || !urgency || !deadline) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

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
        quantity: parseInt(quantity, 10),
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

// Função para concluir uma vaga (fechar a vaga)
const closeVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const hospitalId = req.hospital.id;

    const vacancy = await prisma.vacancy.findUnique({
      where: { id: parseInt(id, 10) },
      include: { hospital: true } // Inclui informações do hospital para usar na notificação
    });

    if (!vacancy || vacancy.hospitalId !== hospitalId) {
      return res.status(404).json({ error: 'Vaga não encontrada ou não pertence ao hospital.' });
    }

    // Atualiza a vaga para isClosed = true
    const closedVacancy = await prisma.vacancy.update({
      where: { id: parseInt(id, 10) },
      data: { isClosed: true },
    });

    // Encontra todas as pendências pendentes desta vaga
    const pendingDonations = await prisma.pendingDonation.findMany({
      where: {
        vacancyId: parseInt(id, 10),
        status: 'pendente',
      }
    });

    // Para cada pendência, cria uma doação concluída pelo hospital e remove a pendência
    for (const pending of pendingDonations) {
      // Cria a doação
      await prisma.donation.create({
        data: {
          userId: pending.userId,
          vacancyId: pending.vacancyId,
          status: 'concluída pelo hospital',
        }
      });

      // Remove a pendência
      await prisma.pendingDonation.delete({
        where: { id: pending.id }
      });

      // Cria notificação informando que a vaga foi encerrada pelo hospital
      await prisma.notification.create({
        data: {
          userId: pending.userId,
          title: 'Vaga Encerrada',
          message: `A vaga ${vacancy.bloodType} no hospital ${vacancy.hospital.name} foi encerrada pelo hospital.`
        }
      });
    }

    res.status(200).json({ message: 'Vaga concluída com sucesso!', vacancy: closedVacancy });
  } catch (error) {
    console.error('Erro ao concluir vaga:', error);
    res.status(500).json({ error: 'Erro ao concluir vaga.' });
  }
};

// Função para listar vagas públicas (abertas) com filtros
const getPublicVacancies = async (req, res) => {
  try {
    const { location, bloodType, urgency } = req.query;

    const conditions = {
      isClosed: false,
    };

    if (location) {
      conditions.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (bloodType) {
      conditions.bloodType = bloodType;
    }

    if (urgency) {
      conditions.urgency = urgency;
    }

    const vacancies = await prisma.vacancy.findMany({
      where: conditions,
      include: {
        hospital: true,
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
