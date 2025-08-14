// backend/controllers/chapter.controller.js

const Chapter = require('../models/chapter.model');

const chapterController = {
  // Récupérer tous les chapitres pour une œuvre donnée
  getAllChaptersByWork: async (req, res) => {
    try {
      const workId = parseInt(req.params.work_id);
      if (isNaN(workId)) {
        return res.status(400).json({ message: 'L\'ID de l\'œuvre doit être un nombre valide.' });
      }

      // Vérifier si l'œuvre existe avant de chercher ses chapitres
      const workExists = await Chapter.workExists(workId);
      if (!workExists) {
        return res.status(404).json({ message: 'Œuvre non trouvée.' });
      }

      const chapters = await Chapter.getAllChaptersByWork(workId);
      res.status(200).json(chapters);
    } catch (error) {
      console.error('Erreur lors de la récupération des chapitres :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des chapitres.' });
    }
  },

  // Récupérer un chapitre spécifique par ID (et ID de l'œuvre parente)
  getChapterById: async (req, res) => {
    try {
      const workId = parseInt(req.params.work_id);
      const chapterId = parseInt(req.params.id);

      if (isNaN(workId) || isNaN(chapterId)) {
        return res.status(400).json({ message: 'Les IDs de l\'œuvre et du chapitre doivent être des nombres valides.' });
      }

      // Vérifier si l'œuvre existe
      const workExists = await Chapter.workExists(workId);
      if (!workExists) {
        return res.status(404).json({ message: 'Œuvre non trouvée.' });
      }

      const chapter = await Chapter.getChapterById(workId, chapterId);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapitre non trouvé pour cette œuvre.' });
      }
      res.status(200).json(chapter);
    } catch (error) {
      console.error('Erreur lors de la récupération du chapitre par ID :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération du chapitre.' });
    }
  },

  // Créer un nouveau chapitre pour une œuvre
  createNewChapter: async (req, res) => {
    try {
      const workId = parseInt(req.params.work_id);
      if (isNaN(workId)) {
        return res.status(400).json({ message: 'L\'ID de l\'œuvre doit être un nombre valide.' });
      }

      // Vérifier si l'œuvre existe avant d'ajouter un chapitre
      const workExists = await Chapter.workExists(workId);
      if (!workExists) {
        return res.status(404).json({ message: 'Impossible d\'ajouter un chapitre : Œuvre non trouvée.' });
      }

      const { chapter_number, title, is_read, personal_note_text, personal_note_rating } = req.body;

      // Validation basique des données
      if (chapter_number === undefined || isNaN(chapter_number) || chapter_number <= 0) {
        return res.status(400).json({ message: 'Le numéro de chapitre est obligatoire et doit être un nombre positif.' });
      }
      // Si personal_note_rating est fourni, valider qu'il est entre 1 et 5
      if (personal_note_rating !== undefined && (isNaN(personal_note_rating) || personal_note_rating < 1 || personal_note_rating > 5)) {
        return res.status(400).json({ message: 'La note personnelle doit être un nombre entre 1 et 5.' });
      }

      const newChapter = await Chapter.createNewChapter(workId, {
        chapter_number,
        title: title || null, // Assure que les chaînes vides sont null ou undefined
        is_read: is_read || false, // Default à false si non fourni
        personal_note_text: personal_note_text || null,
        personal_note_rating: personal_note_rating || null
      });
      res.status(201).json(newChapter);
    } catch (error) {
      console.error('Erreur lors de la création du chapitre :', error);
      // Gérer les erreurs spécifiques comme la violation de contrainte UNIQUE
      if (error.code === '23505') { // Code d'erreur PostgreSQL pour violation de contrainte unique
        return res.status(409).json({ message: 'Un chapitre avec ce numéro existe déjà pour cette œuvre.' });
      }
      res.status(500).json({ message: 'Erreur serveur lors de la création du chapitre.' });
    }
  },

  // Mettre à jour un chapitre existant
  updateExistingChapter: async (req, res) => {
    try {
      const workId = parseInt(req.params.work_id);
      const chapterId = parseInt(req.params.id);

      if (isNaN(workId) || isNaN(chapterId)) {
        return res.status(400).json({ message: 'Les IDs de l\'œuvre et du chapitre doivent être des nombres valides.' });
      }

      // Vérifier si l'œuvre existe
      const workExists = await Chapter.workExists(workId);
      if (!workExists) {
        return res.status(404).json({ message: 'Impossible de mettre à jour le chapitre : Œuvre non trouvée.' });
      }

      const { chapter_number, title, is_read, personal_note_text, personal_note_rating } = req.body;


      const updatedChapter = await Chapter.updateExistingChapter(workId, chapterId, {
        chapter_number,
        title,
        is_read,
        personal_note_text,
        personal_note_rating
      });

      if (!updatedChapter) {
        return res.status(404).json({ message: 'Chapitre non trouvé pour cette œuvre ou impossible de mettre à jour.' });
      }
      res.status(200).json(updatedChapter);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du chapitre :', error);
      if (error.code === '23505') { // Violation de contrainte unique
        return res.status(409).json({ message: 'Un chapitre avec ce numéro existe déjà pour cette œuvre.' });
      }
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du chapitre.' });
    }
  },

  // Supprimer un chapitre
  deleteExistingChapter: async (req, res) => {
    try {
      const workId = parseInt(req.params.work_id);
      const chapterId = parseInt(req.params.id);

      if (isNaN(workId) || isNaN(chapterId)) {
        return res.status(400).json({ message: 'Les IDs de l\'œuvre et du chapitre doivent être des nombres valides.' });
      }

      // Vérifier si l'œuvre existe
      const workExists = await Chapter.workExists(workId);
      if (!workExists) {
        return res.status(404).json({ message: 'Impossible de supprimer le chapitre : Œuvre non trouvée.' });
      }

      const deletedChapter = await Chapter.deleteExistingChapter(workId, chapterId);
      if (!deletedChapter) {
        return res.status(404).json({ message: 'Chapitre non trouvé pour cette œuvre ou impossible de supprimer.' });
      }
      res.status(200).json({ message: 'Chapitre supprimé avec succès.', deletedChapterId: deletedChapter.id });
    } catch (error) {
      console.error('Erreur lors de la suppression du chapitre :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression du chapitre.' });
    }
  }
};

module.exports = chapterController;
