"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCartStore";

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderItem {
  product_id: number;
  qty: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CheckoutFormProps {
  billing: BillingInfo;
  items: OrderItem[];
  orderTotals: OrderTotals;
  cartItems: CartItem[];
}

export default function CheckoutForm({
  billing,
  items,
  orderTotals,
  cartItems,
}: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { subtotal, shipping, tax, total } = orderTotals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsProcessing(true);

    try {
      let orderId: string;
      const orderData: any = {
        items: cartItems,
        billing,
        shipping: { id: "test", title: "Test Shipping", cost: "0.00" },
        totals: { subtotal, shipping, tax, total },
        date: new Date().toISOString(),
        isTestMode,
      };

      if (isTestMode) {
        // ✅ Test Mode
        console.log("✅ Test mode processing started");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        orderId = `TEST-${Date.now()}`;
        orderData.orderId = orderId;
        console.log("📦 Test Order ID:", orderId);
      } else {
        // ✅ Live Mode with Stripe
        if (!stripe || !elements) throw new Error("Stripe not loaded");

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("Card element not found");

        const { error: stripeError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: `${billing.firstName} ${billing.lastName}`,
              email: billing.email,
              address: {
                line1: billing.address,
                city: billing.city,
                state: billing.state,
                postal_code: billing.zip,
                country: billing.country,
              },
            },
          });

        if (stripeError) throw new Error(stripeError.message);

        // Call WooCommerce API
        const res = await fetch(
          "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/create-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_method: "stripe",
              payment_token: paymentMethod.id,
              billing: {
                first_name: billing.firstName,
                last_name: billing.lastName,
                address_1: billing.address,
                city: billing.city,
                state: billing.state,
                postcode: billing.zip,
                country: billing.country,
                email: billing.email,
                phone: billing.phone || "",
              },
              shipping: {
                first_name: billing.firstName,
                last_name: billing.lastName,
                address_1: billing.address,
                city: billing.city,
                state: billing.state,
                postcode: billing.zip,
                country: billing.country,
              },
              line_items: cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                total: (item.price * item.quantity).toFixed(2),
              })),
              shipping_lines: [
                {
                  method_id: "test",
                  method_title: "Test Shipping",
                  total: "0.00",
                },
              ],
            }),
          },
        );

        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.message || "Failed to create order");

        orderId = data.order_id;
        orderData.orderId = orderId;
      }

      // ✅ Save to sessionStorage before navigation
      sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
      console.log("💾 Order saved to sessionStorage");

      // ✅ Clear cart after storing order
      clearCart();
      console.log("🧹 Cart cleared");

      // ✅ Navigate to success page with orderId query
      // Use window.location.href to avoid checkout page redirect on empty cart
      const successUrl = `/checkout/success?orderId=${orderId}`;
      console.log("🔄 Navigating to:", successUrl);

      window.location.href = successUrl;
      console.log("✅ Navigation command executed");
    } catch (err: any) {
      console.error("❌ Checkout error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
      console.log("🏁 Finally block executed, isProcessing set to false");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Test Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div>
          <Label htmlFor="test-mode" className="font-semibold text-yellow-900">
            Test Payment Mode
          </Label>
          <p className="text-sm text-yellow-700 mt-1">
            Skip Stripe and simulate payment (for testing)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsTestMode(!isTestMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isTestMode ? "bg-yellow-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isTestMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Stripe Card Element */}
      {!isTestMode && (
        <div className="space-y-2">
          <Label htmlFor="card-element">Card Details</Label>
          <div className="p-3 border border-gray-300 rounded-lg">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
          <p className="text-sm text-gray-500">
            Test card: 4242 4242 4242 4242 | Any future date | Any 3-digit CVC
          </p>
        </div>
      )}

      {/* Test Mode Info */}
      {isTestMode && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ <strong>Test mode enabled</strong> - Payment will be simulated
            without Stripe
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={(!stripe && !isTestMode) || isProcessing}
        className="w-full h-12 text-lg font-semibold bg-black text-white hover:bg-gray-800"
      >
        {isProcessing
          ? isTestMode
            ? "Processing Test Order..."
            : "Processing Payment..."
          : `Place Order - $${total.toFixed(2)}`}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center">
        🔒 Your payment information is secure and encrypted
      </p>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 text-center mt-2">{error}</p>
      )}
    </form>
  );
}
