/**
 * Date formatting utilities
 */

/**
 * Formats a date string for display in matrix cards
 */
export function formatMatrixDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Formats a date for compact display
 */
export function formatCompactDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}
