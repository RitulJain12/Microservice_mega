import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
    return (
        <div
            className={`${hover ? 'glass-card-hover' : 'glass-card'} p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
