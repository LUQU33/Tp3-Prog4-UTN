export const ListadoAlumnos = ({ alumnos }) => {
    if (!alumnos || alumnos.length === 0){
        return <p className="text-center">No hay Alumnos disponibles</p>
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover alig-middle">
                <thead className="table-ligth">
                    <tr>
                        <th>Nombre</th>
                        <th className="text-center">Apellido</th>
                        <th className="text-center">DNI</th>
                    </tr>
                </thead>

                <tbody>
                    {alumnos.map((a) => {
                        return (
                        <tr key={a.id}>
                            <td className="text-center">{a.nombre}</td>
                            <td className="text-center">{a.apellido}</td>
                            <td className="text-center">{a.DNI}</td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}