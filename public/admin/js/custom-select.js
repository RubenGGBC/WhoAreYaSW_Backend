// Custom Select con imágenes
export function createCustomSelect(containerId, options, placeholder = 'Seleccionar...', getImageUrl) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Crear estructura del custom select
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select-wrapper';

  const customSelect = document.createElement('div');
  customSelect.className = 'custom-select';
  customSelect.dataset.value = '';

  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';
  trigger.innerHTML = `<span>${placeholder}</span>`;

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'custom-select-options';

  // Agregar opciones
  options.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'custom-select-option';
    optionElement.dataset.value = option.value;

    const imageUrl = getImageUrl ? getImageUrl(option) : '';

    optionElement.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${option.text}" onerror="this.style.display='none'">` : ''}
      <span>${option.text}</span>
    `;

    optionElement.addEventListener('click', (e) => {
      e.stopPropagation();
      selectOption(customSelect, trigger, optionElement, option);
    });

    optionsContainer.appendChild(optionElement);
  });

  // Toggle del dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllSelects();
    customSelect.classList.toggle('open');
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', () => {
    customSelect.classList.remove('open');
  });

  customSelect.appendChild(trigger);
  customSelect.appendChild(optionsContainer);
  wrapper.appendChild(customSelect);

  // Reemplazar el contenido del container
  container.innerHTML = '';
  container.appendChild(wrapper);

  return {
    getValue: () => customSelect.dataset.value,
    setValue: (value) => {
      const option = options.find(opt => String(opt.value) === String(value));
      if (option) {
        const optionElement = optionsContainer.querySelector(`[data-value="${value}"]`);
        if (optionElement) {
          selectOption(customSelect, trigger, optionElement, option);
        }
      }
    },
    clear: () => {
      customSelect.dataset.value = '';
      trigger.innerHTML = `<span>${placeholder}</span>`;
      optionsContainer.querySelectorAll('.custom-select-option').forEach(opt => {
        opt.classList.remove('selected');
      });
    }
  };
}

function selectOption(customSelect, trigger, optionElement, option) {
  // Actualizar valor
  customSelect.dataset.value = option.value;

  // Actualizar trigger
  const imageUrl = optionElement.querySelector('img')?.src || '';
  const text = option.text;

  trigger.innerHTML = `
    ${imageUrl ? `<img src="${imageUrl}" alt="${text}">` : ''}
    <span>${text}</span>
  `;

  // Marcar como seleccionado
  customSelect.querySelectorAll('.custom-select-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  optionElement.classList.add('selected');

  // Cerrar dropdown
  customSelect.classList.remove('open');

  // Disparar evento change
  const event = new CustomEvent('change', { detail: { value: option.value, text: option.text } });
  customSelect.dispatchEvent(event);
}

function closeAllSelects() {
  document.querySelectorAll('.custom-select').forEach(select => {
    select.classList.remove('open');
  });
}

export default createCustomSelect;
