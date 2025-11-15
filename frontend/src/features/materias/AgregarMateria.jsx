import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const AgregarMateria = ({
    onConfirmAdd,
    onClose
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        año: 0
    });

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
        onConfirmAdd(dataToSend);
    };

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
                <Button type="submit" variant="primary">AgregarMateria</Button>
            </div>
        </form>
    )
}