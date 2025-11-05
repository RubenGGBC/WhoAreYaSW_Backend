const data = require('./JSON_objects/premier.json')


data.teams.forEach(team =>
    team.squad = team.squad.map(player => {return transformarJsonJugadores(player, team.id, data.competition.id)}))
//console.log(data.teams)
console.log(data.teams[0].squad[0])


//Metodo para transformar el JSON de los jugadores al formato requerido
function transformarJsonJugadores(original, teamId, leagueId) {
    const cambioPosiciones = {
        "Goalkeeper": "GK",
        "Defender": "DF",
        "Midfielder": "MF",
        "Forward": "FW"
    };

    return {
        id: original.id,
        name: original.name,
        birthDate: original.dateOfBirth,
        nationality: original.nationality,
        teamId: teamId,
        leagueId: leagueId,
        position: cambioPosiciones[original.position]
    };
}