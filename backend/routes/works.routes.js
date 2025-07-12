// backend/routes/works.routes.js

const express = require('express');
const router = express.Router(); // <<< Importe Express et crée un nouvel objet Router
const workController = require('../controllers/work.controller');

// Routes pour les œuvres
router.get('/', workController.getWorks);
router.get('/:id', workController.getWork);
router.post('/', workController.createNewWork);
router.put('/:id', workController.updateExistingWork);
router.delete('/:id', workController.deleteExistingWork);

module.exports = router; // <<< TRÈS IMPORTANT : EXPORTE L'OBJET ROUTER
