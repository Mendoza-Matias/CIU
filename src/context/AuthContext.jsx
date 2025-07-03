import React, { createContext, useState, useEffect } from 'react';

// 1. Crea el Contexto
// Tendrá un valor por defecto que incluye el usuario, y las funciones login y logout
export const AuthContext = createContext({
    user: null, // El usuario actualmente logueado
    login: () => {}, // Función para iniciar sesión
    logout: () => {}, // Función para cerrar sesión
    isAuthenticated: false // Indica si hay un usuario autenticado
});

// 2. Crea el Proveedor del Contexto
// Este componente envolverá tu aplicación (o la parte que necesite autenticación)
// y manejará el estado de autenticación.
export const AuthProvider = ({ children }) => {
    // Estado para guardar la información del usuario
    // Intentamos cargar el usuario desde localStorage al inicio
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error al parsear el usuario de localStorage:", error);
            return null;
        }
    });

    // Efecto para sincronizar el estado 'user' con localStorage
    // Cada vez que 'user' cambie, actualizamos localStorage
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user'); // Si no hay usuario, limpiar localStorage
            }
        } catch (error) {
            console.error("Error al guardar el usuario en localStorage:", error);
        }
    }, [user]);

    // Función para iniciar sesión
    // Recibe los datos del usuario (que vienen del backend tras la verificación)
    const login = (userData) => {
        setUser(userData);
        // El useEffect se encargará de guardarlo en localStorage
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        // El useEffect se encargará de removerlo de localStorage
    };

    // Objeto que será el "valor" del contexto y estará disponible para los consumidores
    const contextValue = {
        user,
        login,
        logout,
        isAuthenticated: !!user // true si user no es null, false si es null
    };

    return (
        // El AuthContext.Provider hace que 'contextValue' esté disponible para todos sus hijos
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};