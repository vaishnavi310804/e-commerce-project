import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { verifyResetOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isAuthenticated } = useAuth();

  const email = state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyResetOtp({
        email,
        otp,
      });

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Verify OTP
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Enter the OTP sent to
          </p>

          <p className="font-semibold text-[#6C63FF]">
            {email}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
              }}
              placeholder="Enter OTP"
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;