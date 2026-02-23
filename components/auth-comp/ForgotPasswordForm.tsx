"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Send } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // WordPress Custom REST API endpoint for password reset
      const response = await fetch(
        "https://shoplocal.kinsta.cloud/wp-json/shoplocal-api/v1/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_login: email, // WordPress accepts username or email
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send reset email. Please try again.",
        );
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Back button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email and well send you reset instructions.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium mb-1">
                Email sent successfully!
              </p>
              <p className="text-sm text-green-700">
                Check your inbox for password reset instructions. Dont forget to
                check your spam folder.
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
            {/* Email Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </Link>

            <button
              onClick={() => setSuccess(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
            >
              Send Another Email
            </button>
          </div>
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
