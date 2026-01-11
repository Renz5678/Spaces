import { useState, useCallback, useEffect } from 'react';
import { computeMatrix, getExamples } from '../utils/matrixComputation.js';

/**
 * Hook for matrix computation and examples management
 * Uses local frontend computation - no backend required
 */
export function useMatrix() {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [examples, setExamples] = useState([]);

    /**
     * Load example matrices from local data
     */
    const fetchExamples = useCallback(() => {
        try {
            const data = getExamples();
            setExamples(data.examples || []);
        } catch (e) {
            console.error('Failed to load examples:', e);
        }
    }, []);

    /**
     * Compute fundamental spaces locally
     */
    const handleCompute = useCallback((matrix) => {
        setIsLoading(true);
        setError(null);

        // Return a promise for better async handling
        return new Promise((resolve) => {
            // Use setTimeout to prevent UI blocking
            setTimeout(() => {
                try {
                    const result = computeMatrix(matrix);

                    if (result.success) {
                        setResults(result.data);
                        resolve(result.data);
                    } else {
                        setError(result.error);
                        setResults(null);
                        resolve(null);
                    }
                } catch (err) {
                    setError(err.message || 'Computation failed');
                    setResults(null);
                    resolve(null);
                } finally {
                    setIsLoading(false);
                }
            }, 100); // Small delay for smooth transition
        });
    }, []);

    /**
     * Clear computation results
     */
    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    /**
     * Cleanup on unmount
     */
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
