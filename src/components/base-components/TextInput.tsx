import React from 'react';

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder = 'Enter your message...',
    disabled = false,
}) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '10px',
            }}
        />
    );
};

export default TextInput;

