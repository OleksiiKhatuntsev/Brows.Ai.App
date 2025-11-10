import React from 'react';

interface ErrorMessageProps {
    error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) {
        return null;
    }

    return (
        <div className='alert alert-danger mt-4' role='alert'>
            <strong>Error:</strong> {error}
        </div>
    );
};

export default ErrorMessage;
