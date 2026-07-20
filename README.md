# E-Commerce

A full-stack e-commerce project with a customer mobile app, an admin web app, and two Node.js backend services.

The codebase is split into independent apps so each part can be developed, run, and deployed separately.

## Applications

- `mobile-app` - Customer app built with Expo, React Native, TypeScript, and Expo Router.
- `admin-web` - Admin dashboard built with React and Vite.
- `backend/auth-service` - Authentication service for users, JWT tokens, logout, and password reset.
- `backend/ecommerce-service` - Product, category, cart, wishlist, address, order, and review service.

## Tech Stack

### Mobile App

- Expo
- React Native
- TypeScript
- Expo Router
- Axios
- React Native Confirmation Code Field

### Admin Web

- React
- Vite
- ESLint

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- ES Modules
- JWT
- bcrypt
- express-validator
- Multer
- Cloudinary
- Nodemailer
- CORS
- dotenv

## Project Structure

```text
E-Commerce/
|-- admin-web/
|   |-- src/
|   |-- package.json
|   `-- vite.config.js
|
|-- backend/
|   |-- auth-service/
|   |   |-- src/
|   |   |   |-- config/
|   |   |   |-- middleware/
|   |   |   |-- modules/auth/
|   |   |   `-- services/
|   |   |-- index.js
|   |   `-- package.json
|   |
|   `-- ecommerce-service/
|       |-- src/
|       |   |-- config/
|       |   |-- middleware/
|       |   |-- modules/
|       |   |   |-- address/
|       |   |   |-- cart/
|       |   |   |-- categories/
|       |   |   |-- orders/
|       |   |   |-- products/
|       |   |   |-- profile/
|       |   |   |-- reviews/
|       |   |   |-- users/
|       |   |   `-- wishlist/
|       |   `-- utils/
|       |-- index.js
|       |-- server.js
|       `-- package.json
|
|-- mobile-app/
|   |-- app/
|   |-- assets/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- constants/
|   |   `-- screens/
|   |-- app.json
|   |-- package.json
|   `-- tsconfig.json
|
`-- README.md
```

## Backend Services

### Auth Service

Default port: `5000`

Base URL:

```text
http://localhost:5000/api/v1/auth
```

Implemented auth features:

- Register
- Login
- Get current user
- Logout
- Refresh access token
- Forgot password OTP email
- Verify reset OTP
- Reset password with reset token
- JWT protected routes
- Role field on users: `CUSTOMER` or `ADMIN`

Auth routes:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
POST /api/v1/auth/forgot-password
POST /api/v1/auth/verify-reset-otp
POST /api/v1/auth/reset-password
```

Password reset flow:

1. `POST /forgot-password` with `{ "email": "user@example.com" }`
2. User receives a 6 digit OTP by email.
3. `POST /verify-reset-otp` with `{ "email": "user@example.com", "otp": "123456" }`
4. API returns `{ "resetToken": "..." }`
5. `POST /reset-password` with `{ "resetToken": "...", "newPassword": "newPassword123" }`

### Ecommerce Service

Default port: `5001`

Implemented modules:

- Categories
- Products
- Wishlist
- Cart
- Address
- Orders
- Reviews

Base route groups:

```text
/api/v1/category
/api/v1/product
/api/v1/wishlist
/api/v1/cart
/api/v1/address
/api/v1/order
/api/v1/reviews
```

Important ecommerce routes:

```text
POST   /api/v1/category/create
GET    /api/v1/category/getAll
GET    /api/v1/category/get/:id
PUT    /api/v1/category/update/:id
PATCH  /api/v1/category/status/:id

POST   /api/v1/product/create
GET    /api/v1/product/getAll
GET    /api/v1/product/admin/getAll
GET    /api/v1/product/get/:id
PUT    /api/v1/product/update/:id
PATCH  /api/v1/product/status/:id

POST   /api/v1/wishlist/add/:productId
GET    /api/v1/wishlist/get
DELETE /api/v1/wishlist/remove/:productId
POST   /api/v1/wishlist/toggle/:productId

POST   /api/v1/cart/add/:productId
GET    /api/v1/cart/get
PATCH  /api/v1/cart/update/:productId
DELETE /api/v1/cart/remove/:productId
DELETE /api/v1/cart/clear

POST   /api/v1/address
GET    /api/v1/address/get
GET    /api/v1/address/:id
PATCH  /api/v1/address/:id
DELETE /api/v1/address/:id

POST   /api/v1/order
GET    /api/v1/order/getOrders
GET    /api/v1/order/:id
PATCH  /api/v1/order/cancel/:id
GET    /api/v1/order/admin/all
GET    /api/v1/order/admin/:id
PATCH  /api/v1/order/admin/:id/status

GET    /api/v1/reviews/product/:productId
POST   /api/v1/reviews/:productId
PATCH  /api/v1/reviews/:reviewId
DELETE /api/v1/reviews/:reviewId
```

## Mobile API Layer

The mobile app keeps backend calls in `mobile-app/src/api`.

Auth API functions currently include:

- `register`
- `login`
- `getCurrentUser`
- `logout`
- `refreshAccessToken`
- `forgotPassword`
- `verifyResetOtp`
- `resetPassword`
- `setAuthToken`

The auth client base URL is currently configured in:

```text
mobile-app/src/api/client.ts
```

Current value:

```text
http://192.168.29.120:5000/api/v1/auth
```

Update this IP address when running the mobile app on a different local network.

## Environment Variables

Create a `.env` file inside each backend service that needs one.

### Auth Service

```env
DATABASE_URL=mongodb://127.0.0.1:27017/auth-db
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
PASSWORD_RESET_SECRET=your_password_reset_secret
PASSWORD_RESET_EXPIRES=10m
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=ShopEase <no-reply@example.com>
```

### Ecommerce Service

```env
DATABASE_URL=mongodb://127.0.0.1:27017/ecommerce-db
JWT_SECRET=your_access_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5001
```

Use the same `JWT_SECRET` in the auth service and ecommerce service so protected ecommerce routes can verify access tokens issued by auth-service.

## Getting Started

Install dependencies separately for each app.

### Auth Service

```bash
cd backend/auth-service
npm install
npm run dev
```

### Ecommerce Service

```bash
cd backend/ecommerce-service
npm install
npm run dev
```

### Mobile App

```bash
cd mobile-app
npm install
npm start
```

Useful mobile commands:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

### Admin Web

```bash
cd admin-web
npm install
npm run dev
```

Other admin commands:

```bash
npm run build
npm run lint
npm run preview
```

## API Response Shape

Backend responses use a consistent JSON shape:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Some success responses may omit `message` or `data` when there is nothing extra to return.

## Security Notes

- Passwords are hashed with bcrypt.
- Protected routes expect an access token in the `Authorization` header.
- Use the format `Bearer <accessToken>`.
- Refresh tokens are stored on the user record and rotated when refreshed.
- Password reset OTPs are hashed before being stored.
- Secrets must stay in `.env` files and should not be committed.

## Current Development Notes

- The auth-service runs on port `5000`.
- The ecommerce-service runs on `process.env.PORT || 5001`.
- The mobile app currently points directly to the auth-service local network IP.
- Product image upload uses Multer and Cloudinary.
- Admin-only backend actions use role authorization middleware.

## Future Enhancements

- Wire the mobile forgot-password, OTP, and reset-password screens to the updated auth API methods.
- Add payment gateway integration.
- Add coupons and promotions.
- Add inventory management.
- Add search and filtering.
- Add analytics for the admin dashboard.
- Add Docker support.
- Add CI/CD.
- Add an API gateway for service routing.
