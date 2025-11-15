import { useState, useEffect } from "react";
import { ListadoAlumnos } from "./ListadoAlumnos";
import { useAuth } from "../auth/Auth";
// Componentes
import { Button } from "../../components/ui/Button";

// Para ventana modal
import { EditarAlumno } from "./EditarAlumnos";
import { EliminarAlumno } from "./EliminarAlumnos";
import { BaseVentanaModal } from "../../components/ui/BaseVentanaModal";
import { AgregarAlumno } from "./AgregarAlumno";

export const Alumnos = () => {
    const { fetchAuth } = useAuth();
    const [alumnos, setAlumnos] = useState([]);
    const [error, setError] = useState(null);

    // Estados para controlar ventana modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentAlumnoId, setCurrentAlumnoId] = useState(null);

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

    useEffect(() => {
        getAlumnos();
    }, [fetchAuth]);

    // Funciones de control de modal
    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
        setCurrentAlumnoId(null);
    }

    const handleEdit = (id) => {
        setCurrentAlumnoId(id);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setCurrentAlumnoId(id);
        setModalType('delete');
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentAlumnoId(null);
        setModalType('add');
        setShowModal(true);
    };

    // handles de confirmacion
    const handleConfirmEdit = async (id, updatedAlumno) => {
        try {
            const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAlumno),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el alumno')
            }
            await response.json();
            await getAlumnos(); // Recargamos los alumnos
            handleCloseModal();
        } catch(error) {
            console.error('Error en la actualizacion: ', error)
        }
    };

    const handleConfirmDelete = async (id) => {
        try {
            const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el alumno')
            }
            await response.json();
            await getAlumnos(); // Recargamos los alumnos
            handleCloseModal();
        } catch(error) {
            console.error('Error en la eliminacion: ', error)
        }
    };

    const handleConfirmAdd = async (newAlumno) => {
        try {
            const response = await fetchAuth('http://localhost:3000/alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAlumno),
            });
            if (!response.ok) {
                throw new Error('Error al agregar el alumno');
            }
            await response.json();
            await getAlumnos(); // Recargamos los alumnos
            handleCloseModal();
        } catch (error) {
            console.error("Error en la creación:", error);
        }
    };

    // Funcion de renderizado para ventana modal
    const renderModalContent = () => {
        const alumno = currentAlumnoId ? alumnos.find(a => a.id === currentAlumnoId) : null;

        switch(modalType){
            case 'edit':
                return {
                    title: 'Editar Alumno',
                    body: <EditarAlumno alumno={alumno} onConfirmEdit={handleConfirmEdit} onClose={handleCloseModal}/>,
                };
            case 'delete':
                return {
                    title: 'Eliminar Alumno',
                    body: <EliminarAlumno alumno={alumno} onConfirmDelete={handleConfirmDelete} onClose={handleCloseModal}/>,
                };
            case 'add':
                return {
                    title: 'Agregar Alumno',
                    body: <AgregarAlumno onConfirmAdd={handleConfirmAdd} onClose={handleCloseModal}/>
                };
            default:
                return { title: '', body: null};    
        }
    };

    const { title: modalTitle, body: modalBody } = renderModalContent();

    return (
        <div className="container py-4">
            <div className="text-center mb-3">
                <h2>Listado de Alumnos</h2>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>

            <div>
                <Button className='btn btn-success mt-2' onClick={handleAdd}>
                    + Nuevo Alumno
                </Button>
            </div>

            <ListadoAlumnos 
            alumnos={alumnos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />

            <BaseVentanaModal
            show={showModal}
            onHide={handleCloseModal}
            title={modalTitle}
            >
            {modalBody}
            </BaseVentanaModal>
        </div>
    );
};