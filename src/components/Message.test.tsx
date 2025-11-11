import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from './Message';

// Mock react-markdown to avoid Jest ES module issues
jest.mock('react-markdown', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: string }) => <div>{children}</div>,
    };
});

describe('Message', () => {
    test('renders message when result prop is provided', () => {
        render(<Message result='This is a test response' />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
        expect(screen.getByText('This is a test response')).toBeInTheDocument();
    });

    test('does not render when result prop is empty string', () => {
        const { container } = render(<Message result='' />);
        expect(container.firstChild).toBeNull();
    });

    test('renders markdown formatted text', () => {
        const markdownText = '**Bold text** and *italic text*';
        render(<Message result={markdownText} />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
    });

    test('renders message container with correct structure', () => {
        const { container } = render(<Message result='Test message' />);
        const messageContainer = container.querySelector('.mt-4.w-100');
        expect(messageContainer).toBeInTheDocument();
        expect(messageContainer).toHaveClass('mt-4', 'w-100');

        const cardBody = container.querySelector('.card-body');
        expect(cardBody).toBeInTheDocument();
        expect(cardBody).toHaveStyle({ maxHeight: '600px', overflowY: 'auto' });
    });

    test('handles multiline text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3';
        render(<Message result={multilineText} />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
        expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });

    test('handles long messages', () => {
        const longMessage = 'A'.repeat(1000);
        render(<Message result={longMessage} />);
        expect(screen.getByText('Response:')).toBeInTheDocument();
        expect(screen.getByText(/A+/)).toBeInTheDocument();
    });

    test('renders markdown formatted content', () => {
        const headingText = '# Heading 1';
        render(<Message result={headingText} />);
        // The mocked ReactMarkdown will render the content
        expect(screen.getByText(headingText)).toBeInTheDocument();
    });

    test('renders list content', () => {
        const listText = '* Item 1\n* Item 2\n* Item 3';
        render(<Message result={listText} />);
        // The mocked ReactMarkdown will render the content
        expect(screen.getByText(/Item 1/)).toBeInTheDocument();
    });
});
