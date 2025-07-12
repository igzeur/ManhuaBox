// backend/config/db.config.js

const { Pool } = require('pg');
require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Important pour certains hébergeurs comme Render
  }
});

pool.on('error', (err, client) => {
  console.error('Erreur inattendue sur un client inactif', err);
  process.exit(-1);
});

module.exports = pool;