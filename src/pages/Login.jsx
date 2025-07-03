import React, { useState, useContext } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Asume que tienes un contexto de autenticación

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Función para guardar el usuario en contexto/localStorage

    // Estado para los valores del formulario
    const [formData, setFormData] = useState({
        nickName: '',
        password: ''
    });

    // Estado para los errores de validación del frontend
    const [errors, setErrors] = useState({});

    // Estado para el mensaje general de estado del envío (éxito/error)
    const [submissionStatus, setSubmissionStatus] = useState({
        message: '',
        type: '' // 'success' o 'danger'
    });

    // Contraseña fija para validación local
    const FIXED_PASSWORD = "123456";

    // Maneja los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Limpia el error del campo actual cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validación del formulario en el frontend
    const validate = () => {
        const newErrors = {};

        if (!formData.nickName.trim()) {
            newErrors.nickName = 'El nombre de usuario es obligatorio.';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmissionStatus({ message: '', type: '' }); // Limpia el estado anterior

        if (!validate()) {
            setSubmissionStatus({
                message: 'Por favor, completa todos los campos requeridos.',
                type: 'danger'
            });
            return;
        }

        // Validación local de la contraseña
        if (formData.password !== FIXED_PASSWORD) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: 'Contraseña incorrecta.'
            }));
            setSubmissionStatus({
                message: 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.',
                type: 'danger'
            });
            return;
        }

        try {
            // Realiza un GET a /users para verificar si el usuario existe
            const response = await fetch(`http://localhost:3001/users?nickName=${encodeURIComponent(formData.nickName)}`);

            if (response.ok) {
                const users = await response.json();
                const user = users.find(u => u.nickName === formData.nickName);

                if (user) {
                    // Si el usuario existe y la contraseña es correcta, inicia sesión
                    login(user); // Guarda el usuario en el contexto y localStorage
                    setSubmissionStatus({
                        message: '¡Inicio de sesión exitoso! Redirigiendo a tu perfil...',
                        type: 'success'
                    });
                    setFormData({ nickName: '', password: '' }); // Limpiar el formulario
                    setErrors({}); // Limpiar errores

                    // Redirigir al perfil del usuario
                    setTimeout(() => {
                        navigate('/user'); // Redirige a la ruta del perfil del usuario
                    }, 1500); // Pequeño retraso para que el usuario vea el mensaje
                } else {
                    // Usuario no encontrado
                    setSubmissionStatus({
                        message: 'Nombre de usuario no encontrado. Por favor, regístrate.',
                        type: 'danger'
                    });
                }
            } else {
                // Errores del backend
                const errorData = await response.json();
                setSubmissionStatus({
                    message: errorData.message || 'Error al verificar el usuario. Intenta de nuevo más tarde.',
                    type: 'danger'
                });
            }
        } catch (error) {
            // Errores de red o inesperados
            console.error('Error de conexión o inesperado durante el login:', error);
            setSubmissionStatus({
                message: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.',
                type: 'danger'
            });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Card style={{ width: '25rem' }} className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>

                    {/* Mensajes de estado general del formulario */}
                    {submissionStatus.message && (
                        <Alert variant={submissionStatus.type} className="text-center">
                            {submissionStatus.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicNickName">
                            <Form.Label>tu_nickname_asombroso</Form.Label>
                            <Form.Control
                                type="text"
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre de usuario"
                                isInvalid={!!errors.nickName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nickName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>tu_supersecreta_contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingresa tu contraseña"
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Iniciar Sesión
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;