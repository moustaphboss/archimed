export type SectionKeys = "CapitalCalls" | "Bills" | "Investors";
export interface Bill {
  id: number;
  type: string;
  amount: number;
}

export interface Investor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  iban: string;
  amount_invested: number;
}
