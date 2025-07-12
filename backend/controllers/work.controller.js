// backend/controllers/work.controller.js

const workModel = require('../models/work.model');

// Récupérer toutes les œuvres
async function getWorks(req, res) {
  try {
    const works = await workModel.getAllWorks();
    res.status(200).json(works);
  } catch (error) {
    console.error('Erreur lors de la récupération des œuvres :', error);
    res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}

// Récupérer une œuvre par ID
async function getWork(req, res) {
  try {
    const { id } = req.params;
    const work = await workModel.getWorkById(id);
    if (!work) {
      return res.status(404).json({ message: 'Œuvre non trouvée.' });
    }
    res.status(200).json(work);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'œuvre ${req.params.id} :`, error);
    res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}

// Créer une nouvelle œuvre
async function createNewWork(req, res) {
  try {
    const { title, author, type, image_url, summary } = req.body;

    // Validation basique des données
    if (!title || !image_url) {
      return res.status(400).json({ message: 'Le titre et l\'URL de l\'image sont obligatoires.' });
    }
    // Ajoutez d'autres validations si nécessaire (ex: format URL)

    const newWork = await workModel.createWork({ title, author, type, image_url, summary });
    res.status(201).json(newWork); // 201 Created
  } catch (error) {
    console.error('Erreur lors de la création de l\'œuvre :', error);
    res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}

// Mettre à jour une œuvre
async function updateExistingWork(req, res) {
  try {
    const { id } = req.params;
    const workData = req.body; // Récupère toutes les données du corps de la requête

    const updatedWork = await workModel.updateWork(id, workData);
    if (!updatedWork) {
      return res.status(404).json({ message: 'Œuvre non trouvée pour la mise à jour.' });
    }
    res.status(200).json(updatedWork);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'œuvre ${req.params.id} :`, error);
    res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}

// Supprimer une œuvre
async function deleteExistingWork(req, res) {
  try {
    const { id } = req.params;
    const deletedWork = await workModel.deleteWork(id);
    if (!deletedWork) {
      return res.status(404).json({ message: 'Œuvre non trouvée pour la suppression.' });
    }
    res.status(200).json({ message: 'Œuvre supprimée avec succès.', deletedWorkId: deletedWork.id });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'œuvre ${req.params.id} :`, error);
    res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}

module.exports = {
  getWorks,
  getWork,
  createNewWork,
  updateExistingWork,
  deleteExistingWork
};
