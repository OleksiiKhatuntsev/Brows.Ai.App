import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
    test('renders error message when error prop is provided', () => {
        render(<ErrorMessage error='Something went wrong' />);
        expect(screen.getByText('Error:')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('does not render when error prop is empty string', () => {
        const { container } = render(<ErrorMessage error='' />);
        expect(container.firstChild).toBeNull();
    });

    test('applies correct styling', () => {
        const { container } = render(<ErrorMessage error='Test error' />);
        const errorDiv = container.querySelector('.alert.alert-danger');
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv).toHaveClass('alert', 'alert-danger', 'mt-4');
    });

    test('handles long error messages', () => {
        const longError =
            'This is a very long error message that should still be displayed correctly';
        render(<ErrorMessage error={longError} />);
        expect(screen.getByText('Error:')).toBeInTheDocument();
        expect(screen.getByText(longError)).toBeInTheDocument();
    });
});
