import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../redux/transactionsSlice';
import { v4 as uuidv4 } from 'uuid';

function TransactionForm() {
  const [activeTab, setActiveTab] = useState('Income');
  const [date, setDate] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customCategories, setCustomCategories] = useState([]);

  const dispatch = useDispatch();

  const predefinedCategories = {
    Income: ['Salary', 'Investment', 'Other'],
    Expense: ['Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment']
  };

  const handleAddCustomCategory = () => {
    if (customCategory && !customCategories.includes(customCategory)) {
      setCustomCategories([...customCategories, customCategory]);
      setCustomCategory('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = activeTab === 'Income' ? incomeAmount : expenseAmount;
    if (date && amount && category && currency && title) {
      dispatch(addTransaction({
        id: uuidv4(),
        date,
        amount: parseFloat(amount),
        category,
        currency,
        title,
        note,
        type: activeTab,  
      }));
      setDate('');
      setIncomeAmount('');
      setExpenseAmount('');
      setCategory('');
      setCurrency('USD');
      setTitle('');
      setNote('');
    }
  };

  const combinedCategories = [...predefinedCategories[activeTab], ...customCategories];

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-4">
  <div className="flex justify-center mb-6 space-x-60">
        <button
          type="button"
          onClick={() => setActiveTab('Income')}
          className={`px-4 py-2 rounded ${activeTab === 'Income' ? 'bg-gradient-to-r from-green-200 via-green-500 to-green-700 text-white' : 'bg-gray-200 text-gray-800'} transition-colors duration-300`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Expense')}
          className={`px-4 py-2 rounded ${activeTab === 'Expense' ? 'bg-gradient-to-r from-red-300 via-red-500 to-red-700 text-white' : 'bg-gray-200 text-gray-800'} transition-colors duration-300`}
        >
          Expense
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Amount</label>
            {activeTab === 'Income' ? (
              <input
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            ) : (
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="RUB">RUB</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
              <option value="LKR">LKR</option>
            </select>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Category</label>
            <div className="flex mb-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 p-2 border rounded"
                required
              >
                <option value="">Select a category</option>
                {combinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Add new category"
                className="flex-1 ml-2 p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="ml-2 bg-green-500 text-white p-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded h-11"  
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="submit"
          className="p-2 rounded bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 text-white"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
