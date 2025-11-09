import React from 'react';

interface ErrorMessageProps {
    error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) {
        return null;
    }

    return (
        <div style={{ color: 'red', marginTop: '20px' }}>Error: {error}</div>
    );
};

export default ErrorMessage;
