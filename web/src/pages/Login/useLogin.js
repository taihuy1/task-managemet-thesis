import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';

// Custom hook for login functionality
// Separates login logic from UI component (separation of concerns)
function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await taskService.login(email, password);

      // Store authentication data in localStorage
      // Note: In production, consider httpOnly cookies for token storage
      // Backend response: { success, message, data: { accessToken, user } }
      // Axios wraps in response.data, so actual data is at response.data.data
      const result = response.data.data;
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
      }

      if (result.user) {
        localStorage.setItem('userRole', result.user.role);
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userEmail', result.user.email);
      }

      navigate('/dashboard');

    } catch (err) {
      // Extract user-friendly error message from API response
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your email/password.';
      setError(errorMessage);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin
  };
}

export default useLogin;
