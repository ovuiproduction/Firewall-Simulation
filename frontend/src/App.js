import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Simulation from './components/Simulation';
import Home from './components/Home';
import AddMachine from './components/AddMachine';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-machine" element={<AddMachine />} />
        <Route path="/simulation" element={<Simulation />} />
      </Routes>
    </Router>
  );
}