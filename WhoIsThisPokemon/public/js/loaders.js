export { fetchJSON, fetchPokemon, fetchSolution };

const API_URL = 'http://localhost:3001/api';

async function fetchJSON(what) {
  // Versión BACKEND (igual filosofía que el juego de fútbol)
  if (what === 'pokedex-1-1000') {
    const response = await fetch(`${API_URL}/pokemon?limit=2000`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    // Nuestra API devuelve { success, data, ... }
    const pokemon = jsonData.data || jsonData;

    // Normalización a la estructura que espera el frontend actual:
    // - pokemonId
    // - pokemonName
    // - type1/type2
    return pokemon.map((p) => ({
      pokemonId: p.id,
      pokemonName: p.name,
      type1: p.type1,
      ...(p.type2 ? { type2: p.type2 } : {})
    }));
  }

  if (what === 'pokemonSolutions') {
    try {
      const response = await fetch('./json/pokemonSolutions.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
    }

    return [];
  }
}

async function fetchPokemon(pokemonId) {
  const response = await fetch(`${API_URL}/pokemon/${pokemonId}`);
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
