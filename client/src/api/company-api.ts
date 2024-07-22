import { Company } from "../utils/interfaces";

const API_URL = "http://127.0.0.1:8000/api/company/";

export const fetchCompanyInfo = async (): Promise<Company> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch company info:", error);
    throw error;
  }
};

export const saveCompanyInfo = async (company: Company): Promise<Company> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(company),
    });
    console.log(company);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to save company info:", error);
    throw error;
  }
};
