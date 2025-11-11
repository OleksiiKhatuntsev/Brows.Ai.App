import React from 'react';

interface PromptButtonProps {
    id: string;
    title: string;
    body: string;
    isSelected: boolean;
    onClick: (id: string, title: string, body: string) => void;
}

const PromptButton: React.FC<PromptButtonProps> = ({
    id,
    title,
    body,
    isSelected,
    onClick,
}) => {
    return (
        <button
            onClick={() => onClick(id, title, body)}
            className={`btn w-100 ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
        >
            {title}
        </button>
    );
};

export default PromptButton;

