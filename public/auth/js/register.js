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

      alert('Error al registrarse');
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Registrarse';
    }
  });
};

