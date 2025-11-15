import { Button } from './Button';

export const BaseVentanaModal = ({ 
    show, 
    onHide, 
    title, 
    children 
}) => {
    // Controlamos visibilidad
    const claseModal = `modal fade ${show ? 'show d-block' : ''}`;

    // Forzamos que el modal aparezca siempre al frente
    const estiloModal = { zIndex: 1050 };

    if (!show){
        return null;
    }

    return (
        <>
            <div className='modal-backdrop fade show'></div>

            <div
            className={claseModal}
            tabIndex='-1'
            role='dialog'
            aria-labelledby='modalTitle'
            aria-modal='true'
            style={{...estiloModal, display: 'block'}}
            >
                <div className='modal-dialog modal-dialog-centered' role='document'>
                    <div className='modal-content'>
                        {/* Header */}
                        <div className='modal-header'>
                            <h5 className='modal-title' id='modalTitle'>
                                {title}
                            </h5>
                            <Button 
                                variant='close'
                                onClick={onHide}
                                width='10'
                            />
                        </div>
                        
                        {/* Contenido inyectado (puede incluir body y footer) */}
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}