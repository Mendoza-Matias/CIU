import React, { useEffect, useState, useContext } from 'react'; 
import { Container, Card, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 

function User() {
  const navigate = useNavigate();
  const { user: loggedInUser, isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/inicioSesion'); 
    }
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Redirigiendo al inicio de sesión...</p>
      </Container>
    );
  }

  return (
    <div>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold text-primary mb-2">Mi Perfil</h1>
              <p className="text-muted">Información de tu cuenta en Anti-Social Net</p>
            </div>

            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <div className="d-flex align-items-center justify-content-center">
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
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">ID DE USUARIO</small>
                      <span className="fs-5">{loggedInUser.id}</span>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">NOMBRE DE USUARIO</small>
                      <span className="fs-5">@{loggedInUser.nickName}</span>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">CORREO ELECTRÓNICO</small>
                      <span className="fs-5">{loggedInUser.email}</span>
                    </div>
                  </div>

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

              <Card.Footer className="bg-light text-center py-3">
                <small className="text-muted">
                  🎉 ¡Gracias por ser parte de Anti-Social Net!
                </small>
              </Card.Footer>
            </Card>

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