import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth-comp/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | ShopLocal",
  description: "Create a new password for your ShopLocal account",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <ResetPasswordForm />
    </div>
  );
}
