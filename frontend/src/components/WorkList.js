// frontend/src/components/WorkList.js

import React, { useState, useEffect } from 'react';

const WorkList = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction asynchrone pour récupérer les données
    const fetchWorks = async () => {
      try {
        // L'URL ici est relative, le proxy dans package.json s'occupera de la rediriger
        const response = await fetch('/api/works');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setWorks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []); // Le tableau vide [] signifie que ce code ne s'exécute qu'une seule fois au montage du composant

  if (loading) {
    return <div>Chargement des œuvres...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="work-list-container">
      <h2>Liste des Œuvres</h2>
      {works.length === 0 ? (
        <p>Aucune œuvre trouvée. Ajoutez-en une !</p>
      ) : (
        <ul className="work-list">
          {works.map(work => (
            <li key={work.id} className="work-item">
              <img src={work.image_url} alt={work.title} className="work-image" />
              <div className="work-info">
                <h3>{work.title}</h3>
                <p>Auteur : {work.author}</p>
                <p>Type : {work.type}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkList;