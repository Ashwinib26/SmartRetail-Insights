import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginRegister({ onSuccess, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Analyst');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

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
        top: 0, left: 0,
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
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', color: '#1e272e' }}>
          {isLogin ? '🔐 Login' : '📝 Register'}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            backgroundColor: '#f9f9f9'
          }}
        >
          <option value="Analyst">Analyst</option>
          <option value="Developer">Developer</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1e272e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {isLogin ? 'Proceed' : 'Proceed'}
        </button>

        {success && (
          <p style={{ color: '#00b894', marginTop: '15px' }}>✅ {success}</p>
        )}

        {error && (
          <p style={{ color: '#d63031', marginTop: '15px' }}>⚠️ {error}</p>
        )}

        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{
              marginLeft: '6px',
              background: 'none',
              border: 'none',
              color: '#0984e3',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;
