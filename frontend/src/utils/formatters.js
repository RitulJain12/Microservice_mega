export const formatPrice = (amount, currency = 'INR') => {
    if (amount === undefined || amount === null) return '';

    // Default to INR if currency is invalid or missing
    const validCurrency = ['USD', 'INR', 'EUR', 'GBP'].includes(currency) ? currency : 'INR';

    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: validCurrency,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        console.error("Currency formatting error:", error);
        return `${validCurrency} ${amount}`;
    }
};

export const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        return 'Invalid Date';
    }
};
