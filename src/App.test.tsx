import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CustomPromptRequest in App', () => {
    render(<App />);
    expect(
        screen.getByPlaceholderText('Enter your prompt...')
    ).toBeInTheDocument();
    expect(
        screen.getByRole('button', { name: 'Send Prompt' })
    ).toBeInTheDocument();
});
