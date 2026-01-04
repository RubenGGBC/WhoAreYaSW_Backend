// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdminDashboard);

router.get('/players/new', adminController.getNewPlayerForm);

router.get('/players/edit/:id', adminController.getEditPlayerForm);

module.exports = router;

