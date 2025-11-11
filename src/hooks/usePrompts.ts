import { useEffect, useState } from 'react';
import { Prompt } from '../models';

export const usePrompts = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5271/Ai/GetAllPrompts'
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPrompts(data);
            } catch (err) {
                console.error('Failed to fetch prompts:', err);
                setError('Failed to load prompts from database');
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    return { prompts, error, loading };
};
