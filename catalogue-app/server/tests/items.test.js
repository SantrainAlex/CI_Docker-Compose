const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Import de l'application
const app = require('../index');

describe('Tests API Items', () => {
  let connection;

  beforeAll(async () => {
    // Création d'une connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
  });

  afterAll(async () => {
    // Fermeture de la connexion après les tests
    await connection.end();
  });

  beforeEach(async () => {
    // Nettoyage de la table avant chaque test
    await connection.execute('DELETE FROM items');
  });

  test('POST /api/items - Ajout d\'un élément', async () => {
    const newItem = {
      title: 'Test Item',
      description: 'Test Description',
      category: 'Test Category'
    };

    const response = await request(app)
      .post('/api/items')
      .send(newItem)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newItem.title);
    expect(response.body.description).toBe(newItem.description);
    expect(response.body.category).toBe(newItem.category);
  });

  test('GET /api/items - Récupération de la liste des éléments', async () => {
    // Ajout d'un élément de test
    const testItem = {
      title: 'Test Item',
      description: 'Test Description',
      category: 'Test Category'
    };
    await connection.execute(
      'INSERT INTO items (title, description, category) VALUES (?, ?, ?)',
      [testItem.title, testItem.description, testItem.category]
    );

    const response = await request(app)
      .get('/api/items')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', testItem.title);
    expect(response.body[0]).toHaveProperty('description', testItem.description);
    expect(response.body[0]).toHaveProperty('category', testItem.category);
  });
});