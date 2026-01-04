// Lógica para el registro de usuario del juego de Pokémon

window.onload = function () {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const lastName = (document.getElementById('lastName')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const password = document.getElementById('password')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';

    // Validaciones básicas
    if (!name || !lastName || !email || !password || !confirmPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (name.length < 2) {
      alert('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (lastName.length < 2) {
      alert('El apellido debe tener al menos 2 caracteres');
      return;
    }

    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          lastName,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data.success) {
        // Guardar información del usuario en localStorage
        if (data.data && data.data.token) {
          localStorage.setItem('authToken', data.data.token);
          localStorage.setItem('userName', data.data.user.name);
          localStorage.setItem('userRole', data.data.user.role);

          // Si es admin, ir al dashboard
          if (data.data.user.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
          return;
        }

        // Fallback si no hay data
        window.location.href = '/';
        return;
      }

      // Mostrar error
      const errorMessage = data?.error?.message || 'Error al registrarse';

      // Manejar errores específicos
      if (data?.error?.code === 'EMAIL_EXISTS') {
        alert('Este email ya está registrado. Por favor inicia sesión.');
      } else if (data?.error?.details && Array.isArray(data.error.details)) {
        alert('Errores:\n' + data.error.details.join('\n'));
      } else {
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Registrarse';
    }
  });
};


