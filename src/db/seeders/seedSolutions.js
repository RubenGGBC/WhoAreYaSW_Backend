const { connectDB, mongoose } = require('../../db/connection');
const Solution = require('../../models/Solution');
const Player = require('../../models/Player');

async function seedSolutions() {
  try {
    await connectDB();
    console.log('Conectado a MongoDB. Creando soluciones...');

    // Limpiar colecciones existentes
    await Solution.deleteMany({});

    const SOLUTION_START_DATE = new Date(process.env.SOLUTION_START_DATE || '2025-01-10');
    const players = await Player.find({}).lean();

    if (players.length === 0) {
      console.error('No hay jugadores en la base de datos. Ejecuta seedPlayers.js primero.');
      process.exit(1);
    }

    // Crear una solución para cada jugador (un jugador por día)
    const solutions = players.map((player, index) => ({
      gameNumber: index + 1,
      playerId: player.id,
      date: new Date(SOLUTION_START_DATE.getTime() + index * 24 * 60 * 60 * 1000)
    }));

    console.log(`Insertando ${solutions.length} soluciones...`);
    await Solution.insertMany(solutions);

    console.log('Soluciones creadas correctamente');
    console.log(`   - ${solutions.length} soluciones (una por día)`);
    console.log(`   - Desde ${SOLUTION_START_DATE.toISOString()}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creando soluciones:', error.message);
    process.exit(1);
  }
}

seedSolutions();
