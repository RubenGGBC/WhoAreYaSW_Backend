export { fetchJSON, fetchPlayer, fetchSolution };

const API_URL = 'http://localhost:3000/api';

async function fetchJSON(what) {
    // Ahora llama al backend en lugar de archivos estáticos
    let endpoint;

    if (what === 'fullplayers25') {
        endpoint = `${API_URL}/players`;
    } else if (what === 'solution25') {
        // Obtener el número del juego actual
        const gameResponse = await fetch(`${API_URL}/game/current`);
        const gameData = await gameResponse.json();
        const gameNumber = gameData.data.gameNumber;
        endpoint = `${API_URL}/solution/${gameNumber}`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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
