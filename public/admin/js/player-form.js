// Lógica para el formulario de nuevo jugador

import { API } from './api-client.js';
import { createCustomSelect } from './custom-select.js';

// Map de códigos de liga a nombres legibles
const LEAGUE_CODE_MAP = {
  'es1': 'La Liga',
  'en1': 'Premier League',
  'de1': 'Bundesliga',
  'it1': 'Serie A',
  'fr1': 'Ligue 1'
};

let teamSelect = null;
let leagueSelect = null;

// Verificar autenticación antes de cargar cualquier cosa
function checkAuth() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    window.location.href = '/login';
    return false;
  }

  if (userRole !== 'admin') {
    window.location.href = '/';
    return false;
  }

  return true;
}

window.onload = async () => {
  // Verificar autenticación primero
  if (!checkAuth()) {
    return;
  }

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

  const teams = teamsResult?.data || [];
  const leagues = leaguesResult?.data || [];

  // Crear opciones para equipos
  const teamOptions = teams.map(team => ({
    value: String(team.id),
    text: team.name,
    imageUrl: team.logoUrl || `/images/teams/${team.id}.png`
  }));

  // Crear opciones para ligas
  const leagueOptions = leagues.map(league => ({
    value: String(league.id),
    text: LEAGUE_CODE_MAP[league.code] || league.name,
    imageUrl: league.flagUrl || `/images/leagues/${league.code}.png`
  }));

  // Crear custom selects
  teamSelect = createCustomSelect(
    'team-select-container',
    teamOptions,
    'Selecciona un equipo',
    (option) => option.imageUrl
  );

  leagueSelect = createCustomSelect(
    'league-select-container',
    leagueOptions,
    'Selecciona una liga',
    (option) => option.imageUrl
  );
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
  const teamIdRaw = teamSelect?.getValue() || '';
  const leagueIdRaw = leagueSelect?.getValue() || '';
  const nationality = document.getElementById('nationality').value.trim();
  const positionUi = document.getElementById('position').value;
  const imageFile = document.getElementById('image').files[0];

  if (!validateForm({ name, birthDate, team: teamIdRaw, league: leagueIdRaw, nationality, position: positionUi })) {
    return;
  }

  const position = uiPositionToApi(positionUi);

  // generar un ID numérico único para el jugador
  const id = generateNumericPlayerId();

  // Crear FormData para enviar los datos junto con la imagen
  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('nationality', nationality);
  if (teamIdRaw) formData.append('teamId', Number(teamIdRaw));
  if (leagueIdRaw) formData.append('leagueId', Number(leagueIdRaw));
  if (position) formData.append('position', position);
  if (birthDate) formData.append('birthDate', new Date(birthDate).toISOString());
  if (imageFile) formData.append('image', imageFile);

  //Para feedback
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  if (btnText) btnText.style.display = 'none';
  if (btnLoading) btnLoading.style.display = 'inline';
  if (submitBtn) submitBtn.disabled = true;

  try {
    await API.createPlayerWithImage(formData);
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
