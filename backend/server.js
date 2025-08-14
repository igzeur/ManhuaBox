// backend/server.js (modifié)

const express = require('express');
const cors = require('cors');
const pool = require('./config/db.config');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'https://manhuaboxfront.onrender.com/' }));
app.use(express.json());

// Importation des routes
const worksRoutes = require('./routes/works.routes');
const chaptersRoutes = require('./routes/chapters.routes'); 

// Utilisation des routes
app.use('/api/works', worksRoutes);
app.use('/api/works/:work_id/chapters', chaptersRoutes); 

// Route de test simple pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API de suivi de lecture en cours d\'exécution !');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  console.log(`Accédez à http://localhost:${port}`);
});

// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données', err.stack);
  } else {
    console.log('Connecté à la base de données PostgreSQL à :', res.rows[0].now);
  }
});
