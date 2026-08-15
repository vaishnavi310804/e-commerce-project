import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import Categories from "../pages/categories/Categories";
import Products from "../pages/products/Products";
import Orders from "../pages/orders/Orders";
import Customers from "../pages/customers/Customers";
import Reviews from "../pages/reviews/Reviews";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import Refunds from "../pages/refunds/Refunds";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/refund"
        element={
          <ProtectedRoute>
            <Refunds />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/verify-reset-otp" element={<VerifyOtp />} />

      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default AppRoutes;
