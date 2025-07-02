import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

function Home() {
    // const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Datos de ejemplo para el feed (en una app real vendrían de una API)
    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener el usuario')
                }
                return response.json()
            })
            .then((data) => {
                setPosts(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    // const handleViewMore = (postId) => {
    //     navigate(`/post/${postId}`);
    // };
    if (error) return <Alert variant="danger">{error}</Alert>
    return (
        <div>
            {/* <NavigationBar /> */}

            {/* Banner de Bienvenida */}
            <div className="bg-primary text-white py-5 mb-4">
                <Container>
                    <Row>
                        <Col lg={8} className="mx-auto text-center">
                            <h1 className="display-4 fw-bold mb-3">
                                Bienvenido a Anti-Social Net
                            </h1>
                            <p className="lead mb-4">
                                Conecta de manera auténtica. Comparte momentos reales.
                                Construye relaciones genuinas en un espacio libre de algoritmos.
                            </p>
                            <Button variant="light" size="lg">
                                Crear nueva publicación
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Contenido Principal */}
            <Container>
                <Row>
                    <Col lg={8} className="mx-auto">
                        {/* Información adicional */}
                        <Alert variant="info" className="mb-4">
                            <Alert.Heading className="h6">
                                💡 ¿Sabías que...?
                            </Alert.Heading>
                            En Anti-Social Net priorizamos las conexiones humanas auténticas.
                            No hay likes, no hay algoritmos, solo conversaciones reales.
                        </Alert>

                        {/* Feed de Publicaciones */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h4 mb-0">Publicaciones Recientes</h2>
                            <small className="text-muted">
                                {posts.length} publicación{posts.length !== 1 ? 'es' : ''}
                            </small>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="mt-3 text-muted">Cargando publicaciones...</p>
                            </div>
                        ) : (
                            <>
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}

                                {/* Mensaje de final del feed */}
                                <div className="text-center py-4">
                                    <p className="text-muted">
                                        🎉 ¡Has visto todas las publicaciones recientes!
                                    </p>
                                    <Button variant="outline-primary">
                                        Cargar más publicaciones
                                    </Button>
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;