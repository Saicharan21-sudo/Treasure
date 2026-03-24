import { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onAddExpense, categories }) {
    const [formData, setFormData] = useState({
        amount: '',
        category: categories[0]?.id || 'food',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!formData.description.trim()) {
            alert('Please enter a description');
            return;
        }

        onAddExpense({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        // Reset form
        setFormData({
            amount: '',
            category: categories[0]?.id || 'food',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="card expense-form-card fade-in">
            <h2 className="form-title">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="expense-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">Amount (₹)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="form-input"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="form-input"
                        placeholder="What did you spend on?"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Expense
                </button>
            </form>
        </div>
    );
}

export default ExpenseForm;
