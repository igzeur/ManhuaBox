// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WorkList from './components/WorkList';
import WorkDetails from './components/WorkDetails';
import AddWorkPage from './pages/AddWorkPage';
import WorkEditPage from './pages/WorkEditPage';
import './App.css';

function App() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorks = async () => {
    setLoading(true);
    try {
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

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1>
              <Link to="/">Mon Suivi de Lecture</Link>
            </h1>
            <nav>
              <Link to="/add-work" className="add-work-button">Ajouter une œuvre</Link>
            </nav>
          </div>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={<WorkList works={works} loading={loading} error={error} />}
            />
            <Route path="/works/:work_id" element={<WorkDetails />} />
            <Route path="/add-work" element={<AddWorkPage />} />
            <Route path="/works/:work_id/edit" element={<WorkEditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;