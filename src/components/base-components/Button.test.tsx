import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from './index';

describe('Button', () => {
    const mockOnClick = vi.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('renders button with default text', () => {
        render(<Button onClick={mockOnClick} loading={false} />);
        const button = screen.getByRole('button', { name: 'Get AI Data' });
        expect(button).toBeInTheDocument();
    });

    it('renders button with custom label when provided', () => {
        render(
            <Button
                onClick={mockOnClick}
                loading={false}
                label='Custom Label'
            />
        );
        const button = screen.getByRole('button', { name: 'Custom Label' });
        expect(button).toBeInTheDocument();
    });

    it('shows loading text when loading is true', () => {
        render(<Button onClick={mockOnClick} loading={true} />);
        const button = screen.getByRole('button', { name: 'Loading...' });
        expect(button).toBeInTheDocument();
    });

    it('is disabled when loading is true', () => {
        render(<Button onClick={mockOnClick} loading={true} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('is enabled when loading is false', () => {
        render(<Button onClick={mockOnClick} loading={false} />);
        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });
    it('does not call onClick when button is disabled (loading)', async () => {
        const user = userEvent.setup();
        render(<Button onClick={mockOnClick} loading={true} />);
        const button = screen.getByRole('button');

        await user.click(button);

        expect(mockOnClick).not.toHaveBeenCalled();
    });
});
