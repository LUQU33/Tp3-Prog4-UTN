export const Button = ({
    children, 
    variant = 'primary', 
    type = 'button',
    onClick,
    width = '100'
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} w-${width}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}