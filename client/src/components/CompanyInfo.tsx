// src/components/CompanyInfo.tsx

import React from "react";
import { Company } from "../utils/interfaces";

interface CompanyInfoProps {
  company: Company;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => {
  return (
    <div className="bg-violet-100 rounded-xl p-8 text-center">
      <h4 className="text-gray-800 text-2xl mb-4 font-medium">
        Company Information
      </h4>
      <p className="text-gray-700">Name: {company.name}</p>
      <p className="text-gray-700">Fee Percentage: {company.fee_percentage}%</p>
      <p className="text-gray-700">IBAN: {company.iban}</p>
    </div>
  );
};

export default CompanyInfo;
