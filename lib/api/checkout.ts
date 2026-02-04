const BASE_URL = "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1";

export interface ShippingPayload {
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  title: string;
  cost: string;
  description?: string;
}

export interface ShippingResponse {
  success: boolean;
  methods: ShippingMethod[];
}

export const getShippingMethods = async (
  payload: ShippingPayload,
): Promise<ShippingResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/shipping-methods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store", // Don't cache shipping calculations
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Shipping methods:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch shipping methods:", error);
    throw error;
  }
};

// Country and State APIs for address forms
export interface Country {
  name: string;
  code: string;
}

export interface State {
  name: string;
  code: string;
}

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/iso",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.map((country: any) => ({
      name: country.name,
      code: country.Iso2,
    }));
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    // Fallback to common countries
    return [
      { name: "United States", code: "US" },
      { name: "Canada", code: "CA" },
      { name: "United Kingdom", code: "GB" },
      { name: "Australia", code: "AU" },
    ];
  }
};

export const getStates = async (countryCode: string): Promise<State[]> => {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iso2: countryCode }),
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.states.map((state: any) => ({
      name: state.name,
      code: state.state_code,
    }));
  } catch (error) {
    console.error("Failed to fetch states:", error);
    // Fallback for US states
    if (countryCode === "US") {
      return [
        { name: "California", code: "CA" },
        { name: "New York", code: "NY" },
        { name: "Texas", code: "TX" },
        { name: "Florida", code: "FL" },
      ];
    }
    return [];
  }
};
