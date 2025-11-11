import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptTitle from './PromptTitle';

describe('PromptTitle', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders input with label and placeholder', () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const label = screen.getByText('Prompt Title');
        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('form-label', 'fw-bold');

        const input = screen.getByPlaceholderText('Enter a title for your prompt...');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'promptTitle');
    });

    test('displays the provided value', () => {
        const testValue = 'Test Title';
        render(<PromptTitle value={testValue} onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue(testValue);
    });

    test('has correct input type', () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'text');
    });

    test('calls onChange when text is entered', async () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'New title');

        expect(mockOnChange).toHaveBeenCalled();
    });

    test('calls onChange with correct value for single character', async () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'A');

        expect(mockOnChange).toHaveBeenCalledWith('A');
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test('handles clearing the input', async () => {
        render(<PromptTitle value='Initial Value' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.clear(input);

        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    test('handles special characters', async () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, '!@#$%');

        expect(mockOnChange).toHaveBeenCalled();
    });

    test('handles long text input', () => {
        const longText = 'A'.repeat(200);
        render(<PromptTitle value={longText} onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue(longText);
    });

    test('updates value when prop changes', () => {
        const { rerender } = render(
            <PromptTitle value='Initial' onChange={mockOnChange} />
        );

        let input = screen.getByRole('textbox');
        expect(input).toHaveValue('Initial');

        rerender(
            <PromptTitle value='Updated' onChange={mockOnChange} />
        );

        input = screen.getByRole('textbox');
        expect(input).toHaveValue('Updated');
    });

    test('has correct styling classes', () => {
        const { container } = render(
            <PromptTitle value='' onChange={mockOnChange} />
        );

        const wrapper = container.querySelector('.mb-3');
        expect(wrapper).toBeInTheDocument();

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('form-control');
    });

    test('handles empty string value', () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
    });

    test('handles numeric input as string', async () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, '12345');

        expect(mockOnChange).toHaveBeenCalled();
    });

    test('handles whitespace in title', () => {
        const titleWithSpaces = '  Title  With  Spaces  ';
        render(<PromptTitle value={titleWithSpaces} onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue(titleWithSpaces);
    });

    test('label is associated with input', () => {
        render(<PromptTitle value='' onChange={mockOnChange} />);

        const label = screen.getByText('Prompt Title');
        const input = screen.getByRole('textbox');

        expect(label).toHaveAttribute('for', 'promptTitle');
        expect(input).toHaveAttribute('id', 'promptTitle');
    });
});

