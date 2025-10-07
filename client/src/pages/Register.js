import React, { useState } from 'react';
import API from '../apis/api';
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/register', form);

      if (res.data.token) {
        // ✅ Save token, username, and role to localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('role', res.data.user.role || 'user');

        setIsLoggedIn(true); // ✅ trigger dashboard rendering
        navigate('/dashboard'); // ✅ redirect to dashboard
      } else {
        alert('Registration successful! Please login.');
        navigate('/'); // fallback: redirect to login page
      }
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Server error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>Already have an account?</p>
      <button onClick={() => navigate('/')} style={styles.buttonSecondary}>
        Go to Login
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', fontFamily: 'Arial, sans-serif' },
  input: { width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
  button: { width: '95%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none', backgroundColor: '#6C63FF', color: 'white', fontSize: '16px', cursor: 'pointer' },
  buttonSecondary: { width: '95%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #6C63FF', backgroundColor: 'white', color: '#6C63FF', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', fontWeight: 'bold' },
};

export default Register;
