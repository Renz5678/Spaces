/**
 * Matrix utility functions for parsing, validation, and formatting
 */

/**
 * Parses a matrix cell value to a number
 * Supports fractions (e.g., "1/2") and decimals
 */
export function parseMatrixCell(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 0;

    if (trimmed.includes('/')) {
        const [num, den] = trimmed.split('/').map(s => parseFloat(s.trim()));
        if (isNaN(num) || isNaN(den) || den === 0) {
            throw new Error(`Invalid fraction: ${trimmed}`);
        }
        return num / den;
    }

    const num = parseFloat(trimmed);
    if (isNaN(num)) {
        throw new Error(`Invalid number: ${trimmed}`);
    }
    return num;
}

/**
 * Converts a matrix of strings to numbers
 */
export function parseMatrix(matrix) {
    return matrix.map(row => row.map(parseMatrixCell));
}

/**
 * Validates matrix dimensions
 */
export function validateDimensions(rows, cols, min = 1, max = 5) {
    return {
        rows: Math.max(min, Math.min(max, rows)),
        cols: Math.max(min, Math.min(max, cols))
    };
}

/**
 * Creates an empty matrix with given dimensions
 */
export function createEmptyMatrix(rows, cols, defaultValue = '0') {
    return Array(rows).fill(null).map(() => Array(cols).fill(defaultValue));
}

/**
 * Resizes a matrix to new dimensions, preserving existing values
 */
export function resizeMatrix(matrix, newRows, newCols, defaultValue = '0') {
    return Array(newRows).fill(null).map((_, i) =>
        Array(newCols).fill(null).map((_, j) =>
            (matrix[i] && matrix[i][j]) ? matrix[i][j] : defaultValue
        )
    );
}

/**
 * Formats a number for display in matrix cells
 */
export function formatMatrixCell(value) {
    if (typeof value !== 'number') return value;
    return Number.isInteger(value) ? value : value.toFixed(2);
}
