import { useState, useEffect } from "react";
import { fetchCompanyInfo } from "../../api/company-api";
import { fetchInvestors } from "../../api/investors-api";
import { fetchBills } from "../../api/bills-api";
import { Company, Investor, Bill } from "../../utils/interfaces";
import { toast, ToastContainer } from "react-toastify";
import { Accordion, Checkbox, Spinner, Table } from "flowbite-react";
import CompanyModal from "../CompanyModal";
import CompanyInfo from "../CompanyInfo";
import { formatCurrency } from "../../utils/utils";

export default function CapitalCallsSection() {
  const [openModal, setOpenModal] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [companyData, setCompanyData] = useState<Company>({
    id: 0,
    name: "",
    fee_percentage: 0,
    iban: "",
  });

  const [investors, setInvestors] = useState<Investor[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedBills, setSelectedBills] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState<{ [key: number]: boolean }>({});

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

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        const fetchedInvestors = await fetchInvestors();
        setInvestors(fetchedInvestors);
      } catch (error) {
        toast.error("Failed to load investors.");
      }
    };

    const loadBills = async () => {
      try {
        const fetchedBills = await fetchBills();
        setBills(fetchedBills);
      } catch (error) {
        toast.error("Failed to load bills.");
      }
    };

    loadInvestors();
    loadBills();
  }, []);

  const handleCompanyInfoSaved = () => {
    fetchCompanyInfo()
      .then((fetchedCompany) => {
        if (fetchedCompany) {
          setCompany(fetchedCompany);
          setCompanyData(fetchedCompany);
        }
      })
      .catch((error) => {
        console.error("Failed to refresh company info.");
      });
  };

  const getValidatedBillsForInvestor = (investorId: number) => {
    return bills.filter(
      (bill) => bill.investor === investorId && bill.validated
    );
  };

  const handleSelectAll = (investorId: number, isChecked: boolean) => {
    const validatedBills = getValidatedBillsForInvestor(investorId);
    const updatedSelectedBills = { ...selectedBills };

    validatedBills.forEach((bill) => {
      updatedSelectedBills[bill.id] = isChecked;
    });

    setSelectedBills(updatedSelectedBills);
    setSelectAll((prev) => ({ ...prev, [investorId]: isChecked }));
  };

  const handleSelectBill = (billId: number, isChecked: boolean) => {
    setSelectedBills((prev) => ({ ...prev, [billId]: isChecked }));
  };

  const isAnyBillSelected = () => {
    return Object.values(selectedBills).some((isSelected) => isSelected);
  };

  return (
    <>
      <h1 className="text-3xl font-medium mb-6">Capital Calls</h1>
      {company ? (
        <>
          <CompanyInfo company={company} />
          <div className="flex space-x-6 mt-6 h-4/5">
            <div className="p-4 border border-gray-300 rounded-xl w-full flex-grow">
              <h3 className="text-xl font-medium mb-4">Investors</h3>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <Accordion>
                  {investors.map((investor) => (
                    <Accordion.Panel key={investor.id}>
                      <Accordion.Title className="font-medium bg-white hover:bg-slate-50 focus:ring-0 focus:font-bold focus:text-violet-700">
                        {investor.first_name} {investor.last_name}
                      </Accordion.Title>
                      <Accordion.Content className="bg-slate-100">
                        <h4 className="text-md font-bold text-gray-700 mb-4">
                          Validated Bills
                        </h4>

                        <Table className="min-w-full divide-y divide-gray-200 mb-2">
                          <Table.Head>
                            <Table.HeadCell className="p-4">
                              <Checkbox
                                checked={selectAll[investor.id] || false}
                                onChange={(e) =>
                                  handleSelectAll(investor.id, e.target.checked)
                                }
                                color="indigo"
                              />
                            </Table.HeadCell>
                            <Table.HeadCell className="px-4 py-2">
                              Bill Code
                            </Table.HeadCell>
                            <Table.HeadCell className="px-4 py-2">
                              Amount
                            </Table.HeadCell>
                          </Table.Head>
                          <Table.Body className="bg-white divide-y divide-gray-200">
                            {getValidatedBillsForInvestor(investor.id).map(
                              (bill) => (
                                <Table.Row
                                  className="bg-slate-100"
                                  key={bill.id}
                                >
                                  <Table.Cell className="p-4">
                                    <Checkbox
                                      color="indigo"
                                      checked={selectedBills[bill.id] || false}
                                      onChange={(e) =>
                                        handleSelectBill(
                                          bill.id,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </Table.Cell>
                                  <Table.Cell className="px-4 py-2">
                                    {bill.bill_code}
                                  </Table.Cell>
                                  <Table.Cell className="px-4 py-2">
                                    {formatCurrency(bill.amount)}
                                  </Table.Cell>
                                </Table.Row>
                              )
                            )}
                          </Table.Body>
                        </Table>
                        <div className="flex justify-end">
                          <button
                            className="bg-violet-600 text-white rounded-xl p-3 disabled:bg-violet-300 disabled:cursor-not-allowed"
                            disabled={!isAnyBillSelected()}
                          >
                            Create Capital Call
                          </button>
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                  ))}
                </Accordion>
              )}
            </div>
            <div className="p-4 border border-gray-300 rounded-xl w-full">
              <h3 className="text-xl font-medium">Capital Calls</h3>
            </div>
          </div>
        </>
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

      <CompanyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        companyData={companyData}
        setCompanyData={setCompanyData}
        onCompanyInfoSaved={handleCompanyInfoSaved}
      />
      <ToastContainer />
    </>
  );
}
