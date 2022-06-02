import { configureStore } from '@reduxjs/toolkit';

import uiSlice from './ui-slice';
import cartReducer from './cart';
import productsReducer from './products';

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

export default store;
