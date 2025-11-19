import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { PromptForm } from '.';

// Mock react-markdown to avoid ES module issues
vi.mock('react-markdown', () => {
    return {
        default: ({ children }: { children: string }) => <div>{children}</div>,
    };
});

describe('PromptForm', () => {
    const mockFetch = vi.fn();
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
            json: vi.fn().mockResolvedValue([]),
        } as unknown as Response);
    });

    afterAll(() => {
        global.fetch = originalFetch as typeof fetch;
    });

    it('submits prompt and displays response text', async () => {
        const mockResponseText = 'Here is a joke.';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: vi.fn().mockResolvedValue(mockResponseText),
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

    it('shows validation error when prompt is empty', async () => {
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

    it('shows error message when request fails', async () => {
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
            expect(
                screen.getByText(/HTTP error! status: 500/)
            ).toBeInTheDocument();
        });
    });

    it('shows loading state when submitting prompt', async () => {
        let resolvePromise: (value: unknown) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        render(<PromptForm />);

        // Wait for initial prompts fetch to complete
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Mock the submission fetch with a promise that we control
        mockFetch.mockReturnValueOnce(promise as Promise<Response>);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        await userEvent.type(promptInput, 'test prompt');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        await userEvent.click(submitButton);

        // Button should be disabled and show loading text
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(submitButton).toHaveTextContent('Loading...');
        });

        // Resolve the promise
        await act(async () => {
            resolvePromise!({
                ok: true,
                text: vi.fn().mockResolvedValue('Response'),
            });
            await promise;
        });
    });

    it('displays error message when prompts fetch fails', async () => {
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        mockFetch.mockReset();
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as unknown as Response);

        render(<PromptForm />);

        await waitFor(() => {
            expect(
                screen.getByText(/Failed to load prompts from database/)
            ).toBeInTheDocument();
        });

        consoleErrorSpy.mockRestore();
    });

    it('renders no prompt buttons when prompts array is empty', async () => {
        render(<PromptForm />);

        await waitFor(() => {
            const buttons = screen.queryAllByRole('button', {
                name: /./,
            });
            // Only the submit button should be present, no prompt buttons
            expect(buttons).toHaveLength(1);
            expect(buttons[0]).toHaveTextContent('Send Prompt');
        });
    });

    it('renders prompt buttons when prompts are available', async () => {
        const mockPrompts = [
            { id: '1', title: 'Test Prompt 1', body: 'Body 1' },
            { id: '2', title: 'Test Prompt 2', body: 'Body 2' },
        ];

        mockFetch.mockReset();
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValue(mockPrompts),
        } as unknown as Response);

        render(<PromptForm />);

        await waitFor(() => {
            expect(screen.getByText('Test Prompt 1')).toBeInTheDocument();
            expect(screen.getByText('Test Prompt 2')).toBeInTheDocument();
        });
    });

    it('selects prompt button and updates title and prompt fields', async () => {
        const mockPrompts = [
            { id: '1', title: 'Test Prompt 1', body: 'Body 1' },
        ];

        mockFetch.mockReset();
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValue(mockPrompts),
        } as unknown as Response);

        render(<PromptForm />);

        await waitFor(() => {
            expect(screen.getByText('Test Prompt 1')).toBeInTheDocument();
        });

        const promptButton = screen.getByRole('button', {
            name: 'Test Prompt 1',
        });
        await userEvent.click(promptButton);

        // Title and prompt fields should be updated
        const titleInput = screen.getByPlaceholderText(
            'Enter a title for your prompt...'
        );
        const promptInput = screen.getByPlaceholderText('Enter your prompt...');

        expect(titleInput).toHaveValue('Test Prompt 1');
        expect(promptInput).toHaveValue('Body 1');
    });

    it('clears selection when typing in PromptBody', async () => {
        const mockPrompts = [
            { id: '1', title: 'Test Prompt 1', body: 'Body 1' },
        ];

        mockFetch.mockReset();
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValue(mockPrompts),
        } as unknown as Response);

        render(<PromptForm />);

        await waitFor(() => {
            expect(screen.getByText('Test Prompt 1')).toBeInTheDocument();
        });

        // Select a prompt
        const promptButton = screen.getByRole('button', {
            name: 'Test Prompt 1',
        });
        await userEvent.click(promptButton);

        // Verify it's selected (should have btn-primary class)
        expect(promptButton).toHaveClass('btn-primary');

        // Type in the prompt body
        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        await userEvent.clear(promptInput);
        await userEvent.type(promptInput, 'New text');

        // Selection should be cleared (button should have btn-secondary class)
        await waitFor(() => {
            expect(promptButton).toHaveClass('btn-secondary');
        });
    });

    it('does not render Message component when result is empty', async () => {
        render(<PromptForm />);

        // Wait for initial prompts fetch to complete and component to be stable
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Use waitFor for the assertion to ensure all async updates are complete
        await waitFor(() => {
            expect(screen.queryByText('Response:')).not.toBeInTheDocument();
        });
    });

    it('renders Message component when result exists', async () => {
        const mockResponseText = 'Here is a response.';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: vi.fn().mockResolvedValue(mockResponseText),
        } as unknown as Response);

        render(<PromptForm />);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        await userEvent.type(promptInput, 'test prompt');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Response:')).toBeInTheDocument();
            expect(screen.getByText(mockResponseText)).toBeInTheDocument();
        });
    });

    it('does not render ErrorMessage component when error is empty', async () => {
        render(<PromptForm />);

        // Wait for initial prompts fetch to complete and component to be stable
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
        });

        // Use waitFor for the assertion to ensure all async updates are complete
        await waitFor(() => {
            expect(screen.queryByText('Error:')).not.toBeInTheDocument();
        });
    });

    it('renders ErrorMessage component when error exists', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as unknown as Response);

        render(<PromptForm />);

        const promptInput = screen.getByPlaceholderText('Enter your prompt...');
        await userEvent.type(promptInput, 'test prompt');

        const submitButton = screen.getByRole('button', {
            name: 'Send Prompt',
        });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Error:')).toBeInTheDocument();
            expect(
                screen.getByText(/HTTP error! status: 500/)
            ).toBeInTheDocument();
        });
    });
});
