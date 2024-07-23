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
      className="rounded-xl p-4 mb-4 bg-white shadow-sm"
    >
      <h4 className="text-lg font-semibold mb-2">
        {capitalCall.first_name} {capitalCall.last_name}
      </h4>
      <p>
        <strong>Company:</strong> {capitalCall.company_name}
      </p>
      <p>
        <strong>IBAN:</strong> {IBAN.printFormat(capitalCall.company_iban)}
      </p>
      <p>
        <strong>Date:</strong> {capitalCall.date}
      </p>
      <p>
        <strong>Due Date:</strong> {capitalCall.due_date}
      </p>
      <p>
        <strong>Total Amount:</strong>{" "}
        {formatCurrency(capitalCall.total_amount)}
      </p>
      <p>
        <strong>Status:</strong> {capitalCall.status}
      </p>
    </div>
  );
};

export default CapitalCallBox;
