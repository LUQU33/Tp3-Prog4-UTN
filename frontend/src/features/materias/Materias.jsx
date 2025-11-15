import { useState, useEffect } from "react";
import { ListadoMaterias } from "./ListadoMaterias";
import { useAuth } from "../auth/Auth";

// Componentes
import { Button } from "../../components/ui/Button";

//Para ventana modal
import { EditarMateria } from "./EditarMateria";
import { EliminarMateria } from "./EliminarMateria";
import { BaseVentanaModal } from "../../components/ui/BaseVentanaModal";
import { AgregarMateria } from "./AgregarMateria";


export const Materias = () => {
    const { fetchAuth } = useAuth();
    const [materias, setMaterias] = useState([]);
    const [error, setError] = useState(null);

    // Estados para controlar ventana modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentMateriaId, setCurrentMateriaId] = useState(null);

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

    useEffect(() => {
        getMaterias();
    }, [fetchAuth]);

    // Funciones de control de modal
    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
        setCurrentMateriaId(null);
    }

    const handleEdit = (id) => {
        setCurrentMateriaId(id);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setCurrentMateriaId(id);
        setModalType('delete');
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentMateriaId(null);
        setModalType('add');
        setShowModal(true);
    };

    // handles de confirmacion
    const handleConfirmEdit = async (id, updatedMateria) => {
        try {
            const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMateria),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar materia')
            }
            await response.json();
            await getMaterias(); // Recargamos las materias
            handleCloseModal();
        } catch(error) {
            console.error('Error en la actualizacion: ', error)
        }
    };

    const handleConfirmDelete = async (id) => {
        try {
            const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar materia')
            }
            await response.json();
            await getMaterias(); // Recargamos las materias
            handleCloseModal();
        } catch(error) {
            console.error('Error en la eliminacion: ', error)
        }
    };

    const handleConfirmAdd = async (newMateria) => {
        try {
            const response = await fetchAuth('http://localhost:3000/materias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMateria),
            });
            if (!response.ok) {
                throw new Error('Error al agregar materia');
            }
            await response.json();
            await getMaterias(); // Recargamos las materias
            handleCloseModal();
        } catch (error) {
            console.error("Error en la creación:", error);
        }
    };

    // Funcion de renderizado para ventana modal
    const renderModalContent = () => {
        const materia = currentMateriaId ? materias.find(m => m.id === currentMateriaId) : null;

        switch(modalType){
            case 'edit':
                return {
                    title: 'Editar Materia',
                    body: <EditarMateria materia={materia} onConfirmEdit={handleConfirmEdit} onClose={handleCloseModal}/>,
                };
            case 'delete':
                return {
                    title: 'Eliminar Materia',
                    body: <EliminarMateria materia={materia} onConfirmDelete={handleConfirmDelete} onClose={handleCloseModal}/>,
                };
            case 'add':
                return {
                    title: 'Agregar Materia',
                    body: <AgregarMateria onConfirmAdd={handleConfirmAdd} onClose={handleCloseModal}/>
                };
            default:
                return { title: '', body: null};  
        }
    };

    const { title: modalTitle, body: modalBody } = renderModalContent();

    return (
        <div className="container py-4">
            <div className="text-center mb-3">
                <h2>Listado de Materias</h2>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>

            <div>
                <Button className='btn btn-success mt-2' onClick={handleAdd}>
                    + Nueva Materia
                </Button>
            </div>

            <ListadoMaterias 
            materias={materias}
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