import { Metadata } from "next";
import { CreateListingClient } from "@/components/seller-comp/CreateListingClient";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Create New Listing | ShopLocal",
  description:
    "Add your business or service to ShopLocal marketplace. Create a new listing and reach local customers.",
};

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

// Server-side fetch categories
async function getCategories() {
  try {
    const response = await fetch(
      `${config.api.geodir}/places/categories?per_page=100&hide_empty=false`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.filter((cat: any) => cat.name && cat.name !== "");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return [];
}

// Server-side fetch regions
async function getRegions() {
  try {
    const response = await fetch(`${config.api.geodir}/places/regions`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return data.filter((region: any) => region.name && region.name !== "");
    }
  } catch (error) {
    console.error("Error fetching regions:", error);
  }

  return [];
}

export default async function CreateListingPage() {
  const categories = await getCategories();
  const regions = await getRegions();

  return <CreateListingClient categories={categories} regions={regions} />;
}
