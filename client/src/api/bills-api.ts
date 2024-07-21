import { Bill } from "../utils/interfaces";

const BASE_URL = "http://127.0.0.1:8000/api";

export const generateBills = async () => {
  try {
    const response = await fetch(`${BASE_URL}/generate-bills/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Failed to generate bills");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to generate bills:", error);
    throw error;
  }
};

export const fetchBills = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bills/`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch bills:", error);
    throw error;
  }
};
