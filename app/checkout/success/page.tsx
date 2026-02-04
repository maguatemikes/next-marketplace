import { Suspense } from "react";
import OrderSuccessClient from "@/components/checkout-comp/OrderSuccessClient";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order confirmation...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
