import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import "../styles/Login.css"

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res && res.ok) {
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.userType === 'administratoruser') {
          navigate('/manageorders');
        } else if (res.userType === 'customeruser') {
          navigate('/menu');
        } else {
          setError('Unknown user type');
        }
      } else {
        setError(res && res.error ? res.error : 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-center">
      <div className="login-form" >
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 6 }}>Email</label>
          <input
            id="email"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="email-field"
            style={{padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="password-field"
            style={{padding: 8 }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
    </div>
    
  );
};

export default Login;
