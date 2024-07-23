import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState, ChangeEvent } from "react";
import IBAN from "iban";

import { toast } from "react-toastify";
import { Company } from "../utils/interfaces";
import { saveCompanyInfo } from "../api/company-api";

interface CompanyModalProps {
  open: boolean;
  onClose: () => void;
  companyData: Company;
  setCompanyData: React.Dispatch<React.SetStateAction<Company>>;
  onCompanyInfoSaved: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  onClose,
  companyData,
  setCompanyData,
  onCompanyInfoSaved,
}) => {
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [ibanError, setIbanError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "iban") {
      // Validate IBAN as the user types
      if (IBAN.isValid(value)) {
        setIbanError(null);
      } else {
        setIbanError("Invalid IBAN format.");
      }
    }
  };

  const handleSaveCompanyInfo = async () => {
    if (!IBAN.isValid(companyData.iban)) {
      setIbanError("Please enter a valid IBAN.");
      return;
    }

    setLocalIsLoading(true);
    try {
      await saveCompanyInfo(companyData);
      toast.success("Company info saved successfully!");
      onCompanyInfoSaved();
      onClose();
    } catch (error) {
      toast.error("Failed to save company info.");
    } finally {
      setLocalIsLoading(false);
    }
  };

  return (
    <Modal
      show={open}
      className="text-gray-900 bg-slate-950 bg-opacity-70"
      onClose={onClose}
    >
      <Modal.Header>
        <span className="text-2xl text-gray-600">
          Company General Information
        </span>
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-6">
          <div className="flex space-x-4">
            <div className="w-full">
              <Label className="block text-md font-medium text-gray-700 mb-1">
                Company Name
              </Label>
              <TextInput
                type="text"
                name="name"
                value={companyData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-60">
              <Label className="block text-md font-medium text-gray-700 mb-1">
                Fee Percentage (%)
              </Label>
              <TextInput
                type="number"
                max={100}
                min={0}
                name="fee_percentage"
                value={companyData.fee_percentage}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full">
            <Label className="block text-md font-medium text-gray-700 mb-1">
              IBAN
            </Label>
            <TextInput
              type="text"
              name="iban"
              value={companyData.iban}
              onChange={handleInputChange}
              className={ibanError ? "border-red-500" : ""}
            />
            {ibanError && (
              <span className="text-red-500 text-sm">{ibanError}</span>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex space-x-4 justify-end w-full">
          <Button
            className={`${
              localIsLoading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white text-xl"
            } flex items-center`}
            onClick={handleSaveCompanyInfo}
            disabled={localIsLoading}
          >
            {localIsLoading ? (
              <div className="flex items-center">
                <i className="fi-rr-menu-dots animate-spin mr-4 mt-0.5"></i>
                Saving...
              </div>
            ) : (
              <>
                <i className="fi-rr-disk mr-4 mt-0.5"></i>
                Save
              </>
            )}
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CompanyModal;
