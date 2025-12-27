// Lógica para el formulario de editar jugador

import { API } from './api-client.js';

let playerId = null;

// Cargar datos al iniciar la página
window.onload = async () => {
  playerId = document.getElementById('player-id')?.value;

  try {
    await loadFormData();
    await loadPlayerData();

    const form = document.getElementById('player-form');
    form.addEventListener('submit', handleSubmit);
  } catch (error) {
    console.error('[player-edit] Error inicializando:', error);
  }
};

async function loadFormData() {
  const [teamsResult, leaguesResult] = await Promise.all([
    API.getTeams(),
    API.getLeagues()
  ]);

  const teams = teamsResult.data;
  const leagues = leaguesResult.data;

  // Llenar select de equipos
  const teamSelect = document.getElementById('team');
  (teams || []).forEach(team => {
    const option = document.createElement('option');
    option.value = String(team.id);
    option.textContent = team.name;
    teamSelect.appendChild(option);
  });

  // Llenar select de ligas
  const leagueSelect = document.getElementById('league');
  (leagues || []).forEach(league => {
    const option = document.createElement('option');
    option.value = String(league.id);
    option.textContent = league.name;
    leagueSelect.appendChild(option);
  });
}

//cargar datos del jugador a editar (feedback de Copilot)
async function loadPlayerData() {
  const loading = document.getElementById('loading');
  const form = document.getElementById('player-form');

  try {
    const result = await API.getPlayerById(playerId);
    const player = result.data;

    // Rellenar formulario con datos reales del modelo
    document.getElementById('name').value = player?.name || '';

    // Convertir birthDate a formato YYYY-MM-DD para el input date
    if (player?.birthDate) {
      const date = new Date(player.birthDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      document.getElementById('birthDate').value = `${year}-${month}-${day}`;
    } else {
      document.getElementById('birthDate').value = '';
    }

    document.getElementById('team').value = player?.teamId != null ? String(player.teamId) : '';

    document.getElementById('league').value = player?.leagueId != null ? String(player.leagueId) : '';

    document.getElementById('nationality').value = player?.nationality || '';

    document.getElementById('position').value = apiPositionToUi(player?.position) || '';

    // Mostrar formulario y ocultar loading
    loading.style.display = 'none';
    form.style.display = 'block';
  } catch (error) {
    console.error('Error al cargar jugador:', error);
  }
}

//Metodos auxiliares para conversión de posiciones (De copilot)
function apiPositionToUi(pos) {
  switch (pos) {
    case 'GK': return 'Portero';
    case 'DF': return 'Defensa';
    case 'MF': return 'Centrocampista';
    case 'FW': return 'Delantero';
    default: return '';
  }
}
function uiPositionToApi(pos) {
  switch (pos) {
    case 'Portero': return 'GK';
    case 'Defensa': return 'DF';
    case 'Centrocampista': return 'MF';
    case 'Delantero': return 'FW';
    default: return null;
  }
}


async function handleSubmit(e) {
  e.preventDefault();

  clearErrors();

  const name = document.getElementById('name').value.trim();
  const birthDate = document.getElementById('birthDate').value;
  const teamId = document.getElementById('team').value;
  const leagueId = document.getElementById('league').value;
  const nationality = document.getElementById('nationality').value.trim();
  const positionUi = document.getElementById('position').value;

  if (!validateForm({ name, birthDate, team: teamId, league: leagueId, nationality, position: positionUi })) {
    return;
  }

  const position = uiPositionToApi(positionUi);

  const playerData = {
    name,
    nationality,
    teamId: teamId ? Number(teamId) : undefined,
    leagueId: leagueId ? Number(leagueId) : undefined,
    position: position || undefined
  };

  if (birthDate) {
    playerData.birthDate = new Date(birthDate).toISOString();
  }

  //Para el feedback
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled = true;

  try {
    const current = await API.getPlayerById(playerId);
    const currentPlayer = current.data || current;
    if (currentPlayer?.id != null) playerData.id = currentPlayer.id;

    await API.updatePlayer(playerId, playerData);
    showMessage('Jugador actualizado correctamente', 'success');

  } catch (error) {
    console.error('Error al actualizar jugador:', error);
    showMessage('Error al actualizar jugador: ' + (error.message || 'desconocido'), 'error');

    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  }
}


function validateForm(data) {
  let isValid = true;

  if (!data.name || data.name.trim() === '') {
    showError('name', 'El nombre es obligatorio');
    isValid = false;
  }

  if (!data.birthDate || data.birthDate.trim() === '') {
    showError('birthDate', 'La fecha de nacimiento es obligatoria');
    isValid = false;
  } else {
    // Validar que la fecha sea válida y razonable
    const birthDateObj = new Date(data.birthDate);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

    if (birthDateObj > maxDate) {
      showError('birthDate', 'El jugador debe tener al menos 16 años');
      isValid = false;
    } else if (birthDateObj < minDate) {
      showError('birthDate', 'El jugador no puede tener más de 50 años');
      isValid = false;
    }
  }

  if (!data.team) {
    showError('team', 'Debes seleccionar un equipo');
    isValid = false;
  }

  if (!data.league) {
    showError('league', 'Debes seleccionar una liga');
    isValid = false;
  }

  if (!data.nationality || data.nationality.trim() === '') {
    showError('nationality', 'La nacionalidad es obligatoria');
    isValid = false;
  }

  if (!data.position) {
    showError('position', 'Debes seleccionar una posición');
    isValid = false;
  }

  return isValid;
}

// Metodos de feedback (Copilot)
function showError(fieldName, message) {
  const errorEl = document.getElementById(`${fieldName}-error`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  const fieldEl = document.getElementById(fieldName);
  if (fieldEl) {
    fieldEl.classList.add('error');
  }
}
function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });

  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(el => {
    el.classList.remove('error');
  });
}
function showMessage(message, type) {
  const messageEl = document.getElementById('form-message');
  if (!messageEl) return;

  messageEl.textContent = message;
  messageEl.className = `alert alert-${type}`;
  messageEl.style.display = 'block';

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}
