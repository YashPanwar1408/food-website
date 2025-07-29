# FoodDelivery - Full Stack Food Delivery App

A modern food delivery application built with Next.js, similar to Swiggy and Zomato, featuring user authentication, cart management, search functionality, and payment integration.

## 🚀 Features

- **User Authentication**: Secure authentication using Clerk
- **Food Catalog**: Browse through various food items with detailed information
- **Search & Filter**: Advanced search with category, price, and dietary filters
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Secure payment integration with Razorpay
- **Order Management**: Track order history and status
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic cart updates and order tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Payment**: Razorpay
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-delivery-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
food-delivery-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── cart/              # Cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── orders/            # Orders history page
│   │   ├── search/            # Search page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── FoodCard.tsx       # Food item card
│   │   └── Navbar.tsx         # Navigation bar
│   ├── context/               # React contexts
│   │   └── CartContext.tsx    # Cart state management
│   ├── lib/                   # Utility libraries
│   │   └── mongodb.ts         # Database connection
│   ├── models/                # MongoDB models
│   │   ├── User.ts
│   │   ├── Restaurant.ts
│   │   ├── FoodItem.ts
│   │   └── Order.ts
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── .env.local                 # Environment variables
└── package.json
```

## 🔧 Key Components

### Authentication
- Integrated with Clerk for secure user authentication
- Sign in/sign up modals
- Protected routes for orders and checkout

### Cart Management
- Global cart state using React Context
- Add/remove items functionality
- Quantity management
- Persistent cart data

### Search & Filtering
- Text-based search across food items
- Category filtering
- Price range filtering
- Dietary preference filtering (Vegetarian/Non-vegetarian)
- Sorting by price, rating, and preparation time

### Payment Integration
- Razorpay payment gateway integration
- Secure payment processing
- Order confirmation and tracking

### Database Models
- **User**: User profiles and addresses
- **Restaurant**: Restaurant information
- **FoodItem**: Food items with details
- **Order**: Order history and tracking

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Loading States**: Skeleton loaders for better UX
- **Interactive Elements**: Hover effects and smooth transitions
- **Toast Notifications**: User feedback for actions
- **Modern Design**: Clean and intuitive interface

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📱 Pages Overview

- **Home (`/`)**: Browse featured food items
- **Search (`/search`)**: Advanced search and filtering
- **Cart (`/cart`)**: Review and manage cart items
- **Checkout (`/checkout`)**: Complete order with payment
- **Orders (`/orders`)**: View order history and status

## 🔐 Environment Setup

Make sure to set up the following services:

1. **Clerk**: Create an account and get your API keys
2. **Razorpay**: Set up a merchant account for payment processing
3. **MongoDB**: Set up a database (local or cloud)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication services
- Razorpay for payment processing
- Tailwind CSS for styling utilities
- Unsplash for food images used in the demo
