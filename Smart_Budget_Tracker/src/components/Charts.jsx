import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { getCategoryTotals } from '../utils/helpers';
import './Charts.css';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Charts({ expenses, categories }) {
    if (expenses.length === 0) {
        return (
            <div className="card fade-in">
                <div className="charts-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <h3>No data to visualize</h3>
                    <p>Add some expenses to see beautiful charts</p>
                </div>
            </div>
        );
    }

    const categoryTotals = getCategoryTotals(expenses);

    // Pie Chart Data - Expenses by Category
    const pieData = {
        labels: categoryTotals.map(item => {
            const cat = categories.find(c => c.id === item.category);
            return cat ? cat.name : item.category;
        }),
        datasets: [{
            data: categoryTotals.map(item => item.total),
            backgroundColor: categoryTotals.map(item => {
                const cat = categories.find(c => c.id === item.category);
                return cat ? cat.color : '#64748b';
            }),
            borderColor: '#1a1a2e',
            borderWidth: 2,
        }]
    };

    // Bar Chart Data - Top Categories
    const barData = {
        labels: categoryTotals.slice(0, 5).map(item => {
            const cat = categories.find(c => c.id === item.category);
            return cat ? cat.name : item.category;
        }),
        datasets: [{
            label: 'Amount Spent',
            data: categoryTotals.slice(0, 5).map(item => item.total),
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderColor: '#8b5cf6',
            borderWidth: 1,
        }]
    };

    // Line Chart Data - Spending Trend (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
    });

    const dailyTotals = last7Days.map(date => {
        const dayExpenses = expenses.filter(e => e.date === date);
        return dayExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    });

    const lineData = {
        labels: last7Days.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
            label: 'Daily Spending',
            data: dailyTotals,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter',
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(139, 92, 246, 0.5)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '₹' + context.parsed.toLocaleString('en-IN');
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
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

    const pieOptions = {
        ...chartOptions,
        scales: undefined,
        plugins: {
            ...chartOptions.plugins,
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter',
                        size: 11
                    },
                    padding: 15
                }
            }
        }
    };

    return (
        <div className="charts-container">
            <div className="card chart-card fade-in">
                <h3 className="chart-title">Expenses by Category</h3>
                <div className="chart-wrapper">
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>

            <div className="card chart-card fade-in">
                <h3 className="chart-title">Top Categories</h3>
                <div className="chart-wrapper">
                    <Bar data={barData} options={chartOptions} />
                </div>
            </div>

            <div className="card chart-card chart-card-wide fade-in">
                <h3 className="chart-title">7-Day Spending Trend</h3>
                <div className="chart-wrapper">
                    <Line data={lineData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}

export default Charts;
