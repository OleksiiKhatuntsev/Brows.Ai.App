import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
    result: string;
}

const Message: React.FC<MessageProps> = ({ result }) => {
    if (!result) {
        return null;
    }

    return (
        <div className='mt-4 w-100'>
            <label className='d-block text-start mb-2 fw-bold fs-5'>
                Response:
            </label>
            <div className='card'>
                <div
                    className='card-body bg-light text-dark'
                    style={{ maxHeight: '600px', overflowY: 'auto' }}
                >
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => (
                                <h1
                                    className='h4 fw-bold mb-3 mt-3 text-dark'
                                    {...props}
                                />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2
                                    className='h5 fw-bold mb-2 mt-3 text-dark'
                                    {...props}
                                />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3
                                    className='h6 fw-bold mb-2 mt-2 text-dark'
                                    {...props}
                                />
                            ),
                            p: ({ node, ...props }) => (
                                <p className='mb-3 text-secondary' {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className='ms-4 mb-3' {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className='ms-4 mb-3' {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li className='mb-2' {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong
                                    className='fw-bold text-dark'
                                    {...props}
                                />
                            ),
                            em: ({ node, ...props }) => (
                                <em className='fst-italic' {...props} />
                            ),
                            code: ({ node, ...props }) => (
                                <code
                                    className='bg-light border rounded px-2 py-1 text-danger'
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {result}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default Message;
