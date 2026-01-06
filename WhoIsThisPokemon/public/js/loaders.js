export { fetchJSON, fetchPokemon, fetchSolution, fetchCurrentGame };

const API_URL = 'http://localhost:3000/api';

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
    // - weight
    let mapped = pokemon.map((p) => ({
      pokemonId: p.id,
      pokemonName: p.name,
      type1: p.type1,
      // Asegurar type2 siempre presente: si no existe, usar type1
      type2: p.type2 || p.type1,
      weight: p.weight
    }));

    // Si la API no incluye 'weight' (por ejemplo, DB no seedada), usar el JSON local que sí lo contiene
    const missingWeight = mapped.length > 0 && typeof mapped[0].weight === 'undefined';
    if (missingWeight) {
      try {
        const localResp = await fetch('./json/pokedex-1-1000.json');
        if (localResp.ok) {
          const localData = await localResp.json();
          return localData.map((p) => ({
            pokemonId: p.pokemonId,
            pokemonName: p.pokemonName,
            type1: p.type1 ? (p.type1.charAt(0).toUpperCase() + p.type1.slice(1)) : undefined,
            type2: p.type2 ? (p.type2.charAt(0).toUpperCase() + p.type2.slice(1)) : (p.type1 ? (p.type1.charAt(0).toUpperCase() + p.type1.slice(1)) : undefined),
            weight: p.weight
          }));
        }
      } catch (e) {
        console.warn('No se pudo cargar JSON local de pokedex:', e);
      }
    }

    return mapped;
  }

  if (what === 'pokemonSolutions') {
    // Intentar primero desde la API
    try {
      // Obtener todas las soluciones desde la base de datos
      // Nota: necesitarías implementar un endpoint GET /api/solutions
      // Por ahora, retornamos un array vacío y se manejará dinámicamente
      const response = await fetch(`${API_URL}/game/current`);
      if (response.ok) {
        const data = await response.json();
        // Retornar el gameNumber actual para usar con la API
        return data.data ? [data.data.gameNumber] : [];
      }
    } catch (e) {
      console.warn('No se pudo obtener soluciones desde API, intentando JSON local');
    }

    // Fallback a archivo JSON local si existe
    try {
      const response = await fetch('./json/pokemonSolutions.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Archivo pokemonSolutions.json no encontrado');
    }

    return [];
  }
}

async function fetchPokemon(pokemonId) {
  const response = await fetch(`${API_URL}/pokemon/${pokemonId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const jsonData = await response.json();
  return jsonData.data || jsonData;
}

async function fetchSolution(gameNumber) {
  const response = await fetch(`${API_URL}/solution/${gameNumber}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const jsonData = await response.json();
  return jsonData.data || jsonData;
}

async function fetchCurrentGame() {
  const response = await fetch(`${API_URL}/game/current`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const jsonData = await response.json();
  return jsonData.data || jsonData;
}
