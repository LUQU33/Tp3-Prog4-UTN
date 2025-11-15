import { useState, useEffect } from "react";
import { ListadoMaterias } from "./ListadoMaterias";
import { useAuth } from "../auth/Auth";

export const Materias = () => {
    const { fetchAuth } = useAuth();
    const [materias, setMaterias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMaterias = async () => {
            try {
                setError(null);
                const response = await fetchAuth('http://localhost:3000/materias');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'No se pudieron obtener los materias');
                }
                
                setMaterias(data.materias);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        getMaterias();
    }, [fetchAuth]);

    return (
        <div className="container py-4">
            <div className="text-center mb-3">
                <h2>Listado de Materias</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <ListadoMaterias 
                    materias={materias}
                />
            </div>
        </div>
    );
};