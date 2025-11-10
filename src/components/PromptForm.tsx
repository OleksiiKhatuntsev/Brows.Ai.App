import React, { useEffect, useState } from 'react';
import ErrorMessage from './ErrorMessage';
import Message from './Message';

interface Prompt {
    id: string;
    title: string;
    body: string;
}

const PromptForm: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5271/Ai/GetAllPrompts'
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPrompts(data);
            } catch (err) {
                console.error('Failed to fetch prompts:', err);
                setError('Failed to load prompts from database');
            }
        };

        fetchPrompts();
    }, []);

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
                    body: JSON.stringify({ body: promptToSend.trim() }),
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
        <div className='row mt-4 w-100 g-3'>
            <div className='col-2'>
                <div
                    className='d-flex flex-column gap-2 p-2 overflow-auto'
                    style={{
                        border: '2px solid red',
                        maxHeight: '600px',
                    }}
                >
                    {prompts.map((promptItem) => (
                        <button
                            key={promptItem.id}
                            onClick={() => handleSendPrompt(promptItem.body)}
                            disabled={loading}
                            className='btn btn-secondary w-100'
                        >
                            {promptItem.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className='col-10'>
                <div
                    className='d-flex flex-column p-3'
                    style={{ border: '2px solid blue' }}
                >
                    <div className='mb-3'>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder='Enter your prompt...'
                            disabled={loading}
                            className='form-control'
                            rows={4}
                        />
                    </div>
                    <button
                        onClick={() => handleSendPrompt()}
                        disabled={loading}
                        className='btn btn-primary mb-3'
                    >
                        {loading ? 'Loading...' : 'Send Prompt'}
                    </button>
                    <ErrorMessage error={error} />
                    <Message result={result} />
                </div>
            </div>
        </div>
    );
};

export default PromptForm;
