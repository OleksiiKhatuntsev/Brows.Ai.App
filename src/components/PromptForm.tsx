import React, { useState } from 'react';
import { usePrompts } from '../hooks/usePrompts';
import { usePromptSubmission } from '../hooks/usePromptSubmission';
import ErrorMessage from './ErrorMessage';
import Message from './Message';
import PromptBody from './PromptBody';
import PromptButton from './PromptButton';
import PromptTitle from './PromptTitle';

const PromptForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [selectedPromptId, setSelectedPromptId] = useState<string | null>(
        null
    );

    const { prompts, error: promptsError } = usePrompts();
    const {
        submitPrompt,
        result,
        loading,
        error: submissionError,
    } = usePromptSubmission();

    const handleSendPrompt = () => {
        submitPrompt(prompt);
    };

    const error = promptsError || submissionError;

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
                        <PromptButton
                            key={promptItem.id}
                            id={promptItem.id}
                            title={promptItem.title}
                            body={promptItem.body}
                            isSelected={selectedPromptId === promptItem.id}
                            onClick={(id, title, body) => {
                                setSelectedPromptId(id);
                                setTitle(title);
                                setPrompt(body);
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className='col-10'>
                <div
                    className='d-flex flex-column p-3'
                    style={{ border: '2px solid blue' }}
                >
                    <PromptTitle value={title} onChange={setTitle} />
                    <PromptBody
                        value={prompt}
                        onChange={setPrompt}
                        onClearSelection={() => setSelectedPromptId(null)}
                    />
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
