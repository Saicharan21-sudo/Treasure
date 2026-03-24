import { formatDate, formatCurrency } from './helpers';

/**
 * Export expenses to CSV format
 * @param {Array} expenses - Array of expense objects
 * @param {Object} options - Export options (dateRange, filters)
 * @returns {void}
 */
export const exportToCSV = (expenses, options = {}) => {
    if (!expenses || expenses.length === 0) {
        alert('No expenses to export');
        return;
    }

    // CSV headers
    const headers = ['Date', 'Category', 'Description', 'Amount (₹)'];

    // Convert expenses to CSV rows
    const rows = expenses.map(expense => [
        formatDate(expense.date),
        expense.category,
        `"${expense.description}"`, // Wrap in quotes to handle commas
        expense.amount
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Generate filename
    const filename = generateFilename(options);

    // Create download link
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

/**
 * Generate filename for export
 * @param {Object} options - Export options
 * @returns {string} - Filename
 */
const generateFilename = (options = {}) => {
    const date = new Date();
    const timestamp = date.toISOString().split('T')[0];

    if (options.dateRange) {
        return `expenses_${options.dateRange.start}_to_${options.dateRange.end}.csv`;
    }

    if (options.month && options.year) {
        return `expenses_${options.year}_${String(options.month).padStart(2, '0')}.csv`;
    }

    if (options.year) {
        return `expenses_${options.year}.csv`;
    }

    return `expenses_${timestamp}.csv`;
};

/**
 * Export yearly summary to CSV
 * @param {Object} yearlyData - Yearly summary data
 * @param {number} year - Year
 */
export const exportYearlySummary = (yearlyData, year) => {
    const headers = ['Month', 'Total Expenses (₹)', 'Number of Transactions'];

    const rows = yearlyData.map(month => [
        month.name,
        month.total,
        month.count
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `yearly_summary_${year}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
