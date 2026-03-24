# Budget Tracker

A modern, feature-rich budget tracking web application built with React.

![Budget Tracker](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **💰 Expense Tracking**: Add, view, and delete daily expenses with ease
- **📊 Data Visualization**: Interactive charts (Pie, Bar, Line) for spending analysis
- **🎯 Budget Management**: Set monthly budgets and track spending progress
- **🏷️ Categorization**: Organize expenses into 7 default categories
- **💾 Data Persistence**: All data saved locally using localStorage
- **🎨 Premium UI**: Modern glassmorphism design with smooth animations
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark Theme**: Beautiful dark mode interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project:
```bash
cd budget-tracker-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to:
```
http://localhost:5173/
```

## 🎯 How to Use

### Setting Your Budget

1. Click the **"Set Budget"** button in the header
2. Enter your monthly budget amount in the modal
3. Click **"Update Budget"** to save

### Adding Expenses

1. Fill out the expense form on the left:
   - **Amount**: Enter the expense amount in ₹
   - **Date**: Select the expense date
   - **Category**: Choose from available categories
   - **Description**: Add details about the expense
2. Click **"Add Expense"**
3. Your expense appears immediately in the list

### Viewing Analytics

- **Budget Summary Cards**: View budget, expenses, remaining balance, and transaction count
- **Pie Chart**: See how much you spend in each category
- **Bar Chart**: Identify your top spending categories
- **Line Chart**: Track your spending trend over the last 7 days

### Managing Expenses

- View all expenses in the expense list
- Click the trash icon (🗑️) to delete an expense
- Confirm deletion when prompted

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 7.3.1
- **Charts**: Chart.js + react-chartjs-2
- **Date Utilities**: date-fns
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Hooks
- **Storage**: localStorage API

## 📂 Project Structure

```
budget-tracker-app/
├── src/
│   ├── components/         # React components
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── BudgetSummary.jsx
│   │   └── Charts.jsx
│   ├── utils/              # Utility functions
│   │   ├── localStorage.js
│   │   └── helpers.js
│   ├── App.jsx             # Main application
│   ├── index.css           # Global styles & design system
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

## 🎨 Design Features

- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Gradient Color Scheme**: Purple and blue gradient theme
- **Smooth Animations**: Transitions and micro-interactions
- **Responsive Grid**: Adapts to all screen sizes
- **Custom Scrollbar**: Styled for consistency
- **Progress Indicators**: Visual budget tracking with color-coded status

## 📱 Responsive Breakpoints

- **Desktop**: 1400px max-width container
- **Tablet**: 768px and below
- **Mobile**: 640px and below

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Default Categories

1. 🍔 Food & Dining
2. 🚗 Transport
3. 🎭 Entertainment
4. 💡 Bills & Utilities
5. 🛍️ Shopping
6. 💪 Health & Fitness
7. 📦 Other

## 💾 Data Storage

All data is stored locally in your browser using localStorage:
- **Expenses**: Complete expense records
- **Budget**: Monthly budget amount
- **Categories**: Category configurations

Your data persists across browser sessions and is never sent to external servers.

## 🌟 Features Roadmap

Future enhancements could include:
- Export data to CSV/PDF
- Date range filtering
- Multiple budget periods
- Recurring expense templates
- Income tracking
- Cloud synchronization
- Multi-currency support

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 🙏 Acknowledgments

- Icons: Feather Icons (via inline SVG)
- Fonts: Inter by Google Fonts
- Charts: Chart.js library
- Build Tool: Vite

---

**Built with ❤️ using React and Vite**

For support or questions, please open an issue in the project repository.
=======
# AI-Projects
>>>>>>> c3d0139bf715c30f4b84e99438e565eac601003d
