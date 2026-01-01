const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

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
  if (response.status === 401) {
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    throw new Error(defaultErrorMessage);
  }

  return await response.json();
}

export const API = {

  async getPlayers(filters = {}) {
    const params = buildQueryParams(filters);
    const qs = params.toString();

    const response = await fetch(`/api/players${qs ? `?${qs}` : ''}`, {
      headers: getAuthHeaders()
    });
    return await handleJsonResponse(response, 'Error al obtener jugadores');
  },

  async getPlayerById(id) {
    const response = await fetch(`/api/players/${id}`, {
      headers: getAuthHeaders()
    });
    return await handleJsonResponse(response, 'Jugador no encontrado');
  },

  async createPlayer(playerData) {
    const response = await fetch(`/api/players`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(playerData)
    });

    return await handleJsonResponse(response, 'Error al crear jugador');
  },

  async createPlayerWithImage(formData) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`/api/players`, {
      method: 'POST',
      headers,
      body: formData
    });

    return await handleJsonResponse(response, 'Error al crear jugador');
  },

  async updatePlayer(id, playerData) {
    const response = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(playerData)
    });

    return await handleJsonResponse(response, 'Error al actualizar jugador');
  },

  async updatePlayerWithImage(id, formData) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers,
      body: formData
    });

    return await handleJsonResponse(response, 'Error al actualizar jugador');
  },

  async deletePlayer(id) {
    const response = await fetch(`/api/players/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleJsonResponse(response, 'Error al eliminar jugador');
  },

  async getTeams() {
    const response = await fetch(`/api/teams`, {
      headers: getAuthHeaders()
    });
    return await handleJsonResponse(response, 'Error al obtener equipos');
  },

  async getLeagues() {
    const response = await fetch(`/api/leagues`, {
      headers: getAuthHeaders()
    });
    return await handleJsonResponse(response, 'Error al obtener ligas');
  }
};
