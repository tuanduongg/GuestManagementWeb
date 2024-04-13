// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const cartString = localStorage.getItem('CART');
const cart = cartString ? JSON.parse(cartString) : [];

const initialState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
  cart: cart
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },
    addToCart(state, action) {
      const newProduct = action.payload.cart;
      let isContain = false;
      let findProduct = state.cart?.map((product) => {
        if (product?.productID === newProduct?.productID) {
          isContain = true;
          return {
            ...product,
            quantity: parseInt(product?.quantity) + parseInt(newProduct?.quantity)
          };
        }
        return product;
      });
      if (!isContain) {
        findProduct = state?.cart?.concat([newProduct]);
      }
      localStorage.setItem('CART', JSON.stringify(findProduct));
      state.cart = findProduct;
    },
    setCart(state, action) {
      const newCart = action.payload.cart;
      localStorage.setItem('CART', JSON.stringify(newCart));
      state.cart = newCart;
    },
    changeQuantityProduct(state, action) {
      const { quantity, productID } = action.payload.product;
      // let isContain = false;
      let findProduct = state.cart?.map((product) => {
        if (product?.productID === productID) {
          return {
            ...product,
            quantity: quantity
          };
        }
        return product;
      });
      localStorage.setItem('CART', JSON.stringify(findProduct));
      state.cart = findProduct;
    }
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, addToCart, changeQuantityProduct,setCart } = menu.actions;
