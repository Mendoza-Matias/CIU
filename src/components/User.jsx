import { useEffect, useState } from 'react'
import { Container, Card, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap'
import NavigationBar from './Nav'

function User() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/users/1')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener el usuario')
        }
        return response.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div>
        {/* <NavigationBar /> */}
        <Container className="mt-5">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando información del usuario...</p>
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {/* <NavigationBar /> */}
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>¡Ups! Algo salió mal</Alert.Heading>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Por favor, intenta recargar la página o contacta al soporte si el problema persiste.
            </p>
          </Alert>
        </Container>
      </div>
    )
  }

  return (
    <div>
      {/* <NavigationBar /> */}
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
                      {user.nickName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1">{user.nickName}</h3>
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
                      <span className="fs-5">{user.id}</span>
                    </div>
                  </div>

                  {/* Nombre de Usuario */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">NOMBRE DE USUARIO</small>
                      <span className="fs-5">@{user.nickName}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted fw-semibold d-block mb-1">CORREO ELECTRÓNICO</small>
                      <span className="fs-5">{user.email}</span>
                    </div>
                  </div>

                  {/* Fecha de Creación */}
                  {user.createdAt && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-semibold d-block mb-1">MIEMBRO DESDE</small>
                        <span className="fs-5">
                          {new Date(user.createdAt).toLocaleDateString('es-ES', {
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
  )
}

export default User