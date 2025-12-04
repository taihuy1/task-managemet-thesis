import React from 'react';

function DashboardPage() {
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username') || 'User';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome {username}! You have successfully logged in.</p>
      <p>Your role: {userRole}</p>
    </div>
  );
}

export default DashboardPage;