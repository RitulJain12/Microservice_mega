import React from 'react';
import { cn } from '../utils/cn';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'btn btn-primary',
        secondary: 'btn btn-secondary',
        ghost: 'btn btn-ghost',
    };

    return (
        <button
            className={cn(variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
