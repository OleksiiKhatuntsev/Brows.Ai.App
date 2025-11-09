import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from './Message';

describe('Message', () => {
    test('renders message when result prop is provided', () => {
        render(<Message result='This is a test response' />);
        expect(screen.getByLabelText('Response:')).toBeInTheDocument();
        expect(screen.getByLabelText('Response:')).toHaveValue(
            'This is a test response'
        );
    });

    test('does not render when result prop is empty string', () => {
        const { container } = render(<Message result='' />);
        expect(container.firstChild).toBeNull();
    });

    test('textarea has correct attributes', () => {
        render(<Message result='Test message' />);
        const textarea = screen.getByLabelText('Response:');
        expect(textarea).toHaveAttribute('id', 'custom-prompt-response');
        expect(textarea).toHaveAttribute('readonly');
    });

    test('applies correct styling to textarea', () => {
        render(<Message result='Test message' />);
        const textarea = screen.getByLabelText('Response:');
        expect(textarea).toHaveStyle({
            width: '100%',
            minHeight: '150px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            resize: 'vertical',
        });
    });

    test('handles multiline text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3';
        render(<Message result={multilineText} />);
        expect(screen.getByLabelText('Response:')).toHaveValue(multilineText);
    });

    test('handles long messages', () => {
        const longMessage = 'A'.repeat(1000);
        render(<Message result={longMessage} />);
        expect(screen.getByLabelText('Response:')).toHaveValue(longMessage);
    });
});
