// frontend/src/components/WorkForm.js

import React, { useState } from 'react';

const WorkForm = ({ onWorkAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: 'Manga', // Valeur par défaut
    image_url: '',
    summary: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Création en cours...');
    try {
      const response = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Échec de la création de l\'œuvre.');
      }

      setStatus('Œuvre créée avec succès !');
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        author: '',
        type: 'Manga',
        image_url: '',
        summary: '',
      });
      // Appeler la fonction de rafraîchissement passée en prop
      if (onWorkAdded) {
        onWorkAdded();
      }
    } catch (error) {
      setStatus(`Erreur : ${error.message}`);
      console.error('Erreur lors de la création de l\'œuvre :', error);
    }
  };

  return (
    <div className="work-form-container">
      <h2>Ajouter une nouvelle œuvre</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Auteur :</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type :</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Manga">Manga</option>
            <option value="Roman">Roman</option>
            <option value="BD">BD</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image_url">URL de l'image :</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">Résumé :</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Ajouter l'œuvre</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default WorkForm;