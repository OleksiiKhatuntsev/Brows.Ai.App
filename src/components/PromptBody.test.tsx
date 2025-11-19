import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptBody from './PromptBody';

describe('PromptBody', () => {
    const mockOnChange = vi.fn();
    const mockOnClearSelection = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
        mockOnClearSelection.mockClear();
    });

    it('renders textarea with label and placeholder', () => {
        render(
            <PromptBody value='' onChange={mockOnChange} />
        );

        const label = screen.getByText('Prompt Body');
        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('form-label', 'fw-bold');

        const textarea = screen.getByPlaceholderText('Enter your prompt...');
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveAttribute('id', 'promptBody');
    });

    it('displays the provided value', () => {
        const testValue = 'Test prompt text';
        render(
            <PromptBody value={testValue} onChange={mockOnChange} />
        );

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue(testValue);
    });

    it('calls onChange when text is entered', async () => {
        render(
            <PromptBody value='' onChange={mockOnChange} />
        );

        const textarea = screen.getByRole('textbox');
        await userEvent.type(textarea, 'New text');

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls onChange with correct value', async () => {
        render(
            <PromptBody value='' onChange={mockOnChange} />
        );

        const textarea = screen.getByRole('textbox');
        await userEvent.type(textarea, 'A');

        expect(mockOnChange).toHaveBeenCalledWith('A');
    });

    it('calls onClearSelection when text changes and callback is provided', async () => {
        render(
            <PromptBody
                value=''
                onChange={mockOnChange}
                onClearSelection={mockOnClearSelection}
            />
        );

        const textarea = screen.getByRole('textbox');
        await userEvent.type(textarea, 'X');

        expect(mockOnClearSelection).toHaveBeenCalled();
    });

    it('does not crash when onClearSelection is not provided', async () => {
        render(
            <PromptBody value='' onChange={mockOnChange} />
        );

        const textarea = screen.getByRole('textbox');
        await userEvent.type(textarea, 'Test');

        expect(mockOnChange).toHaveBeenCalled();
        // No error should occur
    });

    it('handles multiline text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3';
        render(
            <PromptBody value={multilineText} onChange={mockOnChange} />
        );

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue(multilineText);
    });

    it('textarea has correct number of rows', () => {
        render(
            <PromptBody value='' onChange={mockOnChange} />
        );

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('rows', '4');
    });

    it('textarea has correct styling classes', () => {
        const { container } = render(
            <PromptBody value='' onChange={mockOnChange} />
        );

        const wrapper = container.querySelector('.mb-3');
        expect(wrapper).toBeInTheDocument();

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveClass('form-control');
    });

    it('updates value when prop changes', () => {
        const { rerender } = render(
            <PromptBody value='Initial' onChange={mockOnChange} />
        );

        let textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue('Initial');

        rerender(
            <PromptBody value='Updated' onChange={mockOnChange} />
        );

        textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue('Updated');
    });
});

