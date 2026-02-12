// Simple className utility without external dependencies
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
