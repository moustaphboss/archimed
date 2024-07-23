import { useState, useEffect } from "react";
import { fetchCompanyInfo } from "../../api/company-api";
import { fetchInvestors } from "../../api/investors-api";
import { fetchBills } from "../../api/bills-api";
import { fetchCapitalCalls } from "../../api/capitalcall-api";
import { Company, Investor, Bill, CapitalCall } from "../../utils/interfaces";
import { toast, ToastContainer } from "react-toastify";
import { Accordion, Checkbox, Spinner, Table } from "flowbite-react";
import CompanyModal from "../CompanyModal";
import CompanyInfo from "../CompanyInfo";
import { formatCurrency } from "../../utils/utils";
import { createCapitalCall } from "../../api/capitalcall-api";

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
  const [capitalCalls, setCapitalCalls] = useState<CapitalCall[]>([]);
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
      setIsLoading(true);
      try {
        const fetchedInvestors = await fetchInvestors();
        setInvestors(fetchedInvestors);
      } catch (error) {
        toast.error("Failed to load investors.");
      } finally {
        setIsLoading(false);
      }
    };

    const loadBills = async () => {
      setIsLoading(true);
      try {
        const fetchedBills = await fetchBills();
        setBills(fetchedBills);
      } catch (error) {
        toast.error("Failed to load bills.");
      } finally {
        setIsLoading(false);
      }
    };

    const loadCapitalCalls = async () => {
      setIsLoading(true);
      try {
        const fetchedCapitalCalls = await fetchCapitalCalls();
        setCapitalCalls(fetchedCapitalCalls);
      } catch (error) {
        toast.error("Failed to load capital calls.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvestors();
    loadBills();
    loadCapitalCalls();
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

  const handleCreateCapitalCall = async (investor: Investor) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const formattedDueDate = dueDate.toISOString().split("T")[0];

      const selectedBillsForInvestor = getValidatedBillsForInvestor(
        investor.id
      ).filter((bill) => selectedBills[bill.id]);

      const totalAmount = selectedBillsForInvestor.reduce(
        (sum, bill) =>
          sum +
          (typeof bill.amount === "string"
            ? parseFloat(bill.amount)
            : bill.amount),
        0
      );

      const capitalCallData = {
        company_name: company?.name || "",
        company_iban: company?.iban || "",
        date: today,
        due_date: formattedDueDate,
        first_name: investor.first_name,
        last_name: investor.last_name,
        email: investor.email,
        total_amount: totalAmount,
        status: "sent",
      };

      await createCapitalCall(capitalCallData);
      toast.success("Capital call created successfully.");

      const fetchedCapitalCalls = await fetchCapitalCalls();
      setCapitalCalls(fetchedCapitalCalls);
    } catch (error) {
      toast.error("Failed to create capital call.");
    }
  };

  const handleClickCreateCapitalCall = (investor: Investor) => {
    handleCreateCapitalCall(investor);
  };

  return (
    <>
      <h1 className="text-3xl font-medium mb-6">Capital Calls</h1>
      {company ? (
        <>
          <CompanyInfo
            company={company}
            onEditClick={() => setOpenModal(true)}
          />
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
                            onClick={() =>
                              handleClickCreateCapitalCall(investor)
                            }
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
            <div className="p-4  bg-slate-100 rounded-xl w-full">
              <h3 className="text-xl font-medium mb-4">Capital Calls</h3>
              {capitalCalls.length === 0 ? (
                <div className="text-center text-gray-500">
                  No capital calls yet.
                </div>
              ) : (
                capitalCalls.map((capitalCall) => (
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
                      <strong>IBAN:</strong> {capitalCall.company_iban}
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
                ))
              )}
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
