// backend/routes/chapters.routes.js

const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: { mergeParams: true }
const chapterController = require('../controllers/chapter.controller');

// Routes pour les chapitres (sous un préfixe d'œuvre comme /api/works/:work_id/chapters)

// GET tous les chapitres pour une œuvre spécifique
router.get('/', chapterController.getAllChaptersByWork);

// GET un chapitre spécifique par ID (et ID de l'œuvre parente)
router.get('/:id', chapterController.getChapterById);

// POST un nouveau chapitre pour une œuvre
router.post('/', chapterController.createNewChapter);

// PUT (mettre à jour) un chapitre existant
router.put('/:id', chapterController.updateExistingChapter);

// DELETE un chapitre
router.delete('/:id', chapterController.deleteExistingChapter);

module.exports = router;
