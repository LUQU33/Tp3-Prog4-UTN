
import { createContext, useContext, useState } from "react";

// Contexto para compartir el estado de autenticacion
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto de auth
export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [error, setError] = useState(null);

    // Intentamos iniciar sesion y almacenar el token y nombre de usuario
    const login = async (nombre, contraseña) => {
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, contraseña }),
            });

            const session = await response.json();

            if (!response.ok && response.status === 400){
                throw new Error(session.error || 'Error de credenciales')
            }

            setToken(session.token);
            setUsername(session.username);
            return { success: true }
        } catch(error) {
            setError(error.message);
            return {success: false}
        }
    };

    // Cerramos sesion eliminando el token y nombre de usuario
    const logout = () => {
        setToken(null);
        setUsername(null);
        setError(null);
    };

    // Wrapper de fetch que inyecta automaticamente el token JWT
    const fetchAuth = async (url, options = {}) => {
        if (!token) {
            throw new Error('No hay sesión. Primero debe iniciar sesión.');
        }
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                // Inyectamos el token en el formato 'Bearer <token>' para el middleware de Passport
                Authorization: `Bearer ${token}`
            },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                error,
                // Propiedad para saber si el usuario esta logeado
                isAuthenticated: !!token,
                login,
                logout,
                fetchAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Componente para proteger vistas (muestra mensaje si el usuario no esta logeado)
export const AuthPage = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Acceso Restringido</h4>
                    <p>Debe iniciar sesión para poder ver esta página.</p>
                </div>
            </div>
        );
    }

    return children;
}

