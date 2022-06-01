import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    {
      id: 'p1',
      title: 'My Product',
      price: 6,
      description: 'This is a first product - amazing!',
    },
    {
      id: 'p2',
      title: '노트북',
      price: 3000,
      description: '최고의 성능을 자랑하는 노트북!',
    },
    {
      id: 'p3',
      title: '선풍기',
      price: 200,
      description: '시원한 여름을 보내세요.',
    },
  ],
};

const produectsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export const productsActions = produectsSlice.actions;

export default produectsSlice.reducer;
