import React, { useState } from 'react';
import axios from 'axios';

function LoginRegister({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Analyst');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const endpoint = isLogin ? 'login' : 'register';
    try {
      await axios.post(`http://localhost:5000/api/${endpoint}`, {
        name,
        email,
        password,
        role
      }, { withCredentials: true });
      onSuccess(); // Inform Dashboard that login/register succeeded
    } catch (err) {
      setError(err.response?.data?.error || 'Error occurred');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
        width: '300px', textAlign: 'center'
      }}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <option value="Analyst">Analyst</option>
          <option value="Developer">Developer</option>
          <option value="Admin">Admin</option>
        </select>

        <button onClick={handleSubmit} style={{ width: '100%' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>

        <p style={{ marginTop: '10px' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }} style={{ marginLeft: '5px' }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;
