// backend/models/work.model.js

const pool = require('../config/db.config'); // Notre pool de connexion à la BDD

// Fonction pour récupérer toutes les œuvres
async function getAllWorks() {
  const query = 'SELECT * FROM works ORDER BY created_at DESC;'; // Tri par défaut par les plus récents
  const { rows } = await pool.query(query);
  return rows;
}

// Fonction pour récupérer une œuvre par son ID
async function getWorkById(id) {
  const query = 'SELECT * FROM works WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  return rows[0]; // Retourne la première ligne trouvée (ou undefined si aucune)
}

// Fonction pour créer une nouvelle œuvre
async function createWork(workData) {
  const { title, author, type, image_url, summary } = workData;
  const query = `
    INSERT INTO works (title, author, type, image_url, summary)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [title, author, type, image_url, summary];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retourne l'œuvre nouvellement créée
}

// Fonction pour mettre à jour une œuvre existante
async function updateWork(id, workData) {
  const { title, author, type, image_url, summary } = workData;
  const query = `
    UPDATE works
    SET
      title = COALESCE($1, title),
      author = COALESCE($2, author),
      type = COALESCE($3, type),
      image_url = COALESCE($4, image_url),
      summary = COALESCE($5, summary),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;
  // COALESCE permet de mettre à jour le champ seulement si la nouvelle valeur n'est pas NULL
  const values = [title, author, type, image_url, summary, id];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retourne l'œuvre mise à jour
}

// Fonction pour supprimer une œuvre
async function deleteWork(id) {
  const query = 'DELETE FROM works WHERE id = $1 RETURNING *;';
  const { rows } = await pool.query(query, [id]);
  return rows[0]; // Retourne l'œuvre supprimée (ou undefined si non trouvée)
}

module.exports = {
  getAllWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork
};
