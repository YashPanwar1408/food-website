'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, FoodItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: FoodItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (item: FoodItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.foodItem._id === action.payload._id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price
        };
      } else {
        const newItem: CartItem = {
          foodItem: action.payload,
          quantity: 1
        };
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price
        };
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.foodItem._id === action.payload);
      if (!itemToRemove) return state;

      const updatedItems = state.items.filter(item => item.foodItem._id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.foodItem.price * itemToRemove.quantity)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.foodItem._id === id);
      
      if (itemIndex === -1) return state;

      const item = state.items[itemIndex];
      const quantityDiff = quantity - item.quantity;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const updatedItems = [...state.items];
      updatedItems[itemIndex].quantity = quantity;
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (item.foodItem.price * quantityDiff)
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: FoodItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};