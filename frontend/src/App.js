import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Auth from './pages/LoginRegister';
import DetailedInventory from './pages/Inventory';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard setUser={setUser} />} />
        <Route path="/auth" element={<Auth setUser={setUser} />} />
        <Route path="/detailed-inventory" element={<DetailedInventory />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
