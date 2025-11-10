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
        <div style={{ marginTop: '20px', width: '100%' }}>
            <label
                style={{
                    display: 'block',
                    textAlign: 'left',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                }}
            >
                Response:
            </label>
            <div
                style={{
                    width: '100%',
                    padding: '20px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    color: '#333',
                    textAlign: 'left',
                }}
            >
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => (
                            <h1
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    marginBottom: '12px',
                                    marginTop: '16px',
                                    color: '#222',
                                }}
                                {...props}
                            />
                        ),
                        h2: ({ node, ...props }) => (
                            <h2
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    marginTop: '14px',
                                    color: '#222',
                                }}
                                {...props}
                            />
                        ),
                        h3: ({ node, ...props }) => (
                            <h3
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    marginTop: '12px',
                                    color: '#222',
                                }}
                                {...props}
                            />
                        ),
                        p: ({ node, ...props }) => (
                            <p
                                style={{ marginBottom: '12px', color: '#333' }}
                                {...props}
                            />
                        ),
                        ul: ({ node, ...props }) => (
                            <ul
                                style={{
                                    marginLeft: '20px',
                                    marginBottom: '12px',
                                    listStyleType: 'disc',
                                    color: '#333',
                                }}
                                {...props}
                            />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol
                                style={{
                                    marginLeft: '20px',
                                    marginBottom: '12px',
                                    color: '#333',
                                }}
                                {...props}
                            />
                        ),
                        li: ({ node, ...props }) => (
                            <li
                                style={{ marginBottom: '6px', color: '#333' }}
                                {...props}
                            />
                        ),
                        strong: ({ node, ...props }) => (
                            <strong
                                style={{ fontWeight: 'bold', color: '#222' }}
                                {...props}
                            />
                        ),
                        em: ({ node, ...props }) => (
                            <em
                                style={{ fontStyle: 'italic', color: '#333' }}
                                {...props}
                            />
                        ),
                        code: ({ node, ...props }) => (
                            <code
                                style={{
                                    backgroundColor: '#e8e8e8',
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    fontSize: '14px',
                                    color: '#d63384',
                                }}
                                {...props}
                            />
                        ),
                    }}
                >
                    {result}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default Message;
