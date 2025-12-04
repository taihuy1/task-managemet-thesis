import React from 'react';
import useLogin from './useLogin';
import './Login.css';

function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin
  } = useLogin();

  return (
    <div className="login-container">
      <h2 className="login-header">Login</h2>
      
      {error && (
        <div className="error-msg">{error}</div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;