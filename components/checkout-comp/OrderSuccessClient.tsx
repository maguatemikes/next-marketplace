"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ShoppingBag,
  Home,
  Download,
  Share2,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "12345";
  const { clearCart } = useCartStore();

  console.log("🎯 SUCCESS PAGE LOADED");
  console.log("🆔 Order ID from URL:", orderId);

  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const estimatedDelivery = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [confetti, setConfetti] = useState<
    Array<{ id: number; left: number; delay: number; duration: number }>
  >([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderTotals, setOrderTotals] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    console.log("✨ useEffect running on success page");

    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(particles);

    // Retrieve order data from sessionStorage (set by checkout)
    const orderData = sessionStorage.getItem("lastOrder");
    console.log("📦 Retrieved order data from sessionStorage:", orderData);

    if (orderData) {
      const parsed = JSON.parse(orderData);
      console.log("✅ Parsed order data:", parsed);
      setOrderItems(parsed.items || []);
      setOrderTotals(
        parsed.totals || {
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
        },
      );
    } else {
      console.log("❌ No order data found in sessionStorage");
    }

    // Clear cart
    clearCart();
    console.log("🧹 Cart cleared on success page");
  }, [clearCart]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated Confetti */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-sky-500 rounded-full animate-confetti opacity-0"
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section with Unique Layout */}
          <div className="text-center mb-16">
            {/* Animated Success Icon */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-sky-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 flex items-center justify-center animate-scale-in shadow-2xl">
                <CheckCircle
                  className="w-20 h-20 text-white"
                  strokeWidth={2.5}
                />
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            </div>

            <h1 className="text-black mb-4 tracking-tight animate-fade-in">
              Your Order is Confirmed!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 animate-fade-in-delay">
              Thank you for shopping with ShopLocal. Were preparing your order
              with care.
            </p>

            {/* Order Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-sky-500 rounded-full px-8 py-4 shadow-lg animate-slide-up">
              <Package className="w-5 h-5 text-sky-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Order Number
                </p>
                <p className="text-black">#SL-{orderId}</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Order Date
                </p>
                <p className="text-black">{orderDate}</p>
              </div>
            </div>
          </div>

          {/* Unique 3-Column Cards with Offset Layout */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Card 1 - Email Confirmation */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 hover:border-sky-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-black mb-3">Check Your Email</h3>
              <p className="text-gray-600 mb-4">
                Weve sent a confirmation email with your order details and
                receipt.
              </p>
              <div className="flex items-center gap-2 text-sm text-sky-600">
                <div className="w-2 h-2 bg-sky-600 rounded-full animate-pulse"></div>
                <span>Email sent successfully</span>
              </div>
            </div>

            {/* Card 2 - Shipping Info (elevated) */}
            <div className="md:-mt-6 group bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl p-8 text-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-delay">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white mb-3">Fast Delivery</h3>
              <p className="text-sky-100 mb-4">
                Your order will arrive between 5-7 business days with free
                tracking.
              </p>
              <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                <Calendar className="w-4 h-4" />
                <span>Est. {estimatedDelivery}</span>
              </div>
            </div>

            {/* Card 3 - Order Tracking */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 hover:border-sky-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-delay-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-black mb-3">Track Your Package</h3>
              <p className="text-gray-600 mb-4">
                Real-time tracking will be available once your order ships.
              </p>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <span>View tracking</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Timeline Section with Unique Visual */}
          <div className="mb-16 bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 animate-fade-in">
            <h2 className="text-black mb-12 tracking-tight text-center">
              Order Journey
            </h2>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 hidden md:block"></div>
              <div className="absolute top-8 left-0 w-1/4 h-1 bg-gradient-to-r from-sky-500 to-sky-600 hidden md:block animate-progress"></div>

              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Step 1 - Active */}
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-sky-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center text-xl shadow-lg ring-4 ring-white">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <h4 className="text-black mb-2">Order Placed</h4>
                  <p className="text-sm text-gray-600">
                    Your order has been received
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-sky-600">
                    <Clock className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                </div>

                {/* Step 2 - Processing */}
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl shadow-md ring-4 ring-white">
                      <Package className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-black mb-2">Processing</h4>
                  <p className="text-sm text-gray-600">
                    Were preparing your items
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-sky-600">
                    <div className="w-2 h-2 bg-sky-600 rounded-full animate-pulse"></div>
                    <span>In Progress</span>
                  </div>
                </div>

                {/* Step 3 - Upcoming */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xl shadow-md mx-auto mb-4 ring-4 ring-white">
                    <Truck className="w-8 h-8" />
                  </div>
                  <h4 className="text-black mb-2">Shipped</h4>
                  <p className="text-sm text-gray-600">
                    Your order is on its way
                  </p>
                  <div className="mt-2 text-xs text-gray-400">Pending</div>
                </div>

                {/* Step 4 - Upcoming */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xl shadow-md mx-auto mb-4 ring-4 ring-white">
                    <Home className="w-8 h-8" />
                  </div>
                  <h4 className="text-black mb-2">Delivered</h4>
                  <p className="text-sm text-gray-600">
                    Package at your doorstep
                  </p>
                  <div className="mt-2 text-xs text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Order Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-sky-500 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-black mb-2">Order Summary</h3>
                  <p className="text-gray-600">View complete order details</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                  <Package className="w-6 h-6 text-sky-600" />
                </div>
              </div>

              {/* Product List */}
              {orderItems.length > 0 && (
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black">
                    ${orderTotals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">
                    {orderTotals.shipping === 0
                      ? "FREE"
                      : `$${orderTotals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-black">
                    ${orderTotals.tax.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between">
                  <span className="text-black">Total</span>
                  <span className="text-black">
                    ${orderTotals.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Link
                href="/orders"
                className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                View Full Details
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300">
              <h3 className="text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl px-4 py-3 transition-colors text-left group">
                  <Download className="w-5 h-5" />
                  <span>Download Invoice</span>
                  <span className="ml-auto group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl px-4 py-3 transition-colors text-left group">
                  <Share2 className="w-5 h-5" />
                  <span>Share Order</span>
                  <span className="ml-auto group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
                <Link
                  href="/help"
                  className="w-full flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl px-4 py-3 transition-colors text-left group"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact Support</span>
                  <span className="ml-auto group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-10 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-white text-black border-2 border-black px-10 py-4 rounded-xl hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Premium Support Banner */}
          <div className="mt-16 bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 rounded-3xl p-0.5 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 mb-4">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-black mb-2">Premium Support Available</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Need help? Our dedicated support team is here 24/7 to assist you
                with any questions about your order.
              </p>
              <div className="flex flex-wrap gap-6 justify-center text-sm">
                <a
                  href="mailto:support@shoplocal.com"
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  support@shoplocal.com
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="tel:1-800-SHOPLOCAL"
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 hover:underline"
                >
                  <Package className="w-4 h-4" />
                  1-800-SHOPLOCAL
                </a>
                <span className="text-gray-300">|</span>
                <Link
                  href="/help"
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 hover:underline"
                >
                  <CreditCard className="w-4 h-4" />
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }

          @keyframes scale-in {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(180deg);
            }
            100% {
              transform: scale(1) rotate(360deg);
              opacity: 1;
            }
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(20px, -50px) scale(1.1);
            }
            50% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            75% {
              transform: translate(50px, 50px) scale(1.05);
            }
          }

          @keyframes progress {
            from {
              width: 0%;
            }
            to {
              width: 25%;
            }
          }

          .animate-confetti {
            animation: confetti forwards;
          }

          .animate-scale-in {
            animation: scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s
              forwards;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }

          .animate-fade-in-delay {
            animation: fade-in 0.6s ease-out 0.2s forwards;
            opacity: 0;
          }

          .animate-fade-in-delay-2 {
            animation: fade-in 0.6s ease-out 0.4s forwards;
            opacity: 0;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out 0.6s forwards;
            opacity: 0;
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animate-progress {
            animation: progress 2s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}
