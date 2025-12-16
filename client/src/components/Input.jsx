import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Input;
