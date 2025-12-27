export { fetchJSON, fetchPlayer, fetchSolution };

const API_URL = 'http://localhost:3000/api';

async function fetchJSON(what) {
    // Ahora llama al backend en lugar de archivos estáticos
    if (what === 'fullplayers25') {
        const response = await fetch(`${API_URL}/players?limit=10000`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        let players = jsonData.data || jsonData;

        // Normalizar los datos: convertir birthDate a birthdate si existe
        players = players.map(player => {
            if (player.birthDate && !player.birthdate) {
                // Convertir birthDate a birthdate en formato YYYY-MM-DD
                const date = new Date(player.birthDate);
                player.birthdate = date.toISOString().split('T')[0];
                delete player.birthDate;
            }
            return player;
        });

        return players;

    } else if (what === 'solution25') {
        try {
            const response = await fetch('/json/solution25.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.log('No se pudo cargar solution25.json, usando backend');
        }

        return [];
    }
}

async function fetchPlayer(playerId) {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function fetchSolution(gameNumber) {
    const response = await fetch(`${API_URL}/solution/${gameNumber}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
