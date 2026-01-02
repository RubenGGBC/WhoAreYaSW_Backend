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

  async getPokemon(filters = {}) {
    const params = buildQueryParams(filters);
    const qs = params.toString();

    const response = await fetch(`/api/pokemon${qs ? `?${qs}` : ''}`);
    return await handleJsonResponse(response, 'Error al obtener Pokémon');
  },

  async getPokemonById(id) {
    const response = await fetch(`/api/pokemon/${id}`);
    return await handleJsonResponse(response, 'Pokémon no encontrado');
  },

  async createPokemon(pokemonData) {
    const response = await fetch(`/api/pokemon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pokemonData)
    });

    return await handleJsonResponse(response, 'Error al crear Pokémon');
  },

  async createPokemonWithImage(formData) {
    const response = await fetch(`/api/pokemon`, {
      method: 'POST',
      body: formData
    });

    return await handleJsonResponse(response, 'Error al crear Pokémon');
  },

  async updatePokemon(id, pokemonData) {
    const response = await fetch(`/api/pokemon/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pokemonData)
    });

    return await handleJsonResponse(response, 'Error al actualizar Pokémon');
  },

  async updatePokemonWithImage(id, formData) {
    const response = await fetch(`/api/pokemon/${id}`, {
      method: 'PUT',
      // No establecer Content-Type para que el navegador lo establezca automáticamente con boundary
      body: formData
    });

    return await handleJsonResponse(response, 'Error al actualizar Pokémon');
  },

  async deletePokemon(id) {
    const response = await fetch(`/api/pokemon/${id}`, {
      method: 'DELETE'
    });

    return await handleJsonResponse(response, 'Error al eliminar Pokémon');
  }
};


