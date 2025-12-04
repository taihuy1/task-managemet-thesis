// src/pages/Login/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';

// This function handles all the state and API calls
const useLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Stop page refresh
    setError(''); // Clear old errors

    try {
      // Call the API
      const response = await taskService.login(username, password);

      // 1. Get the token
      const token = response.data.accessToken || response.data.token;

      // 2. Save essential data to browser storage
      localStorage.setItem('accessToken', token);

      if (response.data.user) {
        localStorage.setItem('userRole', response.data.user.role);
      }

      // 3. Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error("Login error:", err);
      setError('Login failed. Please check your username/password.');
    }
  };

  // Return the variables the HTML needs
  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin
  };
};

export default useLogin;