import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/catalog');
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération du catalogue:', error);
      setError('Impossible de charger le catalogue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(() => {
      fetchItems();
    }, 5000);

    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }, []);

  if (loading && items.length === 0) {
    return <div className="loading">Chargement du catalogue...</div>;
  }

  if (error) {
    return (
      <div className="catalog-container">
        <div className="error">{error}</div>
        <button onClick={fetchItems} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <h1>Catalogue</h1>
      <div className="catalog-header">
        <p>{items.length} élément(s) dans le catalogue</p>
        <button onClick={fetchItems} className="refresh-btn">
          Rafraîchir
        </button>
      </div>
      
      {items.length === 0 ? (
        <p className="no-items">Aucun élément dans le catalogue.</p>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="category">{item.category}</span>
              <div className="created-at">
                Ajouté le: {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
