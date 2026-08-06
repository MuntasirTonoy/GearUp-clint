# GearUp - Sports & Outdoor Gear Rental Platform

[![Vercel](https://vercel.com/button)](https://gearup-clint.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GearUp is a modern full-stack platform for renting sports and outdoor gear from trusted local providers. Borrow quality equipment on-demand without the long-term commitment or storage hassle.

## 🚀 Live Demo

[**gearup-clint.vercel.app**](https://gearup-clint.vercel.app)

---

## 📋 Features

### 🏠 **Public Experience**

- **Stunning Homepage** - Animated hero section with gradient shimmer effects, floating gear icons, and statistics counter
- **Browse & Search Gear** - Filter by category, price range, and search keywords with URL-sync state
- **Interactive Filters** - Price range slider, category dropdown, and debounced search input
- **Gear Detail Pages** - Image gallery with Cloudinary images, specifications table, provider info, and reviews
- **Featured Gear Section** - Auto-selected featured items on the homepage

### 🔐 **Authentication & Authorization**

- **Role-Based Access** - Three user roles: Customer, Provider, Admin
- **JWT Authentication** - Secure HTTP-only cookies with access/refresh token flow
- **Automatic Token Refresh** - Seamless session management with interceptor
- **Route Protection** - Protected routes for each role's dashboard
- **Social Login Ready** - Architecture supports future OAuth integrations

### 👤 **User Dashboard - Customer**

- **Personal Profile** - Avatar, username, and account details
- **My Rentals** - View all rentals with status badges
  - **PLACED** → Yellow
  - **CONFIRMED** → Blue  
  - **PAID** → Purple
  - **PICKED_UP** → Green
  - **RETURNED** → Gray
  - **CANCELLED** → Red
- **Rent Gear** - Select dates, quantities, and process Stripe payments
- **Cart Management** - Pending rentals with bulk payment capability
- **Payment History** - Track all transactions

### 🛠️ **User Dashboard - Provider**

- **Provider Registration** - Extended profile with business name, description, and address
- **Overview Stats** - Total listings, pending requests
- **My Gear Management** - View, edit, and delete gear listings
- **Order Management** - Approve/reject rental requests
- **Earnings Tracking** - View payment history and platform fees
- **Add New Gear** - Upload up to 5 images with form validation

### 👨‍💼 **Admin Dashboard**

- **Platform Metrics** - Total users, active gear, platform fee rate
- **User Management** - View and manage all customers and providers
- **Gear Moderation** - Monitor all listings across providers
- **Rental Oversight** - Track platform-wide rental activity
- **Category Management** - Manage gear categories

### 💳 **Payments & Checkout**

- **Stripe Integration** - Secure payment processing
- **Checkout Flow** - Initiated via REST API, completed in Stripe Checkout
- **Payment Status Tracking** - Real-time status updates (PENDING, PAID, FAILED, REFUNDED)
- **Payment Success/Cancel Pages** - User-friendly post-checkout experiences

### ⭐ **Reviews & Ratings**

- **Star Ratings** - 1-5 star system for gear reviews
- **Review Submission** - Leave feedback after rental completion
- **Average Rating Display** - Aggregate rating on gear detail pages
- **User Avatars** - Display profile photos in reviews

### 🎨 **Design & UX**

- **Responsive Design** - Mobile-first approach with mobile menu
- **Dark/Light Theme** - Seamless theme toggle with system preference detection
- **shadcn/ui Components** - Consistent, accessible UI primitives
- **Lucide Icons** - Clean, modern iconography
- **Smooth Animations** - Fade-up, float, and scale-in animations
- **Navbar with Auth State** - Real-time login/logout state management

### 📱 **Mobile Experience**

- **Responsive Layout** - Optimized for all screen sizes
- **Hamburger Menu** - Collapsible navigation on mobile
- **Touch-Friendly Controls** - Date pickers, buttons, and forms

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **State Management** | Zustand |
| **HTTP Client** | Axios with interceptors |
| **Authentication** | JWT (HTTP-only cookies) |
| **Payments** | Stripe |
| **Images** | Cloudinary + next/image |
| **Toast Notifications** | sonner |
| **Animations** | tw-animate-css |

---

## 📁 Project Structure

```
src/
├── app/                     # App Router pages and layouts
│   ├── (auth)/              # Login, Register, Password Reset
│   ├── dashboard/
│   │   ├── customer/       # Customer portal pages
│   │   ├── provider/       # Provider portal pages
│   │   └── admin/          # Admin panel pages
│   ├── gear/                # Gear browsing and details
│   ├── checkout/          # Stripe checkout flow
│   ├── payment/           # Payment success/cancel pages
│   └── help/                # Help center
├── components/
│   ├── auth/               # Login/Register forms
│   ├── dashboard/          # Dashboard components
│   ├── gear/               # Gear browsing components
│   ├── payment/            # Checkout components
│   ├── provider/           # Provider components
│   ├── shared/             # Navbar, Footer, PublicShell
│   └── ui/                 # shadcn/ui primitives
├── services/               # Typed API service modules
├── store/                  # Zustand state stores
├── types/                  # TypeScript interfaces
└── utils/                  # Helper utilities
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Backend API running at `http://localhost:5000/api`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/gearup-clint.git
cd gearup-clint

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🎯 Roadmap

- [x] User authentication with role-based access
- [x] Gear browsing and filtering
- [x] Rental booking system
- [x] Stripe payment integration
- [ ] Real-time notifications
- [ ] Messaging between customers and providers
- [ ] Admin dashboard enhancements
- [ ] Mobile app (React Native)

---

## 📖 API Documentation

The frontend communicates with a separate backend API. See the [backend repository](link-to-backend) for detailed API documentation.

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/users/me` | GET | Get current user profile |
| `/gears` | GET | Browse gear with filters |
| `/gears/:id` | GET | Get gear details |
| `/gears` | POST | Create new gear (provider) |
| `/gears/:id` | DELETE | Delete gear (provider/admin) |
| `/rentals` | POST | Create rental request |
| `/rentals/my-rentals` | GET | Get user's rentals |
| `/payments/initiate` | POST | Start Stripe payment |
| `/reviews` | POST | Submit gear review |
| `/categories` | GET | Get gear categories |
| `/providers/stats` | GET | Provider statistics |
| `/admin/overview` | GET | Admin platform metrics |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **GearUp Team** - Initial work

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Cloudinary](https://cloudinary.com/) - Image CDN
- [Stripe](https://stripe.com/) - Payment processing