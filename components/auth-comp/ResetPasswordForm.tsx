"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get key and login from URL params
  const key = searchParams.get("key");
  const login = searchParams.get("login");

  useEffect(() => {
    if (!key || !login) {
      setError(
        "Invalid or missing reset link. Please request a new password reset.",
      );
    }
  }, [key, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!key || !login) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://shoplocal.kinsta.cloud/wp-json/shoplocal-api/v1/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: key,
            login: login,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reset password. Please try again.",
        );
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-sm">Enter your new password below</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium mb-1">
                Password reset successful!
              </p>
              <p className="text-sm text-green-700">
                Redirecting to login page...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter new password"
                  required
                  disabled={!key || !login}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  required
                  disabled={!key || !login}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !key || !login}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition flex items-center justify-center gap-2"
          >
            Go to Login
          </Link>
        )}

        {/* Help text */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 text-center">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-green-500 hover:text-green-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
