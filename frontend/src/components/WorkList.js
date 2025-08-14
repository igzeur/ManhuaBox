// frontend/src/components/WorkList.js

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 5; // Définir le nombre d'œuvres par page

const WorkList = ({ works, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1); // État pour la page actuelle

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser la pagination à chaque recherche
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Réinitialiser la pagination à chaque filtre
  };

  const filteredWorks = useMemo(() => {
    return works.filter(work => {
      const matchesSearchTerm = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                work.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilterType = filterType === 'all' || work.type === filterType;
      return matchesSearchTerm && matchesFilterType;
    });
  }, [works, searchTerm, filterType]);
  
  // Calculer les œuvres à afficher pour la page actuelle
  const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE);
  const currentWorks = useMemo(() => {
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastItemIndex = firstItemIndex + ITEMS_PER_PAGE;
    return filteredWorks.slice(firstItemIndex, lastItemIndex);
  }, [filteredWorks, currentPage]);

  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  

  if (loading) {
    return <div className="loading-message">Chargement des œuvres...</div>;
  }

  if (error) {
    return <div className="error-message">Erreur : {error}</div>;
  }

  return (
    <div className="work-list-container">
      <h2>Liste des Œuvres</h2>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={filterType} onChange={handleFilterChange} className="type-filter">
          <option value="all">Tous les types</option>
          <option value="Manga">Manga</option>
          <option value="Roman">Roman</option>
          <option value="BD">BD</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {currentWorks.length === 0 ? (
        <p>Aucune œuvre trouvée pour cette recherche.</p>
      ) : (
        <>
          <ul className="work-list">
            {currentWorks.map(work => (
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
          
          <div className="pagination-controls">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Précédent
            </button>
            {renderPaginationButtons()}
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkList;