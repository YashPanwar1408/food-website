import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from '@/context/CartContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodDelivery - Order Your Favorite Food",
  description: "Fast food delivery service with a wide variety of restaurants and cuisines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <CartProvider>
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
