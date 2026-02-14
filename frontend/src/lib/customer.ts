// Customer utility functions for backend API
import { getUser } from "./auth";

const BACKEND_URL = "http://localhost:8080";

/**
 * Creates a new customer record linked to a Supabase user
 * This should be called during signup after Supabase user is created
 */
export const createCustomer = async (supabaseUserId: string, email: string, firstName: string, lastName: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supabaseUserId,
        email,
        firstName,
        lastName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create customer");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

/**
 * Retrieves customer data by Supabase user ID
 */
export const getCustomerBySupabaseId = async (supabaseUserId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/customers/supabase/${supabaseUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to get customer");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting customer:", error);
    throw error;
  }
};

/**
 * Gets the customer record for the currently authenticated Supabase user
 * Returns null if no user is logged in or customer doesn't exist
 */
export const getCurrentCustomer = async () => {
  const user = await getUser();
  if (!user) {
    return null;
  }

  return await getCustomerBySupabaseId(user.id);
};
