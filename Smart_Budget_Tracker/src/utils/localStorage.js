// Local Storage Keys
const STORAGE_KEYS = {
    EXPENSES: 'budget_tracker_expenses',
    BUDGET: 'budget_tracker_budget',
    CATEGORIES: 'budget_tracker_categories'
};

// Save expenses to localStorage
export const saveExpenses = (expenses) => {
    try {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        return true;
    } catch (error) {
        console.error('Error saving expenses:', error);
        return false;
    }
};

// Load expenses from localStorage
export const loadExpenses = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading expenses:', error);
        return [];
    }
};

// Save budget to localStorage
export const saveBudget = (budget) => {
    try {
        localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
        return true;
    } catch (error) {
        console.error('Error saving budget:', error);
        return false;
    }
};

// Load budget from localStorage
export const loadBudget = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
        return data ? JSON.parse(data) : 5000; // Default budget
    } catch (error) {
        console.error('Error loading budget:', error);
        return 5000;
    }
};

// Save categories to localStorage
export const saveCategories = (categories) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        return true;
    } catch (error) {
        console.error('Error saving categories:', error);
        return false;
    }
};

// Load categories from localStorage
export const loadCategories = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        return data ? JSON.parse(data) : getDefaultCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
        return getDefaultCategories();
    }
};

// Default categories
export const getDefaultCategories = () => [
    { id: 'food', name: 'Food & Dining', color: '#ef4444' },
    { id: 'transport', name: 'Transport', color: '#f97316' },
    { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6' },
    { id: 'bills', name: 'Bills & Utilities', color: '#06b6d4' },
    { id: 'shopping', name: 'Shopping', color: '#ec4899' },
    { id: 'health', name: 'Health & Fitness', color: '#10b981' },
    { id: 'other', name: 'Other', color: '#64748b' }
];
