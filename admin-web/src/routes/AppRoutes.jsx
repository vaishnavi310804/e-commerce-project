import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
import MyAssignedTickets from "../pages/tickets/MyAssignedTickets";
import Admins from "../pages/admins/Admins";
import AuditLogs from "../pages/audit/AuditLogs";
import CustomerAuditLogs from "../pages/audit/CustomerAuditLogs";
import RoleManager from "../pages/roles/RoleManager";
import FeatureToggles from "../pages/config/FeatureToggles";
import FeatureGuard from "../components/common/FeatureGuard";
import Notifications from "../pages/notifications/Notifications";
import SessionManagement from "../pages/sessions/SessionManagement";

function PromotionalRouteGuard({ children }) {
  const { user } = useAuth();

  const isSuperOrFullAdmin =
    user?.role === "SUPER_ADMIN" ||
    !user?.roleId ||
    user?.roleId?.name === "FULL_ADMIN";

  if (!isSuperOrFullAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

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
            <FeatureGuard moduleKey="CATEGORIES">
              <Categories />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="PRODUCTS">
              <Products />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="ORDERS">
              <Orders />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/refund"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="REFUNDS">
              <Refunds />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/return"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="RETURNS">
              <Returns />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipment"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="SHIPMENTS">
              <Shipment />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="CUSTOMERS">
              <Customers />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="REVIEWS">
              <Reviews />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="TICKETS">
              <Tickets />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-assigned-tickets"
        element={
          <ProtectedRoute>
            <FeatureGuard moduleKey="TICKETS">
              <MyAssignedTickets />
            </FeatureGuard>
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
        path="/roles"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <RoleManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-management"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SessionManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feature-toggles"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <FeatureToggles />
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
            <FeatureGuard moduleKey="CUSTOMER_LOGS">
              <CustomerAuditLogs />
            </FeatureGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <PromotionalRouteGuard>
              <FeatureGuard moduleKey="NOTIFICATIONS">
                <Notifications />
              </FeatureGuard>
            </PromotionalRouteGuard>
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
