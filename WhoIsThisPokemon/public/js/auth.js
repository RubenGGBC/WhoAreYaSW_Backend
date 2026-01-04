// Manejo de autenticación en el frontend

document.addEventListener('DOMContentLoaded', async function() {
  const userGreeting = document.getElementById('userGreeting');
  const adminPanelLink = document.getElementById('adminPanelLink');
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutBtn = document.getElementById('logoutBtn');

  // Verificar si hay token guardado en localStorage
  const token = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  if (token && userName && userRole) {
    // Mostrar UI autenticada directamente sin hacer peticiones
    showAuthenticatedUI(userName, userRole);
  } else {
    // No hay datos locales, intentar con sesión del servidor
    try {
      const response = await fetch('/current-user', {
        method: 'GET',
        credentials: 'include' // Importante para cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Guardar en localStorage para próximas cargas
          localStorage.setItem('userName', data.data.name);
          localStorage.setItem('userRole', data.data.role);
          showAuthenticatedUI(data.data.name, data.data.role);
        } else {
          showUnauthenticatedUI();
        }
      } else {
        showUnauthenticatedUI();
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      showUnauthenticatedUI();
    }
  }

  // Configurar logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          credentials: 'include'
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
      
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      
      // Recargar la página
      window.location.reload();
    });
  }

  function showAuthenticatedUI(name, role) {
    if (userGreeting) {
      userGreeting.textContent = `Hola, ${name}`;
      userGreeting.style.display = 'inline';
    }

    if (role === 'admin' && adminPanelLink) {
      adminPanelLink.style.display = 'inline-block';
    }

    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  }

  function showUnauthenticatedUI() {
    if (userGreeting) userGreeting.style.display = 'none';
    if (adminPanelLink) adminPanelLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline-block';
    if (registerLink) registerLink.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
});
