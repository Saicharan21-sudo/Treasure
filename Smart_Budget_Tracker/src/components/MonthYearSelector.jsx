import { getMonthName } from '../utils/helpers';
import './MonthYearSelector.css';

function MonthYearSelector({ selectedMonth, selectedYear, onMonthChange, onYearChange }) {
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: getMonthName(i)
    }));

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const handlePrevYear = () => {
        onYearChange(selectedYear - 1);
    };

    const handleNextYear = () => {
        onYearChange(selectedYear + 1);
    };

    const handleCurrentMonth = () => {
        onMonthChange(currentMonth);
        onYearChange(currentYear);
    };

    return (
        <div className="month-year-selector">
            <div className="selector-header">
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={handleCurrentMonth}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    This Month
                </button>
            </div>

            <div className="selector-controls">
                {/* Month Selector */}
                <div className="form-group">
                    <label className="form-label">Month</label>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => onMonthChange(parseInt(e.target.value))}
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value} style={{ color: "black" }}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year Selector */}
                <div className="form-group">
                    <label className="form-label">Year</label>
                    <div className="year-controls">
                        <button
                            className="year-btn"
                            onClick={handlePrevYear}
                            aria-label="Previous Year"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <div className="year-display">{selectedYear}</div>
                        <button
                            className="year-btn"
                            onClick={handleNextYear}
                            aria-label="Next Year"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="selected-period">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Viewing: <strong>{getMonthName(selectedMonth)} {selectedYear}</strong>
            </div>
        </div>
    );
}

export default MonthYearSelector;
