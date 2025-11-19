import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptButton from './PromptButton';

describe('PromptButton', () => {
    const mockOnClick = vi.fn();
    const defaultProps = {
        id: 'test-id-123',
        title: 'Test Prompt Title',
        body: 'Test prompt body content',
        isSelected: false,
        onClick: mockOnClick,
    };

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('renders button with correct title', () => {
        render(<PromptButton {...defaultProps} />);

        const button = screen.getByRole('button', { name: 'Test Prompt Title' });
        expect(button).toBeInTheDocument();
    });

    it('applies unselected styling when isSelected is false', () => {
        render(<PromptButton {...defaultProps} isSelected={false} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn', 'w-100', 'btn-secondary');
        expect(button).not.toHaveClass('btn-primary');
    });

    it('applies selected styling when isSelected is true', () => {
        render(<PromptButton {...defaultProps} isSelected={true} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn', 'w-100', 'btn-primary');
        expect(button).not.toHaveClass('btn-secondary');
    });

    it('calls onClick with correct parameters when clicked', async () => {
        render(<PromptButton {...defaultProps} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith(
            'test-id-123',
            'Test Prompt Title',
            'Test prompt body content'
        );
    });

    it('handles multiple clicks', async () => {
        render(<PromptButton {...defaultProps} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);
        await userEvent.click(button);
        await userEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('applies full width styling', () => {
        render(<PromptButton {...defaultProps} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-100');
    });

    it('renders with different titles', () => {
        const { rerender } = render(
            <PromptButton {...defaultProps} title='First Title' />
        );

        expect(screen.getByText('First Title')).toBeInTheDocument();

        rerender(
            <PromptButton {...defaultProps} title='Second Title' />
        );

        expect(screen.getByText('Second Title')).toBeInTheDocument();
        expect(screen.queryByText('First Title')).not.toBeInTheDocument();
    });

    it('toggles selected state correctly', () => {
        const { rerender } = render(
            <PromptButton {...defaultProps} isSelected={false} />
        );

        let button = screen.getByRole('button');
        expect(button).toHaveClass('btn-secondary');

        rerender(
            <PromptButton {...defaultProps} isSelected={true} />
        );

        button = screen.getByRole('button');
        expect(button).toHaveClass('btn-primary');
    });

    it('passes all parameters correctly to onClick', async () => {
        const customProps = {
            id: 'custom-id-456',
            title: 'Custom Title',
            body: 'Custom body with special characters: @#$%',
            isSelected: true,
            onClick: mockOnClick,
        };

        render(<PromptButton {...customProps} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledWith(
            'custom-id-456',
            'Custom Title',
            'Custom body with special characters: @#$%'
        );
    });

    it('handles empty strings in props', async () => {
        const emptyProps = {
            id: '',
            title: '',
            body: '',
            isSelected: false,
            onClick: mockOnClick,
        };

        render(<PromptButton {...emptyProps} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledWith('', '', '');
    });

    it('handles long title text', () => {
        const longTitle = 'A'.repeat(100);
        render(<PromptButton {...defaultProps} title={longTitle} />);

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(longTitle);
    });
});

