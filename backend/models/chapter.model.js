// backend/models/chapter.model.js

const pool = require('../config/db.config');

const Chapter = {
  // Récupérer tous les chapitres pour une œuvre spécifique
  getAllChaptersByWork: async (workId) => {
    try {
      const result = await pool.query('SELECT * FROM chapters WHERE work_id = $1 ORDER BY chapter_number ASC', [workId]);
      return result.rows;
    } catch (err) {
      console.error('Erreur lors de la récupération des chapitres :', err);
      throw err;
    }
  },

  // Récupérer un chapitre par son ID et l'ID de l'œuvre parente
  getChapterById: async (workId, chapterId) => {
    try {
      const result = await pool.query('SELECT * FROM chapters WHERE work_id = $1 AND id = $2', [workId, chapterId]);
      return result.rows[0]; // Retourne le premier (et unique) chapitre trouvé
    } catch (err) {
      console.error('Erreur lors de la récupération du chapitre :', err);
      throw err;
    }
  },

  // Créer un nouveau chapitre pour une œuvre
  createNewChapter: async (workId, chapterData) => {
    const { chapter_number, title, is_read, personal_note_text, personal_note_rating } = chapterData;
    try {
      const result = await pool.query(
        'INSERT INTO chapters (work_id, chapter_number, title, is_read, personal_note_text, personal_note_rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [workId, chapter_number, title, is_read, personal_note_text, personal_note_rating]
      );
      return result.rows[0]; // Retourne le chapitre créé
    } catch (err) {
      console.error('Erreur lors de la création du chapitre :', err);
      throw err;
    }
  },

  // Mettre à jour un chapitre existant
  updateExistingChapter: async (workId, chapterId, chapterData) => {
    const { chapter_number, title, is_read, personal_note_text, personal_note_rating } = chapterData;
    try {
      const result = await pool.query(
        'UPDATE chapters SET chapter_number = $1, title = $2, is_read = $3, personal_note_text = $4, personal_note_rating = $5, updated_at = CURRENT_TIMESTAMP WHERE work_id = $6 AND id = $7 RETURNING *',
        [chapter_number, title, is_read, personal_note_text, personal_note_rating, workId, chapterId]
      );
      return result.rows[0]; // Retourne le chapitre mis à jour
    } catch (err) {
      console.error('Erreur lors de la mise à jour du chapitre :', err);
      throw err;
    }
  },

  // Supprimer un chapitre
  deleteExistingChapter: async (workId, chapterId) => {
    try {
      const result = await pool.query('DELETE FROM chapters WHERE work_id = $1 AND id = $2 RETURNING *', [workId, chapterId]);
      return result.rows[0]; // Retourne le chapitre supprimé (ou undefined si non trouvé)
    } catch (err) {
      console.error('Erreur lors de la suppression du chapitre :', err);
      throw err;
    }
  },

  // Vérifier si une œuvre existe (pour les clés étrangères)
  workExists: async (workId) => {
    try {
      const result = await pool.query('SELECT 1 FROM works WHERE id = $1', [workId]);
      return result.rows.length > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'existence de l\'œuvre :', err);
      throw err;
    }
  }
};

module.exports = Chapter;
