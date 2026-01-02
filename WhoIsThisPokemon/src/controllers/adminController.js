// adminController.js

exports.getAdminDashboard = async (req, res) => {
  try {
    res.render('admin/dashboard', {
      title: 'Panel de Administración - Pokémon',
      page: 'dashboard',
      user: req.session.user || null,
      message: req.session.message || null
    });

    // Limpiar mensaje flash después de mostrarlo
    delete req.session.message;
  } catch (error) {
    console.error('Error al cargar el dashboard:', error);
    res.status(500).send('Error al cargar el dashboard');
  }
};

exports.getNewPokemonForm = async (req, res) => {
  try {
    res.render('admin/new-pokemon', {
      title: 'Nuevo Pokémon',
      page: 'dashboard',
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Error al cargar el formulario:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};

exports.getEditPokemonForm = async (req, res) => {
  try {
    const { id } = req.params;

    res.render('admin/edit-pokemon', {
      title: 'Editar Pokémon',
      page: 'dashboard',
      user: req.session.user || null,
      pokemonId: id
    });
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};
