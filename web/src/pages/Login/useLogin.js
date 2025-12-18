import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';

function useLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await taskService.login(username, password);
      
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
      console.log('Login failed:', err);
      setError('Login failed. Please check your username/password.');
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin
  };
}

export default useLogin;
