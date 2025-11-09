import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptForm } from './index';

describe('PromptForm', () => {
    const mockFetch = jest.fn();
    let originalFetch: typeof fetch | undefined;

    beforeAll(() => {
        originalFetch = global.fetch;
        global.fetch = mockFetch as unknown as typeof fetch;
    });

    beforeEach(() => {
        mockFetch.mockReset();
    });

    afterAll(() => {
        global.fetch = originalFetch as typeof fetch;
    });

    test('submits prompt and displays response text', async () => {
        const mockResponseText = 'Here is a joke.';
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue(mockResponseText),
        } as unknown as Response);

        render(<PromptForm />);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        userEvent.type(promptInput, 'tell me a joke');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        userEvent.click(submitButton);

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: 'tell me a joke' }),
            }
        );

        const responseTextarea = await screen.findByLabelText('Response:');
        await waitFor(() =>
            expect(responseTextarea).toHaveDisplayValue(mockResponseText)
        );
    });

    test('shows validation error when prompt is empty', async () => {
        render(<PromptForm />);

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        userEvent.click(submitButton);

        expect(mockFetch).not.toHaveBeenCalled();
        expect(
            await screen.findByText('Error: Please enter a prompt')
        ).toBeInTheDocument();
    });

    test('shows error message when request fails', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        } as unknown as Response);

        render(<PromptForm />);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        userEvent.type(promptInput, 'tell me a joke');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        userEvent.click(submitButton);

        expect(mockFetch).toHaveBeenCalled();
        expect(
            await screen.findByText('Error: HTTP error! status: 500')
        ).toBeInTheDocument();
    });
});
