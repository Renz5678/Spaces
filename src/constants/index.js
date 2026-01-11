/**
 * Application constants
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
        COMPUTE: '/api/compute',
        EXAMPLES: '/api/examples',
    },
};

export const MATRIX_LIMITS = {
    MIN_DIMENSION: 1,
    MAX_DIMENSION: 5,
    DEFAULT_ROWS: 3,
    DEFAULT_COLS: 3,
};

export const UI_CONFIG = {
    MODAL_ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    MAX_PREVIEW_ROWS: 3,
    MAX_PREVIEW_COLS: 5,
};

export const ROUTES = {
    HOME: '/',
    SAVED: '/saved',
};
