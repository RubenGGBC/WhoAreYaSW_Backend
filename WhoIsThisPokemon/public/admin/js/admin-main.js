// Lógica para la vista principal del dashboard (lista de Pokémon)

import { API } from './api-client.js';
import { autocomplete } from './admin-autocomplete.js';

let currentPage = 1;
let currentFilters = {};
let allPokemon = [];

window.onload = async () => {
  try {
    await loadTypes();

    await loadPokemon();

    await loadAllPokemonForAutocomplete();

    document.getElementById('filter-btn')?.addEventListener('click', applyFilters);

  } catch (error) {
    console.error('Error al inicializar el dashboard:', error);
    showDashboardMessage('Error al cargar los datos. Por favor recarga la página.', 'error');
  }
};

function showDashboardMessage(text, type = 'info', { autoHideMs } = {}) {
  const el = document.getElementById('admin-message');
  if (!el) return;

  el.textContent = text;
  el.style.display = 'block';

  el.classList.remove('alert-success', 'alert-error', 'alert-info');
  if (type === 'success') el.classList.add('alert-success');
  else if (type === 'error') el.classList.add('alert-error');
  else el.classList.add('alert-info');

  if (Number.isFinite(autoHideMs) && autoHideMs > 0) {
    window.clearTimeout(showDashboardMessage._t);
    showDashboardMessage._t = window.setTimeout(() => {
      el.style.display = 'none';
    }, autoHideMs);
  }
}

async function loadTypes() {
  try {
    const types = [
      'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
      'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
      'Dragon', 'Dark', 'Steel', 'Fairy'
    ];

    const typeNames = {
      'Normal': 'Normal',
      'Fire': 'Fuego',
      'Water': 'Agua',
      'Electric': 'Eléctrico',
      'Grass': 'Planta',
      'Ice': 'Hielo',
      'Fighting': 'Lucha',
      'Poison': 'Veneno',
      'Ground': 'Tierra',
      'Flying': 'Volador',
      'Psychic': 'Psíquico',
      'Bug': 'Bicho',
      'Rock': 'Roca',
      'Ghost': 'Fantasma',
      'Dragon': 'Dragón',
      'Dark': 'Siniestro',
      'Steel': 'Acero',
      'Fairy': 'Hada'
    };

    const select = document.getElementById('type-filter');

    select.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());

    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = typeNames[type] || type;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar tipos:', error);
  }
}

async function loadPokemon(page = 1) {
  const loading = document.getElementById('loading');
  const pokemonList = document.getElementById('pokemon-list');

  try {
    loading.style.display = 'block';
    loading.textContent = 'Cargando Pokémon...';
    pokemonList.style.display = 'none';

    const filters = {
      ...currentFilters,
      page,
      limit: 20
    };

    console.log('Cargando Pokémon con filtros:', filters);
    const result = await API.getPokemon(filters);

    if (!result || !result.data) {
      throw new Error('Respuesta inválida del servidor');
    }

    const pokemon = result.data;
    const pagination = result.pagination;
    console.log(`Pokémon cargados: ${pokemon.length}`, pokemon);

    currentPage = page;

    displayPokemon(pokemon);
    displayPagination(pagination);

    loading.style.display = 'none';
    pokemonList.style.display = 'grid';

  } catch (error) {
    console.error('Error al cargar Pokémon:', error);
    loading.style.display = 'block';
    loading.innerHTML = `<p class="error-message">Error al cargar Pokémon: ${error.message}</p>`;
    pokemonList.style.display = 'none';
  }
}

function displayPokemon(pokemon) {
  const container = document.getElementById('pokemon-list');
  container.innerHTML = '';

  if (!pokemon || pokemon.length === 0) {
    container.innerHTML = '<p class="no-results">No se encontraron Pokémon</p>';
    return;
  }

  pokemon.forEach(poke => {
    const typeNames = {
      'Normal': 'Normal',
      'Fire': 'Fuego',
      'Water': 'Agua',
      'Electric': 'Eléctrico',
      'Grass': 'Planta',
      'Ice': 'Hielo',
      'Fighting': 'Lucha',
      'Poison': 'Veneno',
      'Ground': 'Tierra',
      'Flying': 'Volador',
      'Psychic': 'Psíquico',
      'Bug': 'Bicho',
      'Rock': 'Roca',
      'Ghost': 'Fantasma',
      'Dragon': 'Dragón',
      'Dark': 'Siniestro',
      'Steel': 'Acero',
      'Fairy': 'Hada'
    };

    const type1Display = typeNames[poke.type1] || poke.type1;
    const type2Display = poke.type2 ? (typeNames[poke.type2] || poke.type2) : '';

    const card = document.createElement('div');
    card.className = 'player-card';

    const imageUrl = `/images/pokemon/${poke.id}.png`;

    card.innerHTML = `
      <img class="player-image" data-pokemon-id="${poke.id}" src="${imageUrl}" alt="${poke.name}">
      <div class="player-info">
        <h3>#${poke.id} - ${poke.name}</h3>
        <p class="player-team">
          <span>Tipo: ${type1Display}${type2Display ? ' / ' + type2Display : ''}</span>
        </p>
      </div>
      <div class="player-actions">
        <button class="btn btn-edit" onclick="editPokemon('${poke._id}')">Editar</button>
        <button class="btn btn-delete" onclick="deletePokemon('${poke._id}', '${poke.name}')">Eliminar</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function displayPagination(pagination) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  const totalPages = Number(pagination?.pages || 0);
  const page = Number(pagination?.page || 1);

  if (!totalPages || totalPages <= 1) return;

  const maxButtons = 10;
  const siblingCount = 2;

  const createButton = (label, targetPage, { isActive = false, isDisabled = false } = {}) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (isActive) btn.className = 'active';
    if (isDisabled) {
      btn.disabled = true;
    } else {
      btn.onclick = () => loadPokemon(targetPage);
    }
    return btn;
  };

  const createEllipsis = () => {
    const span = document.createElement('span');
    span.textContent = '…';
    span.className = 'pagination-ellipsis';
    return span;
  };

  container.appendChild(
    createButton('← Anterior', Math.max(1, page - 1), { isDisabled: page <= 1 })
  );

  let start = Math.max(1, page - siblingCount);
  let end = Math.min(totalPages, page + siblingCount);

  const minWindow = Math.max(5, Math.min(maxButtons - 2, totalPages));
  while ((end - start + 1) < minWindow) {
    if (start > 1) start--;
    else if (end < totalPages) end++;
    else break;
  }

  if (start > 1) {
    container.appendChild(createButton('1', 1, { isActive: page === 1 }));
    if (start > 2) container.appendChild(createEllipsis());
  }

  for (let i = start; i <= end; i++) {
    container.appendChild(createButton(String(i), i, { isActive: i === page }));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) container.appendChild(createEllipsis());
    container.appendChild(
      createButton(String(totalPages), totalPages, { isActive: page === totalPages })
    );
  }

  container.appendChild(
    createButton('Siguiente →', Math.min(totalPages, page + 1), { isDisabled: page >= totalPages })
  );
}

function applyFilters() {
  currentFilters = {
    search: document.getElementById('search').value.trim(),
    type: document.getElementById('type-filter').value
  };

  Object.keys(currentFilters).forEach(key => {
    if (!currentFilters[key]) {
      delete currentFilters[key];
    }
  });

  loadPokemon(1);
}

window.editPokemon = (id) => {
  window.location.href = `/admin/pokemon/edit/${id}`;
};

window.deletePokemon = async (id, name) => {
  if (!confirm(`¿Estás seguro de eliminar a ${name}?`)) return;

  try {
    await API.deletePokemon(id);
    showDashboardMessage('Pokémon eliminado correctamente', 'success', { autoHideMs: 3500 });
    loadPokemon(currentPage);
  } catch (error) {
    showDashboardMessage('Error al eliminar Pokémon: ' + error.message, 'error');
  }
};

async function loadAllPokemonForAutocomplete() {
  try {
    const result = await API.getPokemon({ page: 1, limit: 5000 });
    allPokemon = result.data;

    const searchInput = document.getElementById('search');
    if (searchInput && allPokemon.length > 0) {
      autocomplete(searchInput, allPokemon, (pokemonId) => {
        window.editPokemon(pokemonId);
      });
    }
  } catch (error) {
    console.error('Error al cargar Pokémon para autocomplete:', error);
  }
}
