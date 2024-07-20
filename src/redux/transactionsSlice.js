import { createSlice } from '@reduxjs/toolkit';

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: [],
  reducers: {
    addTransaction: (state, action) => {
      state.push(action.payload);
    },
    editTransaction: (state, action) => {
      const { id, updatedTransaction } = action.payload;
      const index = state.findIndex(transaction => transaction.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updatedTransaction };
      }
    
    },
    removeTransaction: (state, action) => {
      return state.filter(transaction => transaction.id !== action.payload.id);
    },
  },
});

export const { addTransaction, editTransaction, removeTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
