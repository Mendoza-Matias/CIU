import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Para la redirección

function Registrarse() {
    const navigate = useNavigate();

    // Estado para los valores del formulario
    const [formData, setFormData] = useState({
        nickName: '',
        email: ''
    });

    // Estado para los errores de validación del frontend
    const [errors, setErrors] = useState({});

    // Estado para el mensaje general de estado del envío (éxito/error)
    const [submissionStatus, setSubmissionStatus] = useState({
        message: '',
        type: '' // 'success' o 'danger'
    });

    // Maneja los cambios en los inputs del formulario
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

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // Regex simple para email
            newErrors.email = 'Por favor, introduce un formato de email válido.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        setSubmissionStatus({ message: '', type: '' }); // Limpia el estado anterior

        if (!validate()) {
            setSubmissionStatus({
                message: 'Por favor, corrige los errores en el formulario.',
                type: 'danger'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/users', { // URL del endpoint POST /users
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Registro exitoso
                setSubmissionStatus({
                    message: '¡Bienvenido! Te has registrado exitosamente. Redirigiendo al login...',
                    type: 'success'
                });
                setFormData({ nickName: '', email: '' }); // Limpiar el formulario

                // Redirigir al login después de un breve retraso
                setTimeout(() => {
                    navigate('/inicioSesion'); // Asume que tu ruta de login es '/login'
                }, 3000); // Redirige después de 3 segundos
            } else {
                // Errores del backend (ej. nickName o email ya existen)
                const errorData = await response.json();
                setSubmissionStatus({
                    message: errorData.message || 'Error al registrar el usuario. Intenta con otro nombre de usuario o email.',
                    type: 'danger'
                });
            }
        } catch (error) {
            // Errores de red o inesperados
            console.error('Error de conexión o inesperado:', error);
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
                    <h2 className="text-center mb-4">Registrarse</h2>

                    {/* Mensajes de estado general del formulario */}
                    {submissionStatus.message && (
                        <Alert variant={submissionStatus.type} className="text-center">
                            {submissionStatus.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicNickName">
                            <Form.Label>Escribí tu nickName asombroso</Form.Label>
                            <Form.Control
                                type="text"
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                                placeholder="tu_nick_asombroso"
                                // 'isInvalid' se activa si hay un error para este campo
                                isInvalid={!!errors.nickName}
                            />
                            {/* Feedback de error bajo el campo */}
                            <Form.Control.Feedback type="invalid">
                                {errors.nickName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Escribí tu mail :)</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ejemplo@dominio.com"
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Registrarse
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Registrarse;