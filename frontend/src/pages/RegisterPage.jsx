import { useState } from "react";
import { useAuth } from "../auth/Auth";

export const RegisterPage = () => {
    const { isAuthenticated } = useAuth();

    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");

    //  Estados para manejar errores 
    const [localError, setLocalError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    //  Función al enviar el formulario de registro
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null); // Reseteamos mensajes
        setSuccessMessage(null);

        try {
        const response = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Enviamos los 3 campos que espera el backend
            body: JSON.stringify({ nombre, email, contraseña }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Capturamos el error del backend 
            let errorMessage = "Error al registrar el usuario.";
            if (data.error) {
            errorMessage = data.error;
            } else if (data.errors && Array.isArray(data.errors)) {
            // Para errores de express-validator
            errorMessage = data.errors.map((err) => err.msg).join(" ");
            }
            throw new Error(errorMessage);
        }

        // Éxito
        setSuccessMessage("¡Usuario registrado con éxito! Ahora puede iniciar sesión.");
        // Limpiamos campos
        setNombre("");
        setEmail("");
        setContraseña("");

        // Cerramos el modal después de 2 segundos
        setTimeout(() => {
            setOpen(false);
            setSuccessMessage(null);
        }, 2000);

        } catch (err) {
        // Capturamos cualquier error de red o del backend
        setLocalError(err.message);
        }
    };

    // Función para botón 'cancelar' del formulario
    const handleCancel = () => {
        setOpen(false);
        setLocalError(null);
        setSuccessMessage(null);
    };

    // Si el usuario YA está autenticado, no mostramos nada.
    // No tiene sentido registrarse si ya inició sesión.
    if (isAuthenticated) {
        return null;
    }

    return (
        <>
        {/* Usamos 'btn-outline-primary' para diferenciarlo del Login */}
        <button className="btn btn-outline-primary" onClick={() => setOpen(true)}>
            Registrarse
        </button>

        <div
            className={`modal fade ${open ? "show" : ""}`}
            style={{ display: open ? "block" : "none" }}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!open}
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                <h5 className="modal-title">Crear nueva cuenta</h5>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleCancel}
                ></button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                <div className="modal-body">
                    
                    {/* Alerta de Error Local */}
                    {localError && (
                    <div className="alert alert-danger" role="alert">
                        {localError}
                    </div>
                    )}

                    {/* Alerta de Éxito Local */}
                    {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                    )}

                    {/* Campo Usuario */}
                    <div className="mb-3">
                    <label htmlFor="register-nombre" className="form-label">
                        Usuario:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        id="register-nombre" // Usamos ID único
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoComplete="username"
                        required
                    />
                    </div>

                    {/* Campo Email */}
                    <div className="mb-3">
                    <label htmlFor="register-email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="register-email" // Usamos ID único
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="mb-3">
                    <label htmlFor="register-contraseña" className="form-label">
                        Contraseña:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        name="contraseña"
                        id="register-contraseña" // Usamos ID único
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    </div>
                    
                    <small className="form-text text-muted">
                    La contraseña debe tener 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.
                    </small>

                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    >
                    Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                    Crear Cuenta
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>

        {/* Backdrop */}
        {open && <div className="modal-backdrop fade show"></div>}
        </>
    );
};