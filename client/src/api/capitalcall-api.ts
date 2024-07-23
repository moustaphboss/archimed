const API_URL = "http://127.0.0.1:8000/api/capitalcalls/";

export const fetchCapitalCalls = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch capital calls:", error);
    throw error;
  }
};

export const createCapitalCall = async (capitalCall: {
  company_name: string;
  company_iban: string;
  date: string;
  due_date: string;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number;
  status?: string;
}) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(capitalCall),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add capital call:", error);
    throw error;
  }
};
