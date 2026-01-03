// Lógica para el login del juego de Pokémon

window.onload = function () {
  const form = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = (document.getElementById('email')?.value || '').trim();
    const password = document.getElementById('password')?.value || '';

    // Validación básica
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Iniciando sesión...';

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data.success) {
        // El backend devuelve JWT token
        if (data.data && data.data.token) {
          // Guardar token y datos del usuario
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
      const errorMessage = data?.error?.message || 'Email o contraseña incorrectos';
      alert(errorMessage);
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar Sesión';
    }
  });
};


