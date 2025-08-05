'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MapPin, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { Address, RazorpayOptions, RazorpayResponse, Restaurant } from '@/types';

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
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    landmark: ''
  });

  const deliveryFee = 40;
  const tax = Math.round(state.totalAmount * 0.05); // 5% tax
  const finalTotal = state.totalAmount + deliveryFee + tax;

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
    if (!user) {
      alert(t('pleaseSignInToContinue'));
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert(t('pleaseFillAllAddressFields'));
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert(t('failedToLoadPaymentGateway'));
        setLoading(false);
        return;
      }

      // Create order on backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'INR',
        }),
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_7PCMArr5ZUncX9',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FoodDelivery',
        description: 'Food Order Payment',
        order_id: orderData.order_id,
        handler: async function (response: RazorpayResponse) {
          // Payment successful
          console.log('Payment successful:', response);
          
          try {
            // Get the restaurant ID from the first item
            const restaurantId = typeof state.items[0].foodItem.restaurant === 'string'
              ? state.items[0].foodItem.restaurant
              : state.items[0].foodItem.restaurant._id;

            // Create order in database
            const orderResponse = await fetch('/api/create-order-record', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                items: state.items.map(item => ({
                  foodItem: item.foodItem._id,
                  quantity: item.quantity,
                })),
                totalAmount: finalTotal,
                address: address,
                userId: user?.id,
                userEmail: user?.emailAddresses[0]?.emailAddress,
                userName: `${user?.firstName} ${user?.lastName}`,
                restaurant: restaurantId,
              }),
            });

            if (orderResponse.ok) {
              clearCart();
              alert(t('paymentSuccessOrderPlaced'));
              router.push('/orders');
            } else {
              throw new Error('Failed to create order record');
            }
          } catch (error) {
            console.error('Error creating order:', error);
            alert(t('paymentSuccessButOrderRecordFail'));
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.emailAddresses[0]?.emailAddress || '',
          contact: user?.phoneNumbers[0]?.phoneNumber || '',
        },
        theme: {
          color: '#ea580c',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert(t('paymentFailedTryAgain'));
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (state.items.length === 0) {
      router.push('/cart');
    }
  }, [state.items.length, router]);

  if (state.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('checkout')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> {t('deliveryAddress')}
              </h2>
            {/* Delivery Address */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-foreground">{t('deliveryAddress')}</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                    {t('streetAddress')}
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('enterStreetAddress')}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                      {t('city')}
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('city')}
                    />
                  </div>
                  <div>
                    <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                      {t('state')}
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('state')}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                      {t('zipCode')}
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('zipCode')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      {t('country')}
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('country')}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                    {t('landmarkOptional')}
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    className="w-full px-3 text-foreground py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('nearbyLandmark')}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-foreground">{t('paymentMethod')}</h2>
              </div>
              <p className="text-muted-foreground">
                {t('securePayment')}
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-card rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('orderSummary')}</h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {state.items.map((item) => (
                <div key={item.foodItem._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{item.foodItem.name}</p>
                    <p className="text-sm text-muted-foreground">{t('qty')}: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    ₹{(item.foodItem.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
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

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-primary-foreground transition-colors ${
                loading
                  ? 'bg-muted cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
              }`}>
              {loading ? t('processing') : `${t('pay')} ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
      <Footer />

    </div>
  );
};

export default CheckoutPage;