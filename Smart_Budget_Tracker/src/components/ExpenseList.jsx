import { formatCurrency, formatDate } from '../utils/helpers';
import './ExpenseList.css';

function ExpenseList({ expenses, categories, onDeleteExpense, totalExpenses }) {
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.color : '#64748b';
    };

    if (expenses.length === 0) {
        return (
            <div className="card fade-in">
                <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3>No expenses yet</h3>
                    <p>Start tracking your spending by adding your first expense above</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card expense-list-card fade-in">
            <div className="expense-list-header">
                <h2 className="expense-list-title">Recent Expenses</h2>
                {totalExpenses && totalExpenses !== expenses.length && (
                    <span className="filter-info">
                        Showing {expenses.length} of {totalExpenses} expenses
                    </span>
                )}
            </div>
            <div className="expense-list">
                {expenses.map(expense => (
                    <div key={expense.id} className="expense-item slide-in">
                        <div className="expense-icon" style={{ background: getCategoryColor(expense.category) }}>
                            <span>{getCategoryName(expense.category).charAt(0)}</span>
                        </div>
                        <div className="expense-details">
                            <div className="expense-description">{expense.description}</div>
                            <div className="expense-meta">
                                <span className="expense-category">{getCategoryName(expense.category)}</span>
                                <span className="expense-date">{formatDate(expense.date)}</span>
                            </div>
                        </div>
                        <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                        <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="btn-delete"
                            aria-label="Delete expense"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
