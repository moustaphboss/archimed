import { PaymentType, Status } from "./types";

export interface Investor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  amount_invested: number;
  investment_date: string | null;
  payment_type: PaymentType;
}

export interface Bill {
  id: number;
  investor_id: number;
  type: string;
  amount: number;
  validated: boolean;
}

export interface CapitalCall {
  id: number;
  investor_id: number;
  iban: string;
  total_amount: number;
  due_date: Date;
  status: Status;
  bills: Bill[];
  date: Date;
}
