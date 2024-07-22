import React, { useEffect, useState } from "react";
import { Bill, Company } from "../../utils/interfaces";
import { Button, Table } from "flowbite-react";
import { generateBills, fetchBills, validateBill } from "../../api/bills-api";
import { toast, ToastContainer } from "react-toastify";
import { formatCurrency } from "../../utils/utils";
import { fetchCompanyInfo } from "../../api/company-api";
import CompanyModal from "../CompanyModal";

export default function BillsSection() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
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
      toast.success("Bill validated successfully!");
    } catch (error) {
      console.error("Failed to validate bill:", error);
      toast.error("Failed to validate bills");
    }
  };

  const handleGenerateBills = async () => {
    setIsLoading(true);
    try {
      await generateBills();
      toast.success("Bills generated successfully!");
      loadBills();
    } catch (error) {
      toast.error("Failed to generate bills.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadBills = async () => {
    try {
      const fetchedBills = await fetchBills();
      setBills(fetchedBills);
      console.log(fetchedBills);
    } catch (error) {
      toast.error("Failed to fetch bills.");
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

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
      {company ? (
        <>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleGenerateBills}
              className={`${
                isLoading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700 text-white"
              } p-4 rounded-xl`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fi-rr-menu-dots animate-spin mr-4 mt-0.5"></i>
                  Generating...
                </div>
              ) : (
                "Generate Bills"
              )}
            </button>
          </div>

          {hasBills ? (
            <div className="mt-4">
              <Table>
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
              <div className="bg-slate-100 p-12 my-8 rounded-3xl">
                <svg
                  width="110"
                  height="110"
                  viewBox="0 0 110 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.6476 40.6433H54.0209C54.2468 40.6433 54.4704 40.5989 54.6791 40.5125C54.8878 40.4261 55.0774 40.2994 55.2371 40.1397C55.3968 39.98 55.5234 39.7904 55.6098 39.5817C55.6963 39.3731 55.7407 39.1494 55.7406 38.9235V30.576C55.7407 30.3501 55.6963 30.1265 55.6098 29.9178C55.5234 29.7091 55.3968 29.5195 55.2371 29.3598C55.0774 29.2001 54.8878 29.0735 54.6791 28.987C54.4704 28.9006 54.2468 28.8562 54.0209 28.8563H29.6476C29.4217 28.8562 29.1981 28.9006 28.9894 28.987C28.7807 29.0735 28.5911 29.2001 28.4314 29.3598C28.2717 29.5195 28.145 29.7091 28.0586 29.9178C27.9722 30.1265 27.9278 30.3501 27.9279 30.576V38.9235C27.9278 39.1494 27.9722 39.373 28.0586 39.5817C28.145 39.7904 28.2717 39.98 28.4314 40.1397C28.5911 40.2994 28.7807 40.4261 28.9894 40.5125C29.1981 40.5989 29.4217 40.6433 29.6476 40.6433ZM31.3673 32.2957H52.3012V37.2038H31.3673V32.2957Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M29.6475 47.7438C29.1975 47.7529 28.7689 47.9381 28.4539 48.2597C28.1388 48.5812 27.9623 49.0134 27.9623 49.4636C27.9624 49.9137 28.1388 50.346 28.4539 50.6675C28.769 50.989 29.1976 51.1742 29.6477 51.1832H75.0287C75.4788 51.1742 75.9075 50.9891 76.2226 50.6675C76.5378 50.346 76.7143 49.9137 76.7143 49.4635C76.7143 49.0132 76.5377 48.581 76.2225 48.2594C75.9074 47.9379 75.4787 47.7528 75.0285 47.7438L29.6475 47.7438Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M75.0287 57.188H29.6476C29.1974 57.197 28.7688 57.3821 28.4536 57.7037C28.1385 58.0252 27.962 58.4575 27.962 58.9077C27.962 59.358 28.1385 59.7902 28.4537 60.1118C28.7689 60.4333 29.1976 60.6184 29.6477 60.6274H75.0287C75.4787 60.6182 75.9072 60.4329 76.2222 60.1114C76.5371 59.7899 76.7136 59.3578 76.7136 58.9077C76.7136 58.4576 76.5371 58.0254 76.2222 57.7039C75.9072 57.3824 75.4787 57.1972 75.0287 57.188Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M75.0287 66.6322H29.6476C29.1974 66.6412 28.7688 66.8263 28.4536 67.1479C28.1385 67.4694 27.962 67.9017 27.962 68.3519C27.962 68.8022 28.1385 69.2345 28.4537 69.556C28.7689 69.8775 29.1976 70.0626 29.6477 70.0716H75.0287C75.4787 70.0624 75.9072 69.8771 76.2222 69.5556C76.5371 69.2341 76.7136 68.802 76.7136 68.3519C76.7136 67.9018 76.5371 67.4696 76.2222 67.1481C75.9072 66.8266 75.4787 66.6414 75.0287 66.6322Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M58.6342 76.0755H29.6475C29.1974 76.0845 28.7687 76.2697 28.4536 76.5912C28.1384 76.9127 27.9619 77.345 27.9619 77.7953C27.9619 78.2455 28.1385 78.6778 28.4537 78.9993C28.7688 79.3208 29.1975 79.5059 29.6476 79.5149H58.6342C59.0844 79.5059 59.5131 79.3208 59.8282 78.9993C60.1434 78.6777 60.3199 78.2454 60.3199 77.7952C60.3199 77.345 60.1434 76.9127 59.8282 76.5912C59.5131 76.2696 59.0844 76.0845 58.6342 76.0755Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M52.3381 85.5197H29.6476C29.1973 85.5285 28.7684 85.7136 28.4531 86.0351C28.1377 86.3567 27.9611 86.7891 27.9611 87.2395C27.9611 87.6899 28.1378 88.1223 28.4532 88.4438C28.7685 88.7654 29.1974 88.9504 29.6477 88.9591H52.3381C52.7883 88.9501 53.217 88.765 53.5321 88.4435C53.8473 88.1219 54.0238 87.6897 54.0238 87.2394C54.0238 86.7892 53.8473 86.3569 53.5321 86.0354C53.217 85.7139 52.7883 85.5287 52.3381 85.5197Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M92.4358 24.1119C92.3589 6.92094 69.9213 0.438164 60.665 14.6907L26.3676 14.6904C24.0338 14.6931 21.7963 15.6214 20.146 17.2716C18.4956 18.9218 17.5671 21.1592 17.5642 23.4931V94.3223C17.5671 96.6562 18.4956 98.8936 20.146 100.544C21.7963 102.194 24.0338 103.122 26.3676 103.125H64.8984C65.2183 103.13 65.531 103.03 65.7888 102.841C66.3459 102.676 86.1339 84.301 86.5698 84.0422C86.8878 83.7031 87.0788 83.2645 87.1104 82.8007V36.5643C88.7932 34.9561 90.1327 33.0236 91.048 30.8834C91.9633 28.7431 92.4354 26.4396 92.4358 24.1119ZM75.1446 10.2601C78.817 10.2642 82.3379 11.725 84.9347 14.3218C87.5315 16.9186 88.9922 20.4395 88.9964 24.1119C88.2999 42.4618 61.9864 42.4568 61.2927 24.1117C61.2969 20.4393 62.7576 16.9185 65.3545 14.3217C67.9513 11.7249 71.4721 10.2642 75.1446 10.2601ZM66.6182 97.5219V84.5204H80.9388L66.6182 97.5219ZM83.6709 81.0809H64.8984C64.6726 81.0809 64.4489 81.1253 64.2402 81.2117C64.0316 81.2982 63.8419 81.4248 63.6822 81.5845C63.5225 81.7443 63.3959 81.9339 63.3095 82.1426C63.2231 82.3512 63.1786 82.5749 63.1787 82.8008V99.6856H26.3676C24.9456 99.6841 23.5823 99.1186 22.5767 98.1131C21.5711 97.1077 21.0053 95.7444 21.0036 94.3224V23.4931C21.0053 22.071 21.5711 20.7078 22.5767 19.7023C23.5823 18.6969 24.9456 18.1314 26.3676 18.1299H58.9423C57.7074 21.452 57.5253 25.0737 58.4206 28.503C59.3159 31.9323 61.2452 35.0028 63.9465 37.2973C66.6477 39.5918 69.9898 40.9991 73.5188 41.3279C77.0477 41.6567 80.5923 40.8912 83.6709 39.1352V81.0809Z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M68.9828 30.2729C69.1425 30.4326 69.332 30.5593 69.5407 30.6457C69.7493 30.7322 69.9729 30.7767 70.1987 30.7767C70.4246 30.7767 70.6482 30.7322 70.8568 30.6457C71.0654 30.5593 71.255 30.4326 71.4146 30.2729L75.1446 26.5432L78.8746 30.2729C79.1973 30.594 79.6343 30.7741 80.0896 30.7736C80.545 30.773 80.9815 30.5919 81.3035 30.2699C81.6254 29.948 81.8065 29.5114 81.8071 29.0561C81.8076 28.6008 81.6276 28.1638 81.3064 27.8411L77.5765 24.1115L81.3064 20.3819C81.6276 20.0592 81.8076 19.6222 81.8071 19.1669C81.8065 18.7116 81.6254 18.275 81.3035 17.9531C80.9815 17.6311 80.545 17.45 80.0896 17.4494C79.6343 17.4489 79.1973 17.629 78.8746 17.9502L75.1446 21.6798L71.4146 17.9502C71.0919 17.629 70.6549 17.4489 70.1996 17.4494C69.7443 17.45 69.3077 17.6311 68.9858 17.9531C68.6638 18.275 68.4827 18.7116 68.4821 19.1669C68.4816 19.6222 68.6616 20.0592 68.9828 20.3819L72.7127 24.1115L68.9828 27.8411C68.8231 28.0007 68.6964 28.1903 68.61 28.3989C68.5235 28.6075 68.479 28.8311 68.479 29.057C68.479 29.2828 68.5235 29.5064 68.61 29.715C68.6964 29.9237 68.8231 30.1132 68.9828 30.2729Z"
                    fill="#9CA3AF"
                  />
                </svg>
              </div>
              <p className="mt-20 mb-8 text-gray-500 text-2xl">
                There are no bills to display.
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
