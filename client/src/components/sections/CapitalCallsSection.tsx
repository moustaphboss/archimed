import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { fetchCompanyInfo, saveCompanyInfo } from "../../api/company-api";
import { Company } from "../../utils/interfaces";
import { toast, ToastContainer } from "react-toastify";

export default function CapitalCallsSection() {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [companyData, setCompanyData] = useState<Company>({
    id: 0,
    name: "",
    fee_percentage: 0,
    iban: "",
  });

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const fetchedCompany = await fetchCompanyInfo();
        if (fetchedCompany) {
          setCompany(fetchedCompany);
          setCompanyData(fetchedCompany);
        }
      } catch (error) {
        toast.error("Failed to load company info.");
      }
    };

    loadCompanyInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const savedCompany = await saveCompanyInfo(companyData);
      setCompany(savedCompany);
      toast.success("Company info saved successfully!");
      setOpenModal(false);
    } catch (error) {
      toast.error("Failed to save company info.");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(company);

  return (
    <>
      <h1 className="text-3xl font-medium mb-6">Capital Calls</h1>
      {company ? (
        <div className="bg-violet-100 rounded-xl p-8 text-center">
          <h4 className="text-gray-800 text-2xl mb-4 font-medium">
            Company Information
          </h4>
          <p className="text-gray-700">Name: {company.name}</p>
          <p className="text-gray-700">
            Fee Percentage: {company.fee_percentage}%
          </p>
          <p className="text-gray-700">IBAN: {company.iban}</p>
        </div>
      ) : (
        <div className="bg-violet-100 rounded-xl p-8 text-center">
          <h4 className="text-gray-800 text-2xl mb-4 font-medium">
            Start by adding the Company Data
          </h4>
          <button
            onClick={() => setOpenModal(true)}
            className="px-8 py-4 text-lg bg-violet-600 text-white rounded-xl"
          >
            Add company data
          </button>
        </div>
      )}

      <Modal
        show={openModal}
        className="text-gray-900 bg-slate-950 bg-opacity-70"
        onClose={() => setOpenModal(false)}
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
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-4 justify-end w-full">
            <Button
              className={`${
                isLoading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-purple-600 text-white text-xl"
              } flex items-center`}
              onClick={handleSaveCompanyInfo}
              disabled={isLoading}
            >
              {isLoading ? (
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
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
