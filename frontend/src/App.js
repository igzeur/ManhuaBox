// frontend/src/App.js

import React from 'react';
import WorkList from './components/WorkList';
import './App.css'; // Pour l'instant, nous utiliserons le CSS par défaut

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mon Suivi de Lecture</h1>
      </header>
      <main>
        <WorkList />
      </main>
    </div>
  );
}

export default App;