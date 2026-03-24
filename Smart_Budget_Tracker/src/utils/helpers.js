import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Format date for display
export const formatDate = (date) => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

// Get expenses for current month
export const getMonthlyExpenses = (expenses, month = new Date()) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    return expenses.filter(expense => {
        try {
            const expenseDate = parseISO(expense.date);
            return isWithinInterval(expenseDate, { start, end });
        } catch (error) {
            return false;
        }
    });
};

// Calculate total expenses
export const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
};

// Group expenses by category
export const groupByCategory = (expenses) => {
    return expenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(expense);
        return acc;
    }, {});
};

// Get category totals
export const getCategoryTotals = (expenses) => {
    const grouped = groupByCategory(expenses);
    return Object.keys(grouped).map(category => ({
        category,
        total: calculateTotal(grouped[category]),
        count: grouped[category].length
    }));
};

// Sort expenses
export const sortExpenses = (expenses, sortBy = 'date', order = 'desc') => {
    return [...expenses].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'amount') {
            comparison = parseFloat(a.amount) - parseFloat(b.amount);
        } else if (sortBy === 'category') {
            comparison = a.category.localeCompare(b.category);
        }

        return order === 'desc' ? -comparison : comparison;
    });
};

// Generate unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Filter expenses by multiple criteria
export const filterExpenses = (expenses, filters = {}) => {
    let filtered = [...expenses];

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(expense =>
            filters.categories.includes(expense.category)
        );
    }

    // Filter by date range
    if (filters.startDate) {
        filtered = filtered.filter(expense =>
            new Date(expense.date) >= new Date(filters.startDate)
        );
    }

    if (filters.endDate) {
        filtered = filtered.filter(expense =>
            new Date(expense.date) <= new Date(filters.endDate)
        );
    }

    // Filter by search term (description)
    if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(expense =>
            expense.description.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
};

// Get expenses for a specific year
export const getYearExpenses = (expenses, year) => {
    return expenses.filter(expense => {
        const expenseYear = new Date(expense.date).getFullYear();
        return expenseYear === year;
    });
};

// Get expenses for a specific month and year
export const getMonthYearExpenses = (expenses, month, year) => {
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
};

// Calculate monthly totals for a year
export const getMonthlyTotals = (expenses, year) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map((name, index) => {
        const monthExpenses = getMonthYearExpenses(expenses, index, year);
        return {
            name,
            month: index,
            total: calculateTotal(monthExpenses),
            count: monthExpenses.length
        };
    });
};

// Group expenses by month
export const groupByMonth = (expenses) => {
    return expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(expense);
        return acc;
    }, {});
};

// Get available years from expenses
export const getAvailableYears = (expenses) => {
    const years = expenses.map(expense =>
        new Date(expense.date).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a);
};

// Get month name
export const getMonthName = (monthIndex) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
};
