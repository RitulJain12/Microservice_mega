import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}
            <input
                className={`input-field ${error ? 'input-error-border' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="input-error">{error}</p>
            )}
        </div>
    );
};

export default Input;
