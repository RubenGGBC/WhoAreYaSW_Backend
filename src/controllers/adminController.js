// adminController.js
const path = require('path');

exports.getAdminDashboard = async (req, res) => {
  try {
    res.render('admin/dashboard', {
      title: 'Panel de Administración',
      page: 'dashboard',
      user: req.session.user || null,
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
    res.render('admin/new-player', {
      title: 'Nuevo Jugador',
      page: 'dashboard',
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Error al renderizar formulario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

exports.getEditPlayerForm = async (req, res) => {
  try {
    const { id } = req.params;

    res.render('admin/edit-player', {
      title: 'Editar Jugador',
      page: 'dashboard',
      user: req.session.user || null,
      playerId: id
    });
  } catch (error) {
    console.error('Error al renderizar formulario de edición:', error);
    res.status(500).send('Error interno del servidor');
  }
};


