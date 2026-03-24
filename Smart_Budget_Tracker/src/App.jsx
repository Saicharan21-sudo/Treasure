import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetSummary from './components/BudgetSummary';
import Charts from './components/Charts';
import FilterPanel from './components/FilterPanel';
import MonthYearSelector from './components/MonthYearSelector';
import YearlyAnalysis from './components/YearlyAnalysis';
import { loadExpenses, saveExpenses, loadBudget, saveBudget, loadCategories } from './utils/localStorage';
import { getMonthYearExpenses, calculateTotal, sortExpenses, generateId, filterExpenses } from './utils/helpers';
import { exportToCSV } from './utils/exportUtils';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(5000);
  const [categories, setCategories] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('monthly'); // 'monthly' or 'yearly'

  // Period selection
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Filters
  const [filters, setFilters] = useState({
    categories: [],
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedExpenses = loadExpenses();
    const loadedBudget = loadBudget();
    const loadedCategories = loadCategories();
    const savedTheme = localStorage.getItem('theme') || 'dark';

    setExpenses(loadedExpenses);
    setBudget(loadedBudget);
    setCategories(loadedCategories);
    setTheme(savedTheme);

    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      saveExpenses(expenses);
    }
  }, [expenses]);

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: generateId(),
      ...expenseData,
      createdAt: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      // Update localStorage after deletion
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      saveExpenses(updatedExpenses);
    }
  };

  const handleUpdateBudget = () => {
    const budgetValue = parseFloat(newBudget);
    if (budgetValue && budgetValue > 0) {
      setBudget(budgetValue);
      saveBudget(budgetValue);
      setShowBudgetModal(false);
      setNewBudget('');
    } else {
      alert('Please enter a valid budget amount');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      startDate: '',
      endDate: '',
      searchTerm: ''
    });
  };

  const handleExport = () => {
    const expensesToExport = view === 'monthly' ? filteredMonthExpenses : expenses;
    exportToCSV(expensesToExport, {
      month: selectedMonth + 1,
      year: selectedYear
    });
  };

  // Get expenses for selected month/year
  const monthExpenses = getMonthYearExpenses(expenses, selectedMonth, selectedYear);

  // Apply filters
  const filteredMonthExpenses = filterExpenses(monthExpenses, filters);
  const sortedExpenses = sortExpenses(filteredMonthExpenses, 'date', 'desc');

  const totalExpenses = calculateTotal(filteredMonthExpenses);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-brand">
              <div className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <h1 className="app-title">Budget Tracker</h1>
                <p className="app-subtitle">Track your expenses smartly</p>
              </div>
            </div>
            <div className="header-actions">
              {/* Theme Toggle */}
              <button className="btn btn-secondary" onClick={handleThemeToggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

              {/* Export Button */}
              <button className="btn btn-secondary" onClick={handleExport}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export
              </button>

              {/* Set Budget Button */}
              <button
                className="btn btn-secondary"
                onClick={() => setShowBudgetModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m6-11.5v3M6 9.5v3m11.5-6h-3M9.5 18h-3"></path>
                </svg>
                Set Budget
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'monthly' ? 'active' : ''}`}
              onClick={() => setView('monthly')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Monthly View
            </button>
            <button
              className={`view-btn ${view === 'yearly' ? 'active' : ''}`}
              onClick={() => setView('yearly')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Yearly Analysis
            </button>
          </div>

          {view === 'monthly' ? (
            <>
              {/* Month/Year Selector */}
              <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />

              {/* Budget Summary */}
              <BudgetSummary
                budget={budget}
                totalExpenses={totalExpenses}
                monthlyExpenses={filteredMonthExpenses.length}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />

              <div className="app-grid">
                <div className="app-grid-sidebar">
                  {/* Expense Form */}
                  <ExpenseForm onAddExpense={handleAddExpense} categories={categories} />

                  {/* Filter Panel */}
                  <FilterPanel
                    categories={categories}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
                <div className="app-grid-main">
                  {/* Expense List */}
                  <ExpenseList
                    expenses={sortedExpenses}
                    categories={categories}
                    onDeleteExpense={handleDeleteExpense}
                    totalExpenses={monthExpenses.length}
                  />
                </div>
              </div>

              {/* Charts */}
              <Charts expenses={filteredMonthExpenses} categories={categories} />
            </>
          ) : (
            <>
              {/* Yearly Analysis */}
              <YearlyAnalysis
                expenses={expenses}
                year={selectedYear}
                categories={categories}
              />

              {/* Year Selector for Yearly View */}
              <div className="year-selector-controls">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedYear(selectedYear - 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Previous Year
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  disabled={selectedYear >= currentDate.getFullYear()}
                >
                  Next Year
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Set Monthly Budget</h2>
              <button
                className="modal-close"
                onClick={() => setShowBudgetModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="budget-input" className="form-label">Budget Amount (₹)</label>
                <input
                  id="budget-input"
                  type="number"
                  className="form-input"
                  placeholder="Enter your monthly budget"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowBudgetModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateBudget}
                >
                  Update Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
