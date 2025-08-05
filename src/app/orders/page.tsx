'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, CheckCircle, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  _id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: {
    foodItem: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    landmark?: string;
  };
  estimatedDeliveryTime: string;
}

const OrdersPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'preparing':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'confirmed':
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-success bg-success-foreground';
      case 'out_for_delivery':
        return 'text-info bg-info-foreground';
      case 'preparing':
        return 'text-warning bg-warning-foreground';
      case 'confirmed':
        return 'text-info bg-info-foreground';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return t('orderStatus.outForDelivery');
      case 'confirmed':
        return t('orderStatus.confirmed');
      case 'preparing':
        return t('orderStatus.preparing');
      case 'delivered':
        return t('orderStatus.delivered');
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('ordersPage.pleaseSignIn')}</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">{t('ordersPage.yourOrders')}</h1>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4 w-1/4"></div>
                <div className="h-3 bg-muted rounded mb-6 w-1/6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('ordersPage.yourOrders')}</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t('ordersPage.noOrders')}</h3>
            <p className="text-muted-foreground">{t('ordersPage.noOrdersDesc')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-card rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Items Ordered</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-foreground">{item.foodItem.name}</span>
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <div className="font-semibold text-foreground">₹{(item.foodItem.price * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="font-bold text-primary">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Delivery Address</h4>
                      <div className="flex items-start space-x-2 mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <p className="text-foreground text-sm">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}, {order.deliveryAddress.country}
                        </p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Estimated Delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</p>
                        {order.status === 'delivered' && (
                          <p className="text-success font-medium">Delivered</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;