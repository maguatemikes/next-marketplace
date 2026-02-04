import { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-comp/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | ShopLocal",
  description: "Complete your purchase securely with ShopLocal",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
