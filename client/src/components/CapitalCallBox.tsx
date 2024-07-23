import React from "react";
import { formatCurrency } from "../utils/utils";
import { CapitalCall } from "../utils/interfaces";
import IBAN from "iban";

interface CapitalCallBoxProps {
  capitalCall: CapitalCall;
}

const CapitalCallBox: React.FC<CapitalCallBoxProps> = ({ capitalCall }) => {
  return (
    <div
      key={capitalCall.id}
      className="rounded-xl p-4 mb-4 bg-white shadow-sm text-slate-700"
    >
      <p>
        IBAN: <strong>{IBAN.printFormat(capitalCall.company_iban)}</strong>
      </p>
      <p>
        Due Date: <strong>{capitalCall.due_date}</strong>
      </p>

      <hr className="my-2" />

      <p className="text-lg">
        FROM: <strong>{capitalCall.company_name}</strong>
      </p>

      <p className="text-lg">
        TO:{" "}
        <strong>
          {capitalCall.first_name} {capitalCall.last_name}
        </strong>
      </p>
      <p>
        EMAIL: <strong>{capitalCall.email}</strong>
      </p>

      <hr className="my-2" />

      <div className="flex w-full justify-between">
        <p>
          <strong>Total Amount:</strong>{" "}
          {formatCurrency(capitalCall.total_amount)}
        </p>
        <p>
          Date: <strong>{capitalCall.date}</strong>
        </p>
      </div>

      <hr className="my-2" />

      <div className="flex items-center space-x-4">
        <p>Status</p>
        <div className="bg-violet-100 w-fit px-4 py-1 font-medium text-lg text-violet-700 rounded-full">
          {capitalCall.status}
        </div>
      </div>
    </div>
  );
};

export default CapitalCallBox;
