'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MapPin, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Address } from '@/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
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
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please sign in to continue');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert('Please fill in all address fields');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway');
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_7PCMArr5ZUncX9',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FoodDelivery',
        description: 'Food Order Payment',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          try {
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
                  foodItem: item.foodItem,
                  quantity: item.quantity,
                  restaurant: (item.foodItem.restaurant as any)?._id || item.foodItem.restaurant // Ensure restaurant ID is sent
                })),
                totalAmount: finalTotal,
                address: address,
                userId: user?.id,
                userEmail: user?.emailAddresses[0]?.emailAddress,
                userName: `${user?.firstName} ${user?.lastName}`,
              }),
            });

            if (orderResponse.ok) {
              clearCart();
              alert('Payment successful! Your order has been placed.');
              router.push('/orders');
            } else {
              throw new Error('Failed to create order record');
            }
          } catch (error) {
            console.error('Error creating order:', error);
            alert('Payment successful but failed to create order record. Please contact support.');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0]?.emailAddress || '',
          contact: user.phoneNumbers[0]?.phoneNumber || '',
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
      alert('Payment failed. Please try again.');
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
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-foreground">Delivery Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="State"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="ZIP Code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Country"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-foreground text-sm font-medium text-muted-foreground mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    className="w-full px-3 text-foreground py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
              </div>
              <p className="text-muted-foreground">
                Secure payment powered by Razorpay. We accept all major credit cards, debit cards, and UPI.
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-card rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {state.items.map((item) => (
                <div key={item.foodItem._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{item.foodItem.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
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
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{state.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span className="text-foreground">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-lg font-semibold text-foreground">Total</span>
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
              {loading ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;