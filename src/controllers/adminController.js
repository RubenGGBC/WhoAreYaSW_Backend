// adminController.js
const path = require('path');

exports.getAdminDashboard = async (req, res) => {
  try {
    const user = req.session.user || req.user || null;
    res.render('admin/dashboard', {
      title: 'Panel de Administración',
      page: 'dashboard',
      user: user,
      message: req.session.message || null
    });

    // Limpiar mensaje flash después de mostrarlo
    delete req.session.message;
  } catch (error) {
    console.error('Error al renderizar dashboard:', error);
    res.status(500).send('Error interno del servidor');
  }
};

exports.getNewPlayerForm = async (req, res) => {
  try {
    const user = req.session.user || req.user || null;
    res.render('admin/new-player', {
      title: 'Nuevo Jugador',
      page: 'dashboard',
      user: user
    });
  } catch (error) {
    console.error('Error al renderizar formulario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

exports.getEditPlayerForm = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.session.user || req.user || null;

    res.render('admin/edit-player', {
      title: 'Editar Jugador',
      page: 'dashboard',
      user: user,
      playerId: id
    });
  } catch (error) {
    console.error('Error al renderizar formulario de edición:', error);
    res.status(500).send('Error interno del servidor');
  }
};


