// Lógica para la vista principal del dashboard (lista de jugadores)

import { API } from './api-client.js';

let currentPage = 1;
let currentFilters = {};


// Cargar jugadores, ligas y nacionalidades al iniciar la página
window.onload = async () => {

  await loadLeagues();
  await loadNationalities();
  await loadPlayers();

  document.getElementById('filter-btn').addEventListener('click', applyFilters);
};

//Metodo para el feedback (hecho por Copilot)
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

async function loadLeagues() {
  try {
    const result = await API.getLeagues();
    const leagues = result.data;


    //Añadir al select de ligas las ligas
    const select = document.getElementById('league-filter');

    // Mantener el primer option (Todas las ligas) para que no filtre de primeras
    select.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());

    leagues.forEach(league => {
      const option = document.createElement('option');
      option.value = String(league.id);
      option.textContent = league.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar ligas:', error);
  }
}

async function loadNationalities() {
  try {
    const result = await API.getPlayers({ page: 1, limit: 5000 });
    const players = result.data;

    //Set de nacionalidades para almacenarlas sin duplicados
    const set = new Set();
    players.forEach(p => {
      if (p.nationality){
          set.add(String(p.nationality).trim());
      }
    });

    //Convertir el set a array y ordenar alfabéticamente
    const nationalities = Array.from(set).sort((a, b) => a.localeCompare(b));

    //Añadir al select de nacionalidades las nacionalidades
    const select = document.getElementById('nationality-filter');

    // Mantener el primer option (Todas las nacionalidades) para que no filtre de primeras
    select.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());

    nationalities.forEach(nat => {
      const option = document.createElement('option');
      option.value = nat;
      option.textContent = nat;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar nacionalidades:', error);
  }
}

//Metodo para cargar los jugadores con los filtros y paginación (feedback añadido con Copilot)
async function loadPlayers(page = 1) {
  const loading = document.getElementById('loading');
  const playersList = document.getElementById('players-list');

  try {
    loading.style.display = 'block';
    playersList.style.display = 'none';

    const filters = {
      ...currentFilters,
      page,
      limit: 20
    };

    const result = await API.getPlayers(filters);
    const players = result.data;
    const pagination = result.pagination;

    currentPage = page;

    displayPlayers(players);
    displayPagination(pagination);

    // Ocultar loading y mostrar lista
    loading.style.display = 'none';
    playersList.style.display = 'grid';

  } catch (error) {
    console.error('Error al cargar jugadores:', error);
    loading.innerHTML = `<p class="error-message">Error al cargar jugadores: ${error.message}</p>`;
  }
}

function displayPlayers(players) {
  const container = document.getElementById('players-list');
  container.innerHTML = '';

  if (!players || players.length === 0) {
    container.innerHTML = '<p class="no-results">No se encontraron jugadores</p>';
    return;
  }

  players.forEach(player => {
    const teamName = player?.teamId

    const leagueName = player?.leagueId

      // Crear tarjeta de jugador (ayudado por Copilot)
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
      <img src="https://playfootball.games/media/players/${player.id % 32}/${player.id}.png" 
           alt="${player.name}"
           onerror="this.src='/images/players/default.png'">
      <div class="player-info">
        <h3>${player.name}</h3>
        <p class="player-team">${teamName || 'Sin equipo'}</p>
        <p class="player-league">${leagueName || 'Sin liga'}</p>
        <p class="player-nationality">${player.nationality || 'Sin nacionalidad'}</p>
      </div>
      <div class="player-actions">
        <button class="btn btn-edit" onclick="editPlayer('${player._id}')">Editar</button>
        <button class="btn btn-delete" onclick="deletePlayer('${player._id}', '${player.name}')">Eliminar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

//Función para mostrar la paginación con botones numerados y elipsis (hecho con ayuda de Copilot)
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
      btn.onclick = () => loadPlayers(targetPage);
    }
    return btn;
  };

  const createEllipsis = () => {
    const span = document.createElement('span');
    span.textContent = '…';
    span.className = 'pagination-ellipsis';
    return span;
  };

  // Anterior
  container.appendChild(
    createButton('← Anterior', Math.max(1, page - 1), { isDisabled: page <= 1 })
  );

  // Calcula ventana alrededor de la página actual
  let start = Math.max(1, page - siblingCount);
  let end = Math.min(totalPages, page + siblingCount);

  // Expandir ventana si hay poco contenido (hasta maxButtons aproximado)
  // Reservamos hueco para primera/última y posibles elipsis.
  // Ajuste sencillo: intentar que [start..end] tenga al menos minWindow
  const minWindow = Math.max(5, Math.min(maxButtons - 2, totalPages));
  while ((end - start + 1) < minWindow) {
    if (start > 1) start--;
    else if (end < totalPages) end++;
    else break;
  }

  // Primera página + elipsis izquierda
  if (start > 1) {
    container.appendChild(createButton('1', 1, { isActive: page === 1 }));
    if (start > 2) container.appendChild(createEllipsis());
  }

  // Ventana central
  for (let i = start; i <= end; i++) {
    container.appendChild(createButton(String(i), i, { isActive: i === page }));
  }

  // Elipsis derecha + última página
  if (end < totalPages) {
    if (end < totalPages - 1) container.appendChild(createEllipsis());
    container.appendChild(
      createButton(String(totalPages), totalPages, { isActive: page === totalPages })
    );
  }

  // Siguiente
  container.appendChild(
    createButton('Siguiente →', Math.min(totalPages, page + 1), { isDisabled: page >= totalPages })
  );
}

function applyFilters() {
  currentFilters = {
    search: document.getElementById('search').value.trim(),
    league: document.getElementById('league-filter').value,
    nationality: document.getElementById('nationality-filter').value
  };

  // Limpiar filtros vacíos
  Object.keys(currentFilters).forEach(key => {
    if (!currentFilters[key]){
        delete currentFilters[key];
    }
  });

  loadPlayers(1);
}

window.editPlayer = (id) => {
  window.location.href = `/admin/players/edit/${id}`;
};

window.deletePlayer = async (id, name) => {
  if (!confirm(`¿Estás seguro de eliminar a ${name}?`)) return;

  try {
    await API.deletePlayer(id);
    showDashboardMessage('Jugador eliminado correctamente', 'success', { autoHideMs: 3500 });
    loadPlayers(currentPage);
  } catch (error) {
    showDashboardMessage('Error al eliminar jugador: ' + error.message, 'error');
  }
};
