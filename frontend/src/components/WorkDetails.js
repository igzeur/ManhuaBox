// frontend/src/components/WorkDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const WorkDetails = () => {
  const { work_id } = useParams();
  const [work, setWork] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newChaptersInput, setNewChaptersInput] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [status, setStatus] = useState('');

  // Fonction de récupération des données de l'œuvre et des chapitres
  const fetchData = async () => {
    try {
      const workResponse = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}`);
      if (!workResponse.ok) {
        throw new Error(`Erreur lors de la récupération de l'œuvre : ${workResponse.statusText}`);
      }
      const workData = await workResponse.json();
      setWork(workData);

      const chaptersResponse = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}/chapters`);
      if (!chaptersResponse.ok) {
        throw new Error(`Erreur lors de la récupération des chapitres : ${chaptersResponse.statusText}`);
      }
      const chaptersData = await chaptersResponse.json();
      setChapters(chaptersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [work_id]);

  // Gérer l'ajout d'un ou plusieurs chapitres
  const handleAddChapters = async (e) => {
    e.preventDefault();
    setStatus('Ajout des chapitres en cours...');
    
    const chapterNumbers = [];
    newChaptersInput.split(',').forEach(part => {
        const trimmedPart = part.trim();
        if (trimmedPart.includes('-')) {
            const [start, end] = trimmedPart.split('-').map(num => parseInt(num));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    chapterNumbers.push(i);
                }
            }
        } else {
            const num = parseInt(trimmedPart);
            if (!isNaN(num)) {
                chapterNumbers.push(num);
            }
        }
    });

    const uniqueChapterNumbers = [...new Set(chapterNumbers)].sort((a, b) => a - b);
    
    if (uniqueChapterNumbers.length === 0) {
      setStatus('Veuillez entrer des numéros de chapitres valides (ex: 1, 2-5, 8).');
      return;
    }

    try {
      const chaptersToAdd = uniqueChapterNumbers.map(chapter_number => ({
        chapter_number,
        title: newChapterTitle,
        is_read: false,
      }));

      const promises = chaptersToAdd.map(chapter => 
          fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}/chapters`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(chapter),
          })
      );

      const responses = await Promise.all(promises);

      for (const response of responses) {
          if (!response.ok) {
              const errorBody = await response.json();
              throw new Error(`Échec de l'ajout d'un ou plusieurs chapitres. Erreur: ${errorBody.message}`);
          }
      }

      setStatus('Chapitre(s) ajouté(s) avec succès !');
      setNewChaptersInput('');
      setNewChapterTitle('');
      fetchData();
    } catch (error) {
      setStatus(`Erreur : ${error.message}`);
      console.error('Erreur lors de l\'ajout des chapitres :', error);
    }
  };

  // Gérer la suppression d'un chapitre
  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}/chapters/${chapterId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Échec de la suppression du chapitre.');
        }

        setStatus('Chapitre supprimé avec succès !');
        fetchData();
      } catch (error) {
        setStatus(`Erreur : ${error.message}`);
        console.error('Erreur lors de la suppression du chapitre :', error);
      }
    }
  };

  // Gérer la mise à jour de l'état "lu" d'un chapitre
  const handleToggleRead = async (chapter) => {
    const updatedChapter = { ...chapter, is_read: !chapter.is_read };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}/chapters/${chapter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChapter),
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour du chapitre.');
      }
      
      setStatus(`Chapitre ${updatedChapter.is_read ? 'marqué comme lu' : 'marqué comme non lu'} !`);
      fetchData();
    } catch (error) {
      setStatus(`Erreur : ${error.message}`);
      console.error('Erreur lors de la mise à jour du chapitre :', error);
    }
  };

  // Marquer tous les chapitres comme lus
  const handleMarkAllAsRead = async () => {
    if (!window.confirm('Voulez-vous vraiment marquer TOUS les chapitres comme lus ?')) {
      return;
    }

    setStatus('Mise à jour en cours...');
    const unreadChapters = chapters.filter(c => !c.is_read);

    if (unreadChapters.length === 0) {
      setStatus('Tous les chapitres sont déjà lus !');
      return;
    }

    try {
      const promises = unreadChapters.map(chapter => {
        const updatedChapter = { ...chapter, is_read: true };
        return fetch(`${process.env.REACT_APP_API_URL}/works/${work_id}/chapters/${chapter.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedChapter),
        });
      });
      
      const responses = await Promise.all(promises);

      for (const response of responses) {
        if (!response.ok) {
          throw new Error('Échec de la mise à jour d\'un ou plusieurs chapitres.');
        }
      }

      setStatus('Tous les chapitres ont été marqués comme lus !');
      fetchData();
    } catch (error) {
      setStatus(`Erreur : ${error.message}`);
      console.error('Erreur lors de la mise à jour des chapitres :', error);
    }
  };
  
  if (loading) {
    return <div>Chargement des détails de l'œuvre...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!work) {
    return <div>Œuvre non trouvée.</div>;
  }

  return (
    <div className="work-details-container">
      <div className="work-details-header">
        <img src={work.image_url} alt={work.title} className="work-details-image" />
        <div className="work-details-info">
          <h2>{work.title}</h2>
          <div className="work-actions">
            <Link to={`/works/${work.id}/edit`} className="edit-work-button">Modifier l'œuvre</Link>
          </div>
          <p>Auteur : {work.author}</p>
          <p>Type : {work.type}</p>
          <p>Résumé : {work.summary}</p>
        </div>
      </div>

      <div className="chapter-management">
        <h3>Ajouter des chapitres</h3>
        <form onSubmit={handleAddChapters} className="chapter-form">
          <input
            type="text"
            placeholder="Numéros (ex: 1, 2-5, 8)"
            name="chapters"
            value={newChaptersInput}
            onChange={(e) => setNewChaptersInput(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Commentaire (optionnel)"
            name="title"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
          />
          <button type="submit">Ajouter</button>
        </form>
        {status && <p className="status-message">{status}</p>}

        <div className="chapter-list-header">
          <h3>Liste des Chapitres</h3>
          {chapters.length > 0 && (
            <button onClick={handleMarkAllAsRead} className="mark-all-read-button">Marquer tout comme lu</button>
          )}
        </div>
        
        {chapters.length > 0 ? (
          <ul className="chapter-list">
            {chapters.map(chapter => (
              <li key={chapter.id} className="chapter-item">
                <span className={`chapter-status ${chapter.is_read ? 'read' : 'unread'}`} onClick={() => handleToggleRead(chapter)}>
                  {chapter.is_read ? '✓' : '✗'}
                </span>
                Chapitre {chapter.chapter_number}
                {chapter.title && <span className="chapter-title"> : {chapter.title}</span>}
                <button onClick={() => handleDeleteChapter(chapter.id)} className="delete-chapter-button">Supprimer</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun chapitre trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default WorkDetails;