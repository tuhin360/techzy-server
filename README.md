<div align="center">

  <!-- Logo & Title -->
  <img src="https://img.icons8.com/fluency/96/000000/server.png" alt="Server Icon" width="70" />

  <h1 style="background: linear-gradient(90deg, #FF8C00, #FF6347, #D2691E); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3.2em; font-weight: 900; margin: 10px 0;">
    Techzy Backend (MERN)
  </h1>

  <p><strong>🔥 Server-side REST APIs with Node.js, Express, MongoDB, SSLCommerz, Stripe & Automated Transaction Mailers</strong></p>

  <!-- Tech Badges -->
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Nodemailer-339933?style=for-the-badge&logo=nodemailer&logoColor=white" alt="Nodemailer" />
  </p>

</div>

---

### 🌈 About Techzy Backend
Handles all server-side operations, transactional workflows, payment gateways, and data integrity controllers for the **Techzy E-commerce platform**:

- 💳 **Dual-Payment Gateways**: Stripe checkout + SSLCommerz local payment gateway integration.
- 📨 **Nodemailer Transaction Emailer**: Fully automated mail server that delivers beautiful industry-standard purchase summaries to users upon successful payment confirmation.
- 🔐 **JWT Session Middleware**: Secure cross-origin cookie/local token signatures with role-based admin validation guards.
- 🚀 **Auto-Database User Sync**: Automatically provisions user records inside MongoDB upon Firebase Google OAuth registration.
- 📦 **API Controllers**: Managed routes for product CRUD, user database indexing, and automated subscriber lists.

---

## 🛠️ Backend Tech Stack

```text
Server Framework:   Node.js • Express.js
Database:           MongoDB (Mongoose / Native Driver)
Session Auth:       Firebase Admin SDK • JsonWebToken (JWT)
Payment Systems:    Stripe Core API • SSLCommerz Merchant Gateway
Email Automation:   Nodemailer (SMTP Relay Client)
Security:           CORS Guards • Dotenv Environment Managers
```

---

## ⚙️ Core Architecture & Enhancements

### 1. Payment Processing (`src/controllers/payment.controller.js`)
- Integrated **SSLCommerz merchant payment credentials** along with standard Stripe API hooks.
- Configured dynamic payment init callback endpoints (`/payment/ssl-init`), IPN (Instant Payment Notification) listener validation routes, and routing callbacks.

### 2. Transaction Emailer System (`src/services/email.service.js`)
- Built an SMTP mailer pipeline utilizing Nodemailer.
- Delivers a structured, premium invoice table detailing purchased items, customer info, transaction IDs, and receipt links automatically upon payment hook resolution.

### 3. Middleware Security & Identity Validation
- Integrated route verifiers (`verifyToken` & `verifyAdmin`) to secure dashboard analytics and catalog mutating operations.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tuhin360/techzy.git
   cd techzy-server
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Create a `.env` configuration file:**
   ```env
   PORT=5000
   DB_USER=yourMongoUser
   DB_PASSWORD=yourMongoPassword
   JWT_SECRET=yourJwtSecret
   STRIPE_SECRET_KEY=yourStripeSecretKey
   STORE_ID=yourSSLCommerzStoreId
   STORE_PASSWORD=yourSSLCommerzStorePassword
   IS_LIVE=false
   EMAIL_USER=yourSMTPAuthEmail
   EMAIL_PASS=yourSMTPAuthPassword
   ```

4. **Run in development mode:**
   ```bash
   pnpm dev
   ```
   *The server runs locally at `http://localhost:5000`.*