import { Button } from "../../components/ui/Button";

export const EliminarMateria = ({
    materia,
    onConfirmDelete,
    onClose
}) => {
    if (!materia) {
        return (
            <div className="alert alert-danger" role="alert">
                Error: No se pudo cargar la informacion de la materia.
            </div>
        )
    }

    const handleDelete = () => {
        onConfirmDelete(materia.id);
    }

    return (
        <div>
            <p>¿Estás seguro de que deseas eliminar la materia <strong>{materia.nombre}</strong>?</p>
            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="danger" onClick={handleDelete}>Sí, eliminar</Button>
            </div>
        </div>
    )
}