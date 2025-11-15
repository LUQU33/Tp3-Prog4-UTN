import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const EditarAlumno = ({
    alumno,
    onConfirmEdit,
    onClose
}) => {
    const [formData, setFormData] = useState({
        nombre: alumno?.nombre || '',
        apellido: alumno?.apellido || '',
        dni: alumno?.DNI || ''
    });

    // Actualizar formulario si el alumno cambia
    useEffect(() => {
        if (alumno) {
            setFormData({
                nombre: alumno.nombre || '',
                apellido: alumno.apellido || '',
                dni: alumno.DNI || ''
            });
        }
    }, [alumno]);

    // Error
    if (!alumno){
        return (
            <div className="alert alert-danger" role="alert">
                Error: No se pudo cargar la informacion del alumno.
            </div>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Preparar datos para enviar a la API
        const dataToSend = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            dni: formData.dni
        };
        onConfirmEdit(alumno.id, dataToSend);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-body">
                <Input
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="modal-footer">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="primary">Guardar Cambios</Button>
            </div>
        </form>
    )
}