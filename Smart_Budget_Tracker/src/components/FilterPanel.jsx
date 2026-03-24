import { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({ categories, filters, onFilterChange, onClearFilters }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleCategoryToggle = (categoryId) => {
        const currentCategories = filters.categories || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(id => id !== categoryId)
            : [...currentCategories, categoryId];

        onFilterChange({ ...filters, categories: newCategories });
    };

    const handleDateChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const handleSearchChange = (value) => {
        onFilterChange({ ...filters, searchTerm: value });
    };

    const activeFilterCount = () => {
        let count = 0;
        if (filters.categories && filters.categories.length > 0) count++;
        if (filters.startDate) count++;
        if (filters.endDate) count++;
        if (filters.searchTerm) count++;
        return count;
    };

    return (
        <div className="card filter-panel fade-in">
            <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h3 className="filter-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filters
                    {activeFilterCount() > 0 && (
                        <span className="filter-count">{activeFilterCount()}</span>
                    )}
                </h3>
                <button className="filter-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>

            {isExpanded && (
                <div className="filter-content">
                    {/* Search */}
                    <div className="form-group">
                        <label className="form-label">Search Description</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search expenses..."
                            value={filters.searchTerm || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Date Range */}
                    <div className="form-group">
                        <label className="form-label">Date Range</label>
                        <div className="date-range">
                            <input
                                type="date"
                                className="form-input"
                                value={filters.startDate || ''}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                placeholder="Start Date"
                            />
                            <span className="date-separator">to</span>
                            <input
                                type="date"
                                className="form-input"
                                value={filters.endDate || ''}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                placeholder="End Date"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="form-group">
                        <label className="form-label">Categories</label>
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`category-chip ${(filters.categories || []).includes(category.id) ? 'active' : ''}`}
                                    onClick={() => handleCategoryToggle(category.id)}
                                    style={{
                                        '--category-color': category.color
                                    }}
                                >
                                    <span className="category-dot" style={{ background: category.color }}></span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFilterCount() > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={onClearFilters}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default FilterPanel;
