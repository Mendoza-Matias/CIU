import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Registrarse() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nickName: '',
        email: ''
    });
    const [errors, setErrors] = useState({});

    const [submissionStatus, setSubmissionStatus] = useState({
        message: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const validate = () => {
        const newErrors = {};

        if (!formData.nickName.trim()) {
            newErrors.nickName = 'El nombre de usuario es obligatorio.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Por favor, introduce un formato de email válido.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus({ message: '', type: '' });
        if (!validate()) {
            setSubmissionStatus({
                message: 'Por favor, corrige los errores en el formulario.',
                type: 'danger'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus({
                    message: '¡Bienvenido! Te has registrado exitosamente. Redirigiendo al login...',
                    type: 'success'
                });
                setFormData({ nickName: '', email: '' });
                setTimeout(() => {
                    navigate('/inicioSesion');
                }, 3000);
            } else {
                const errorData = await response.json();
                setSubmissionStatus({
                    message: errorData.message || 'Error al registrar el usuario. Intenta con otro nombre de usuario o email.',
                    type: 'danger'
                });
            }
        } catch (error) {
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
                                isInvalid={!!errors.nickName}
                            />
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