import React from 'react';

interface ButtonProps {
    onClick: () => void;
    loading: boolean;
    label?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    loading,
    label = 'Get AI Data',
}) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
            <button
                type='submit'
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '20px',
                }}
            >
                {loading ? 'Loading...' : label}
            </button>
        </form>
    );
};

export default Button;

