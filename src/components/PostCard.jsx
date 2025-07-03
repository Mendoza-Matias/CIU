import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
    const navigate = useNavigate();
    const handleViewMore = () => {
        console.log(`Ver más de post ${post.id}`);
        navigate(`/post/${post.id}`);
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h6 className="mb-1 fw-bold">{post.User?.nickName || 'Usuario anónimo'}</h6>
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

                <div className="d-flex justify-content-between align-items-center">
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