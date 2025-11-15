import { useState } from "react";
import { useAuth } from "./Auth";
import { VentanaModalBase } from "../../components/ui/BaseVentanaModal";

export const Login = () => {
    // Obtenemos todo lo necesario del contexto de autenticacion
    const { error, login, isAuthenticated, logout, username } = useAuth();

    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [contraseña, setContraseña] = useState('');

    // Funcion al enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(nombre, contraseña);

        // En caso de que el login sea exitoso
        if (result.success){
            setOpen(false); // Cerramos modal
            // Limpiamos datos 
            setNombre('');
            setContraseña('');
        }
    };

    // Funcion para boton 'cancelar' del formulario
    const handleCancel = () => {
        setOpen(false);
    };

    // Para el usuario AUTENTICADO (inicio sesion)
    if (isAuthenticated) {
        return (
            <div className="d-flex align-items-center gap-2">
                <span className="navbar-text me-2">
                    Bienvenido, <strong>{username}</strong>
                </span>
                <button onClick={logout} className="btn btn-secondary btn-sm">
                    Salir
                </button>
            </div>
        );
    }

    // Para el usuario NO AUTENTICADO (no inicio sesion)
    return (
        <>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Ingresar
        </button>

        <VentanaModalBase
            show={open}
            onHide={handleCancel}
            title="Ingrese usuario y contraseña"
        >
            {/* Formulario (dentro del Body del Modal) */}
            <form onSubmit={handleSubmit}>
                <div className="modal-body">
                    {/* Alerta de Error de Bootstrap */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Campo Usuario */}
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">
                            Usuario:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="mb-3">
                        <label htmlFor="contraseña" className="form-label">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="contraseña"
                            id="contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                </div>
                
                {/* Footer del Modal (Botones) */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Ingresar</button>
                </div>
            </form>
        </VentanaModalBase>
        </>
    );
}