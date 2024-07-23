import React from "react";
import { Company } from "../utils/interfaces";
import IBAN from "iban";

interface CompanyInfoProps {
  company: Company;
  onEditClick: () => void;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company, onEditClick }) => {
  return (
    <div className="bg-gradient-to-bl from-violet-600 to-violet-800 rounded-2xl p-8 flex items-center">
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
          <p className="text-white font-medium text-lg">
            {IBAN.printFormat(company.iban)}
          </p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="border border-violet-300 rounded-full px-6 py-2 text-white flex hover:border-violet-100"
      >
        <i className="fi-rr-edit text-lg mr-3 mt-0.5"></i>
        <span className="font-medium text-lg">Edit</span>
      </button>
    </div>
  );
};

export default CompanyInfo;
