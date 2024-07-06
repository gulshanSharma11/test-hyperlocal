import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import './Header.css'; // Adjust path as necessary

const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
      toast.success('Successfully logged in');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    toast.success('Successfully logged out');
  };

  return (
    <header className="header">
      <h1>HyperLocal</h1>
      <div className="user-info">
        {isAuthenticated ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
      </div>
    </header>
  );
};

export default Header;
