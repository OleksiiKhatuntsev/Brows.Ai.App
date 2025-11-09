import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import Message from './Message';
import { Button, TextInput } from './base-components';

const PromptForm: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSendPrompt = async (promptText?: string) => {
        const promptToSend = promptText ?? prompt;

        if (!promptToSend.trim()) {
            setError('Please enter a prompt');
            return;
        }

        setLoading(true);
        setError('');
        setResult('');

        try {
            const response = await fetch(
                'http://localhost:5271/Ai/GetCustomResponse',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: promptToSend.trim() }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 5fr',
                width: '100%',
                marginTop: '20px',
                gap: '20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    border: '2px solid red',
                }}
            >
                <Button
                    onClick={() => handleSendPrompt('Hello')}
                    loading={loading}
                    label='Send Hello'
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    border: '2px solid blue',
                }}
            >
                <div style={{ marginRight: '20px' }}>
                    <TextInput
                        value={prompt}
                        onChange={setPrompt}
                        placeholder='Enter your prompt...'
                        disabled={loading}
                    />
                </div>
                <Button
                    onClick={() => handleSendPrompt()}
                    loading={loading}
                    label='Send Prompt'
                />
                <ErrorMessage error={error} />
                <Message result={result} />
            </div>
        </div>
    );
};

export default PromptForm;
