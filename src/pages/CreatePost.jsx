import { useState, useEffect, useContext } from "react";

import { Container, Row, Col, Form, Button, Card, Alert, Badge, Spinner } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { AuthContext } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta



function CreatePost() {

    const navigate = useNavigate();

    const { user: loggedInUser, isAuthenticated } = useContext(AuthContext);



    const [formData, setFormData] = useState({

        description: "", // Renombrado de 'content' a 'description' para coincidir con la API de posts

        title: "", // Mantendremos el título para mejor UX, pero lo uniremos a la descripción

        imageUrls: [''], // Array para manejar múltiples URLs de imagen, con un campo inicial

        selectedTagIds: []

    });

    const [availableTags, setAvailableTags] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [success, setSuccess] = useState(false);



    // Protección de Ruta: Redirige si no está autenticado

    useEffect(() => {

        if (!isAuthenticated) {

            navigate('/inicioSesion');

        }

    }, [isAuthenticated, navigate]);



    // Carga inicial de tags

    useEffect(() => {

        fetchAvailableTags();

    }, []);



    const fetchAvailableTags = async () => {

        try {

            const response = await fetch('http://localhost:3001/tags');

            if (response.ok) {

                const tags = await response.json();

                setAvailableTags(tags);

            } else {

                console.warn("Failed to fetch tags from API. Using mock data.");

                const mockTags = [

                    { id: 1, name: "tecnología" }, { id: 2, name: "programación" },

                    { id: 3, name: "react" }, { id: 4, name: "javascript" },

                    { id: 5, name: "personal" }, { id: 6, name: "reflexión" },

                    { id: 7, name: "tutorial" }, { id: 8, name: "opinión" },

                    { id: 9, name: "noticias" }, { id: 10, name: "diseño" }

                ];

                setAvailableTags(mockTags);

            }

        } catch (err) {

            console.error("Error fetching tags:", err);

            console.warn("Failed to fetch tags from API. Using mock data due to network error.");

            const mockTags = [

                { id: 1, name: "tecnología" }, { id: 2, name: "programación" },

                { id: 3, name: "react" }, { id: 4, name: "javascript" },

                { id: 5, name: "personal" }, { id: 6, name: "reflexión" }

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



    // NUEVO: Manejar cambios en las URLs de imagen

    const handleImageUrlChange = (index, value) => {

        const newImageUrls = [...formData.imageUrls];

        newImageUrls[index] = value;

        setFormData(prev => ({

            ...prev,

            imageUrls: newImageUrls

        }));

    };



    // NUEVO: Agregar un campo de URL de imagen

    const addImageUrlField = () => {

        // Solo agrega un nuevo campo si el último no está vacío

        if (formData.imageUrls[formData.imageUrls.length - 1] !== '') {

            setFormData(prev => ({

                ...prev,

                imageUrls: [...prev.imageUrls, '']

            }));

        }

    };



    // NUEVO: Eliminar un campo de URL de imagen

    const removeImageUrlField = (index) => {

        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);

        // Si eliminamos todos los campos, aseguramos que haya al menos uno para ingresar

        if (newImageUrls.length === 0) {

            setFormData(prev => ({

                ...prev,

                imageUrls: ['']

            }));

        } else {

            setFormData(prev => ({

                ...prev,

                imageUrls: newImageUrls

            }));

        }

    };



    const handleTagToggle = (tagId) => {

        setFormData(prev => ({

            ...prev,

            selectedTagIds: prev.selectedTagIds.includes(tagId)

                ? prev.selectedTagIds.filter(id => id !== tagId)

                : [...prev.selectedTagIds, tagId]

        }));

    };



    const getSelectedTags = () => {

        return availableTags.filter(tag => formData.selectedTagIds.includes(tag.id));

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError(null);

        setSuccess(false);



        if (!loggedInUser || !loggedInUser.id) {

            setError("No hay un usuario logueado para crear la publicación.");

            setLoading(false);

            return;

        }



        try {

            // Paso 1: Crear el Post

            const postDescription = formData.title ? `${formData.title}\n\n${formData.description}` : formData.description;



            const postData = {

                description: postDescription.trim(), // Asegúrate de que la descripción no esté vacía

                userId: loggedInUser.id,

                tagIds: formData.selectedTagIds

            };



            if (!postData.description) {

                setError("La descripción no puede estar vacía.");

                setLoading(false);

                return;

            }



            console.log("Enviando Post:", postData);

            const postResponse = await fetch('http://localhost:3001/posts', {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                },

                body: JSON.stringify(postData)

            });



            if (!postResponse.ok) {

                const errorData = await postResponse.json();

                throw new Error(errorData.message || 'Error al crear la publicación.');

            }



            const createdPost = await postResponse.json();

            console.log("Post creado exitosamente:", createdPost);



            // Paso 2: Procesar y asociar URLs de imágenes

            const validImageUrls = formData.imageUrls.filter(url => url.trim() !== '');



            if (validImageUrls.length > 0) {

                const imagePromises = validImageUrls.map(url =>

                    fetch('http://localhost:3001/post-images', {

                        method: 'POST',

                        headers: {

                            'Content-Type': 'application/json',

                        },

                        body: JSON.stringify({ url, postId: createdPost.id })

                    })

                );



                const imageResponses = await Promise.all(imagePromises);



                // Verificar si todas las subidas de imagen fueron exitosas

                const failedImageUploads = imageResponses.filter(response => !response.ok);

                if (failedImageUploads.length > 0) {

                    // Puedes decidir si esto es un error grave o solo una advertencia

                    console.warn("Algunas imágenes no pudieron asociarse. Errores:", failedImageUploads);

                    // Opcionalmente, setError para notificar al usuario

                    setError(prev => prev ? prev + "\nAlgunas imágenes no pudieron cargarse." : "Post creado, pero algunas imágenes no pudieron cargarse.");

                } else {

                    console.log("Todas las imágenes asociadas exitosamente.");

                }

            }



            setSuccess(true);

            setFormData({ description: "", title: "", imageUrls: [''], selectedTagIds: [] }); // Limpiar formulario



            // Paso 3: Redirigir al perfil después de un breve delay

            setTimeout(() => {

                navigate(`/`); // Redirige al perfil del usuario

            }, 2000);



        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };



    // La validación del formulario solo necesita la descripción (el título se incluye en ella)

    const isFormValid = formData.description.trim().length > 0;



    if (!isAuthenticated) {

        return (

            <div className="bg-light min-vh-100 py-5 d-flex align-items-center justify-content-center">

                <Container className="text-center">

                    <Spinner animation="border" variant="primary" />

                    <p className="mt-3 text-muted">Redirigiendo al inicio de sesión...</p>

                </Container>

            </div>

        );

    }



    return (

        <div className="bg-light min-vh-100 py-5">

            <Container>

                <Row className="justify-content-center">

                    <Col lg={8} xl={6}>

                        <div className="text-center mb-4">

                            <h1 className="h2 text-primary fw-bold">Crear Nueva Publicación</h1>

                            <p className="text-muted">

                                Comparte tus pensamientos con la comunidad de Anti-Social Net

                            </p>

                        </div>



                        {error && (

                            <Alert variant="danger" dismissible onClose={() => setError(null)}>

                                <Alert.Heading className="h6">Error</Alert.Heading>

                                {error}

                            </Alert>

                        )}



                        {success && (

                            <Alert variant="success">

                                <Alert.Heading className="h6">¡Post creado! 🎉</Alert.Heading>

                                Tu publicación ha sido creada exitosamente. Redirigiendo a tu perfil en 2 segundos...

                            </Alert>

                        )}



                        <Card className="shadow-sm">

                            <Card.Body className="p-4">

                                <Form onSubmit={handleSubmit}>

                                    {loggedInUser && (

                                        <div className="mb-4 p-3 bg-light rounded">

                                            <h6 className="text-muted mb-2">Publicando como:</h6>

                                            <div className="d-flex align-items-center">

                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"

                                                    style={{ width: '40px', height: '40px' }}>

                                                    {loggedInUser.nickName?.charAt(0).toUpperCase()}

                                                </div>

                                                <div>

                                                    <div className="fw-semibold">{loggedInUser.nickName}</div>

                                                    <small className="text-muted">{loggedInUser.email}</small>

                                                </div>

                                            </div>

                                        </div>

                                    )}



                                    <Form.Group className="mb-4">

                                        <Form.Label className="fw-semibold">Título de la publicación (opcional)</Form.Label>

                                        <Form.Control

                                            type="text"

                                            name="title"

                                            value={formData.title}

                                            onChange={handleInputChange}

                                            placeholder="Escribe un título llamativo..."

                                            size="lg"

                                            disabled={loading}

                                            className="border-2"

                                        />

                                        <Form.Text className="text-muted">

                                            Un buen título ayuda a captar la atención de los lectores

                                        </Form.Text>

                                    </Form.Group>



                                    <Form.Group className="mb-4">

                                        <Form.Label className="fw-semibold">Contenido de la publicación (obligatorio)</Form.Label>

                                        <Form.Control

                                            as="textarea"

                                            rows={6}

                                            name="description" // Cambiado a 'description'

                                            value={formData.description}

                                            onChange={handleInputChange}

                                            placeholder="¿Qué quieres compartir hoy? Escribe tu mensaje aquí..."

                                            required

                                            disabled={loading}

                                            className="border-2"

                                            style={{ resize: 'vertical' }}

                                        />

                                        <Form.Text className="text-muted">

                                            Caracteres: {formData.description.length}

                                        </Form.Text>

                                    </Form.Group>



                                    {/* NUEVO: Campos para URLs de imagen */}

                                    <Form.Group className="mb-4">

                                        <Form.Label className="fw-semibold d-flex align-items-center">

                                            URLs de imágenes (opcional)

                                            <Button

                                                variant="outline-primary"

                                                size="sm"

                                                className="ms-2"

                                                onClick={addImageUrlField}

                                                disabled={loading}

                                            >

                                                + Añadir URL

                                            </Button>

                                        </Form.Label>

                                        {formData.imageUrls.map((url, index) => (

                                            <div key={index} className="d-flex mb-2 align-items-center">

                                                <Form.Control

                                                    type="url" // Tipo url para validación básica

                                                    placeholder={`URL de imagen ${index + 1}`}

                                                    value={url}

                                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}

                                                    disabled={loading}

                                                    className="me-2"

                                                />

                                                {formData.imageUrls.length > 1 && ( // Solo mostrar botón si hay más de 1 campo

                                                    <Button

                                                        variant="outline-danger"

                                                        onClick={() => removeImageUrlField(index)}

                                                        disabled={loading}

                                                    >

                                                        &times;

                                                    </Button>

                                                )}

                                            </div>

                                        ))}

                                        <Form.Text className="text-muted">

                                            Introduce URLs directas a imágenes (ej. `.jpg`, `.png`, `.gif`).

                                        </Form.Text>

                                        {/* Previsualización de imágenes */}

                                        <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">

                                            {formData.imageUrls.map((url, index) =>

                                                url.trim() !== '' && (

                                                    <Card key={index} style={{ width: '150px' }} className="shadow-sm">

                                                        <Card.Img

                                                            src={url}

                                                            alt={`Previsualización ${index + 1}`}

                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; e.target.alt = 'Error al cargar imagen'; }}

                                                            style={{ height: '100px', objectFit: 'cover' }}

                                                            className="rounded-top"

                                                        />

                                                        <Card.Body className="p-2 text-center">

                                                            <small className="text-muted text-truncate d-block" style={{ fontSize: '0.75rem' }}>

                                                                {url.substring(0, 20)}...

                                                            </small>

                                                        </Card.Body>

                                                    </Card>

                                                )

                                            )}

                                        </div>

                                    </Form.Group>



                                    {/* Tags Seleccionados (sin cambios) */}

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



                                    {/* Selector de Tags (sin cambios) */}

                                    <Form.Group className="mb-4">

                                        <Form.Label className="fw-semibold">

                                            Seleccionar Tags

                                        </Form.Label>

                                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>

                                            <div className="d-flex flex-wrap gap-2">

                                                {availableTags.map(tag => (

                                                    <Badge

                                                        key={tag.id}

                                                        bg={formData.selectedTagIds.includes(tag.id) ? "primary" : "info"}

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

                                            Haz clic en los tags para seleccionar/deseleccionar.

                                        </Form.Text>

                                    </Form.Group>



                                    {/* Botones */}

                                    <div className="d-flex gap-3 justify-content-end">

                                        <Button

                                            variant="outline-secondary"

                                            onClick={() => navigate('/')} // Puedes redirigir a donde quieras al cancelar

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

                                                    <Spinner animation="border" size="sm" className="me-2" />

                                                    Creando post...

                                                </>

                                            ) : (

                                                <>

                                                    📝 Crear Post

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

                                            • Sé auténtico y genuino<br />

                                            • Usa tags relevantes<br />

                                            • Respeta a otros usuarios

                                        </small>

                                    </div>

                                    <div className="col-md-6">

                                        <small className="text-muted">

                                            • Evita contenido ofensivo<br />

                                            • Usa un lenguaje claro<br />

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