import { useState, useCallback, memo } from 'react';
import { MatrixViewModal } from './MatrixViewModal';
import { formatMatrixDate } from '../utils/dateUtils';
import { formatMatrixCell } from '../utils/matrixUtils';
import { UI_CONFIG } from '../constants';
import './SavedMatricesPage.css';

/**
 * Page component for displaying and managing saved matrices
 */
export const SavedMatricesPage = memo(function SavedMatricesPage({
    savedMatrices,
    loadMatrix,
    deleteMatrix,
    updateMatrix,
    handleCompute,
    isLoading,
    user
}) {
    const [selectedMatrix, setSelectedMatrix] = useState(null);

    const handleOpenMatrix = useCallback((matrix) => {
        setSelectedMatrix(matrix);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedMatrix(null);
    }, []);

    const handleSaveChanges = useCallback(async (id, newData) => {
        await updateMatrix(id, newData);
        setSelectedMatrix(null);
    }, [updateMatrix]);

    if (savedMatrices.length === 0) {
        return (
            <div className="saved-matrices-page">
                <div className="page-header">
                    <h1>Saved Matrices</h1>
                    <p className="page-subtitle">You haven't saved any matrices yet</p>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                    </div>
                    <h3>No saved matrices</h3>
                    <p>Compute a matrix and save it to see it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-matrices-page">
            <div className="page-header">
                <h1>Saved Matrices</h1>
                <p className="page-subtitle">
                    You have {savedMatrices.length} saved {savedMatrices.length === 1 ? 'matrix' : 'matrices'}
                </p>
            </div>

            <div className="matrices-grid">
                {savedMatrices.map((saved) => (
                    <MatrixCard
                        key={saved.id}
                        matrix={saved}
                        onOpen={handleOpenMatrix}
                        onDelete={deleteMatrix}
                    />
                ))}
            </div>

            {selectedMatrix && (
                <MatrixViewModal
                    matrix={selectedMatrix}
                    onClose={handleCloseModal}
                    onSave={handleSaveChanges}
                    handleCompute={handleCompute}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
});

/**
 * Individual matrix card component
 */
const MatrixCard = memo(function MatrixCard({ matrix, onOpen, onDelete }) {
    const handleDelete = useCallback((e) => {
        e.stopPropagation();
        onDelete(matrix.id);
    }, [matrix.id, onDelete]);

    const handleOpen = useCallback(() => {
        onOpen(matrix);
    }, [matrix, onOpen]);

    return (
        <div className="matrix-card" onClick={handleOpen}>
            <div className="matrix-card-header">
                <h3 className="matrix-name">{matrix.name}</h3>
                <span className="matrix-dims">{matrix.rows}×{matrix.cols}</span>
            </div>

            <div className="matrix-preview">
                <div
                    className="matrix-grid"
                    style={{
                        gridTemplateColumns: `repeat(${Math.min(matrix.cols, UI_CONFIG.MAX_PREVIEW_COLS)}, 1fr)`,
                    }}
                >
                    {matrix.data?.slice(0, UI_CONFIG.MAX_PREVIEW_ROWS).map((row, i) => (
                        row.slice(0, UI_CONFIG.MAX_PREVIEW_COLS).map((cell, j) => (
                            <span key={`${i}-${j}`} className="matrix-cell">
                                {formatMatrixCell(cell)}
                            </span>
                        ))
                    ))}
                    {(matrix.rows > UI_CONFIG.MAX_PREVIEW_ROWS || matrix.cols > UI_CONFIG.MAX_PREVIEW_COLS) && (
                        <span className="matrix-ellipsis">...</span>
                    )}
                </div>
            </div>

            <div className="matrix-card-footer">
                <span className="matrix-date">{formatMatrixDate(matrix.created_at)}</span>
                <div className="matrix-actions">
                    <button
                        onClick={handleOpen}
                        className="btn-load"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn-delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
});
