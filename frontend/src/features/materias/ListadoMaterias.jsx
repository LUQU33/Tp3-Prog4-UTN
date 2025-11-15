import { Button } from "../../components/ui/Button";

export const ListadoMaterias = ({ 
    materias,
    onEdit,
    onDelete
}) => {
    if (!materias || materias.length === 0){
        return <p className="text-center">No hay Materias disponibles</p>
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover alig-middle">
                <thead className="table-ligth">
                    <tr>
                        <th>Nombre</th>
                        <th className="text-center">Código</th>
                        <th className="text-center">Año</th>
                        <th className='text-center'>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {materias.map((m) => {
                        return (
                        <tr key={m.id}>
                            <td>{m.nombre}</td>
                            <td className="text-center">{m.codigo}</td>
                            <td className="text-center">{m.año}</td>
                            <td className='text-center'>
                                <div className='d-flex justify-content-center gap-2'>
                                    <Button variant="primary" onClick={() => onEdit(m.id)}>Editar</Button>
                                    <Button variant="danger" onClick={() => onDelete(m.id)}>Eliminar</Button>
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}