// backend/server.js

const express = require('express');
const cors = require('cors');
const pool = require('./config/db.config'); // Notre pool de connexion à la BDD

const app = express();
const port = process.env.PORT || 3000; // Le port de votre API, par défaut 3000

// Middleware
app.use(cors()); // Permet les requêtes cross-origin depuis le frontend
app.use(express.json()); // Permet à Express de parser le corps des requêtes en JSON

// Route de test simple pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API de suivi de lecture en cours d\'exécution !');
});

// À faire : Importer et utiliser les routes des œuvres et des chapitres
// Exemple:
// const worksRoutes = require('./routes/works.routes');
// app.use('/api/works', worksRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  console.log(`Accédez à http://localhost:${port}`);
});

// Test de connexion à la base de données (optionnel, pour vérification au démarrage)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données', err.stack);
  } else {
    console.log('Connecté à la base de données PostgreSQL à :', res.rows[0].now);
  }
});