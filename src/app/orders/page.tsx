
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, Truck, ShoppingBag, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OrderStatus } from '@/types'; // Import OrderStatus enum

// --- Type Definitions ---
interface FoodItem {
  name: string;
  price: number;
}

interface OrderItem {
  foodItem: FoodItem | null;
  quantity: number;
}

interface Order {
  _id: string;
  orderDate: string;
  status: OrderStatus; // Use the enum for status
  totalAmount: number;
  items: OrderItem[];
}

// --- Component ---

const OrdersPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- NEW: Cancel Order Handler ---
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: OrderStatus.CANCELLED }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Update the state locally to reflect the change immediately
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: OrderStatus.CANCELLED } : order
        )
      );

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not cancel the order.');
      console.error('Error cancelling order:', err);
    }
  };
  
  // --- Helper Functions ---
  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.DELIVERED: return <CheckCircle className="h-5 w-5 text-green-500" />;
      case OrderStatus.OUT_FOR_DELIVERY: return <Truck className="h-5 w-5 text-blue-500" />;
      case OrderStatus.PREPARING: return <Clock className="h-5 w-5 text-yellow-500" />;
      case OrderStatus.CONFIRMED: return <Clock className="h-5 w-5 text-yellow-500" />;
      case OrderStatus.CANCELLED: return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case OrderStatus.OUT_FOR_DELIVERY: return 'text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case OrderStatus.PREPARING: return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case OrderStatus.CONFIRMED: return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case OrderStatus.CANCELLED: return 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-muted-foreground bg-muted';
    }
  };
  
  const formatStatus = (status: string) => {
    const formatted = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return t(`orderStatus.${status}`, formatted);
  };

  // --- Render Logic ---

  if (!user) {
    // Render sign-in prompt if user is not logged in
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">{t('ordersPage.pleaseSignIn')}</h1>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('ordersPage.yourOrders')}</h1>
        
        {loading ? (
          <div className="text-center py-16">Loading orders...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">{t('ordersPage.noOrders')}</h3>
            <p className="text-muted-foreground mt-2">{t('ordersPage.noOrdersDesc')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const canCancel = order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PREPARING;
              return (
                <div key={order._id} className="bg-card rounded-lg shadow-md overflow-hidden border">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Order #{order._id.slice(-6)}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </div>
                    </div>
                    <div className="border-t border-border my-4"></div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Items</h4>
                      <ul className="space-y-3">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between items-center text-sm">
                            {item.foodItem ? (
                              <>
                                <span className="text-foreground">{item.foodItem.name} (x{item.quantity})</span>
                                <span className="font-medium text-foreground">₹{(item.foodItem.price * item.quantity).toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-red-500">Item no longer available</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-border my-4"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-sm font-medium text-red-500 hover:text-red-700"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground mr-2">Total:</span>
                        <span className="font-bold text-xl text-primary">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
