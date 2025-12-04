import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../api/taskService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const response = await taskService.login(username, password);
      

      const token = response.data.accessToken || response.data.token; 
      localStorage.setItem('accessToken', token);
      

      if (response.data.user) {
         localStorage.setItem('userRole', response.data.user.role);
      }

      navigate('/dashboard');
      
    } catch (err) {
      setError('Login failed. Please check your username/password.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label><br />
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;