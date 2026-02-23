import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth-comp/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | ShopLocal",
  description: "Reset your ShopLocal account password",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
