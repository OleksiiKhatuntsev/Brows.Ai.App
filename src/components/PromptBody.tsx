import React from 'react';

interface PromptBodyProps {
    value: string;
    onChange: (value: string) => void;
    onClearSelection?: () => void;
}

const PromptBody: React.FC<PromptBodyProps> = ({
    value,
    onChange,
    onClearSelection,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        if (onClearSelection) {
            onClearSelection();
        }
    };

    return (
        <div className='mb-3'>
            <label htmlFor='promptBody' className='form-label fw-bold'>
                Prompt Body
            </label>
            <textarea
                id='promptBody'
                value={value}
                onChange={handleChange}
                placeholder='Enter your prompt...'
                className='form-control'
                rows={4}
            />
        </div>
    );
};

export default PromptBody;

