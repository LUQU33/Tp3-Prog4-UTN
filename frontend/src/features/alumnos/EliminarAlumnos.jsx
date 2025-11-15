import { Button } from "../../components/ui/Button";

export const EliminarAlumno = ({
    alumno,
    onConfirmDelete,
    onClose
}) => {
    if (!alumno) {
        return (
            <div className="alert alert-danger" role="alert">
                Error: No se pudo cargar la informacion del alumno.
            </div>
        )
    }

    const handleDelete = () => {
        onConfirmDelete(alumno.id);
    }

    return (
        <div>
            <p>¿Estás seguro de que deseas eliminar el alumno <strong>{alumno.nombre}</strong>?</p>
            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="danger" onClick={handleDelete}>Sí, eliminar</Button>
            </div>
        </div>
    )
}