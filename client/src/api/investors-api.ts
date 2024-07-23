import { Investor } from "../utils/interfaces";

const API_URL = "http://127.0.0.1:8000/api/investors/";

export const fetchInvestors = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch investors:", error);
    throw error;
  }
};

export const addInvestor = async (investor: Investor) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(investor),
    });
    console.log(investor);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add investor:", error);
    throw error;
  }
};

export const deleteInvestor = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Network response was not ok");
  } catch (error) {
    console.error("Failed to delete investor:", error);
    throw error;
  }
};
