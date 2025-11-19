import { act, renderHook, waitFor } from '@testing-library/react';
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { usePromptSubmission } from './usePromptSubmission';

describe('usePromptSubmission', () => {
    const mockFetch = vi.fn();
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

    it('initializes with correct default values', () => {
        const { result } = renderHook(() => usePromptSubmission());

        expect(result.current.result).toBe('');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('');
    });

    it('submits prompt successfully', async () => {
        const mockResponse = 'This is the AI response';
        mockFetch.mockResolvedValue({
            ok: true,
            text: vi.fn().mockResolvedValue(mockResponse),
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

    it('calls fetch with correct URL and parameters', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: vi.fn().mockResolvedValue('Response'),
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

    it('trims whitespace from prompt before submission', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: vi.fn().mockResolvedValue('Response'),
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

    it('shows error when prompt is empty', async () => {
        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('');
        });

        expect(result.current.error).toBe('Please enter a prompt');
        expect(result.current.loading).toBe(false);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('shows error when prompt is only whitespace', async () => {
        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('   ');
        });

        expect(result.current.error).toBe('Please enter a prompt');
        expect(result.current.loading).toBe(false);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('sets loading to true during submission', async () => {
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
                text: vi.fn().mockResolvedValue('Response'),
            });
            await promise;
        });
    });

    it('handles HTTP error response', async () => {
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

    it('handles network error', async () => {
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

    it('handles non-Error exceptions', async () => {
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

    it('clears previous results before new submission', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            text: vi.fn().mockResolvedValue('First response'),
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
            text: vi.fn().mockResolvedValue('Second response'),
        } as unknown as Response);

        await act(async () => {
            await result.current.submitPrompt('Second prompt');
        });

        await waitFor(() => {
            expect(result.current.result).toBe('Second response');
        });
    });

    it('handles long response text', async () => {
        const longResponse = 'B'.repeat(10000);
        mockFetch.mockResolvedValue({
            ok: true,
            text: vi.fn().mockResolvedValue(longResponse),
        } as unknown as Response);

        const { result } = renderHook(() => usePromptSubmission());

        await act(async () => {
            await result.current.submitPrompt('Test prompt');
        });

        await waitFor(() => {
            expect(result.current.result).toBe(longResponse);
        });
    });
});
