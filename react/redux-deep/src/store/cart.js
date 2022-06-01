import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      // 만약 이미 존재하는 상품이면 수량, 총합만 변경
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index > -1) {
        state.items[index].quantity += 1;
        state.items[index].total += state.items[index].price;
      } else {
        // items에 추가
        const item = {
          ...action.payload,
          quantity: 1,
          total: action.payload.price,
        };

        state.items.push(item);
      }
    },
    increaseQuantity(state, action) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      state.items[index].quantity += 1;
      state.items[index].total += state.items[index].price;
    },
    decreaseQuantity(state, action) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.items[index].quantity === 1) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity -= 1;
        state.items[index].total -= state.items[index].price;
      }
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
