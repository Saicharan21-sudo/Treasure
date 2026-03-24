import { Bar } from 'react-chartjs-2';
import { getMonthlyTotals, formatCurrency, calculateTotal } from '../utils/helpers';
import { exportYearlySummary } from '../utils/exportUtils';
import './YearlyAnalysis.css';

function YearlyAnalysis({ expenses, year, categories }) {
    const yearExpenses = expenses.filter(expense => {
        const expenseYear = new Date(expense.date).getFullYear();
        return expenseYear === year;
    });

    const monthlyTotals = getMonthlyTotals(expenses, year);
    const yearTotal = calculateTotal(yearExpenses);
    const avgMonthly = yearTotal / 12;

    // Find highest and lowest spending months
    const monthsWithData = monthlyTotals.filter(m => m.total > 0);
    const highestMonth = monthsWithData.reduce((max, month) =>
        month.total > max.total ? month : max
        , { total: 0, name: '-' });

    const lowestMonth = monthsWithData.length > 0
        ? monthsWithData.reduce((min, month) =>
            month.total < min.total ? month : min
        )
        : { total: 0, name: '-' };

    // Chart data
    const chartData = {
        labels: monthlyTotals.map(m => m.name),
        datasets: [{
            label: `Spending in ${year}`,
            data: monthlyTotals.map(m => m.total),
            backgroundColor: monthlyTotals.map(m =>
                m.total === highestMonth.total ? 'rgba(239, 68, 68, 0.8)' :
                    m.total === lowestMonth.total ? 'rgba(16, 185, 129, 0.8)' :
                        'rgba(139, 92, 246, 0.8)'
            ),
            borderColor: monthlyTotals.map(m =>
                m.total === highestMonth.total ? '#ef4444' :
                    m.total === lowestMonth.total ? '#10b981' :
                        '#8b5cf6'
            ),
            borderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(139, 92, 246, 0.5)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return '₹' + context.parsed.y.toLocaleString('en-IN');
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: 'Inter'
                    },
                    callback: function (value) {
                        return '₹' + value.toLocaleString('en-IN');
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        }
    };

    const handleExport = () => {
        exportYearlySummary(monthlyTotals, year);
    };

    return (
        <div className="yearly-analysis fade-in">
            <div className="yearly-header">
                <h2 className="yearly-title">Yearly Analysis - {year}</h2>
                <button className="btn btn-secondary btn-sm" onClick={handleExport}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export Year
                </button>
            </div>

            {/* Summary Cards */}
            <div className="yearly-summary-grid">
                <div className="card yearly-card">
                    <div className="yearly-card-label">Total Spending</div>
                    <div className="yearly-card-value">{formatCurrency(yearTotal)}</div>
                    <div className="yearly-card-meta">{yearExpenses.length} transactions</div>
                </div>

                <div className="card yearly-card">
                    <div className="yearly-card-label">Monthly Average</div>
                    <div className="yearly-card-value">{formatCurrency(avgMonthly)}</div>
                    <div className="yearly-card-meta">Across 12 months</div>
                </div>

                <div className="card yearly-card">
                    <div className="yearly-card-label">Highest Month</div>
                    <div className="yearly-card-value yearly-card-value-danger">{formatCurrency(highestMonth.total)}</div>
                    <div className="yearly-card-meta">{highestMonth.name}</div>
                </div>

                <div className="card yearly-card">
                    <div className="yearly-card-label">Lowest Month</div>
                    <div className="yearly-card-value yearly-card-value-success">{formatCurrency(lowestMonth.total)}</div>
                    <div className="yearly-card-meta">{lowestMonth.name}</div>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className="card yearly-chart-card">
                <h3 className="chart-title">Monthly Breakdown</h3>
                <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Monthly Table */}
            <div className="card">
                <h3 className="table-title">Month-by-Month Details</h3>
                <div className="monthly-table-wrapper">
                    <table className="monthly-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Expenses</th>
                                <th>Transactions</th>
                                <th>% of Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyTotals.map((month, index) => (
                                <tr key={index} className={month.total === 0 ? 'empty-month' : ''}>
                                    <td>{month.name}</td>
                                    <td className="amount-cell">{formatCurrency(month.total)}</td>
                                    <td>{month.count}</td>
                                    <td>
                                        <div className="percentage-bar">
                                            <div
                                                className="percentage-fill"
                                                style={{ width: `${yearTotal > 0 ? (month.total / yearTotal * 100) : 0}%` }}
                                            ></div>
                                            <span className="percentage-text">
                                                {yearTotal > 0 ? ((month.total / yearTotal) * 100).toFixed(1) : 0}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default YearlyAnalysis;
