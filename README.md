# E-Commerce

A production-style cross-platform e-commerce application built as an internship project to demonstrate full-stack application development, microservices architecture, mobile development, web development, authentication, REST APIs, and scalable backend design.

The project consists of three independent applications:

* **Customer Mobile App** built with React Native (Expo)
* **Admin Dashboard** built with React + Vite
* **Backend** built with Node.js, Express, MongoDB, following a two-microservice architecture

The objective is to build the application using clean architecture, reusable components, scalable code organization, and production-ready development practices.

---

# Tech Stack

## Mobile Application

* React Native
* Expo
* JavaScript
* React Navigation
* Axios
* React Hook Form

---

## Admin Dashboard

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router DOM
* Axios
* React Hook Form

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* ES Modules (`"type": "module"`)
* JWT Authentication
* Refresh Tokens
* bcrypt
* Cloudinary
* Multer
* Nodemailer
* dotenv
* CORS
* express-validator

---

# Project Structure

```text
E-Commerce/

├── backend/
│   ├── auth-service/
│   └── ecommerce-service/
│
├── admin/
│
├── mobile/
│
├── .gitignore
└── README.md
```

Each project is completely independent.

---

# Backend Architecture

The backend follows a **microservices architecture** with only two services.

## 1. Auth Service

Responsible only for authentication and authorization.

Responsibilities include:

* User Registration
* Login
* Logout
* JWT Authentication
* Refresh Tokens
* Google Login
* Apple Login
* Email Verification
* Forgot Password
* Reset Password
* Change Password
* Role-Based Authorization

The Auth Service should not contain business logic related to products, orders, or carts.

---

## 2. Ecommerce Service

Responsible for all e-commerce functionality.

Responsibilities include:

* Products
* Categories
* Cart
* Wishlist
* Orders
* Customer Profile
* Profile Image Upload
* Admin Product Management

---

# Backend Folder Structure

The backend uses a **feature-based architecture** instead of the traditional MVC structure.

Example:

```text
src/

├── modules/
│
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   ├── auth.model.js
│   │   ├── auth.validation.js
│   │   └── auth.utils.js
│
├── config/
├── constants/
├── database/
├── middleware/
├── services/
├── templates/
├── utils/
├── validators/
├── app.js
└── server.js
```

The Ecommerce Service should follow the same feature-based structure, with each module (products, categories, cart, orders, etc.) containing its own controller, routes, service, model, and validation files.

---

# Database

During development the application uses **Local MongoDB**.

Later it will be migrated to **MongoDB Atlas**.

Each microservice owns its own database.

Example:

```text
Local MongoDB

├── auth-db
│
└── ecommerce-db
```

Each service manages its own MongoDB connection.

Microservices must never directly access another service's database.

---

# User Roles

Current roles:

* Admin
* Customer

The system should be designed so that additional roles such as **Vendor** can be added later with minimal code changes.

Role-Based Access Control (RBAC) should be implemented from the beginning.

---

# Authentication

Authentication should support:

* Email & Password
* Google Login
* Apple Login
* JWT Access Tokens
* Refresh Tokens
* Email Verification
* Forgot Password
* Reset Password
* Change Password
* Logout

Passwords must always be hashed using bcrypt.

Never store plain text passwords.

---

# Admin Dashboard

The Admin Dashboard is a completely separate React application.

It consumes REST APIs only.

It must never connect directly to MongoDB.

The dashboard manages:

* Customers
* Products
* Categories
* Orders
* Dashboard Analytics

---

# Mobile Application

The customer application is built using React Native with Expo.

The UI follows the provided Behance design.

The application should include reusable components, responsive layouts, and maintainable code.

Avoid hardcoded values whenever possible.

---

# Image Upload

User profile images should be uploaded to Cloudinary.

Only the image URL should be stored in MongoDB.

Images should never be stored permanently on the local server.

---

# REST API Standards

Use RESTful API design.

Example:

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

Use proper HTTP status codes.

Return consistent JSON responses.

---

# Security

Always implement:

* JWT Authentication
* Refresh Tokens
* Password Hashing (bcrypt)
* Role-Based Authorization
* CORS
* Request Validation
* Centralized Error Handling
* Environment Variables
* Secure Cookies (where appropriate)

Never expose secrets or sensitive information.

---

# Coding Standards

The project should follow production-quality coding practices.

Guidelines:

* Use ES Modules (`import` / `export`)
* Use async/await
* Keep business logic inside services
* Avoid duplicated code
* Use reusable utility functions
* Use meaningful naming conventions
* Write modular, scalable, and maintainable code
* Follow feature-based architecture
* Use consistent folder organization
* Prefer composition over duplication

---

# Development Principles

This project is intended to simulate a real-world production application.

Whenever generating code:

* Follow scalable architecture.
* Prefer clean and maintainable code over shortcuts.
* Explain architectural decisions when necessary.
* Avoid unnecessary dependencies.
* Keep the code reusable and modular.
* Write code that can later be containerized using Docker.
* Assume the application will eventually be deployed with MongoDB Atlas.

---

# Future Enhancements

The architecture should make it easy to add features such as:

* Vendor Module
* Payment Gateway Integration
* Notifications
* Coupons
* Product Reviews
* Inventory Management
* Search & Filtering
* Analytics
* Docker
* CI/CD
* API Gateway
* Redis Caching
* Kubernetes Deployment

The codebase should remain flexible enough to support these additions without major restructuring.
