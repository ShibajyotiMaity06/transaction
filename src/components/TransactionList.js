import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa';
import { removeTransaction, editTransaction } from '../redux/transactionsSlice';
import dayjs from 'dayjs';

const incomeColors = ['#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'];
const expenseColors = ['#FFAB91', '#FF8A65', '#FF7043', '#FF5722'];


function TransactionList() {
  const transactions = useSelector(state => state.transactions);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [editTransactionData, setEditTransactionData] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [searchTitle, setSearchTitle] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');

  const handleRemove = (id) => {
    dispatch(removeTransaction({ id }));
  };

  const handleEdit = (transaction) => {
    setEditTransactionData(transaction);
    setEditMode(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTransactionData({ ...editTransactionData, [name]: value });
  };

  const handleEditSubmit = (e) => {
  e.preventDefault();
  const updatedTransaction = {
    ...editTransactionData,
    amount: parseFloat(editTransactionData.amount)
  };

  dispatch(editTransaction({ id: editTransactionData.id, updatedTransaction }));
  setEditMode(false);
  setEditTransactionData(null);
};

  const calculateTotals = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    let totalAmount = 0;

    transactions.forEach(transaction => {
      totalAmount += transaction.amount;

      if (transaction.amount > 0 && transaction.type === 'Income') {
        incomeTotal += transaction.amount;
      }

      if (transaction.amount > 0 && transaction.type === 'Expense') {
        expenseTotal += transaction.amount;
      }
    });

    return { incomeTotal, expenseTotal };
  };

  const { incomeTotal, expenseTotal } = calculateTotals();

  const data = {
    income: [
      { name: 'Income', value: incomeTotal },
    ],
    expense: [
      { name: 'Expense', value: expenseTotal },
    ],
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const categories = {
  income: ['Salary', 'Bonus', 'Investment'],
  expense: ['Food', 'Rent', 'Utilities', 'Entertainment']
};



  const filteredTransactions = transactions.filter(transaction => {

    const isSameMonth = dayjs(transaction.date).isSame(currentMonth, 'month');

    const matchesType = filterType === '' || 
      (filterType === 'income' && transaction.amount > 0 && transaction.type === 'Income') ||
      (filterType === 'expense' && transaction.amount > 0 && transaction.type === 'Expense');

    const matchesTitle = searchTitle === '' || transaction.title.toLowerCase().includes(searchTitle.toLowerCase());

    const matchesCategory = filterCategory === '' || transaction.category === filterCategory;

    const matchesCurrency = filterCurrency === '' || transaction.currency === filterCurrency;

    return isSameMonth && matchesType && matchesTitle && matchesCategory && matchesCurrency;
  });

  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = dayjs(transaction.date).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = { transactions: [], income: 0, expense: 0 };
    }
    if (transaction.amount > 0 && transaction.type === 'Income') {
      acc[date].income += transaction.amount;
    } else if (transaction.amount > 0 && transaction.type === 'Expense') {
      acc[date].expense += transaction.amount;
    }
    acc[date].transactions.push(transaction);
    return acc;
  }, {});


  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>

            <div className="flex justify-between mb-4">
        <button onClick={handlePrevMonth} className="bg-yellow-500 text-white p-2 rounded">Previous Month</button>
        <div className="text-lg font-bold">{currentMonth.format('MMMM YYYY')}</div>
        <button onClick={handleNextMonth} className="bg-violet-900 text-white p-2 rounded">Next Month</button>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap space-x-2 mb-2">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Search by title"
            className="flex-grow p-2 border rounded"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-grow p-2 border rounded"
          >
            <option value="">type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-grow p-2 border rounded"
          >
            <option value="">category</option>
            {filterType === 'income' &&
              categories.income.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            {filterType === 'expense' &&
              categories.expense.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            className="flex-grow p-2 border rounded"
          >
            <option value="">currency</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="RUB">RUB</option>
            <option value="EUR">EUR</option>
            <option value="CNY">CNY</option>
            <option value="LKR">LKR</option>
          </select>
        </div>
      </div>


<div className="flex justify-between mb-4">
  <div className="w-1/2">
    <h3 className="text-lg font-bold mb-2">Income</h3>
    <PieChart width={400} height={250}>
      <Pie
        data={data.income}
        dataKey="value"
        outerRadius={80}
        label
      >
        {data.income.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={incomeColors[index % incomeColors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
    <div className="flex justify-center">
      <span className="bg-gradient-to-r from-green-200 via-green-500 to-green-700 text-white p-2 rounded inline-block">
        Total Income: ${incomeTotal.toFixed(2)}
      </span>
    </div>
  </div>
  <div className="w-1/2">
    <h3 className="text-lg font-bold mb-2">Expense</h3>
    <PieChart width={400} height={250}>
      <Pie
        data={data.expense}
        dataKey="value"
        outerRadius={80}
        label
      >
        {data.expense.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={expenseColors[index % expenseColors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
    <div className="flex justify-center">
      <span className="bg-gradient-to-r from-red-300 via-red-500 to-red-700 text-white p-2 rounded inline-block">
        Total Expense: ${expenseTotal.toFixed(2)}
      </span>
    </div>
  </div>
</div>

      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, { transactions, income, expense }]) => (
          <div key={date} className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-md">
            <div className="font-bold mb-2">{date} - Total Income: ${income.toFixed(2)} | Total Expense: ${expense.toFixed(2)}</div>
            <ul className="space-y-4">
              {transactions.map(transaction => (
                <li key={transaction.id} className="flex justify-between items-center p-2 rounded">
                  <div className="flex-1">
                    <div className={`font-bold ${transaction.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.title}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.note}</div>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <div className="text-sm">{transaction.amount.toFixed(2)}</div>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(transaction.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {editMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-4 relative">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Transaction</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="date"
                name="date"
                value={editTransactionData.date}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="number"
                name="amount"
                value={editTransactionData.amount}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
                placeholder="Amount"
                required
              />
              <input
                type="text"
                name="currency"
                value={editTransactionData.currency}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
                placeholder="Currency"
                required
              />
              <input
                type="text"
                name="title"
                value={editTransactionData.title}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
                placeholder="Title"
                required
              />
              <textarea
                name="note"
                value={editTransactionData.note}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
                placeholder="Note"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;


