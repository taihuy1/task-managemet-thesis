import React from 'react';
import useLogin from './useLogin';
import './Login.css';

/**
 * Login Page - Trust & Confidence Design
 * Uses friendly microcopy and clear visual hierarchy
 */
function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin
  } = useLogin();

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Brand Section */}
          <div className="login-brand">
            <div className="login-brand-icon" role="img" aria-label="Task Manager">
              📋
            </div>
            <h1 className="login-header">Welcome back</h1>
            <p className="login-subtitle">Sign in to manage your tasks</p>
          </div>

          {/* Error Message - Friendly & Specific */}
          {error && (
            <div className="error-msg" role="alert">
              {error === 'Invalid credentials'
                ? "That login didn't work. Please check your email and password."
                : error}
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  autoComplete="email"
                  aria-describedby={error ? 'login-error' : undefined}
                />
                <span className="input-icon" aria-hidden="true">📧</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <span className="input-icon" aria-hidden="true">🔒</span>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>Task Management System v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
