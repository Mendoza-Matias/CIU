import React, { useEffect, useState } from "react";
import { Container, Alert, Spinner, Badge, Card, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/Nav";

function Tags() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/tags')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener las etiquetas');
                }
                return response.json();
            })
            .then((data) => {
                setTags(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div>
                {/* <NavigationBar /> */}
                <Container className="mt-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Cargando etiquetas...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Container className="mt-5">
                    <Alert variant="danger">
                        <Alert.Heading>¡Error!</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                        <div className="text-center mb-5">
                            <h1 className="display-6 fw-bold text-primary mb-2">
                                🏷️ Etiquetas
                            </h1>
                            <p className="text-muted">
                                Explora todas las etiquetas disponibles en Anti-Social Net
                            </p>
                        </div>

                        <Card className="mb-4 border-0 bg-light">
                            <Card.Body className="text-center py-3">
                                <small className="text-muted">
                                    Total de etiquetas: <strong>{tags.length}</strong>
                                </small>
                            </Card.Body>
                        </Card>

                        {tags.length === 0 ? (
                            <Alert variant="info" className="text-center">
                                <h5>🔍 No hay etiquetas disponibles</h5>
                                <p className="mb-0">
                                    Parece que aún no se han creado etiquetas en el sistema.
                                </p>
                            </Alert>
                        ) : (
                            <>
                                <Card className="shadow-sm border-0">
                                    <Card.Header className="bg-primary text-white">
                                        <h5 className="mb-0">🎯 Todas las Etiquetas</h5>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <div className="d-flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    bg="secondary"
                                                    className="fs-6 px-3 py-2 cursor-pointer"
                                                    style={{
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#6c757d';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    #{tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card className="mt-4 shadow-sm border-0">
                                    <Card.Header className="bg-light">
                                        <h6 className="mb-0 text-muted">📋 Vista de Lista</h6>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <div className="list-group list-group-flush">
                                            {tags.map((tag, index) => (
                                                <div
                                                    key={tag.id}
                                                    className="list-group-item d-flex justify-content-between align-items-center py-3"
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <Badge
                                                            bg="primary"
                                                            className="me-3"
                                                            style={{ minWidth: '30px' }}
                                                        >
                                                            {index + 1}
                                                        </Badge>
                                                        <span className="fw-medium">#{tag.name}</span>
                                                    </div>
                                                    <small className="text-muted">
                                                        ID: {tag.id}
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Tags;