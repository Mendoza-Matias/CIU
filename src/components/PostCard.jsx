import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
    const navigate = useNavigate();
    const handleViewMore = () => {
        // Aquí puedes agregar la navegación cuando tengas React Router configurado
        console.log(`Ver más de post ${post.id}`);
        navigate(`/post/${post.id}`);
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        {/* Usar User.nickName en lugar de author */}
                        <h6 className="mb-1 fw-bold">{post.User?.nickName || 'Usuario anónimo'}</h6>
                        {/* Formatear la fecha */}
                        <small className="text-muted">
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </small>
                    </div>
                </div>

                <Card.Text className="mb-3">
                    {post.description}
                </Card.Text>

                {/* Imágenes - comentadas por ahora
                {post.images && post.images.length > 0 && (
                    <div className="mb-3">
                        {post.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Imagen ${index + 1}`}
                                className="img-fluid rounded mb-2"
                                style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }}
                            />
                        ))}
                    </div>
                )} */}

                {/* Etiquetas */}
                <div className="mb-3">
                    {post.Tags && post.Tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            bg="secondary"
                            className="me-1 mb-1"
                            style={{ fontSize: "0.75rem" }}
                        >
                            #{tag.name}
                        </Badge>
                    ))}
                </div>

                {/* Footer con comentarios y botón */}
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        💬 {post.commentsCount || 0} comentario{(post.commentsCount || 0) !== 1 ? 's' : ''}
                    </small>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleViewMore}
                    >
                        Ver más
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default PostCard;