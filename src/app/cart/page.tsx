'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const CartPage = () => {
  const { t } = useTranslation();
  const { state, addItem, removeItem, updateQuantity } = useCart();

  const deliveryFee = 40;
  const tax = Math.round(state.totalAmount * 0.05); // 5% tax
  const finalTotal = state.totalAmount + deliveryFee + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('cartPage.empty')}</h1>
          <p className="text-muted-foreground text-lg mb-8">{t('cartPage.emptyDesc')}</p>
          <Link href="/search" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            {t('cartPage.browse')}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('cartPage.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div key={item.foodItem._id} className="bg-card rounded-lg shadow-md p-4 flex items-center space-x-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.foodItem.image}
                    alt={t(item.foodItem.name)}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100px, 100px"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-foreground">{t(item.foodItem.name)}</h2>
                  <p className="text-muted-foreground">₹{item.foodItem.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.foodItem._id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      className="p-1 rounded-full bg-muted hover:bg-muted-foreground text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-3 text-foreground font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.foodItem._id, item.quantity + 1)}
                      className="p-1 rounded-full bg-muted hover:bg-muted-foreground text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.foodItem._id)}
                      className="ml-auto p-1 rounded-full text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-card rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('orderSummary')}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="text-foreground">₹{state.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('deliveryFee')}</span>
                <span className="text-foreground">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('tax')} (5%)</span>
                <span className="text-foreground">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-lg font-semibold text-foreground">{t('total')}</span>
                <span className="text-lg font-bold text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full mt-6 py-3 px-6 rounded-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex justify-center"
            >
              {t('proceedToCheckout')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;