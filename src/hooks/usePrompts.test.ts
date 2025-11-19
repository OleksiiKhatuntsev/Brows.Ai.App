import { renderHook, waitFor } from '@testing-library/react';
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { usePrompts } from './usePrompts';

describe('usePrompts', () => {
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
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('');
        expect(result.current.loading).toBe(true);
    });

    it('fetches prompts successfully', async () => {
        const mockPrompts = [
            { id: '1', title: 'Test Prompt 1', body: 'Body 1' },
            { id: '2', title: 'Test Prompt 2', body: 'Body 2' },
        ];

        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockPrompts),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual(mockPrompts);
        expect(result.current.error).toBe('');
    });

    it('calls fetch with correct URL', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue([]),
        } as unknown as Response);

        renderHook(() => usePrompts());

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5271/Ai/GetAllPrompts'
            );
        });
    });

    it('handles HTTP error response', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        } as unknown as Response);

        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe(
            'Failed to load prompts from database'
        );

        consoleErrorSpy.mockRestore();
    });

    it('handles network error', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe(
            'Failed to load prompts from database'
        );

        consoleErrorSpy.mockRestore();
    });

    it('handles JSON parse error', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as Response);

        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe(
            'Failed to load prompts from database'
        );

        consoleErrorSpy.mockRestore();
    });

    it('handles empty prompts array', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('');
    });

    it('handles large number of prompts', async () => {
        const largePromptsArray = Array.from({ length: 100 }, (_, i) => ({
            id: `${i}`,
            title: `Prompt ${i}`,
            body: `Body ${i}`,
        }));

        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(largePromptsArray),
        } as unknown as Response);

        const { result } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prompts).toHaveLength(100);
        expect(result.current.error).toBe('');
    });

    it('fetches prompts only once on mount', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue([]),
        } as unknown as Response);

        const { rerender } = renderHook(() => usePrompts());

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        rerender();

        // Should still be called only once after rerender
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});
