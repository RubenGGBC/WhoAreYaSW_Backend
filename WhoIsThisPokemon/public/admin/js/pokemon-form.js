// Lógica para el formulario de nuevo Pokémon

import { API } from './api-client.js';

window.onload = async () => {
  try {
    const form = document.getElementById('pokemon-form');
    form.addEventListener('submit', handleSubmit);
  } catch (error) {
    console.error('[pokemon-form] Error inicializando:', error);
    showMessage(error.message || 'Error inicializando el formulario', 'error');
  }
};

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

  // Crear FormData para enviar los datos junto con la imagen
  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('type1', type1);
  if (type2) formData.append('type2', type2);

  // Si no se proporciona imagen, usar una URL por defecto
  if (imageFile) {
    formData.append('image', imageFile);
  } else {
    formData.append('imageUrl', `/images/pokemon/${id}.png`);
  }

  //Para feedback
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  if (btnText) btnText.style.display = 'none';
  if (btnLoading) btnLoading.style.display = 'inline';
  if (submitBtn) submitBtn.disabled = true;

  try {
    if (imageFile) {
      await API.createPokemonWithImage(formData);
    } else {
      // Si no hay imagen, enviar como JSON
      await API.createPokemon({
        id,
        name,
        type1,
        type2,
        imageUrl: `/images/pokemon/${id}.png`
      });
    }

    showMessage('Pokémon creado correctamente', 'success');

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      window.location.href = '/admin';
    }, 1500);

  } catch (error) {
    console.error('[pokemon-form] Error creando Pokémon:', error);
    showMessage('Error al crear Pokémon: ' + (error.message || 'desconocido'), 'error');

    if (btnText) btnText.style.display = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
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


