// Manager utility functions for backend API
import { getUser } from "./auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

/**
 * Upgrades a customer to manager by Supabase user ID
 * This is an administrative action
 */
export const upgradeToManager = async (supabaseUserId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/managers/upgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supabaseUserId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upgrade to manager");
    }

    return await response.json();
  } catch (error) {
    console.error("Error upgrading to manager:", error);
    throw error;
  }
};

/**
 * Gets manager data by Supabase user ID
 */
export const getManagerBySupabaseId = async (supabaseUserId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/managers/supabase/${supabaseUserId}`, {
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
      throw new Error(error.message || "Failed to get manager");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting manager:", error);
    throw error;
  }
};

/**
 * Checks if a Supabase user is a manager
 */
export const isManager = async (supabaseUserId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/managers/check/${supabaseUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking manager status:", error);
    return false;
  }
};

/**
 * Checks if the current logged-in user is a manager
 */
export const isCurrentUserManager = async () => {
  const user = await getUser();
  if (!user) {
    return false;
  }

  return await isManager(user.id);
};
