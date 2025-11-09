import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from './TextInput';

describe('TextInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders textarea with default placeholder', () => {
        render(<TextInput value='' onChange={mockOnChange} />);
        const textarea = screen.getByPlaceholderText('Enter your message...');
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveValue('');
    });

    test('renders textarea with custom placeholder', () => {
        render(
            <TextInput
                value=''
                onChange={mockOnChange}
                placeholder='Type here...'
            />
        );
        const textarea = screen.getByPlaceholderText('Type here...');
        expect(textarea).toBeInTheDocument();
    });

    test('displays the value prop', () => {
        render(<TextInput value='Test message' onChange={mockOnChange} />);
        const textarea = screen.getByDisplayValue('Test message');
        expect(textarea).toBeInTheDocument();
    });

    test('calls onChange when user types', async () => {
        const TestWrapper = () => {
            const [value, setValue] = useState('');
            return (
                <TextInput
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                        mockOnChange(newValue);
                    }}
                />
            );
        };

        render(<TestWrapper />);
        const textarea = screen.getByPlaceholderText('Enter your message...');

        await userEvent.type(textarea, 'Hello');

        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenLastCalledWith('Hello');
    });

    test('is disabled when disabled prop is true', () => {
        render(
            <TextInput value='' onChange={mockOnChange} disabled={true} />
        );
        const textarea = screen.getByPlaceholderText('Enter your message...');
        expect(textarea).toBeDisabled();
    });

    test('is enabled when disabled prop is false', () => {
        render(
            <TextInput value='' onChange={mockOnChange} disabled={false} />
        );
        const textarea = screen.getByPlaceholderText('Enter your message...');
        expect(textarea).not.toBeDisabled();
    });

    test('is enabled by default when disabled prop is not provided', () => {
        render(<TextInput value='' onChange={mockOnChange} />);
        const textarea = screen.getByPlaceholderText('Enter your message...');
        expect(textarea).not.toBeDisabled();
    });
});

