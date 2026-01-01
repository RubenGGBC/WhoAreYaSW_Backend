window.onload = function () {
  const form = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = (document.getElementById('email')?.value || '').trim();
    const password = document.getElementById('password')?.value || '';

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
        if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('userName', data.data.user.name);
          localStorage.setItem('userRole', data.data.user.role);

          if (data.data.user.role === 'admin'){
              window.location.href = '/admin';
          }
          else{
              window.location.href = '/';
          }

          return;
        }

        window.location.href = '/';
        return;
      }

      alert('Email o contraseña incorrectos');
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar Sesión';
    }
  });
};

