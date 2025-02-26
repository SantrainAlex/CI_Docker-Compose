import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AddItem() {
  const [item, setItem] = useState({ title: '', description: '', category: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/catalog/add', item);
      setSuccess(response.data.message);
      setError('');
      setItem({ title: '', description: '', category: '' });
      
      // Redirection vers le catalogue après 2 secondes
      setTimeout(() => {
        navigate('/catalog');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue lors de l\'ajout');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-item-container">
      <h1>Ajouter un nouvel élément</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={item.title}
            onChange={handleChange}
            placeholder="Entrez le titre"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={item.description}
            onChange={handleChange}
            placeholder="Entrez la description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <input
            type="text"
            id="category"
            name="category"
            value={item.category}
            onChange={handleChange}
            placeholder="Entrez la catégorie"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Ajouter</button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/catalog')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
