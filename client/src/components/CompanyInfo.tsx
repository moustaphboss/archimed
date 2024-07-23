import React from "react";
import { Company } from "../utils/interfaces";

interface CompanyInfoProps {
  company: Company;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => {
  return (
    <div className="bg-gradient-to-bl from-violet-600 to-violet-800 rounded-2xl p-8 flex">
      <h4 className="text-white text-xl font-medium w-1/3">
        Company
        <br />
        Information
      </h4>
      <div className="flex w-full space-x-20 text-center justify-center">
        <div>
          <h5 className="text-violet-200">Name</h5>
          <p className="text-white font-medium text-lg">{company.name}</p>
        </div>
        <div>
          <h5 className="text-violet-200">Fee Percentage</h5>
          <p className="text-white font-medium text-lg">
            {company.fee_percentage}%
          </p>
        </div>
        <div>
          <h5 className="text-violet-200">IBAN</h5>
          <p className="text-white font-medium text-lg">{company.iban}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
