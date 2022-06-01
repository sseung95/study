import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cart';
import productsReducer from './products';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
});

export default store;
