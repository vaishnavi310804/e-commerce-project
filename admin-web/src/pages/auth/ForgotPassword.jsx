import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({ email });

      navigate("/verify-reset-otp", {
        state: {
          email,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to send OTP."
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
            Forgot Password
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Enter your registered email address to receive a password reset OTP.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
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
            className="w-full rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-2xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;