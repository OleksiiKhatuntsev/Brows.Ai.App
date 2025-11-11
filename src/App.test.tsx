import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-markdown to avoid Jest ES module issues
jest.mock('react-markdown', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: string }) => <div>{children}</div>,
    };
});

test('renders CustomPromptRequest in App', () => {
    render(<App />);
    expect(
        screen.getByPlaceholderText('Enter your prompt...')
    ).toBeInTheDocument();
    expect(
        screen.getByRole('button', { name: 'Send Prompt' })
    ).toBeInTheDocument();
});
