import { Outlet, Link } from 'react-router-dom';
import { Login } from '../../features/auth/Login.jsx';
import { Register } from '../../features/auth/Register.jsx';
import { useAuth } from '../../features/auth/Auth.jsx';

export const Layout = () => {
    const { isAuthenticated } = useAuth();
    
    return (
        <>
            {/* --- Barra de Navegación --- */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Gestión Escolar</Link>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* Links de navegación (a la izquierda) */}
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            
                            {/* Solo mostramos estos links si está autenticado */}
                            {isAuthenticated && (
                                <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/alumnos">Alumnos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/materias">Materias</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/notas">Notas</Link>
                                </li>
                                </>
                            )}
                        </ul>
                        
                        {/* Botones de Login/Registro */}
                        <div className="d-flex gap-2">
                            <Login />
                            <Register />
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Contenido de la Página --- */}
            <main className="container mt-4">
                {/* Outlet renderiza el componente de la ruta actual (Home, Alumnos, etc.) */}
                <Outlet /> 
            </main>
        </>
    )
}