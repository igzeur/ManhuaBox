// frontend/src/pages/AddWorkPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkForm from '../components/WorkForm';
import './AddWorkPage.css'; // Nous allons créer ce fichier pour le style

const AddWorkPage = () => {
  const navigate = useNavigate();

  const handleWorkAdded = () => {
    // Naviguer vers la page d'accueil (liste des œuvres) après l'ajout
    navigate('/');
  };

  return (
    <div className="add-work-page-container">
      <WorkForm onWorkAdded={handleWorkAdded} />
    </div>
  );
};

export default AddWorkPage;