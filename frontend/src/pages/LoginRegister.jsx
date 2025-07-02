import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginRegister({ onSuccess , setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Analyst');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // ADD THIS

  const normalizeRole = (r) => r.toLowerCase();

  const handleSubmit = async () => {
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin
      ? { email, password, role: normalizeRole(role) }
      : { name, email, password, role: normalizeRole(role) };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        payload,
        { withCredentials: true }
      );

      setSuccess(response.data.message || 'Login successful!');
      setUser(response.data.name);
      setError('');

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response.data);
      }

      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setSuccess('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          width: '300px',
          textAlign: 'center'
        }}
      >
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <option value="Analyst">Analyst</option>
          <option value="Developer">Developer</option>
          <option value="Admin">Admin</option>
        </select>

        <button onClick={handleSubmit} style={{ width: '100%' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>

        {success && <p style={{ color: 'green', marginTop: '10px' }}>✅ {success}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>⚠️ {error}</p>}

        <p style={{ marginTop: '10px' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{ marginLeft: '5px' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;
