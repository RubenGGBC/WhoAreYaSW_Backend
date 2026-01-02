// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/', adminController.getAdminDashboard);

router.get('/pokemon/new', adminController.getNewPokemonForm);

router.get('/pokemon/edit/:id', adminController.getEditPokemonForm);

module.exports = router;

