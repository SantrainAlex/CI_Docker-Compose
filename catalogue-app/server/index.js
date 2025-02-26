const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Configuration du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify pour utiliser async/await
const promisePool = pool.promise();

// Test de connexion initial
const testDatabaseConnection = async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('Connecté à la base de données MySQL');
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1);  // Arrêter le serveur si la connexion échoue
  }
};

// Routes API
app.get(['/api/items', '/catalog'], async (req, res) => {
  try {
    const query = 'SELECT * FROM items';
    const [results] = await promisePool.query(query);
    res.json(results);
  } catch (err) {
    console.error('Erreur lors de la récupération des items:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/items', '/catalog/add'], async (req, res) => {
  const { title, description, category } = req.body;
  
  // Validation des données
  if (!title || !description || !category) {
    return res.status(400).json({ 
      error: 'Tous les champs sont obligatoires (title, description, category)' 
    });
  }

  try {
    const query = 'INSERT INTO items (title, description, category) VALUES (?, ?, ?)';
    const [result] = await promisePool.query(query, [title, description, category]);
    
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      description, 
      category,
      message: 'Élément ajouté avec succès' 
    });
  } catch (err) {
    console.error('Erreur lors de l\'ajout d\'un item:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// Démarrer le serveur seulement après avoir testé la connexion
testDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});

module.exports = app;
