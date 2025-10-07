import React, { useState } from 'react';
import API from '../apis/api';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', { email, password });

      // ✅ Save token, username, and role in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('role', response.data.user.role);

      setIsLoggedIn(true);       // ✅ triggers dashboard rendering
      navigate('/dashboard');    // ✅ optional immediate redirect
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} disabled={loading} style={styles.button}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p>Don't have an account?</p>
      <button onClick={() => navigate('/register')} style={styles.buttonSecondary}>
        Go to Register
      </button>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', fontFamily: 'Arial, sans-serif' },
  input: { width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
  button: { width: '95%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none', backgroundColor: '#6C63FF', color: 'white', fontSize: '16px', cursor: 'pointer' },
  buttonSecondary: { width: '95%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #6C63FF', backgroundColor: 'white', color: '#6C63FF', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', fontWeight: 'bold' },
};

export default Login;
