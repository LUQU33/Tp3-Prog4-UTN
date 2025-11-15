import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const EditarMateria = ({
    materia,
    onConfirmEdit,
    onClose
}) => {
    const [formData, setFormData] = useState({
        nombre: materia?.nombre || '',
        codigo: materia?.codigo || '',
        año: materia?.año || 0
    });

    // Actualizar formulario si la materia cambia
    useEffect(() => {
        if (materia) {
            setFormData({
                nombre: materia.nombre || '',
                codigo: materia.codigo || '',
                año: materia.año || 0
            });
        }
    }, [materia]);

    // Error
    if (!materia){
        return (
            <div className="alert alert-danger" role="alert">
                Error: No se pudo cargar la informacion de la materia.
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
            codigo: formData.codigo,
            año: formData.año
        };
        onConfirmEdit(materia.id, dataToSend);
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
                    label="Codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Año"
                    name="año"
                    value={formData.año}
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