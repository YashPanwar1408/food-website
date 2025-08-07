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

// FIX: New helper function to reliably calculate totals from the items array.
// This is the source of truth for all calculations.
const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
    return { totalItems, totalAmount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.foodItem._id === action.payload._id
      );
      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item exists, just update quantity
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // New item, add to cart
        const newItem: CartItem = { foodItem: action.payload, quantity: 1 };
        updatedItems = [...state.items, newItem];
      }
      
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return { items: updatedItems, totalItems, totalAmount };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.foodItem._id !== action.payload);
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return { items: updatedItems, totalItems, totalAmount };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or less, treat it as a remove action
        const updatedItems = state.items.filter(item => item.foodItem._id !== id);
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        return { items: updatedItems, totalItems, totalAmount };
      }

      const updatedItems = state.items.map(item =>
        item.foodItem._id === id ? { ...item, quantity } : item
      );

      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return { items: updatedItems, totalItems, totalAmount };
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