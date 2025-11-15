import { Button } from "../../components/ui/Button";

export const ListadoAlumnos = ({ 
    alumnos, 
    onEdit, 
    onDelete 
}) => {
    if (!alumnos || alumnos.length === 0){
        return <p className='text-center'>No hay Alumnos disponibles</p>
    }

    return (
        <div className='table-responsive'>
            <table className='table table-hover alig-middle'>
                <thead className='table-ligth'>
                    <tr>
                        <th>Nombre</th>
                        <th className='text-center'>Apellido</th>
                        <th className='text-center'>DNI</th>
                        <th className='text-center'>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {alumnos.map((a) => {
                        return (
                        <tr key={a.id}>
                            <td>{a.nombre}</td>
                            <td className='text-center'>{a.apellido}</td>
                            <td className='text-center'>{a.DNI}</td>
                            <td className='text-center'>
                                <div className='d-flex justify-content-center gap-2'>
                                    <Button variant="info" onClick={console.log('Viendo notas..')}>Ver Notas</Button>
                                    <Button variant="primary" onClick={() => onEdit(a.id)}>Editar</Button>
                                    <Button variant="danger" onClick={() => onDelete(a.id)}>Eliminar</Button>
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