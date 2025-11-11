import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptForm } from './index';

// Mock react-markdown to avoid Jest ES module issues
jest.mock('react-markdown', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: string }) => <div>{children}</div>,
    };
});

describe('PromptForm', () => {
    const mockFetch = jest.fn();
    let originalFetch: typeof fetch | undefined;

    beforeAll(() => {
        originalFetch = global.fetch;
        global.fetch = mockFetch as unknown as typeof fetch;
    });

    beforeEach(() => {
        mockFetch.mockReset();
        // Mock the initial fetch for prompts that happens on component mount
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        } as unknown as Response);
    });

    afterAll(() => {
        global.fetch = originalFetch as typeof fetch;
    });

    test('submits prompt and displays response text', async () => {
        const mockResponseText = 'Here is a joke.';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: jest.fn().mockResolvedValue(mockResponseText),
        } as unknown as Response);

        render(<PromptForm />);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        await userEvent.type(promptInput, 'tell me a joke');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        await userEvent.click(submitButton);

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: 'tell me a joke' }),
            }
        );

        await waitFor(() => {
            expect(screen.getByText('Response:')).toBeInTheDocument();
            expect(screen.getByText(mockResponseText)).toBeInTheDocument();
        });
    });

    test('shows validation error when prompt is empty', async () => {
        render(<PromptForm />);

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        await userEvent.click(submitButton);

        // Only the initial prompts fetch should have been called, not the submit
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(
            await screen.findByText(/Please enter a prompt/)
        ).toBeInTheDocument();
    });

    test('shows error message when request fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as unknown as Response);

        render(<PromptForm />);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        await userEvent.type(promptInput, 'tell me a joke');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        await userEvent.click(submitButton);

        expect(mockFetch).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
        });
    });
});
