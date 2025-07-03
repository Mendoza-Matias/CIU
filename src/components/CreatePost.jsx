import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        selectedTagIds: [] // IDs de tags seleccionados
    });
    const [availableTags, setAvailableTags] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        // Simular usuario actual
        setCurrentUser({
            id: 1,
            nickName: "luna",
            email: "luna@example.com"
        });

        // Cargar tags disponibles
        fetchAvailableTags();
    }, []);

    const fetchAvailableTags = async () => {
        try {
            const response = await fetch('http://localhost:3001/tags');
            if (response.ok) {
                const tags = await response.json();
                setAvailableTags(tags);
            } else {
                // Fallback con tags mock
                const mockTags = [
                    { id: 1, name: "tecnología" },
                    { id: 2, name: "programación" },
                    { id: 3, name: "react" },
                    { id: 4, name: "javascript" },
                    { id: 5, name: "personal" },
                    { id: 6, name: "reflexión" },
                    { id: 7, name: "tutorial" },
                    { id: 8, name: "opinión" },
                    { id: 9, name: "noticias" },
                    { id: 10, name: "diseño" }
                ];
                setAvailableTags(mockTags);
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
            // Fallback en caso de error
            const mockTags = [
                { id: 1, name: "tecnología" },
                { id: 2, name: "programación" },
                { id: 3, name: "react" },
                { id: 4, name: "javascript" },
                { id: 5, name: "personal" },
                { id: 6, name: "reflexión" }
            ];
            setAvailableTags(mockTags);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagToggle = (tagId) => {
        setFormData(prev => ({
            ...prev,
            selectedTagIds: prev.selectedTagIds.includes(tagId)
                ? prev.selectedTagIds.filter(id => id !== tagId)
                : [...prev.selectedTagIds, tagId]
        }));
    };

    // Función para obtener los tags seleccionados con su información completa
    const getSelectedTags = () => {
        return availableTags.filter(tag => formData.selectedTagIds.includes(tag.id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Estructura de datos para enviar (coincide con tu backend)
            const postData = {
                description: formData.title ? `${formData.title}\n\n${formData.content}` : formData.content, // Combinar título y contenido
                userId: currentUser.id, // camelCase como espera tu backend
                tagIds: formData.selectedTagIds // Solo los IDs de los tags
            };

            console.log("Datos a enviar:", postData); // Para debug

            const response = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error('Error al crear la publicación');
            }

            const createdPost = await response.json();
            console.log("Post creado:", createdPost);

            setSuccess(true);
            setFormData({ title: "", content: "", selectedTagIds: [] });
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.title.trim() && formData.content.trim();

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        {/* Header */}
                        <div className="text-center mb-4">
                            <h1 className="h2 text-primary fw-bold">Crear Nueva Publicación</h1>
                            <p className="text-muted">
                                Comparte tus pensamientos con la comunidad de Anti-Social Net
                            </p>
                        </div>

                        {/* Alertas */}
                        {error && (
                            <Alert variant="danger" dismissible onClose={() => setError(null)}>
                                <Alert.Heading className="h6">Error</Alert.Heading>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert variant="success">
                                <Alert.Heading className="h6">¡Post creado! 🎉</Alert.Heading>
                                Tu publicación ha sido creada exitosamente con {formData.selectedTagIds.length > 0 ? `${formData.selectedTagIds.length} tags` : 'sin tags'}. Redirigiendo al inicio en 3 segundos...
                            </Alert>
                        )}

                        {/* Formulario */}
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    {/* Información del Usuario */}
                                    {currentUser && (
                                        <div className="mb-4 p-3 bg-light rounded">
                                            <h6 className="text-muted mb-2">Publicando como:</h6>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                     style={{width: '40px', height: '40px'}}>
                                                    {currentUser.nickName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{currentUser.nickName}</div>
                                                    <small className="text-muted">{currentUser.email}</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Campo Título */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            Título de la publicación
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Escribe un título llamativo..."
                                            required
                                            size="lg"
                                            disabled={loading}
                                            className="border-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Un buen título ayuda a captar la atención de los lectores
                                        </Form.Text>
                                    </Form.Group>

                                    {/* Campo Contenido */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            Contenido
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            placeholder="¿Qué quieres compartir hoy? Escribe tu mensaje aquí..."
                                            required
                                            disabled={loading}
                                            className="border-2"
                                            style={{ resize: 'vertical' }}
                                        />
                                        <Form.Text className="text-muted">
                                            Caracteres: {formData.content.length}
                                        </Form.Text>
                                    </Form.Group>

                                    {/* Tags Seleccionados */}
                                    {formData.selectedTagIds.length > 0 && (
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold">
                                                Tags seleccionados ({formData.selectedTagIds.length})
                                            </Form.Label>
                                            <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded">
                                                {getSelectedTags().map(tag => (
                                                    <Badge 
                                                        key={tag.id} 
                                                        bg="primary" 
                                                        className="d-flex align-items-center gap-1 p-2"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleTagToggle(tag.id)}
                                                    >
                                                        #{tag.name}
                                                        <span className="ms-1">×</span>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Form.Text className="text-muted">
                                                IDs seleccionados: [{formData.selectedTagIds.join(', ')}]
                                            </Form.Text>
                                        </Form.Group>
                                    )}

                                    {/* Selector de Tags */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            Seleccionar Tags
                                        </Form.Label>
                                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            <div className="d-flex flex-wrap gap-2">
                                                {availableTags.map(tag => (
                                                    <Badge 
                                                        key={tag.id}
                                                        bg={formData.selectedTagIds.includes(tag.id) ? "primary" : "outline-secondary"}
                                                        className="p-2 d-flex align-items-center gap-2"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleTagToggle(tag.id)}
                                                    >
                                                        <span>#{tag.name}</span>
                                                        <small className="opacity-75">(ID: {tag.id})</small>
                                                        {formData.selectedTagIds.includes(tag.id) && (
                                                            <span>✓</span>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <Form.Text className="text-muted">
                                            Haz clic en los tags para seleccionar/deseleccionar. Los IDs se enviarán en la request.
                                        </Form.Text>
                                    </Form.Group>

                                    {/* Botones */}
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/')}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={!isFormValid || loading}
                                            className="px-4"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Creando post...
                                                </>
                                            ) : (
                                                <>
                                                    📝 Crear Post {formData.selectedTagIds.length > 0 && `(${formData.selectedTagIds.length} tags)`}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Consejos */}
                        <Card className="mt-4 border-0 bg-transparent">
                            <Card.Body className="text-center">
                                <h6 className="text-muted mb-3">💡 Consejos para una buena publicación</h6>
                                <div className="row text-start">
                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            • Sé auténtico y genuino<br/>
                                            • Usa tags relevantes<br/>
                                            • Respeta a otros usuarios
                                        </small>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            • Evita contenido ofensivo<br/>
                                            • Usa un lenguaje claro<br/>
                                            • Máximo 5 tags recomendado
                                        </small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default CreatePost;