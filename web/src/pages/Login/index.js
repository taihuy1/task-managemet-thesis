import React from 'react';
import useLogin from './useLogin';
import './Login.css';

// Login page component
// Uses custom hook (useLogin) to separate business logic from presentation
function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin
  } = useLogin();

  return (
    <div className="login-container">
      <h2 className="login-header">Login</h2>
      
      {error && (
        <div className="error-msg" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
