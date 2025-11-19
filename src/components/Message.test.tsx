import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Message from './Message';

// Mock react-markdown to avoid ES module issues
vi.mock('react-markdown', () => {
    return {
        default: ({ children }: { children: string }) => <div>{children}</div>,
    };
});

describe('Message', () => {
    it('renders message when result prop is provided', () => {
        render(<Message result='This is a test response' />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
        expect(screen.getByText('This is a test response')).toBeInTheDocument();
    });

    it('does not render when result prop is empty string', () => {
        const { container } = render(<Message result='' />);
        expect(container.firstChild).toBeNull();
    });

    it('renders markdown formatted text', () => {
        const markdownText = '**Bold text** and *italic text*';
        render(<Message result={markdownText} />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
    });

    it('renders message container with correct structure', () => {
        const { container } = render(<Message result='Test message' />);
        const messageContainer = container.querySelector('.mt-4.w-100');
        expect(messageContainer).toBeInTheDocument();
        expect(messageContainer).toHaveClass('mt-4', 'w-100');

        const cardBody = container.querySelector('.card-body');
        expect(cardBody).toBeInTheDocument();
        expect(cardBody).toHaveStyle({ maxHeight: '600px', overflowY: 'auto' });
    });

    it('handles multiline text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3';
        render(<Message result={multilineText} />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
        expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });

    it('handles long messages', () => {
        const longMessage = 'A'.repeat(1000);
        render(<Message result={longMessage} />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
        expect(screen.getByText(/A+/)).toBeInTheDocument();
    });
});
