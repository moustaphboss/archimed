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
  investor: number;
  type: string;
  amount: number;
  validated: boolean;
  issue_date: string | null;
  bill_code: string;
}

export interface Company {
  id?: number;
  name: string;
  fee_percentage: number;
  iban: string;
}

// export interface CapitalCall {
//   id: number;
//   investor_id: number;
//   iban: string;
//   total_amount: number;
//   due_date: Date;
//   status: Status;
//   bills: Bill[];
//   date: Date;
// }

export interface CapitalCall {
  id?: number;
  company_name: string;
  company_iban: string;
  date: string;
  due_date: string;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number;
  status?: string;
}
