import { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Accordion, Checkbox, Spinner, Table } from "flowbite-react";
import { fetchCompanyInfo } from "../../api/company-api";
import { fetchInvestors } from "../../api/investors-api";
import { fetchBills } from "../../api/bills-api";
import {
  fetchCapitalCalls,
  createCapitalCall,
} from "../../api/capitalcall-api";
import { Company, Investor, Bill, CapitalCall } from "../../utils/interfaces";
import CompanyModal from "../CompanyModal";
import CompanyInfo from "../CompanyInfo";
import { formatCurrency } from "../../utils/utils";
import CapitalCallBox from "../CapitalCallBox";

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

  const [selectedBills, setSelectedBills] = useState<Record<number, boolean>>(
    {}
  );
  const [selectAll, setSelectAll] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          fetchedCompany,
          fetchedInvestors,
          fetchedBills,
          fetchedCapitalCalls,
        ] = await Promise.all([
          fetchCompanyInfo(),
          fetchInvestors(),
          fetchBills(),
          fetchCapitalCalls(),
        ]);

        if (fetchedCompany) {
          setCompany(fetchedCompany);
          setCompanyData(fetchedCompany);
        }
        setInvestors(fetchedInvestors);
        setBills(fetchedBills);
        setCapitalCalls(fetchedCapitalCalls);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCompanyInfoSaved = useCallback(() => {
    fetchCompanyInfo()
      .then((fetchedCompany) => {
        if (fetchedCompany) {
          setCompany(fetchedCompany);
          setCompanyData(fetchedCompany);
        }
      })
      .catch((error) => {
        console.error("Failed to refresh company info.");
        toast.error("Failed to refresh company info.");
      });
  }, []);

  const getValidatedBillsForInvestor = useCallback(
    (investorId: number) => {
      return bills.filter(
        (bill) => bill.investor === investorId && bill.validated
      );
    },
    [bills]
  );

  const handleSelectAll = useCallback(
    (investorId: number, isChecked: boolean) => {
      const validatedBills = getValidatedBillsForInvestor(investorId);
      const updatedSelectedBills = { ...selectedBills };

      validatedBills.forEach((bill) => {
        updatedSelectedBills[bill.id] = isChecked;
      });

      setSelectedBills(updatedSelectedBills);
      setSelectAll((prev) => ({ ...prev, [investorId]: isChecked }));
    },
    [selectedBills, getValidatedBillsForInvestor]
  );

  const handleSelectBill = useCallback((billId: number, isChecked: boolean) => {
    setSelectedBills((prev) => ({ ...prev, [billId]: isChecked }));
  }, []);

  const isAnyBillSelected = useMemo(() => {
    return Object.values(selectedBills).some((isSelected) => isSelected);
  }, [selectedBills]);

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
                            disabled={!isAnyBillSelected}
                            onClick={() => handleCreateCapitalCall(investor)}
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
            <div className="p-4 bg-slate-100 rounded-xl w-full">
              <h3 className="text-xl font-medium mb-4">Capital Calls</h3>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[600px]">
                  {capitalCalls.map((capitalCall) => (
                    <CapitalCallBox
                      key={capitalCall.id}
                      capitalCall={capitalCall}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      )}
      <ToastContainer />
      <CompanyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        companyData={companyData}
        setCompanyData={setCompanyData}
        onCompanyInfoSaved={handleCompanyInfoSaved}
      />
    </>
  );
}
