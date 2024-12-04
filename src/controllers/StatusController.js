const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const donorsCount = await prisma.user.count();
    const donationsCount = await prisma.vacancy.count({
      where: {
        isClosed: true,
      },
    });
    const hospitalsCount = await prisma.hospital.count();

    res.status(200).json({
      donorsCount,
      donationsCount,
      hospitalsCount,
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas.' });
  }
};

module.exports = {
  getStats,
};