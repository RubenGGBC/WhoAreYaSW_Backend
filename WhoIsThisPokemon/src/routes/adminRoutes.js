// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticatedView, isAdminView } = require('../middlewares/authMiddlewareNew');

// Todas las rutas de admin usan el middleware de vista
router.use(isAuthenticatedView);
router.use(isAdminView);

router.get('/', adminController.getAdminDashboard);

router.get('/pokemon/new', adminController.getNewPokemonForm);

router.get('/pokemon/edit/:id', adminController.getEditPokemonForm);

module.exports = router;

