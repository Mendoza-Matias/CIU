import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import NavigationBar from './Nav';

function PostDetail() {
    const { id } = useParams(); // Obtener el ID del post desde la URL
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError('ID del post no válido');
            setLoading(false);
            return;
        }

        fetch(`http://localhost:3001/posts/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener el post');
                }
                return response.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
                console.error(err);
            });
    }, [id]);

    const handleGoBack = () => {
        navigate(-1); // Volver a la página anterior
    };

    if (loading) {
        return (
            <div>
                {/* <NavigationBar /> */}
                <Container className="mt-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Cargando publicación...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                {/* <NavigationBar /> */}
                <Container className="mt-5">
                    <Alert variant="danger">
                        <Alert.Heading>¡Error!</Alert.Heading>
                        <p>{error}</p>
                        <hr />
                        <div className="d-flex gap-2">
                            <Button variant="outline-danger" onClick={handleGoBack}>
                                Volver
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/')}>
                                Ir al inicio
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </div>
        );
    }

    if (!post) {
        return (
            <div>
                {/* <NavigationBar /> */}
                <Container className="mt-5">
                    <Alert variant="warning">
                        <h5>Publicación no encontrada</h5>
                        <p>La publicación que buscas no existe o ha sido eliminada.</p>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Volver al inicio
                        </Button>
                    </Alert>
                </Container>
            </div>
        );
    }

    return (
        <div>
            {/* <NavigationBar /> */}
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        {/* Botón para volver */}
                        <div className="mb-4">
                            <Button
                                variant="outline-secondary"
                                onClick={handleGoBack}
                                className="d-flex align-items-center"
                            >
                                ← Volver
                            </Button>
                        </div>

                        {/* Card principal del post */}
                        <Card className="shadow-sm border-0">
                            {/* Header del post */}
                            <Card.Header className="bg-white border-bottom py-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h4 className="fw-bold mb-2 text-primary">
                                            {post.User?.nickName || 'Usuario anónimo'}
                                        </h4>
                                        <small className="text-muted">
                                            📅 {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </div>
                                    <Badge bg="primary">Post #{post.id}</Badge>
                                </div>
                            </Card.Header>

                            {/* Contenido del post */}
                            <Card.Body className="p-4">
                                <div className="mb-4">
                                    <p className="fs-5 lh-base mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                        {post.description}
                                    </p>
                                </div>

                                {/* Imágenes (si las hay) */}
                                {post.images && post.images.length > 0 && (
                                    <div className="mb-4">
                                        {post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Imagen ${index + 1} del post`}
                                                className="img-fluid rounded mb-3 w-100"
                                                style={{ maxHeight: "500px", objectFit: "cover" }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Etiquetas */}
                                {post.Tags && post.Tags.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="text-muted mb-2">🏷️ Etiquetas:</h6>
                                        <div>
                                            {post.Tags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    bg="secondary"
                                                    className="me-2 mb-2 fs-6 px-3 py-2"
                                                >
                                                    #{tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card.Body>

                            {/* Footer con información adicional */}
                            <Card.Footer className="bg-light py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        💬 {post.commentsCount || 0} comentario{(post.commentsCount || 0) !== 1 ? 's' : ''}
                                    </small>
                                    <small className="text-muted">
                                        Usuario: {post.User?.email || 'No disponible'}
                                    </small>
                                </div>
                            </Card.Footer>
                        </Card>

                        {/* Información adicional */}
                        <Alert variant="info" className="mt-4">
                            <Alert.Heading className="h6">
                                💡 ¿Te gustó esta publicación?
                            </Alert.Heading>
                            En Anti-Social Net fomentamos las conversaciones auténticas.
                            ¡Comparte tus pensamientos de manera genuina!
                        </Alert>

                        {/* Sección de comentarios (placeholder) */}
                        <Card className="mt-4 shadow-sm border-0">
                            <Card.Header className="bg-light">
                                <h6 className="mb-0">💬 Comentarios</h6>
                            </Card.Header>
                            <Card.Body className="text-center py-5">
                                <p className="text-muted mb-3">
                                    Los comentarios se implementarán próximamente
                                </p>
                                <Button variant="outline-primary" disabled>
                                    Agregar comentario
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PostDetail;