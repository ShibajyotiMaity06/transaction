import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

function App() {
  return (

    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Transaction Manager</h1>
            <TransactionForm /> 
            <TransactionList />
        </div>
      </div>
    </Provider>


  );
}

export default App;
