import React from 'react';

interface PromptTitleProps {
    value: string;
    onChange: (value: string) => void;
}

const PromptTitle: React.FC<PromptTitleProps> = ({ value, onChange }) => {
    return (
        <div className='mb-3'>
            <label htmlFor='promptTitle' className='form-label fw-bold'>
                Prompt Title
            </label>
            <input
                id='promptTitle'
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Enter a title for your prompt...'
                className='form-control'
            />
        </div>
    );
};

export default PromptTitle;
