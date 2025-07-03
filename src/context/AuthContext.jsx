import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false
});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error al parsear el usuario de localStorage:", error);
            return null;
        }
    });

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error("Error al guardar el usuario en localStorage:", error);
        }
    }, [user]);
    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const contextValue = {
        user,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};