import React from "react";
import { Company } from "../utils/interfaces";

interface CompanyInfoProps {
  company: Company;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => {
  return (
    <div className="bg-gradient-to-bl from-violet-600 to-violet-800 rounded-2xl p-8">
      <h4 className="text-white text-2xl mb-6 font-medium text-center">
        Company Information
      </h4>
      <div className="flex w-full space-x-20 text-center justify-center">
        <div>
          <h5 className="text-violet-300">Name</h5>
          <p className="text-white">{company.name}</p>
        </div>
        <div>
          <h5 className="text-violet-300">Fee Percentage</h5>
          <p className="text-white">{company.fee_percentage}%</p>
        </div>
        <div>
          <h5 className="text-violet-300">IBAN</h5>
          <p className="text-white">{company.iban}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
