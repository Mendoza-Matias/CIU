import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { AuthContext } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta

function NavigationBar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    navigate('/inicioSesion'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="text-decoration-none">
          Anti-Social Net
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Inicio
            </Nav.Link>
            
            {/* NUEVO: Ocultar/mostrar "Usuario" basado en isAuthenticated */}
            {isAuthenticated && ( // Solo renderiza si isAuthenticated es true
              <Nav.Link as={NavLink} to="/user">
                Usuario
              </Nav.Link>
            )}

            <Nav.Link as={NavLink} to="/tags">
              Tags
            </Nav.Link>

            {/* Mantener la lógica existente para Registrarse/Iniciar sesión/Cerrar sesión */}
            {!isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/registroUsuario">
                  Registrarse
                </Nav.Link>
                <Nav.Link as={NavLink} to="/inicioSesion">
                  Iniciar sesión
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>
                Cerrar sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;