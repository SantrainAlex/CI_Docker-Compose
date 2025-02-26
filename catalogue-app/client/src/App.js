import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Catalog from './components/Catalog';
import AddItem from './components/AddItem';

function AddItemForm({ onSubmit }) {
  const [newItem, setNewItem] = React.useState({ title: '', description: '', category: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/items', newItem);
      setNewItem({ title: '', description: '', category: '' });
      onSubmit && onSubmit();
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un item:', error);
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <h2>Ajouter un nouvel élément</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newItem.title}
          onChange={handleChange}
          placeholder="Titre"
          required
        />
        <input
          type="text"
          name="description"
          value={newItem.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="category"
          value={newItem.category}
          onChange={handleChange}
          placeholder="Catégorie"
          required
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

function Home() {
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Bienvenue dans notre Catalogue</h1>
      <div className="home-navigation">
        <Link to="/catalog" className="home-nav-link">Voir le Catalogue</Link>
        <Link to="/catalog/add" className="home-nav-link">Ajouter un élément</Link>
      </div>
      <div className="items-container">
        <h2>Liste des éléments</h2>
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="category">{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="main-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/catalog" className="nav-link">Catalogue</Link>
          <Link to="/catalog/add" className="nav-link">Ajouter</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/add" element={<AddItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
