import React, { useEffect, useState } from "react";
import { Bill } from "../../utils/interfaces";
import { Table } from "flowbite-react";
import { generateBills, fetchBills } from "../../api/bills-api";
import { toast, ToastContainer } from "react-toastify";

export default function BillsSection() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasBills = bills.length > 0;

  const handleGenerateBills = async () => {
    setIsLoading(true);
    try {
      await generateBills();
      toast.success("Bills generated successfully!");
      loadBills(); // Reload bills after generation
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

  return (
    <>
      <h1 className="text-2xl font-medium">Bills</h1>
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
              <Table.HeadCell>Bill Id</Table.HeadCell>
              <Table.HeadCell>Investor Id</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Validated</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {bills.map((bill) => (
                <Table.Row key={bill.id}>
                  <Table.Cell>{bill.id}</Table.Cell>
                  <Table.Cell>{bill.investor}</Table.Cell>
                  <Table.Cell>{bill.type}</Table.Cell>
                  <Table.Cell>{bill.amount}</Table.Cell>
                  <Table.Cell>{bill.validated ? "Yes" : "No"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center">
          <p className="mt-20 mb-8 text-gray-500 text-2xl">
            There are no bills to display.
          </p>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
