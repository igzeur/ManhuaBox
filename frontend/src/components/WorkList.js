// frontend/src/components/WorkList.js

import React from 'react';
import { Link } from 'react-router-dom';

const WorkList = ({ works, loading, error }) => {
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
              <Link to={`/works/${work.id}`} className="work-link">
                <img src={work.image_url} alt={work.title} className="work-image" />
                <div className="work-info">
                  <h3>{work.title}</h3>
                  <p>Auteur : {work.author}</p>
                  <p>Type : {work.type}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkList;