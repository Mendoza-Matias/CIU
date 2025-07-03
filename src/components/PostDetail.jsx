import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Spinner, Alert, Button, Row, Col, Form, ListGroup } from 'react-bootstrap';
import NavigationBar from './Nav';

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [postImages, setPostImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Simular usuario actual (en una app real vendría del contexto de autenticación)
        setCurrentUser({
            id: 1,
            nickName: "luna",
            email: "luna@example.com"
        });

        if (!id) {
            setError('ID del post no válido');
            setLoading(false);
            return;
        }

        // Cargar post y comentarios
        loadPostAndComments();
    }, [id]);

    const loadPostAndComments = async () => {
        try {
            // Cargar el post
            const postResponse = await fetch(`http://localhost:3001/posts/${id}`);
            if (!postResponse.ok) {
                throw new Error('Error al obtener el post');
            }
            const postData = await postResponse.json();
            setPost(postData);

            // Cargar imágenes del post
            await loadPostImages();

            // Cargar comentarios
            await loadComments();
            
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadPostImages = async () => {
        try {
            const imagesResponse = await fetch(`http://localhost:3001/postimages/post/${id}`);
            if (imagesResponse.ok) {
                const imagesData = await imagesResponse.json();
                setPostImages(imagesData);
                console.log("Imágenes cargadas:", imagesData);
            } else {
                // Si no hay imágenes o el endpoint falla
                setPostImages([]);
            }
        } catch (err) {
            console.error('Error loading post images:', err);
            setPostImages([]);
        }
    };

    const loadComments = async () => {
        try {
            // Ajustar para usar el endpoint correcto de comentarios
            const commentsResponse = await fetch(`http://localhost:3001/comments/post/${id}`);
            if (commentsResponse.ok) {
                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            } else {
                // Si no hay endpoint específico, usar comentarios mock para demo
                setComments([
                    {
                        id: 1,
                        content: "¡Excelente publicación! Me parece muy interesante el punto que mencionas.",
                        createdAt: new Date().toISOString(),
                        UserId: 2,
                        PostId: parseInt(id),
                        User: {
                            id: 2,
                            nickName: "alex",
                            email: "alex@example.com"
                        }
                    },
                    {
                        id: 2,
                        content: "Gracias por compartir esto. Me ayudó mucho a entender el tema.",
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        UserId: 3,
                        PostId: parseInt(id),
                        User: {
                            id: 3,
                            nickName: "maria",
                            email: "maria@example.com"
                        }
                    }
                ]);
            }
        } catch (err) {
            console.error('Error loading comments:', err);
            // Usar comentarios mock para demo
            setComments([]);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setSubmittingComment(true);
        setCommentError(null);

        try {
            // Estructura que coincide exactamente con tu backend
            const commentData = {
                content: commentText,
                userId: currentUser.id,
                postId: parseInt(id)
            };

            console.log("Enviando comentario:", commentData); // Para debug

            const response = await fetch(`http://localhost:3001/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData)
            });

            if (response.ok) {
                const newComment = await response.json();
                console.log("Comentario creado:", newComment);
                
                // Agregar información del usuario al comentario para mostrarlo
                const commentWithUser = {
                    ...newComment,
                    User: currentUser
                };
                
                setComments(prev => [commentWithUser, ...prev]);
                setCommentText('');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el comentario');
            }
        } catch (err) {
            setCommentError('Error al agregar el comentario. Inténtalo de nuevo.');
            console.error('Error submitting comment:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Hace un momento';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} hora${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
        
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div>
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
                                            📅 {formatDate(post.createdAt)}
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

                                {/* Imágenes del post */}
                                {postImages && postImages.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="text-muted mb-3">📸 Imágenes:</h6>
                                        <div className="row g-3">
                                            {postImages.map((imageObj, index) => (
                                                <div 
                                                    key={imageObj.id || index} 
                                                    className={`col-${postImages.length === 1 ? '12' : postImages.length === 2 ? '6' : '4'}`}
                                                >
                                                    <div className="position-relative">
                                                        <img
                                                            src={imageObj.url || imageObj.imagePath || imageObj}
                                                            alt={`Imagen ${index + 1} del post`}
                                                            className="img-fluid rounded w-100"
                                                            style={{ 
                                                                height: postImages.length === 1 ? "400px" : "250px", 
                                                                objectFit: "cover",
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() => {
                                                                // Abrir imagen en modal o nueva pestaña
                                                                window.open(imageObj.url || imageObj.imagePath || imageObj, '_blank');
                                                            }}
                                                        />
                                                        {/* Badge con número de imagen */}
                                                        <Badge 
                                                            bg="dark" 
                                                            className="position-absolute top-0 start-0 m-2"
                                                        >
                                                            {index + 1}
                                                        </Badge>
                                                        {/* Descripción de la imagen si existe */}
                                                        {imageObj.description && (
                                                            <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2 rounded-bottom">
                                                                <small>{imageObj.description}</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-2">
                                            <small className="text-muted">
                                                {postImages.length} imagen{postImages.length !== 1 ? 'es' : ''} • Click para ver en tamaño completo
                                            </small>
                                        </div>
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
                                    <div className="d-flex gap-3">
                                        <small className="text-muted">
                                            💬 {comments.length} comentario{comments.length !== 1 ? 's' : ''}
                                        </small>
                                        {postImages.length > 0 && (
                                            <small className="text-muted">
                                                📸 {postImages.length} imagen{postImages.length !== 1 ? 'es' : ''}
                                            </small>
                                        )}
                                    </div>
                                    <small className="text-muted">
                                        Usuario: {post.User?.email || 'No disponible'}
                                    </small>
                                </div>
                            </Card.Footer>
                        </Card>

                        {/* Sección de comentarios */}
                        <Card className="mt-4 shadow-sm border-0">
                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">💬 Comentarios ({comments.length})</h6>
                                {currentUser && (
                                    <small className="text-muted">
                                        Como {currentUser.nickName}
                                    </small>
                                )}
                            </Card.Header>

                            {/* Formulario para agregar comentario */}
                            {currentUser && (
                                <Card.Body className="border-bottom">
                                    <Form onSubmit={handleCommentSubmit}>
                                        <div className="d-flex gap-3">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                                 style={{width: '40px', height: '40px', minWidth: '40px'}}>
                                                {currentUser.nickName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-fill">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Escribe tu comentario..."
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    disabled={submittingComment}
                                                    className="mb-2"
                                                />
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">
                                                        {commentText.length}/500 caracteres
                                                    </small>
                                                    <Button 
                                                        type="submit"
                                                        variant="primary"
                                                        size="sm"
                                                        disabled={!commentText.trim() || submittingComment}
                                                    >
                                                        {submittingComment ? (
                                                            <>
                                                                <Spinner size="sm" className="me-2" />
                                                                Enviando...
                                                            </>
                                                        ) : (
                                                            'Comentar'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                    {commentError && (
                                        <Alert variant="danger" className="mt-3 mb-0">
                                            {commentError}
                                        </Alert>
                                    )}
                                </Card.Body>
                            )}

                            {/* Lista de comentarios */}
                            <Card.Body className="p-0">
                                {comments.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted mb-3">
                                            Aún no hay comentarios en esta publicación
                                        </p>
                                        <small className="text-muted">
                                            ¡Sé el primero en comentar!
                                        </small>
                                    </div>
                                ) : (
                                    <ListGroup variant="flush">
                                        {comments.map((comment) => (
                                            <ListGroup.Item key={comment.id} className="border-0 py-3">
                                                <div className="d-flex gap-3">
                                                    <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                                         style={{width: '35px', height: '35px', minWidth: '35px'}}>
                                                        {comment.User.nickName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-fill">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            <strong className="text-primary">
                                                                {comment.User.nickName}
                                                            </strong>
                                                            <small className="text-muted">
                                                                {formatDate(comment.createdAt)}
                                                            </small>
                                                        </div>
                                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Información adicional */}
                        <Alert variant="info" className="mt-4">
                            <Alert.Heading className="h6">
                                💡 ¿Te gustó esta publicación?
                            </Alert.Heading>
                            En Anti-Social Net fomentamos las conversaciones auténticas.
                            ¡Comparte tus pensamientos de manera genuina!
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PostDetail;