'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MapPin, CreditCard, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { Address, RazorpayOptions, RazorpayResponse } from '@/types';

// Define the Razorpay instance on the window object for TypeScript
interface RazorpayInstance {
  open(): void;
}
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { state, clearCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for user-facing errors
  const [address, setAddress] = useState<Address>({
    street: '', city: '', state: '', zipCode: '', country: 'India', landmark: ''
  });

  const deliveryFee = 40;
  const tax = Math.round(state.totalAmount * 0.05);
  const finalTotal = state.totalAmount + deliveryFee + tax;

  useEffect(() => {
    if (!loading && state.items.length === 0) {
      router.push('/cart');
    }
  }, [state.items.length, router, loading]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setError(null); // Clear previous errors

    if (!user) {
      setError(t('pleaseSignInToContinue'));
      return;
    }
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      setError(t('pleaseFillAllAddressFields'));
      return;
    }

    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError(t('failedToLoadPaymentGateway'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, currency: 'INR' }),
      });

      const orderData = await response.json();
      if (!orderData.success) {
        console.error("API Error creating Razorpay order:", orderData.details);
        throw new Error(orderData.error || 'Failed to create Razorpay order');
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FoodDelivery',
        description: 'Food Order Payment',
        order_id: orderData.order_id,
        handler: async function (response: RazorpayResponse) {
          try {
            const orderRecordResponse = await fetch('/api/create-order-record', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                items: state.items.map(item => ({
                  foodItem: item.foodItem._id,
                  quantity: item.quantity,
                })),
                totalAmount: finalTotal,
                address: address,
                userId: user?.id,
              }),
            });

            if (orderRecordResponse.ok) {
              clearCart();
              alert(t('paymentSuccessOrderPlaced')); // Using alert here for success is fine
              router.push('/orders');
            } else {
              const errorResult = await orderRecordResponse.json();
              throw new Error(errorResult.error || 'Failed to create order record');
            }
          } catch (error) {
            console.error('Error creating order record:', error);
            setError(t('paymentSuccessButOrderRecordFail'));
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0]?.emailAddress || '',
          contact: user.phoneNumbers[0]?.phoneNumber || '',
        },
        theme: { color: '#ea580c' },
        modal: { 
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
            setLoading(false);
          } 
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : t('paymentFailedTryAgain'));
      setLoading(false);
    }
  };

  if (state.items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('checkout')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Address Form */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4"><MapPin className="h-5 w-5 text-primary mr-2" /><h2 className="text-xl font-semibold text-foreground">{t('deliveryAddress')}</h2></div>
              <div className="space-y-4">
                <div><label htmlFor="street" className="block text-sm font-medium text-muted-foreground mb-1">{t('streetAddress')}</label><input id="street" type="text" value={address.street} onChange={(e) => handleAddressChange('street', e.target.value)} className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('enterStreetAddress')} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="city" className="block text-sm font-medium text-muted-foreground mb-1">{t('city')}</label><input id="city" type="text" value={address.city} onChange={(e) => handleAddressChange('city', e.target.value)} className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('city')} /></div>
                  <div><label htmlFor="state" className="block text-sm font-medium text-muted-foreground mb-1">{t('state')}</label><input id="state" type="text" value={address.state} onChange={(e) => handleAddressChange('state', e.target.value)} className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('state')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="zipCode" className="block text-sm font-medium text-muted-foreground mb-1">{t('zipCode')}</label><input id="zipCode" type="text" value={address.zipCode} onChange={(e) => handleAddressChange('zipCode', e.target.value)} className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('zipCode')} /></div>
                  <div><label htmlFor="country" className="block text-sm font-medium text-muted-foreground mb-1">{t('country')}</label><input id="country" type="text" value={address.country} readOnly className="w-full text-foreground px-3 py-2 border border-border rounded-lg bg-muted" /></div>
                </div>
                <div><label htmlFor="landmark" className="block text-sm font-medium text-muted-foreground mb-1">{t('landmarkOptional')}</label><input id="landmark" type="text" value={address.landmark} onChange={(e) => handleAddressChange('landmark', e.target.value)} className="w-full px-3 text-foreground py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('nearbyLandmark')} /></div>
              </div>
            </div>
            {/* Payment Method */}
            <div className="bg-card rounded-lg shadow-md p-6"><div className="flex items-center mb-4"><CreditCard className="h-5 w-5 text-primary mr-2" /><h2 className="text-xl font-semibold text-foreground">{t('paymentMethod')}</h2></div><p className="text-muted-foreground">{t('securePayment')}</p></div>
          </div>
          {/* Order Summary */}
          <div className="bg-card rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('orderSummary')}</h2>
            <div className="space-y-3 mb-6">{state.items.map((item) => (<div key={item.foodItem._id} className="flex justify-between items-center"><div><p className="font-medium text-foreground">{t(item.foodItem.name)}</p><p className="text-sm text-muted-foreground">{t('qty')}: {item.quantity}</p></div><p className="font-semibold text-foreground">₹{(item.foodItem.price * item.quantity).toFixed(2)}</p></div>))}</div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('subtotal')}</span><span className="text-foreground">₹{state.totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('deliveryFee')}</span><span className="text-foreground">₹{deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('tax')} (5%)</span><span className="text-foreground">₹{tax.toFixed(2)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between"><span className="text-lg font-semibold text-foreground">{t('total')}</span><span className="text-lg font-bold text-primary">₹{finalTotal.toFixed(2)}</span></div>
            </div>
            {/* NEW: Error message display */}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <button onClick={handlePayment} disabled={loading} className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-colors border border-foreground/50 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}>{loading ? t('processing') : `${t('pay')} ₹${finalTotal.toFixed(2)}`}</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;