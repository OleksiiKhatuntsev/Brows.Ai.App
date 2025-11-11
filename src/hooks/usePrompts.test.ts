import { renderHook, waitFor } from '@testing-library/react';
import { usePrompts } from './usePrompts';

describe('usePrompts', () => {
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
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('');
        expect(result.current.loading).toBe(true);
    });

    test('fetches prompts successfully', async () => {
        const mockPrompts = [
            { id: '1', title: 'Test Prompt 1', body: 'Body 1' },
            { id: '2', title: 'Test Prompt 2', body: 'Body 2' },
        ];

        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPrompts),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual(mockPrompts);
        expect(result.current.error).toBe('');
    });

    test('calls fetch with correct URL', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        } as unknown as Response);

        renderHook(() => usePrompts());

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5271/Ai/GetAllPrompts'
            );
        });
    });

    test('handles HTTP error response', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        } as unknown as Response);

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('Failed to load prompts from database');

        consoleErrorSpy.mockRestore();
    });

    test('handles network error', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('Failed to load prompts from database');

        consoleErrorSpy.mockRestore();
    });

    test('handles JSON parse error', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as Response);

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('Failed to load prompts from database');

        consoleErrorSpy.mockRestore();
    });

    test('sets loading to false after successful fetch', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    test('sets loading to false after failed fetch', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        consoleErrorSpy.mockRestore();
    });

    test('handles empty prompts array', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('');
    });

    test('handles large number of prompts', async () => {
        const largePromptsArray = Array.from({ length: 100 }, (_, i) => ({
            id: `${i}`,
            title: `Prompt ${i}`,
            body: `Body ${i}`,
        }));

        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(largePromptsArray),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toHaveLength(100);
        expect(result.current.error).toBe('');
    });

    test('fetches prompts only once on mount', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { rerender } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        rerender();

        // Should still be called only once after rerender
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test('handles HTTP 404 error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
        } as unknown as Response);

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to load prompts from database');

        consoleErrorSpy.mockRestore();
    });

    test('handles timeout error', async () => {
        mockFetch.mockRejectedValue(new Error('Timeout'));

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to load prompts from database');

        consoleErrorSpy.mockRestore();
    });
});

