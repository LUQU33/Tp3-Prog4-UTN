export const ListadoMaterias = ({ materias }) => {
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
                    </tr>
                </thead>

                <tbody>
                    {materias.map((m) => {
                        return (
                        <tr key={m.id}>
                            <td>{m.nombre}</td>
                            <td className="text-center">{m.codigo}</td>
                            <td className="text-center">{m.año}</td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}