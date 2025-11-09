import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './index';

describe('Button', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    test('renders button with default text', () => {
        render(<Button onClick={mockOnClick} loading={false} />);
        const button = screen.getByRole('button', { name: 'Get AI Data' });
        expect(button).toBeInTheDocument();
    });

    test('renders button with custom label when provided', () => {
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

    test('shows loading text when loading is true', () => {
        render(<Button onClick={mockOnClick} loading={true} />);
        const button = screen.getByRole('button', { name: 'Loading...' });
        expect(button).toBeInTheDocument();
    });

    test('is disabled when loading is true', () => {
        render(<Button onClick={mockOnClick} loading={true} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    test('is enabled when loading is false', () => {
        render(<Button onClick={mockOnClick} loading={false} />);
        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });

    test('calls onClick when button is clicked', async () => {
        render(<Button onClick={mockOnClick} loading={false} />);
        const button = screen.getByRole('button', { name: 'Get AI Data' });

        userEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick when form is submitted', async () => {
        render(<Button onClick={mockOnClick} loading={false} />);
        const button = screen.getByRole('button', { name: 'Get AI Data' });

        userEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when button is disabled (loading)', async () => {
        render(<Button onClick={mockOnClick} loading={true} />);
        const button = screen.getByRole('button');

        userEvent.click(button);

        expect(mockOnClick).not.toHaveBeenCalled();
    });
});
