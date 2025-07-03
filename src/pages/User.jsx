import React, { useEffect, useState, useContext } from 'react'; // Importa useContext
import { Container, Card, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { AuthContext } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta

function User() {
  const navigate = useNavigate();
  // Obtén el usuario y el estado de autenticación del AuthContext
  const { user: loggedInUser, isAuthenticated } = useContext(AuthContext);

  // No necesitamos un estado 'user' local ni un loading/error para el fetch de un ID fijo.
  // El 'loading' y 'error' ahora se manejarían si hubieras una API compleja para el perfil
  // que usara el ID del loggedInUser, pero para este caso simplificado no son necesarios aquí.

  // Efecto para redirigir si el usuario no está logueado
  useEffect(() => {
    if (!isAuthenticated) {
      // Si no hay un usuario autenticado, redirige a la página de login
      navigate('/inicioSesion'); // O '/login' si esa es tu ruta
    }
  }, [isAuthenticated, navigate]); // Dependencias: se ejecuta cuando cambian isAuthenticated o navigate

  // Si no está autenticado, no renderizamos nada (la redirección se encargará)
  // O puedes mostrar un spinner o un mensaje mientras se resuelve la redirección
  if (!isAuthenticated) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Redirigiendo al inicio de sesión...</p>
      </Container>
    );
  }

  // Ahora 'loggedInUser' contiene los datos del usuario logueado.
  // Si llegamos aquí, 'isAuthenticated' es true y 'loggedInUser' tiene los datos.
  return (
    <div>
      {/* <NavigationBar /> // Generalmente NavigationBar está en App.jsx */}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold text-primary mb-2">Mi Perfil</h1>
              <p className="text-muted">Información de tu cuenta en Anti-Social Net</p>
            </div>

            {/* Card del Usuario */}
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <div className="d-flex align-items-center justify-content-center">
                  {/* Avatar placeholder */}
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <span className="text-primary fs-2 fw-bold">
                      {loggedInUser.nickName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1">{loggedInUser.nickName}</h3>
                    <Badge bg="light" text="primary">Usuario Activo</Badge>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="p-4">
                <div className="row g-3">
                  {/* ID del Usuario */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">ID DE USUARIO</small>
                      <span className="fs-5">{loggedInUser.id}</span>
                    </div>
                  </div>

                  {/* Nombre de Usuario */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">NOMBRE DE USUARIO</small>
                      <span className="fs-5">@{loggedInUser.nickName}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">CORREO ELECTRÓNICO</small>
                      <span className="fs-5">{loggedInUser.email}</span>
                    </div>
                  </div>

                  {/* Fecha de Creación */}
                  {loggedInUser.createdAt && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-semibold d-block mb-1">MIEMBRO DESDE</small>
                        <span className="fs-5">
                          {new Date(loggedInUser.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>

              {/* Footer con estadísticas opcionales */}
              <Card.Footer className="bg-light text-center py-3">
                <small className="text-muted">
                  🎉 ¡Gracias por ser parte de Anti-Social Net!
                </small>
              </Card.Footer>
            </Card>

            {/* Información adicional */}
            <Alert variant="info" className="mt-4">
              <Alert.Heading className="h6">
                💡 Tip
              </Alert.Heading>
              Mantén tu información actualizada para una mejor experiencia en la plataforma.
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default User;