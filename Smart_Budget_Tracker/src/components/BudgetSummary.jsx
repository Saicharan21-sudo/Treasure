import { formatCurrency, getMonthName } from '../utils/helpers';
import './BudgetSummary.css';

function BudgetSummary({ budget, totalExpenses, monthlyExpenses, selectedMonth, selectedYear }) {
    const remaining = budget - totalExpenses;
    const percentageUsed = (totalExpenses / budget) * 100;

    const getStatus = () => {
        if (percentageUsed >= 90) return 'danger';
        if (percentageUsed >= 70) return 'warning';
        return 'success';
    };

    const status = getStatus();
    const periodLabel = selectedMonth !== undefined && selectedYear !== undefined
        ? `${getMonthName(selectedMonth)} ${selectedYear}`
        : 'Current Month';

    return (
        <div className="budget-summary-grid">
            <div className="card budget-card fade-in">
                <div className="budget-card-header">
                    <div className="budget-icon budget-icon-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div>
                        <div className="budget-label">Monthly Budget</div>
                        <div className="budget-value">{formatCurrency(budget)}</div>
                        <div className="budget-period">{periodLabel}</div>
                    </div>
                </div>
            </div>

            <div className="card budget-card fade-in">
                <div className="budget-card-header">
                    <div className="budget-icon budget-icon-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div>
                        <div className="budget-label">Total Expenses</div>
                        <div className="budget-value budget-value-expense">{formatCurrency(totalExpenses)}</div>
                    </div>
                </div>
            </div>

            <div className="card budget-card fade-in">
                <div className="budget-card-header">
                    <div className={`budget-icon budget-icon-${status}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                        </svg>
                    </div>
                    <div>
                        <div className="budget-label">Remaining</div>
                        <div className={`budget-value ${remaining < 0 ? 'budget-value-negative' : ''}`}>
                            {formatCurrency(Math.abs(remaining))}
                        </div>
                    </div>
                </div>
                <div className="budget-progress-container">
                    <div className="budget-progress-bar">
                        <div
                            className={`budget-progress-fill budget-progress-${status}`}
                            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        ></div>
                    </div>
                    <div className="budget-progress-text">
                        {percentageUsed.toFixed(1)}% of budget used
                    </div>
                </div>
            </div>

            <div className="card budget-card fade-in">
                <div className="budget-card-header">
                    <div className="budget-icon budget-icon-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div>
                        <div className="budget-label">Transactions</div>
                        <div className="budget-value">{monthlyExpenses}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetSummary;
