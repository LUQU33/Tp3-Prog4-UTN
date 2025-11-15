export const Input = ({ 
    label, 
    type = "text", 
    name, 
    value, 
    onChange 
}) => {
    return (
        <div className="mb-3">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
            )}
            <input 
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="form-control"
            />
        </div>
    )
}