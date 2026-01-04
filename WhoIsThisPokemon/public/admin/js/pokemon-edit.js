// Lógica para el formulario de editar Pokémon

import { API } from './api-client.js';

let pokemonId = null;

// Cargar datos al iniciar la página
window.onload = async () => {
  pokemonId = document.getElementById('pokemon-id')?.value;

  try {
    await loadPokemonData();

    const form = document.getElementById('pokemon-form');
    form.addEventListener('submit', handleSubmit);
  } catch (error) {
    console.error('[pokemon-edit] Error inicializando:', error);
  }
};

//cargar datos del Pokémon a editar
async function loadPokemonData() {
  const loading = document.getElementById('loading');
  const form = document.getElementById('pokemon-form');

  try {
    const result = await API.getPokemonById(pokemonId);
    const pokemon = result.data;

    document.getElementById('name').value = pokemon?.name || '';
    document.getElementById('id').value = pokemon?.id || '';
    document.getElementById('type1').value = pokemon?.type1 || '';
    document.getElementById('type2').value = pokemon?.type2 || '';

    loading.style.display = 'none';
    form.style.display = 'block';
  } catch (error) {
    console.error('Error al cargar Pokémon:', error);
    loading.innerHTML = `<p class="error-message">Error al cargar Pokémon: ${error.message}</p>`;
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  clearErrors();

  const id = parseInt(document.getElementById('id').value);
  const name = document.getElementById('name').value.trim();
  const type1 = document.getElementById('type1').value;
  const type2 = document.getElementById('type2').value || undefined;
  const imageFile = document.getElementById('image').files[0];

  if (!validateForm({ id, name, type1 })) {
    return;
  }

  //Para el feedback
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('type1', type1);
    if (type2) formData.append('type2', type2);

    if (imageFile) {
      formData.append('image', imageFile);
      await API.updatePokemonWithImage(pokemonId, formData);
    } else {
      await API.updatePokemon(pokemonId, {
        id,
        name,
        type1,
        type2,
        imageUrl: `/images/pokemon/${id}.png`
      });
    }

    showMessage('Pokémon actualizado correctamente', 'success');

    setTimeout(() => {
      window.location.href = '/admin';
    }, 1500);

  } catch (error) {
    console.error('Error al actualizar Pokémon:', error);
    showMessage('Error al actualizar Pokémon: ' + (error.message || 'desconocido'), 'error');

    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  }
}

function validateForm(data) {
  let isValid = true;

  if (!data.id || isNaN(data.id) || data.id < 1) {
    showError('id', 'El ID debe ser un número positivo');
    isValid = false;
  }

  if (!data.name || data.name.trim() === '') {
    showError('name', 'El nombre es obligatorio');
    isValid = false;
  } else if (data.name.length < 2) {
    showError('name', 'El nombre debe tener al menos 2 caracteres');
    isValid = false;
  }

  if (!data.type1) {
    showError('type1', 'Debes seleccionar el tipo principal');
    isValid = false;
  }

  return isValid;
}

// Metodos de feedback
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


