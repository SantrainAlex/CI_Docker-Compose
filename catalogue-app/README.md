# Application de Catalogue

Une application simple permettant de gérer un catalogue d'items avec React, Node.js et MySQL.

## Prérequis

- Node.js
- MySQL
- npm

## Installation

### Configuration de la base de données

1. Connectez-vous à MySQL et exécutez le script `server/init.sql`
2. Modifiez le fichier `server/.env` avec vos informations de connexion MySQL

### Installation du serveur

```bash
cd server
npm install
npm start
```

### Installation du client

```bash
cd client
npm install
npm start
```

## Utilisation

L'application sera accessible à :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000

### Fonctionnalités

1. Ajouter un nouvel élément au catalogue :
   - Remplissez le formulaire avec le titre, la description et la catégorie
   - Cliquez sur "Ajouter"

2. Voir tous les éléments :
   - La liste des éléments s'affiche automatiquement sous le formulaire
   - Chaque élément affiche son titre, sa description et sa catégorie
