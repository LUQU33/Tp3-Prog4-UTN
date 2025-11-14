import { useState, useEffect } from "react";
import { ListadoAlumnos } from "./ListadoAlumnos";
import { useAuth } from "../auth/Auth";

export const Alumnos = () => {
    const { fetchAuth } = useAuth();
    const [alumnos, setAlumnos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAlumnos = async () => {
            try {
                setError(null);
                const response = await fetchAuth('http://localhost:3000/alumnos');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'No se pudieron obtener los alumnos');
                }
                
                setAlumnos(data.alumnos);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        getAlumnos();
    }, [fetchAuth]);

    return (
        <div className="container py-4">
            <div className="text-center mb-3">
                <h2>Listado de Alumnos</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <ListadoAlumnos 
                    alumnos={alumnos}
                />
            </div>
        </div>
    );
};