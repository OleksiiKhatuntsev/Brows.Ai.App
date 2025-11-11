import { renderHook, waitFor, act } from '@testing-library/react';
import { usePromptSubmission } from './usePromptSubmission';

describe('usePromptSubmission', () => {
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

    test('initializes with correct default values', () => {
        const { result } = renderHook(() => usePromptSubmission());

        expect(result.current.result).toBe('');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('');
    });

    test('submits prompt successfully', async () => {
        const mockResponse = 'This is the AI response';
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue(mockResponse),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Tell me a joke');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.result).toBe(mockResponse);
        expect(result.current.error).toBe('');
    });

    test('calls fetch with correct URL and parameters', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: 'Test prompt' }),
            }
        );
    });

    test('trims whitespace from prompt before submission', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('  Test prompt  ');
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: 'Test prompt' }),
            }
        );
    });

    test('shows error when prompt is empty', async () => {
        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('');
        });

        expect(result.current.error).toBe('Please enter a prompt');
        expect(result.current.loading).toBe(false);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    test('shows error when prompt is only whitespace', async () => {
        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('   ');
        });

        expect(result.current.error).toBe('Please enter a prompt');
        expect(result.current.loading).toBe(false);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    test('sets loading to true during submission', async () => {
        let resolvePromise: (value: unknown) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockFetch.mockReturnValue(promise as Promise<Response>);

        const { result } = renderHook(() => usePromptSubmission());

        act(() => {
            result.current.submitPrompt('Test prompt');
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolvePromise!({
                ok: true,
                text: jest.fn().mockResolvedValue('Response'),
            });
            await promise;
        });
    });

    test('sets loading to false after successful submission', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    test('handles HTTP error response', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.result).toBe('');
        expect(result.current.error).toBe('HTTP error! status: 500');
    });

    test('handles network error', async () => {
        mockFetch.mockRejectedValue(new Error('Network failure'));

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.result).toBe('');
        expect(result.current.error).toBe('Network failure');
    });

    test('handles non-Error exceptions', async () => {
        mockFetch.mockRejectedValue('String error');

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('An error occurred');
    });

    test('clears previous results before new submission', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('First response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('First prompt');
        });

        await waitFor(() => {
            expect(result.current.result).toBe('First response');
        });

        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Second response'),
        } as unknown as Response);

        await act(async () => {
            await result.current.submitPrompt('Second prompt');
        });

        await waitFor(() => {
            expect(result.current.result).toBe('Second response');
        });
    });

    test('clears previous errors before new submission', async () => {
        mockFetch.mockRejectedValue(new Error('First error'));

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('First prompt');
        });

        await waitFor(() => {
            expect(result.current.error).toBe('First error');
        });

        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Success'),
        } as unknown as Response);

        await act(async () => {
            await result.current.submitPrompt('Second prompt');
        });

        await waitFor(() => {
            expect(result.current.error).toBe('');
            expect(result.current.result).toBe('Success');
        });
    });

    test('handles long prompt text', async () => {
        const longPrompt = 'A'.repeat(1000);
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt(longPrompt);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: longPrompt }),
            }
        );
    });

    test('handles special characters in prompt', async () => {
        const specialPrompt = 'Test with "quotes" and \'apostrophes\' & symbols @#$%';
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt(specialPrompt);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: specialPrompt }),
            }
        );
    });

    test('handles multiline prompt text', async () => {
        const multilinePrompt = 'Line 1\nLine 2\nLine 3';
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt(multilinePrompt);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5271/Ai/GetCustomResponse',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: multilinePrompt }),
            }
        );
    });

    test('handles HTTP 404 error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.error).toBe('HTTP error! status: 404');
        });
    });

    test('handles HTTP 401 unauthorized error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 401,
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.error).toBe('HTTP error! status: 401');
        });
    });

    test('handles long response text', async () => {
        const longResponse = 'B'.repeat(10000);
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue(longResponse),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.result).toBe(longResponse);
        });
    });

    test('can submit multiple prompts sequentially', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response 1'),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Prompt 1');
        });

        await waitFor(() => {
            expect(result.current.result).toBe('Response 1');
        });

        mockFetch.mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('Response 2'),
        } as unknown as Response);

        await act(async () => {
            await result.current.submitPrompt('Prompt 2');
        });

        await waitFor(() => {
            expect(result.current.result).toBe('Response 2');
        });

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });
});

