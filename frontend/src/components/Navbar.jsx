import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg={darkMode ? 'dark' : 'white'} variant={darkMode ? 'dark' : 'light'} expand="lg" sticky="top" className="shadow-sm mb-4 py-2" style={{ zIndex: 1020 }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">Social</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <div onClick={toggleTheme} style={{ cursor: 'pointer' }} className="me-2 text-secondary">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </div>
            {user ? (
              <>
                <span className={`fw-bold ${darkMode ? 'text-light' : 'text-dark'}`}>{user.username}</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Signup</Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
