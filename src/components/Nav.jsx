import { NavLink } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function NavigationBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        {/* Cambié href por as={NavLink} to="/" para consistencia */}
        <Navbar.Brand as={NavLink} to="/" className="text-decoration-none">
          Anti-Social Net
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/user">
              Usuario
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tags">
              Tags
            </Nav.Link>
            <Nav.Link as={NavLink} to="/registroUsuario">
              Registrarse
            </Nav.Link>
            <Nav.Link as={NavLink} to="/inicioSesion">
              Iniciar sesión
            </Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar