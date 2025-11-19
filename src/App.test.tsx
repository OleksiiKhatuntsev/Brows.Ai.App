import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

// Mock react-markdown to avoid Vitest ES module issues
vi.mock('react-markdown', () => {
    return {
        default: ({ children }: { children: string }) => <div>{children}</div>,
    };
});

describe('App', () => {
    it('renders PromptForm component', () => {
        render(<App />);
        expect(
            screen.getByPlaceholderText('Enter your prompt...')
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Send Prompt' })
        ).toBeInTheDocument();
    });
});
