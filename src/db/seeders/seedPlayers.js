const fs = require('fs').promises;
const path = require('path');
const { connectDB, mongoose } = require('../../db/connection');
const Player = require('../../models/Player');
const Team = require('../../models/Team');
const League = require('../../models/League');

async function seedPlayers() {
  try {
    await connectDB();
    console.log('Conectado a MongoDB. Limpiando bases de datos anteriores...');

    // Limpiar colecciones existentes
    await Player.deleteMany({});
    await Team.deleteMany({});
    await League.deleteMany({});

    // Leer archivo de jugadores
    const filePath = path.join(__dirname, '../../../public/json/fullplayers25.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const players = JSON.parse(fileContent);

    console.log(`Leyendo ${players.length} jugadores...`);

    // Extraer ligas, equipos y jugadores únicos
    const leaguesMap = new Map();
    const teamsMap = new Map();

    players.forEach(player => {
      // Guardar liga
      if (player.leagueId && !leaguesMap.has(player.leagueId)) {
        leaguesMap.set(player.leagueId, {
          id: player.leagueId,
          name: `League ${player.leagueId}`,
          code: `league${player.leagueId}`,
          country: 'Unknown',
          flagUrl: `/images/leagues/league${player.leagueId}.png`
        });
      }

      // Guardar equipo
      if (player.teamId && !teamsMap.has(player.teamId)) {
        teamsMap.set(player.teamId, {
          id: player.teamId,
          name: `Team ${player.teamId}`,
          leagueId: player.leagueId,
          logoUrl: `/images/teams/${player.teamId}.png`,
          country: 'Unknown',
          stadium: 'Unknown'
        });
      }
    });

    // Insertar ligas
    console.log(`Insertando ${leaguesMap.size} ligas...`);
    const leagues = Array.from(leaguesMap.values());
    await League.insertMany(leagues);

    // Insertar equipos
    console.log(`Insertando ${teamsMap.size} equipos...`);
    const teams = Array.from(teamsMap.values());
    await Team.insertMany(teams);

    // Insertar jugadores
    console.log(`Insertando ${players.length} jugadores...`);
    const playersForDB = players.map(p => ({
      id: p.id,
      name: p.name,
      birthDate: p.birthdate ? new Date(p.birthdate) : null,
      nationality: p.nationality,
      teamId: p.teamId,
      leagueId: p.leagueId,
      position: p.position || 'MF',
      number: p.number,
      imageUrl: `/images/players/${p.id}.png`
    }));

    await Player.insertMany(playersForDB);

    console.log('Base de datos poblada correctamente');
    console.log(`   - ${leagues.length} ligas`);
    console.log(`   - ${teams.length} equipos`);
    console.log(`   - ${players.length} jugadores`);

    process.exit(0);
  } catch (error) {
    console.error('Error poblando la base de datos:', error.message);
    process.exit(1);
  }
}

seedPlayers();
