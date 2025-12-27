// Cliente para llamar a la API REST desde el navegador

const API_BASE = '/api';

function buildQueryParams(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return;
      params.append(key, trimmed);
      return;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      params.append(key, String(value));
      return;
    }

    try {
      params.append(key, JSON.stringify(value));
    } catch {
    }
  });

  return params;
}

async function handleJsonResponse(response, defaultErrorMessage) {

    //Si no está autenticado, redirigir al login
  if (response.status === 401) {
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    throw new Error(defaultErrorMessage);
  }

  return await response.json();
}

// Cliente API. Métodos para interactuar con la API REST con fetch.
export const API = {

  async getPlayers(filters = {}) {
    const params = buildQueryParams(filters);
    const qs = params.toString();

    const response = await fetch(`/api/players${qs ? `?${qs}` : ''}`);
    return await handleJsonResponse(response, 'Error al obtener jugadores');
  },

  async getPlayerById(id) {
    const response = await fetch(`/api/players/${id}`);
    return await handleJsonResponse(response, 'Jugador no encontrado');
  },

  async createPlayer(playerData) {
    const response = await fetch(`/api/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playerData)
    });

    return await handleJsonResponse(response, 'Error al crear jugador');
  },

  async updatePlayer(id, playerData) {
    const response = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playerData)
    });

    return await handleJsonResponse(response, 'Error al actualizar jugador');
  },

  async deletePlayer(id) {
    const response = await fetch(`/api/players/${id}`, {
      method: 'DELETE'
    });

    return await handleJsonResponse(response, 'Error al eliminar jugador');
  },

  async getTeams() {
    const response = await fetch(`/api/teams`);
    return await handleJsonResponse(response, 'Error al obtener equipos');
  },

  async getLeagues() {
    const response = await fetch(`/api/leagues`);
    return await handleJsonResponse(response, 'Error al obtener ligas');
  }
};
