import { useState, useEffect, useCallback, useMemo } from 'react';
import { parseMatrix, validateDimensions, createEmptyMatrix, resizeMatrix } from '../utils/matrixUtils';
import { MATRIX_LIMITS } from '../constants';
import './MatrixInput.css';

/**
 * Matrix input component with dynamic grid and dimension controls
 */
const MatrixInput = ({ onCompute, isLoading, examples, initialMatrix }) => {
    const [rows, setRows] = useState(MATRIX_LIMITS.DEFAULT_ROWS);
    const [cols, setCols] = useState(MATRIX_LIMITS.DEFAULT_COLS);
    const [matrix, setMatrix] = useState(
        createEmptyMatrix(MATRIX_LIMITS.DEFAULT_ROWS, MATRIX_LIMITS.DEFAULT_COLS)
    );

    useEffect(() => {
        if (initialMatrix && initialMatrix.length > 0) {
            const initRows = initialMatrix.length;
            const initCols = initialMatrix[0]?.length || 0;
            setRows(initRows);
            setCols(initCols);
            setMatrix(initialMatrix.map(row => row.map(v => String(v))));
        }
    }, [initialMatrix]);

    const handleDimensionChange = useCallback((newRows, newCols) => {
        const validated = validateDimensions(
            newRows,
            newCols,
            MATRIX_LIMITS.MIN_DIMENSION,
            MATRIX_LIMITS.MAX_DIMENSION
        );

        setRows(validated.rows);
        setCols(validated.cols);
        setMatrix(prev => resizeMatrix(prev, validated.rows, validated.cols));
    }, []);

    const handleCellChange = useCallback((i, j, value) => {
        setMatrix(prev => prev.map((row, ri) =>
            row.map((cell, ci) => (ri === i && ci === j) ? value : cell)
        ));
    }, []);

    const handleSubmit = useCallback(() => {
        try {
            const numericMatrix = parseMatrix(matrix);
            onCompute(numericMatrix);
        } catch (error) {
            alert(error.message);
        }
    }, [matrix, onCompute]);

    const loadExample = useCallback((example) => {
        const exampleMatrix = example.matrix;
        const exampleRows = exampleMatrix.length;
        const exampleCols = exampleMatrix[0].length;

        setRows(exampleRows);
        setCols(exampleCols);
        setMatrix(exampleMatrix.map(row => row.map(v => String(v))));
    }, []);

    const clearMatrix = useCallback(() => {
        setMatrix(createEmptyMatrix(rows, cols));
    }, [rows, cols]);

    const gridStyle = useMemo(() => ({
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
    }), [rows, cols]);

    return (
        <div className="matrix-input-container">
            <div className="matrix-controls">
                <div className="dimension-control">
                    <label>
                        Rows:
                        <input
                            type="number"
                            min={MATRIX_LIMITS.MIN_DIMENSION}
                            max={MATRIX_LIMITS.MAX_DIMENSION}
                            value={rows}
                            onChange={(e) => handleDimensionChange(parseInt(e.target.value) || 1, cols)}
                        />
                    </label>
                    <label>
                        Columns:
                        <input
                            type="number"
                            min={MATRIX_LIMITS.MIN_DIMENSION}
                            max={MATRIX_LIMITS.MAX_DIMENSION}
                            value={cols}
                            onChange={(e) => handleDimensionChange(rows, parseInt(e.target.value) || 1)}
                        />
                    </label>
                </div>

                {examples && examples.length > 0 && (
                    <div className="examples-dropdown">
                        <select
                            onChange={(e) => {
                                const idx = parseInt(e.target.value);
                                if (!isNaN(idx) && examples[idx]) {
                                    loadExample(examples[idx]);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Load example...</option>
                            {examples.map((ex, idx) => (
                                <option key={idx} value={idx}>{ex.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="matrix-grid-wrapper">
                <div className="bracket left">[</div>
                <div className="matrix-grid" style={gridStyle}>
                    {matrix.map((row, i) =>
                        row.map((cell, j) => (
                            <input
                                key={`${i}-${j}`}
                                type="text"
                                className="matrix-cell"
                                value={cell}
                                onChange={(e) => handleCellChange(i, j, e.target.value)}
                                placeholder="0"
                            />
                        ))
                    )}
                </div>
                <div className="bracket right">]</div>
            </div>

            <div className="matrix-actions">
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Computing...' : 'Compute Subspaces'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={clearMatrix}
                    disabled={isLoading}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default MatrixInput;
