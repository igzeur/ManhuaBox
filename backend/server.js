// backend/server.js

const express = require('express');
const cors = require('cors');
const pool = require('./config/db.config');

const app = express();
const port = process.env.PORT || 3000;

// ---- CORS (important en prod) ----
// Mets l'URL de TON front Render dans FRONT_ORIGIN (ou via process.env.FRONT_ORIGIN)
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || 'https://manhuaboxfront.onrender.com/';

const corsOptions = {
  origin: FRONT_ORIGIN,                  // autorise UNIQUEMENT ton front
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','X-CSRFToken'],
  credentials: true,                     // true si tu utilises cookies/session; sinon tu peux mettre false
  optionsSuccessStatus: 204
};

// Si tu envoies des cookies cross-site (auth), Render est en HTTPS → ok
app.set('trust proxy', 1);

// Middleware
app.use(cors(corsOptions));
// Réponses au preflight (OPTIONS) pour toutes les routes
app.options('*', cors(corsOptions));

app.use(express.json());

// ---- Routes ----
const worksRoutes = require('./routes/works.routes');
const chaptersRoutes = require('./routes/chapters.routes');

// IMPORTANT: si chaptersRoutes a besoin de req.params.work_id, crée le router avec { mergeParams:true } dans le fichier de routes
// ex. const router = require('express').Router({ mergeParams: true })

app.use('/api/works', worksRoutes);
app.use('/api/works/:work_id/chapters', chaptersRoutes);

// Healthcheck
app.get('/', (req, res) => {
  res.send('API de suivi de lecture en cours d\'exécution !');
});

// ---- Démarrage ----
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  console.log(`Accédez à http://localhost:${port}`);
});

// ---- Test DB ----
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Erreur de connexion à la base de données', err.stack);
  } else {
    console.log('Connecté à PostgreSQL à :', result.rows[0].now);
  }
});
