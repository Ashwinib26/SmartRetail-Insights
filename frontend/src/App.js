import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Auth from './pages/LoginRegister';
import DetailedInventory from './pages/Inventory';
import Forecast from './pages/Forecast';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // ✅ Check session on page load
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setUser(res.data.name); // make sure backend sends `name`
        }
      })
      .catch(err => {
        console.log('Auth check failed', err);
      });
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forecast" element={<Forecast setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard setUser={setUser} />} />
        <Route path="/auth" element={<Auth setUser={setUser} />} />
        <Route path="/detailed-inventory" element={<DetailedInventory />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
