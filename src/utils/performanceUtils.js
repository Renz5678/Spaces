/**
 * Performance utility functions for debouncing and throttling
 */

/**
 * Debounce function to limit execution rate
 * Useful for search inputs, resize handlers, etc.
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to ensure function runs at most once per interval
 * Useful for scroll handlers, mousemove, etc.
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Create a cleanup function for event listeners
 */
export function createCleanup(cleanupFunctions = []) {
    return () => {
        cleanupFunctions.forEach(fn => fn());
    };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                observer.unobserve(lazyImage);
            }
        });
    });

    observer.observe(img);
    return () => observer.disconnect();
}
