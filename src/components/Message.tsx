import React from 'react';

interface MessageProps {
    result: string;
}

const Message: React.FC<MessageProps> = ({ result }) => {
    if (!result) {
        return null;
    }

    return (
        <div style={{ marginTop: '20px', width: '100%' }}>
            <label
                htmlFor='custom-prompt-response'
                style={{
                    display: 'block',
                    textAlign: 'left',
                    marginBottom: '8px',
                }}
            >
                Response:
            </label>
            <textarea
                id='custom-prompt-response'
                value={result}
                readOnly
                style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                }}
            />
        </div>
    );
};

export default Message;
