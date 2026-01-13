import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';

// Custom hook for login functionality
// Separates login logic from UI component (separation of concerns)
function useLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await taskService.login(username, password);
      
      // Store authentication data in localStorage
      // Note: In production, consider httpOnly cookies for token storage
      const token = response.data.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
      }

      if (response.data.user) {
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
      }

      navigate('/dashboard');
      
    } catch (err) {
      // Extract user-friendly error message from API response
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please check your username/password.';
      setError(errorMessage);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin
  };
}

export default useLogin;
