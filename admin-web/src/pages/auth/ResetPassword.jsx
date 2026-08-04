import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isAuthenticated } = useAuth();

  const email = state?.email || "";
  const otp = state?.otp || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!email || !otp) {
    navigate("/forgot-password");
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        otp,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      alert("Password reset successfully.");

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Reset Password
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Create a new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#6C63FF]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;