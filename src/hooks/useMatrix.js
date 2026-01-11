import { useState, useCallback, useEffect } from 'react';
import { API_CONFIG } from '../constants';

/**
 * Hook for matrix computation and examples management
 * Optimized for memory efficiency with proper cleanup
 */
export function useMatrix() {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [examples, setExamples] = useState([]);

    const fetchExamples = useCallback(async () => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXAMPLES}`);
            const data = await res.json();
            setExamples(data.examples || []);
        } catch (e) {
            console.error('Failed to fetch examples:', e);
        }
    }, []);

    const handleCompute = useCallback(async (matrix) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPUTE}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matrix }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Computation failed');
            }

            const data = await response.json();
            setResults(data);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            setResults(null);
            setError(null);
            setExamples([]);
        };
    }, []);

    return {
        results,
        isLoading,
        error,
        examples,
        handleCompute,
        clearResults,
        fetchExamples,
    };
}
