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
import Shipment from "../pages/shipments/Shipment";
import Returns from "../pages/returns/Returns";
import Tickets from "../pages/tickets/Tickets";
import Admins from "../pages/admins/Admins";
import AuditLogs from "../pages/audit/AuditLogs";
import CustomerAuditLogs from "../pages/audit/CustomerAuditLogs";

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
        path="/return"
        element={
          <ProtectedRoute>
            <Returns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipment"
        element={
          <ProtectedRoute>
            <Shipment />
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
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admins"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <Admins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-audit-logs"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <CustomerAuditLogs />
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
