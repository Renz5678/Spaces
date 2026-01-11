import { useState, useEffect, useCallback, memo } from 'react';
import MatrixInput from './MatrixInput';
import ResultsDisplay from './ResultsDisplay';
import './MatrixViewModal.css';

/**
 * Modal for viewing and editing saved matrices
 */
export const MatrixViewModal = memo(function MatrixViewModal({
    matrix,
    onClose,
    onSave,
    handleCompute,
    isLoading
}) {
    const [currentMatrix, setCurrentMatrix] = useState(null);
    const [results, setResults] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);

    useEffect(() => {
        if (matrix?.data) {
            setCurrentMatrix(matrix.data);
            computeMatrix(matrix.data);
        }
    }, [matrix]);

    const computeMatrix = useCallback(async (matrixData) => {
        const result = await handleCompute(matrixData);
        if (result) {
            setResults(result);
        }
    }, [handleCompute]);

    const handleMatrixChange = useCallback(async (newMatrix) => {
        setCurrentMatrix(newMatrix);
        setHasChanges(true);
        await computeMatrix(newMatrix);
    }, [computeMatrix]);

    const handleClose = useCallback(() => {
        if (hasChanges) {
            setShowSavePrompt(true);
        } else {
            onClose();
        }
    }, [hasChanges, onClose]);

    const handleSaveAndClose = useCallback(async () => {
        if (onSave && currentMatrix) {
            await onSave(matrix.id, currentMatrix, results);
        }
        onClose();
    }, [onSave, currentMatrix, matrix.id, results, onClose]);

    const handleDiscardAndClose = useCallback(() => {
        setHasChanges(false);
        onClose();
    }, [onClose]);

    if (!matrix) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal matrix-view-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>×</button>

                <div className="modal-header">
                    <h2>{matrix.name}</h2>
                    <span className="matrix-dims-badge">{matrix.rows}×{matrix.cols}</span>
                </div>

                <div className="modal-body">
                    <div className="matrix-editor-section">
                        <h3>Edit Matrix</h3>
                        {currentMatrix && (
                            <MatrixInput
                                onCompute={handleMatrixChange}
                                isLoading={isLoading}
                                examples={[]}
                                initialMatrix={currentMatrix}
                            />
                        )}
                    </div>

                    {results && (
                        <div className="results-section">
                            <h3>Results</h3>
                            <ResultsDisplay results={results} />
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {hasChanges && (
                        <span className="unsaved-indicator">● Unsaved changes</span>
                    )}
                    <div className="modal-actions">
                        <button onClick={handleClose} className="btn-cancel">
                            Close
                        </button>
                        {hasChanges && (
                            <button onClick={handleSaveAndClose} className="btn-submit">
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>

                {showSavePrompt && (
                    <div className="modal-overlay" onClick={() => setShowSavePrompt(false)}>
                        <div className="modal save-prompt-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Unsaved Changes</h3>
                            <p>You have unsaved changes. Do you want to save them before closing?</p>
                            <div className="modal-actions">
                                <button onClick={handleDiscardAndClose} className="btn-cancel">
                                    Discard Changes
                                </button>
                                <button onClick={() => setShowSavePrompt(false)} className="btn-secondary">
                                    Keep Editing
                                </button>
                                <button onClick={handleSaveAndClose} className="btn-submit">
                                    Save & Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
