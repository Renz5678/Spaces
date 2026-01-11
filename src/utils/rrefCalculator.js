/**
 * RREF (Row Reduced Echelon Form) Calculator
 * Implements Gaussian elimination with partial pivoting
 */

import { Fraction } from './fractionUtils.js';

/**
 * Matrix class for exact arithmetic operations
 */
export class Matrix {
    constructor(data) {
        // Convert all elements to Fractions
        this.data = data.map(row =>
            row.map(val => Fraction.from(val))
        );
        this.rows = this.data.length;
        this.cols = this.data[0]?.length || 0;
    }

    /**
     * Get element at position (i, j)
     */
    get(i, j) {
        return this.data[i][j];
    }

    /**
     * Set element at position (i, j)
     */
    set(i, j, value) {
        this.data[i][j] = Fraction.from(value);
    }

    /**
     * Create a copy of the matrix
     */
    clone() {
        const newData = this.data.map(row => [...row]);
        const matrix = Object.create(Matrix.prototype);
        matrix.data = newData;
        matrix.rows = this.rows;
        matrix.cols = this.cols;
        return matrix;
    }

    /**
     * Swap two rows
     */
    swapRows(i, j) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    /**
     * Multiply a row by a scalar
     */
    multiplyRow(i, scalar) {
        const frac = Fraction.from(scalar);
        for (let j = 0; j < this.cols; j++) {
            this.data[i][j] = this.data[i][j].multiply(frac);
        }
    }

    /**
     * Add a multiple of one row to another: row[i] += scalar * row[j]
     */
    addRowMultiple(i, j, scalar) {
        const frac = Fraction.from(scalar);
        for (let k = 0; k < this.cols; k++) {
            this.data[i][k] = this.data[i][k].add(this.data[j][k].multiply(frac));
        }
    }

    /**
     * Convert to plain JavaScript array
     */
    toArray() {
        return this.data.map(row => row.map(f => f.toNumber()));
    }

    /**
     * Convert to nested array of fractions
     */
    toFractionArray() {
        return this.data.map(row => [...row]);
    }

    /**
     * Convert to LaTeX format
     */
    toLatex() {
        const rows = this.data.map(row =>
            row.map(f => f.toLatex()).join(' & ')
        ).join(' \\\\ ');
        return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
    }

    /**
     * Get transpose of the matrix
     */
    transpose() {
        const transposed = Array(this.cols).fill(null).map(() =>
            Array(this.rows).fill(null)
        );

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                transposed[j][i] = this.data[i][j];
            }
        }

        const matrix = Object.create(Matrix.prototype);
        matrix.data = transposed;
        matrix.rows = this.cols;
        matrix.cols = this.rows;
        return matrix;
    }
}

/**
 * Compute RREF and pivot columns
 * Returns { rref: Matrix, pivots: number[] }
 */
export function computeRREF(matrix) {
    const m = matrix.clone();
    const pivots = [];
    let currentRow = 0;

    for (let col = 0; col < m.cols && currentRow < m.rows; col++) {
        // Find pivot (largest absolute value in column)
        let pivotRow = currentRow;
        let maxVal = Math.abs(m.get(currentRow, col).toNumber());

        for (let row = currentRow + 1; row < m.rows; row++) {
            const val = Math.abs(m.get(row, col).toNumber());
            if (val > maxVal) {
                maxVal = val;
                pivotRow = row;
            }
        }

        // Skip if column is all zeros
        if (m.get(pivotRow, col).isZero()) {
            continue;
        }

        // Swap rows if needed
        if (pivotRow !== currentRow) {
            m.swapRows(currentRow, pivotRow);
        }

        // Scale pivot row to make pivot = 1
        const pivot = m.get(currentRow, col);
        m.multiplyRow(currentRow, new Fraction(1, 1).divide(pivot));

        // Eliminate all other entries in this column
        for (let row = 0; row < m.rows; row++) {
            if (row !== currentRow && !m.get(row, col).isZero()) {
                const factor = m.get(row, col).negate();
                m.addRowMultiple(row, currentRow, factor);
            }
        }

        pivots.push(col);
        currentRow++;
    }

    return { rref: m, pivots };
}

/**
 * Compute rank of a matrix
 */
export function computeRank(matrix) {
    const { pivots } = computeRREF(matrix);
    return pivots.length;
}

/**
 * Check if a row is all zeros
 */
export function isZeroRow(matrix, rowIndex) {
    for (let j = 0; j < matrix.cols; j++) {
        if (!matrix.get(rowIndex, j).isZero()) {
            return false;
        }
    }
    return true;
}

/**
 * Get non-zero rows from a matrix
 */
export function getNonZeroRows(matrix) {
    const rows = [];
    for (let i = 0; i < matrix.rows; i++) {
        if (!isZeroRow(matrix, i)) {
            rows.push(matrix.data[i]);
        }
    }
    return rows;
}
