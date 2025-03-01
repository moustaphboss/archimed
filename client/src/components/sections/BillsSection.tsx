import { useEffect, useState } from "react";
import { Bill, Company } from "../../utils/interfaces";
import { Button, Spinner, Table } from "flowbite-react";
import { generateBills, fetchBills, validateBill } from "../../api/bills-api";
import { toast, ToastContainer } from "react-toastify";
import { formatCurrency } from "../../utils/utils";
import { fetchCompanyInfo } from "../../api/company-api";
import CompanyModal from "../CompanyModal";

export default function BillsSection() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [companyData, setCompanyData] = useState<Company>({
    id: 0,
    name: "",
    fee_percentage: 0,
    iban: "",
  });

  const hasBills = bills.length > 0;

  const handleValidate = async (billId: number) => {
    try {
      await validateBill(billId);
      loadBills();
      toast.success("Bill validated!");
    } catch (error) {
      console.error("Failed to validate bill:", error);
      toast.error("Failed to validate bills");
    }
  };

  const handleGenerateBills = async () => {
    setIsLoading(true);
    try {
      await generateBills();
      loadBills();
    } catch (error) {
      console.error("Failed to generate bills.");
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
      toast.error("Failed to fetch bills.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      setIsLoading(true);
      try {
        const fetchedCompany = await fetchCompanyInfo();
        if (fetchedCompany) {
          setCompany(fetchedCompany);
          setCompanyData(fetchedCompany);
        }
      } catch (error) {
        toast.error("Failed to load company info.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyInfo();
  }, []);

  useEffect(() => {
    if (companyData) {
      handleGenerateBills();
    }
  }, [companyData]);

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

  return (
    <>
      <h1 className="text-3xl font-medium mb-6">Bills</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner aria-label="Loading bills..." />
        </div>
      ) : company ? (
        <>
          {hasBills ? (
            <div className="mt-4">
              <div className="bg-violet-100 mb-4 p-4 rounded-lg flex space-x-4 justify-center items-center">
                <i className="fi-rr-info text-violet-600 mt-1 text-2xl"></i>
                <p className="text-lg font-regular text-violet-700">
                  The list of bills is dynamically generated. Refresh to check
                  for new bills :)
                </p>
              </div>

              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Bill Code</Table.HeadCell>
                  <Table.HeadCell>Investor Id</Table.HeadCell>
                  <Table.HeadCell>Type</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Issue Date</Table.HeadCell>
                  <Table.HeadCell>Validated</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {bills.map((bill) => (
                    <Table.Row key={bill.id}>
                      <Table.Cell>{bill.bill_code}</Table.Cell>
                      <Table.Cell>{bill.investor}</Table.Cell>
                      <Table.Cell>{bill.type}</Table.Cell>
                      <Table.Cell>{formatCurrency(bill.amount)}</Table.Cell>
                      <Table.Cell>{bill.issue_date}</Table.Cell>
                      <Table.Cell>
                        {!bill.validated && (
                          <Button
                            className="border-violet-600 text-violet-600 rounded-full"
                            onClick={() => handleValidate(bill.id)}
                          >
                            Validate
                          </Button>
                        )}
                        {bill.validated && (
                          <span className="bg-green-100 px-4 py-2 text-green-800 rounded-full">
                            Validated
                          </span>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center">
              <p className="mt-20 mb-8 text-gray-500 text-2xl">
                There are no bills to display. Start by adding investors :)
              </p>
            </div>
          )}
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
