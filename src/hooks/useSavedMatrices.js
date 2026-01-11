import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for managing saved matrices CRUD operations
 * Optimized for memory efficiency with proper cleanup
 */
export function useSavedMatrices(user, handleCompute) {
    const [savedMatrices, setSavedMatrices] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveMatrixName, setSaveMatrixName] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');

    const fetchSavedMatrices = useCallback(async (userId) => {
        if (!supabase || !userId) return;

        const { data, error } = await supabase
            .from('matrices')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setSavedMatrices(data);
        }
    }, []);

    const openSaveModal = useCallback(() => {
        const nextNumber = savedMatrices.length + 1;
        setSaveMatrixName(`Matrix #${nextNumber}`);
        setSaveError('');
        setShowSaveModal(true);
    }, [savedMatrices.length]);

    const closeSaveModal = useCallback(() => {
        setShowSaveModal(false);
        setSaveMatrixName('');
        setSaveError('');
    }, []);

    const saveMatrix = useCallback(async (e, results) => {
        e.preventDefault();
        if (!supabase || !user || !results) return;

        if (!saveMatrixName.trim()) {
            setSaveError('Please enter a name for the matrix');
            return;
        }

        setSaveLoading(true);
        setSaveError('');

        try {
            const matrixData = results.matrix.data;
            const { error } = await supabase.from('matrices').insert({
                user_id: user.id,
                name: saveMatrixName.trim(),
                rows: matrixData.length,
                cols: matrixData[0]?.length || 0,
                data: matrixData,
            });

            if (error) throw error;

            await fetchSavedMatrices(user.id);
            closeSaveModal();
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setSaveLoading(false);
        }
    }, [user, saveMatrixName, fetchSavedMatrices, closeSaveModal]);

    const loadMatrix = useCallback(async (saved) => {
        if (saved.data && handleCompute) {
            await handleCompute(saved.data);
        }
    }, [handleCompute]);

    const deleteMatrix = useCallback(async (id) => {
        if (!supabase || !user) return;
        if (!confirm('Delete this matrix?')) return;

        const { error } = await supabase
            .from('matrices')
            .delete()
            .eq('id', id);

        if (!error) {
            await fetchSavedMatrices(user.id);
        }
    }, [user, fetchSavedMatrices]);

    const updateMatrix = useCallback(async (id, newData) => {
        if (!supabase || !user) return;

        try {
            const { error } = await supabase
                .from('matrices')
                .update({
                    data: newData,
                    rows: newData.length,
                    cols: newData[0]?.length || 0,
                })
                .eq('id', id);

            if (error) throw error;
            await fetchSavedMatrices(user.id);
        } catch (err) {
            console.error('Error updating matrix:', err);
            throw err;
        }
    }, [user, fetchSavedMatrices]);

    const clearSavedMatrices = useCallback(() => {
        setSavedMatrices([]);
    }, []);

    useEffect(() => {
        return () => {
            setSavedMatrices([]);
            setShowSaveModal(false);
            setSaveMatrixName('');
            setSaveError('');
        };
    }, []);

    return {
        savedMatrices,
        showSaveModal,
        saveMatrixName,
        setSaveMatrixName,
        saveLoading,
        saveError,
        fetchSavedMatrices,
        openSaveModal,
        closeSaveModal,
        saveMatrix,
        loadMatrix,
        deleteMatrix,
        updateMatrix,
        clearSavedMatrices,
    };
}
