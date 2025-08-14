// frontend/src/pages/WorkEditPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkEditPage = () => {
  const { work_id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: '',
    image_url: '',
    summary: '',
  });
  const [status, setStatus] = useState('');

  // Récupérer les données de l'œuvre pour pré-remplir le formulaire
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}`);
        if (!response.ok) {
          throw new Error('Œuvre non trouvée.');
        }
        const workData = await response.json();
        setWork(workData);
        setFormData(workData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [work_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('Mise à jour en cours...');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour de l\'œuvre.');
      }

      setStatus('Œuvre mise à jour avec succès !');
      // Naviguer vers la page de détails après la mise à jour
      navigate(`/works/${work_id}`);
    } catch (err) {
      setStatus(`Erreur : ${err.message}`);
      console.error('Erreur lors de la mise à jour de l\'œuvre :', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette œuvre et tous ses chapitres ?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Échec de la suppression de l\'œuvre.');
        }
        
        // Naviguer vers la page d'accueil après la suppression
        navigate('/');
      } catch (err) {
        setStatus(`Erreur : ${err.message}`);
        console.error('Erreur lors de la suppression de l\'œuvre :', err);
      }
    }
  };

  if (loading) {
    return <div>Chargement des données de l'œuvre...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="work-edit-page-container">
      <h2>Modifier l'œuvre</h2>
      <form onSubmit={handleUpdate} className="work-edit-form">
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
        <button type="submit">Enregistrer les modifications</button>
      </form>
      <button onClick={handleDelete} className="delete-work-button">Supprimer l'œuvre</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default WorkEditPage;