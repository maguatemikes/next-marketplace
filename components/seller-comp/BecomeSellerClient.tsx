"use client";

import {
  MapPin,
  DollarSign,
  FileText,
  Upload,
  Building,
  Phone,
  Mail,
  Globe,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Store,
  Users,
  ArrowRight,
  Settings,
  Award,
  Search,
  Building2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useTransition } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import Image from "next/image";
import { config } from "@/lib/config";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BecomeSellerClientProps {
  categories: Category[];
  searchBusinessesAction: (
    query: string,
  ) => Promise<{ businesses: any[]; error: string | null }>;
}

export function BecomeSellerClient({
  categories,
  searchBusinessesAction,
}: BecomeSellerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const [currentStep, setCurrentStep] = useState<
    "search" | "verify" | "setup" | "confirm"
  >("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isNewListing, setIsNewListing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);

  // API state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
    email: user?.email || "",
    website: "",
    contactName: user?.displayName || user?.name || "",
    contactRole: "",
    brandPartnerships: "",
    description: "",
    storeSetup: false,
    storeName: "",
    storeProducts: "",
    estimatedProducts: "",
  });
  const [proofDocument, setProofDocument] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Handle featured image upload
  const handleFeaturedImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-populate user email and name when logged in
  useEffect(() => {
    if (user && user.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        contactName: user.displayName || user.name || prev.contactName,
      }));
      console.log("✅ Auto-populated email:", user.email);
      console.log(
        "✅ Auto-populated contact name:",
        user.displayName || user.name,
      );
    }
  }, [user]);

  // Search businesses using server action
  const searchBusinesses = useCallback(
    async (query: string) => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      startTransition(async () => {
        const result = await searchBusinessesAction(query);

        if (result.error) {
          setSearchError(result.error);
          setSearchResults([]);
        } else {
          setSearchResults(result.businesses);
          setSearchError(null);
        }

        setIsSearching(false);
      });
    },
    [searchBusinessesAction],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBusinesses(searchQuery);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, searchBusinesses]);

  const handleSelectListing = (listing: any) => {
    // CHECK AUTHENTICATION FIRST
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent("/sell")}`);
      return;
    }

    // If authenticated, proceed with claim
    setSelectedListing(listing);
    setIsNewListing(false);

    // Pre-fill form with listing data including category
    setFormData({
      ...formData,
      businessName: listing.name || "",
      businessType: listing.category || "",
      address: listing.address || "",
      city: listing.city || "",
      state: listing.state || "",
      zip: listing.zip || "",
    });

    setCurrentStep("verify");
  };

  const handleCreateNew = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent("/create-listing")}`);
    } else {
      router.push("/create-listing");
    }
  };

  // Handle form submission
  const handleSubmitClaim = async () => {
    console.log("🚀 ============================================");
    console.log("🚀 SUBMIT BUTTON CLICKED");
    console.log("🚀 ============================================");

    // 🔐 STEP 1: Validate user authentication
    console.log("🔐 Step 1: Checking authentication...");
    console.log("🔐 isAuthenticated:", isAuthenticated);
    console.log("🔐 user:", user);

    if (!isAuthenticated || !user) {
      console.error("❌ Authentication check failed");
      toast.error("You must be logged in to submit a claim");
      router.push(`/auth/login?from=${encodeURIComponent("/sell")}`);
      return;
    }
    console.log("✅ Authentication OK");

    // Validate required fields
    console.log("📋 Step 2: Validating all required fields...");
    console.log("📋 Form Data:", formData);
    console.log("📄 Proof Document:", proofDocument);

    const missingFields = [];
    const errors: Record<string, string> = {};

    // Helper function to check if field has value
    const hasValue = (value: any) => {
      return (
        value !== null && value !== undefined && String(value).trim() !== ""
      );
    };

    // Check all form fields
    if (!hasValue(formData.businessName)) {
      missingFields.push("Business Name");
      errors.businessName = "Business name is required";
    }
    if (!hasValue(formData.businessType)) {
      missingFields.push("Business Type");
      errors.businessType = "Business type is required";
    }
    if (!hasValue(formData.address)) {
      missingFields.push("Address");
      errors.address = "Address is required";
    }
    if (!hasValue(formData.city)) {
      missingFields.push("City");
      errors.city = "City is required";
    }
    if (!hasValue(formData.state)) {
      missingFields.push("State");
      errors.state = "State is required";
    }
    if (!hasValue(formData.zip)) {
      missingFields.push("ZIP");
      errors.zip = "ZIP code is required";
    }
    if (!hasValue(formData.phone)) {
      missingFields.push("Phone");
      errors.phone = "Phone number is required";
    }
    if (!hasValue(formData.email)) {
      missingFields.push("Email");
      errors.email = "Email is required";
    }
    if (!hasValue(formData.contactName)) {
      missingFields.push("Contact Name");
      errors.contactName = "Contact name is required";
    }
    if (!hasValue(formData.description)) {
      missingFields.push("Description");
      errors.description = "Business description is required";
    }

    // Check proof document
    if (!proofDocument) {
      missingFields.push("Proof of Authorization");
      errors.proofDocument = "Proof of authorization is required";
    }

    // If there are any missing fields, show errors and prevent submission
    if (missingFields.length > 0) {
      console.error(
        "❌ Validation failed! Missing required fields:",
        missingFields,
      );
      setValidationErrors(errors);
      toast.error(
        `Please complete all required fields (${missingFields.length} missing)`,
      );
      // Scroll to top to see the error summary
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Clear any previous errors and proceed
    setValidationErrors({});
    console.log("✅ All validations passed! All required fields are complete.");

    console.log("🎯 All validations passed! Starting submission...");
    setIsSubmitting(true);

    try {
      // 🔐 ALWAYS USE ADMIN CREDENTIALS FOR CLAIMS & MEDIA UPLOADS
      const authHeader = `Basic ${config.auth.basicAuth}`;
      console.log("🔑 Using admin application password");

      // Determine if claiming existing or creating new
      const isClaimingExisting = !isNewListing && selectedListing;

      // DEBUG: Log state
      console.log("🐛 DEBUG - Submit State:", {
        isNewListing,
        selectedListing: selectedListing
          ? { id: selectedListing.id, name: selectedListing.name }
          : null,
        isClaimingExisting,
        formData: formData.businessName,
        user: { id: user.id, email: user.email },
      });

      const claimsEndpoints = [
        `${config.api.wordpress}/claims`,
        `${config.api.wordpress}/shoplocal_claim`,
      ];

      const url = isClaimingExisting
        ? claimsEndpoints[0]
        : `${config.api.geodir}/places`;

      console.log(
        `📍 Endpoint: ${
          isClaimingExisting
            ? "🏪 CLAIMS API (creates claim record, NOT new listing)"
            : "✨ GEODIR API (creates new listing)"
        }`,
        url,
      );

      let response;
      let data;

      if (isClaimingExisting) {
        // ===== CLAIMING EXISTING LISTING =====
        console.log("🏪 ============================================");
        console.log("🏪 CLAIMING EXISTING LISTING (NOT CREATING NEW)");
        console.log("🏪 ============================================");
        console.log("🏪 Listing ID:", selectedListing.id);
        console.log("🏪 Listing Name:", selectedListing.name);
        console.log("🏪 Claimed By User:", user.email, "(ID:", user.id + ")");
        console.log("🏪 ============================================");

        // Step 1: Upload proof document first (REQUIRED)
        let proofDocumentId = null;
        if (proofDocument) {
          try {
            const docFormData = new FormData();
            docFormData.append("file", proofDocument);
            docFormData.append(
              "title",
              `${formData.businessName} - Proof of Authorization`,
            );

            console.log("📤 Uploading proof document...");

            const docResponse = await fetch(`${config.api.wordpress}/media`, {
              method: "POST",
              headers: {
                Authorization: authHeader,
              },
              body: docFormData,
            });

            if (docResponse.ok) {
              const docData = await docResponse.json();
              proofDocumentId = docData.id;
              console.log("✅ Proof document uploaded, ID:", proofDocumentId);
            } else {
              let errorMessage = "Unknown error";
              try {
                const docError = await docResponse.json();
                errorMessage =
                  docError.message || docError.code || JSON.stringify(docError);
              } catch (e) {
                errorMessage = `HTTP ${docResponse.status}: ${docResponse.statusText}`;
              }
              console.error(
                "❌ Failed to upload proof document:",
                errorMessage,
              );
              toast.error(`Failed to upload proof document: ${errorMessage}`);
              setIsSubmitting(false);
              return;
            }
          } catch (docError) {
            console.error("❌ Error uploading proof document:", docError);
            toast.error("Failed to upload proof document. Please try again.");
            setIsSubmitting(false);
            return;
          }
        }

        // Step 2: Upload featured image if provided
        let featuredImageId = null;
        if (featuredImage) {
          try {
            const imgFormData = new FormData();
            imgFormData.append("file", featuredImage);
            imgFormData.append(
              "title",
              `${formData.businessName} - Featured Image`,
            );

            console.log("📤 Uploading featured image...");

            const imgResponse = await fetch(`${config.api.wordpress}/media`, {
              method: "POST",
              headers: {
                Authorization: authHeader,
              },
              body: imgFormData,
            });

            if (imgResponse.ok) {
              const imgData = await imgResponse.json();
              featuredImageId = imgData.id;
              console.log("✅ Featured image uploaded, ID:", featuredImageId);
            }
          } catch (imgError) {
            console.error(
              "⚠️ Error uploading featured image (non-critical):",
              imgError,
            );
          }
        }

        // Step 3: Create the claim
        const claimData = {
          title: formData.businessName,
          status: "publish",
          author: user?.id || 0,
          business_type: formData.businessType,
          business_address: formData.address,
          business_city: formData.city,
          business_state: formData.state,
          business_zip: formData.zip,
          business_country: formData.country,
          business_phone: formData.phone,
          business_email: formData.email,
          website_url: formData.website || "",
          contact_name: formData.contactName,
          contact_role: formData.contactRole,
          brand_partnerships: formData.brandPartnerships || "",
          business_description: formData.description,
          listing_id: selectedListing.id.toString(),
          claim_status: "pending",
          proof_document: proofDocumentId || 0,
          featured_image: featuredImageId || 0,
        };

        console.log("📤 ============================================");
        console.log("📤 SUBMITTING CLAIM (NOT NEW LISTING)");
        console.log("📤 ============================================");
        console.log("📤 POST to:", url);
        console.log("📤 Claim Data:", claimData);
        console.log("📤 ============================================");

        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(claimData),
        });

        const responseText = await response.text();
        console.log("📥 Raw Response Text:", responseText);

        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("⚠️ Response is not valid JSON:", e);
          data = { error: "Invalid JSON response", responseText };
        }

        console.log("📥 Response Status:", response.status);
        console.log("📥 Response Data:", data);

        // If 404, try fallback endpoint
        if (response.status === 404 && claimsEndpoints[1]) {
          console.log("⚠️ First endpoint failed (404), trying fallback...");

          response = await fetch(claimsEndpoints[1], {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify(claimData),
          });

          data = await response.json();
          console.log("📥 Fallback Response:", data);
        }
      } else {
        // ===== CREATING NEW LISTING =====
        console.log("✨ Creating new listing");

        const geoData: Record<string, any> = {
          title: formData.businessName,
          content: formData.description,
          street: formData.address,
          country: formData.country,
          region: formData.state,
          city: formData.city,
          zip: formData.zip,
          phone: formData.phone,
          status: "pending",
          author: user?.id || 0,
        };

        if (formData.email && formData.email.includes("@")) {
          geoData.email = formData.email;
        }

        if (formData.website) {
          geoData.website = formData.website;
        }

        if (formData.brandPartnerships) {
          geoData.post_tags = formData.brandPartnerships;
        }

        console.log("🔄 ============================================");
        console.log("🔄 SUBMITTING NEW LISTING");
        console.log("🔄 ============================================");
        console.log("🔄 Listing Data:", geoData);
        console.log("🔄 ============================================");

        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(geoData),
        });

        data = await response.json();
      }

      // Handle response
      if (response.ok) {
        console.log(
          `✅ ${
            isClaimingExisting ? "Claim" : "Listing"
          } submitted successfully:`,
          data,
        );

        // For NEW listings, upload featured image
        if (!isClaimingExisting && featuredImage && data.id) {
          try {
            const imageFormData = new FormData();
            imageFormData.append("file", featuredImage);
            imageFormData.append(
              "title",
              `${formData.businessName} - Featured Image`,
            );

            const imageResponse = await fetch(`${config.api.wordpress}/media`, {
              method: "POST",
              headers: {
                Authorization: authHeader,
              },
              body: imageFormData,
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              console.log("✅ Featured image uploaded:", imageData);

              await fetch(`${url}/${data.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
                  Authorization: authHeader,
                },
                body: new URLSearchParams({
                  featured_image: imageData.id.toString(),
                }),
              });
            }
          } catch (imageError) {
            console.error("Error uploading featured image:", imageError);
          }
        }

        toast.success(
          `${
            isClaimingExisting ? "Claim" : "Listing"
          } submitted successfully! Your submission is pending review.`,
        );
        setCurrentStep("confirm");
        setCreatedListingId(data.id);
        setShowSuccessModal(true);
      } else {
        console.error("❌ ============================================");
        console.error("❌ API ERROR");
        console.error("❌ ============================================");
        console.error("❌ Status:", response.status);
        console.error("❌ Response:", data);
        console.error("❌ ============================================");

        if (response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          router.push(`/auth/login?from=${encodeURIComponent("/sell")}`);
        } else if (response.status === 403) {
          toast.error("You do not have permission. Please contact support.");
        } else if (response.status === 404) {
          toast.error("Claims system not configured. Please contact support.");
        } else {
          throw new Error(
            data.message ||
              `Failed to ${
                isClaimingExisting ? "submit claim" : "create listing"
              }`,
          );
        }
      }
    } catch (error: any) {
      console.error("❌ Error submitting:", error);

      if (error.message && error.message.includes("not allowed to create")) {
        toast.error("Authentication error. Please log in.");
        router.push(`/login?from=${encodeURIComponent("/sell")}`);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4 sm:mb-6">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm text-white">
              Join 250+ Authorized Local Sellers & Premium Brands
            </span>
          </div>
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 px-4">
            Become an Authorized Seller on ShopLocal
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-green-50 max-w-3xl mx-auto px-4">
            Get visibility alongside premium national brands and reach customers
            who value quality and community.
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-green-100 max-w-2xl mx-auto px-4">
            Whether you sell products or offer services (restaurants, lawyers,
            doctors, wellness), we'll promote you as an authorized local seller.
          </p>

          {/* Dual Positioning Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mt-6 sm:mt-10 px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
              </div>
              <h3 className="text-lg sm:text-xl text-white mb-2">
                Sell Brand-Name Products
              </h3>
              <p className="text-green-100 text-xs sm:text-sm">
                Authorized to sell premium brands? We'll verify and badge you,
                giving customers confidence and boosting your sales.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
              </div>
              <h3 className="text-lg sm:text-xl text-white mb-2">
                Offer Local Services
              </h3>
              <p className="text-green-100 text-xs sm:text-sm">
                Restaurants, professionals, wellness—get listed and promoted to
                local customers actively searching for quality services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            {[
              { step: "search", label: "Find or Create", icon: Search },
              { step: "verify", label: "Verify & Setup", icon: CheckCircle },
              { step: "setup", label: "Store Details", icon: Settings },
              { step: "confirm", label: "Launch", icon: Award },
            ].map((item, index) => {
              const Icon = item.icon;
              const isActive = currentStep === item.step;
              const isCompleted =
                ["search", "verify", "setup"].indexOf(currentStep) >
                ["search", "verify", "setup"].indexOf(item.step as any);

              return (
                <div key={item.step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                            ? "bg-sky-600 border-sky-600 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* STEP 1: Search for Existing Business or Create New */}
          {currentStep === "search" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-900 mb-3 sm:mb-4">
                  Step 1: Find Your Business
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  First, let's check if your business already exists on
                  ShopLocal. If it does, you can claim it. If not, you'll create
                  a new listing.
                </p>

                {/* Search Box */}
                <div className="relative mb-6 sm:mb-8">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by business name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-sky-500 text-sm sm:text-base md:text-lg"
                  />
                </div>

                {/* Search Results */}
                {searchQuery && (
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {(isSearching || isPending) && (
                      <div className="text-center py-6 sm:py-8">
                        <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-2 sm:mb-3"></div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Searching businesses...
                        </p>
                      </div>
                    )}

                    {!isSearching && !isPending && searchError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-red-800">
                          {searchError}
                        </p>
                      </div>
                    )}

                    {!isSearching &&
                      !isPending &&
                      !searchError &&
                      searchResults.length > 0 && (
                        <>
                          <h3 className="text-xs sm:text-sm text-gray-600">
                            Found {searchResults.length} matching businesses
                          </h3>
                          {searchResults.map((listing) => (
                            <div
                              key={listing.id}
                              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl transition-colors ${
                                listing.claimed === 1
                                  ? "border-amber-200 bg-amber-50/50 cursor-not-allowed opacity-75 pointer-events-none"
                                  : "border-gray-200 hover:border-sky-500 cursor-pointer"
                              }`}
                              onClick={() => {
                                if (listing.claimed === 1) {
                                  toast.warning(
                                    "This listing has already been claimed by another seller",
                                  );
                                  return;
                                }
                                handleSelectListing(listing);
                              }}
                            >
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <Image
                                  src={
                                    listing.image ||
                                    listing.featured_image ||
                                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
                                  }
                                  alt={listing.name}
                                  fill
                                  sizes="(max-width: 640px) 48px, 64px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1 truncate">
                                  {listing.name}
                                </h4>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {listing.address}
                                  </span>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
                                  {listing.category}
                                </div>
                              </div>
                              {listing.claimed === 1 ? (
                                <>
                                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex-shrink-0">
                                    <Shield className="w-4 h-4" />
                                    Already Claimed
                                  </div>
                                  <Shield className="w-5 h-5 sm:hidden text-amber-600 flex-shrink-0" />
                                </>
                              ) : (
                                <>
                                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm flex-shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                    Claim This
                                  </div>
                                  <CheckCircle className="w-5 h-5 sm:hidden text-sky-600 flex-shrink-0" />
                                </>
                              )}
                            </div>
                          ))}
                        </>
                      )}

                    {!isSearching &&
                      !isPending &&
                      !searchError &&
                      searchResults.length === 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
                          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                          <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                            No businesses found matching &quot;{searchQuery}
                            &quot;
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Try a different search or create a new listing below
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {/* Create New Button */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">
                          Don&apos;t see your business?
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                          No problem! You can create a new listing and we'll
                          help you get set up as an authorized seller.
                        </p>
                        <button
                          onClick={handleCreateNew}
                          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm sm:text-base rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                          Create New Listing
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">
                    Premium Positioning
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Showcase alongside exclusive brands and reach engaged
                    customers
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">
                    Verified Badge
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Get official verification for brand authorization and
                    credibility
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">
                    Community Support
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    &quot;Shop Local&quot; badges drive community-focused
                    customers to you
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Verify Ownership & Business Info */}
          {currentStep === "verify" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-900 mb-3 sm:mb-4">
                  {isNewListing
                    ? "Step 2: Create Your Business Profile"
                    : "Step 2: Verify Business Ownership"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                  {isNewListing
                    ? "Tell us about your business so we can create your listing and verify your authorization."
                    : "Verify that you are authorized to represent this business and manage its listing."}
                </p>

                {/* Claim Context */}
                {!isNewListing && selectedListing && user && (
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-300 rounded-xl p-4 sm:p-6 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-sky-600" />
                      <h3 className="font-semibold text-gray-900">
                        Claim Verification Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-sky-200">
                        <p className="text-xs text-gray-500 mb-1">
                          CLAIMING AS
                        </p>
                        <p className="font-medium text-gray-900">
                          {user.name || user.email}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-sky-600 mt-1">
                          User ID: {user.id}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-sky-200">
                        <p className="text-xs text-gray-500 mb-1">
                          LISTING TO CLAIM
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedListing.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedListing.address}
                        </p>
                        <p className="text-xs text-sky-600 mt-1">
                          Listing ID: {selectedListing.id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700">
                        Upon approval, listing{" "}
                        <strong>#{selectedListing.id}</strong> will be
                        transferred to your account and you&apos;ll have full
                        management access.
                      </p>
                    </div>
                  </div>
                )}

                {/* Validation Error Summary */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-2">
                          Please complete the following required fields:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                          {Object.entries(validationErrors).map(
                            ([field, error]) => (
                              <li key={field}>{error}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Business */}
                {!isNewListing && selectedListing && (
                  <div className="bg-sky-50 border border-sky-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={
                            selectedListing.image ||
                            selectedListing.featured_image ||
                            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
                          }
                          alt={selectedListing.name || "Business"}
                          fill
                          sizes="(max-width: 640px) 48px, 64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1 truncate">
                          {selectedListing.name}
                        </h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">
                            {selectedListing.address}
                          </span>
                        </div>
                        {selectedListing.category && (
                          <div className="text-xs text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                            {selectedListing.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Form - Continued in next message due to length */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Business Name */}
                  <div>
                    <Label>Business Name *</Label>
                    <Input
                      placeholder="e.g., Fleet Feet Sports Boston"
                      className={`mt-1 sm:mt-2 ${validationErrors.businessName ? "border-red-500 border-2" : ""}`}
                      value={formData.businessName}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          businessName: e.target.value,
                        });
                        if (validationErrors.businessName) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.businessName;
                          setValidationErrors(newErrors);
                        }
                      }}
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <Label>Business Type *</Label>
                    <select
                      className={`w-full mt-1 sm:mt-2 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 rounded-lg focus:outline-none ${validationErrors.businessType ? "border-red-500" : "border-gray-300 focus:border-sky-500"}`}
                      value={formData.businessType}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          businessType: e.target.value,
                        });
                        if (validationErrors.businessType) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.businessType;
                          setValidationErrors(newErrors);
                        }
                      }}
                    >
                      <option value="">Select type...</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <Label>Business Address *</Label>
                    <Input
                      placeholder="123 Main Street"
                      className={`mt-1 sm:mt-2 mb-3 ${validationErrors.address ? "border-red-500 border-2" : ""}`}
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (validationErrors.address) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.address;
                          setValidationErrors(newErrors);
                        }
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label className="text-xs sm:text-sm">City *</Label>
                        <Input
                          placeholder="City"
                          className={`mt-1 ${validationErrors.city ? "border-red-500 border-2" : ""}`}
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (validationErrors.city) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.city;
                              setValidationErrors(newErrors);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm">State *</Label>
                        <select
                          className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 rounded-lg focus:outline-none mt-1 ${validationErrors.state ? "border-red-500" : "border-gray-300 focus:border-sky-500"}`}
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({ ...formData, state: e.target.value });
                            if (validationErrors.state) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.state;
                              setValidationErrors(newErrors);
                            }
                          }}
                        >
                          <option value="">Select State</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                          <option value="DC">Washington DC</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <Label className="text-xs sm:text-sm">ZIP Code *</Label>
                        <Input
                          placeholder="ZIP/Postal Code"
                          className={`mt-1 ${validationErrors.zip ? "border-red-500 border-2" : ""}`}
                          value={formData.zip}
                          onChange={(e) => {
                            setFormData({ ...formData, zip: e.target.value });
                            if (validationErrors.zip) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.zip;
                              setValidationErrors(newErrors);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm">Country</Label>
                        <select
                          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 mt-1"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Business Phone *</Label>
                      <Input
                        placeholder="(617) 555-0123"
                        className={`mt-1 sm:mt-2 ${validationErrors.phone ? "border-red-500 border-2" : ""}`}
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (validationErrors.phone) {
                            const newErrors = { ...validationErrors };
                            delete newErrors.phone;
                            setValidationErrors(newErrors);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Business Email *</Label>
                      <Input
                        type="email"
                        placeholder="info@business.com"
                        className={`mt-1 sm:mt-2 ${validationErrors.email ? "border-red-500 border-2" : ""}`}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (validationErrors.email) {
                            const newErrors = { ...validationErrors };
                            delete newErrors.email;
                            setValidationErrors(newErrors);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <Label>Business Website (Optional)</Label>
                    <Input
                      placeholder="https://www.yourbusiness.com"
                      className="mt-1 sm:mt-2"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>

                  {/* Your Role */}
                  <div>
                    <Label>Contact Information *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1 sm:mt-2">
                      <div>
                        <Input
                          placeholder="Your Full Name *"
                          className={
                            validationErrors.contactName
                              ? "border-red-500 border-2"
                              : ""
                          }
                          value={formData.contactName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              contactName: e.target.value,
                            });
                            if (validationErrors.contactName) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.contactName;
                              setValidationErrors(newErrors);
                            }
                          }}
                        />
                      </div>
                      <Input
                        placeholder="Your Title (Optional)"
                        value={formData.contactRole}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactRole: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Brand Partnerships */}
                  <div>
                    <Label>Authorized Brand Partnerships (Optional)</Label>
                    <Input
                      placeholder="e.g., Nike, New Balance, Apple"
                      className="mt-1 sm:mt-2"
                      value={formData.brandPartnerships}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brandPartnerships: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
                      List brands you're authorized to sell. We'll verify these
                      separately and add verified badges.
                    </p>
                  </div>

                  {/* Business Description */}
                  <div>
                    <Label>Business Description *</Label>
                    <Textarea
                      placeholder="Tell customers about your business..."
                      className={`mt-1 sm:mt-2 ${validationErrors.description ? "border-red-500 border-2" : ""}`}
                      rows={4}
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        if (validationErrors.description) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.description;
                          setValidationErrors(newErrors);
                        }
                      }}
                    />
                  </div>

                  {/* Featured Image Upload */}
                  <div>
                    <Label>Featured Image (Optional)</Label>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      Upload a high-quality photo of your business
                    </p>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-sky-500 transition-colors cursor-pointer"
                      onClick={() =>
                        document.getElementById("featured-image")?.click()
                      }
                    >
                      {featuredImagePreview ? (
                        <div className="relative">
                          <div className="relative w-full max-h-48 mb-3">
                            <Image
                              src={featuredImagePreview}
                              alt="Preview"
                              width={400}
                              height={192}
                              className="mx-auto rounded-lg object-contain"
                            />
                          </div>
                          <p className="text-sm text-gray-600">
                            {featuredImage?.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeaturedImage(null);
                              setFeaturedImagePreview(null);
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                          <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            JPG, PNG (Max 5MB)
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        id="featured-image"
                        className="hidden"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleFeaturedImageChange}
                      />
                    </div>
                  </div>

                  {/* Proof Upload */}
                  <div>
                    <Label>Proof of Authorization *</Label>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      Upload documentation proving your authorization
                    </p>
                    <div
                      className={`border-2 border-dashed rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-sky-500 transition-colors cursor-pointer ${validationErrors.proofDocument ? "border-red-500" : "border-gray-300"}`}
                      onClick={() =>
                        document.getElementById("proof-document")?.click()
                      }
                    >
                      {proofDocument ? (
                        <div>
                          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-sky-600 mx-auto mb-3 sm:mb-4" />
                          <p className="text-sm sm:text-base text-gray-600 mb-1">
                            {proofDocument.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProofDocument(null);
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Remove Document
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                          <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            PDF, JPG, PNG (Max 10MB)
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        id="proof-document"
                        className="hidden"
                        accept="application/pdf, image/jpeg, image/png"
                        onChange={(e) => {
                          setProofDocument(e.target.files?.[0] || null);
                          if (
                            e.target.files?.[0] &&
                            validationErrors.proofDocument
                          ) {
                            const newErrors = { ...validationErrors };
                            delete newErrors.proofDocument;
                            setValidationErrors(newErrors);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Alert */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl mt-6 sm:mt-8">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-amber-800">
                    <p className="mb-1">
                      We&apos;ll review your submission within 3-5 business
                      days.
                    </p>
                    <p>
                      You&apos;ll receive an email notification once verified.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    onClick={() => setCurrentStep("search")}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm sm:text-base rounded-lg transition-colors order-2 sm:order-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmitClaim();
                    }}
                    disabled={isSubmitting}
                    className="flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {currentStep === "confirm" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-4xl text-gray-900 mb-4">
                  Application Submitted! 🎉
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Your seller application has been submitted successfully. Our
                  team will review within 3-5 business days.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/")}
                    className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all"
                  >
                    Return to Homepage
                  </button>
                  <button
                    onClick={() => router.push("/vendors")}
                    className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 rounded-xl transition-all"
                  >
                    Browse Sellers
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section (Step 1 only) */}
      {currentStep === "search" && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What types of businesses can join?
                </AccordionTrigger>
                <AccordionContent>
                  We welcome both product retailers and service providers. As
                  long as you&apos;re a legitimate local business or authorized
                  seller, you&apos;re welcome to apply.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Do I need brand authorization to join?
                </AccordionTrigger>
                <AccordionContent>
                  Not necessarily! While brand authorization gives you verified
                  badges, you can still join as a local business without
                  specific brand partnerships.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are there any fees?</AccordionTrigger>
                <AccordionContent>
                  Local business listings are free. Online store commission is
                  typically 5-15%. No upfront costs or monthly fees.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How long does verification take?
                </AccordionTrigger>
                <AccordionContent>
                  Typically 3-5 business days. We manually review each
                  application to ensure quality and authenticity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl text-gray-900 mb-3">
                {isNewListing ? "🎉 Listing Created!" : "✅ Claim Submitted!"}
              </h2>
              <p className="text-gray-600 mb-6">
                We will notify you via email once approved.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push("/vendors");
                  }}
                  className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors"
                >
                  Browse Marketplace
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push("/");
                  }}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
