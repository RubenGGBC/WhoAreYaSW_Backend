// Lógica para el formulario de nuevo jugador

import { API } from './api-client.js';

window.onload = async () => {
  try {
    await loadFormData();

    const form = document.getElementById('player-form');

    form.addEventListener('submit', handleSubmit);
  } catch (error) {
    console.error('[player-form] Error inicializando:', error);
    showMessage(error.message || 'Error inicializando el formulario', 'error');
  }
};

async function loadFormData() {
  const [teamsResult, leaguesResult] = await Promise.all([
    API.getTeams(),
    API.getLeagues()
  ]);

  const teams = teamsResult?.data;
  const leagues = leaguesResult?.data;

  const teamSelect = document.getElementById('team');
  const leagueSelect = document.getElementById('league');

  (teams).forEach(team => {
    const option = document.createElement('option');
    option.value = String(team.id);
    option.textContent = team.name;
    teamSelect.appendChild(option);
  });

  (leagues).forEach(league => {
    const option = document.createElement('option');
    option.value = String(league.id);
    option.textContent = league.name;
    leagueSelect.appendChild(option);
  });
}

//Metodos de ayuda para el formulario (con ayuda de Copilot)
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
  const teamIdRaw = document.getElementById('team').value;
  const leagueIdRaw = document.getElementById('league').value;
  const nationality = document.getElementById('nationality').value.trim();
  const positionUi = document.getElementById('position').value;

  if (!validateForm({ name, birthDate, team: teamIdRaw, league: leagueIdRaw, nationality, position: positionUi })) {
    return;
  }

  const position = uiPositionToApi(positionUi);

  // generar un ID numérico único para el jugador
  const id = generateNumericPlayerId();

  const playerData = {
    id,
    name,
    nationality,
    teamId: teamIdRaw ? Number(teamIdRaw) : undefined,
    leagueId: leagueIdRaw ? Number(leagueIdRaw) : undefined,
    position: position || undefined
  };

  if (birthDate) {
    playerData.birthDate = new Date(birthDate).toISOString();
  }

  //Para feedback
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  if (btnText) btnText.style.display = 'none';
  if (btnLoading) btnLoading.style.display = 'inline';
  if (submitBtn) submitBtn.disabled = true;

  try {
    await API.createPlayer(playerData);
    showMessage('Jugador creado correctamente', 'success');

  } catch (error) {
    console.error('[player-form] Error creando jugador:', error);
    showMessage('Error al crear jugador: ' + (error.message || 'desconocido'), 'error');

    if (btnText) btnText.style.display = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  }
}

//Metodo generado por Copilot para generar un ID numerico unico
function generateNumericPlayerId() {
  // 10 dígitos aprox (segundos*1000 + random) para minimizar colisiones y seguir siendo numérico.
  const base = Date.now();
  const rand = Math.floor(Math.random() * 1000);
  return Number(String(base) + String(rand).padStart(3, '0'));
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
function showError(field, message) {
  const errorEl = document.getElementById(`${field}-error`);
  if (errorEl) errorEl.textContent = message;

  const input = document.getElementById(field);
  if (input) input.classList.add('is-invalid');
}
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  document.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });
}
function showMessage(message, type = 'info') {
  const el = document.getElementById('form-message');
  if (!el) return;

  el.textContent = message;
  el.style.display = 'block';

  el.classList.remove('alert-success', 'alert-error', 'alert-info');
  if (type === 'success') el.classList.add('alert-success');
  else if (type === 'error') el.classList.add('alert-error');
  else el.classList.add('alert-info');
}
