import React, { useState } from "react";
import { Investor } from "../../utils/interfaces";
import { Button, Modal, Table } from "flowbite-react";

const INVESTORS: Investor[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    amount_invested: 10000,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    amount_invested: 15000,
  },
  {
    id: 3,
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@example.com",
    amount_invested: 20000,
  },
  {
    id: 4,
    first_name: "Bob",
    last_name: "Brown",
    email: "bob.brown@example.com",
    amount_invested: 25000,
  },
  {
    id: 5,
    first_name: "Charlie",
    last_name: "Davis",
    email: "charlie.davis@example.com",
    amount_invested: 30000,
  },
];

export default function InvestorsSection() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newInvestor, setNewInvestor] = useState<Investor>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    amount_invested: 0,
  });

  const hasInvestors = investors.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvestor((prev) => ({
      ...prev,
      [name]: name === "amount_invested" ? parseFloat(value) : value,
    }));
  };

  const handleAddInvestor = () => {
    setInvestors((prev) => [...prev, { ...newInvestor, id: prev.length + 1 }]);
    setOpenModal(false);
    setNewInvestor({
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
      amount_invested: 0,
    });
  };

  return (
    <>
      <h1 className="text-3xl font-medium">Investors</h1>

      <button
        onClick={() => setOpenModal(true)}
        className="text-lg text-violet-600 border-2 border-violet-600 font-medium hover:bg-violet-600 hover:text-white p-4 rounded-xl mt-10 "
      >
        <i className={`fi-rr-user-add mt-2 mr-4`}></i>
        Add Investor
      </button>

      {hasInvestors ? (
        <div className="mt-4">
          <Table>
            <Table.Head>
              <Table.HeadCell>Investor Id</Table.HeadCell>
              <Table.HeadCell>First Name</Table.HeadCell>
              <Table.HeadCell>Last Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Amount Invested</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {investors.map((investor) => (
                <Table.Row key={investor.id}>
                  <Table.Cell>{investor.id}</Table.Cell>
                  <Table.Cell>{investor.first_name}</Table.Cell>
                  <Table.Cell>{investor.last_name}</Table.Cell>
                  <Table.Cell>{investor.email}</Table.Cell>
                  <Table.Cell>{investor.amount_invested}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center">
          <p className="mb-8 text-gray-500 text-2xl">
            There are no investors to display.
          </p>
          <div className="bg-slate-100 p-8 mb-8 rounded-3xl">
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_9_136)">
                <path
                  d="M95.9998 22.4999C95.9998 10.0935 85.9064 0 73.4999 0C66.8506 0 60.8656 2.8993 56.7431 7.50016H5.62498C2.52337 7.50016 0 10.0235 0 13.1251V90.375C0 93.4766 2.52337 96 5.62479 96H69.7499C72.8515 96 75.3749 93.4766 75.3749 90.375V44.9224C86.9076 43.9665 95.9998 34.2751 95.9998 22.4999ZM5.62498 11.2501H54.0197C52.0999 14.5616 51 18.4047 51 22.4999C51 26.3815 51.9973 30.1806 53.891 33.5389C53.3644 35.5011 52.838 37.4637 52.3112 39.4296C51.9855 40.6521 52.329 41.9121 53.2297 42.8001C54.1168 43.6744 55.4077 44.0104 56.6021 43.6791C58.5547 43.1558 60.5071 42.6321 62.4596 42.1082C65.2754 43.6963 68.4007 44.6539 71.6247 44.922V83.55H3.74999V13.1251C3.74999 12.0913 4.59111 11.2501 5.62498 11.2501ZM69.7499 92.25H5.62498C4.59111 92.25 3.75017 91.4089 3.75017 90.375V87.3H71.6251V90.375C71.6249 91.4089 70.7838 92.25 69.7499 92.25ZM73.4999 41.2498C70.0353 41.2498 66.6511 40.2973 63.713 38.4953C63.4153 38.3127 63.0757 38.2185 62.7326 38.2185C62.57 38.2185 62.4067 38.2397 62.2466 38.2827C60.183 38.8363 58.1195 39.3898 56.0559 39.943C56.6092 37.878 57.1625 35.8152 57.7162 33.7519C57.8497 33.2547 57.7728 32.7246 57.5036 32.2857C55.7021 29.3483 54.7496 25.9645 54.7496 22.4999C54.7496 12.1612 63.1606 3.74999 73.4995 3.74999C83.8384 3.74999 92.2495 12.1612 92.2495 22.4999C92.2495 32.8386 83.8388 41.2498 73.4999 41.2498Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M84.7498 16.875C84.7498 15.3725 84.1648 13.9601 83.1024 12.8979C82.0402 11.8355 80.6278 11.2503 79.1252 11.2503C77.6227 11.2503 76.2103 11.8355 75.1479 12.8979L73.5003 14.5456L71.8524 12.8977C69.6592 10.7047 66.0907 10.7047 63.8979 12.8977C61.7051 15.0907 61.7051 18.659 63.8979 20.852L65.5458 22.5L63.8979 24.1477C61.7051 26.3407 61.7051 29.909 63.8979 32.102C66.0907 34.2948 69.6592 34.2948 71.8524 32.102L73.5003 30.4543L75.1479 32.102C76.2103 33.1644 77.6227 33.7494 79.1252 33.7494C80.6278 33.7494 82.0402 33.1642 83.1024 32.102C84.1646 31.0398 84.7498 29.6274 84.7498 28.125C84.7498 26.6225 84.1648 25.2101 83.1024 24.1479L81.4545 22.5L83.1022 20.852C84.1646 19.7898 84.7498 18.3774 84.7498 16.875ZM77.477 23.8258L80.4504 26.7993C80.8046 27.1533 80.9996 27.6241 80.9996 28.1248C80.9996 28.6256 80.8046 29.0962 80.4504 29.4504C80.0964 29.8044 79.6258 29.9994 79.125 29.9994C78.6242 29.9994 78.1533 29.8044 77.7995 29.4504L74.8262 26.4768C74.46 26.1106 73.9802 25.9276 73.5003 25.9276C73.0205 25.9276 72.5407 26.1106 72.1747 26.4768L69.2008 29.4504C68.8468 29.8046 68.3762 29.9994 67.8753 29.9994C67.3745 29.9994 66.9037 29.8044 66.5499 29.4504C65.8192 28.7195 65.8192 27.5302 66.5497 26.7993L69.5235 23.8258C69.8752 23.4742 70.0728 22.9972 70.0728 22.5C70.0728 22.0027 69.8752 21.5257 69.5237 21.1741L66.5499 18.2006C65.8192 17.4697 65.8192 16.2804 66.5499 15.5495C66.9039 15.1953 67.3745 15.0005 67.8753 15.0005C68.3762 15.0005 68.847 15.1955 69.2008 15.5495L72.1745 18.5231C72.5263 18.8746 73.0031 19.0723 73.5003 19.0723C73.9976 19.0723 74.4746 18.8746 74.8262 18.5231L77.7995 15.5495C78.1535 15.1953 78.6242 15.0005 79.125 15.0005C79.6258 15.0005 80.0966 15.1955 80.4504 15.5495C80.8046 15.9033 80.9998 16.3741 80.9998 16.875C80.9998 17.3758 80.8048 17.8464 80.4506 18.2006L77.4772 21.1743C76.7448 21.9063 76.7448 23.0936 77.477 23.8258Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M13.1254 52.5005H43.1254C44.1607 52.5005 45.0004 51.6611 45.0004 50.6255C45.0004 43.5729 40.6515 37.517 34.4947 34.9985C36.3424 33.2851 37.5004 30.8381 37.5004 28.1255C37.5004 22.9561 33.2947 18.7505 28.1254 18.7505C22.956 18.7505 18.7504 22.9561 18.7504 28.1255C18.7504 30.8381 19.9084 33.2851 21.756 34.9985C15.5992 37.517 11.2504 43.5731 11.2504 50.6255C11.2504 51.6611 12.09 52.5005 13.1254 52.5005ZM28.1254 22.5005C31.227 22.5005 33.7504 25.0239 33.7504 28.1255C33.7504 31.2271 31.227 33.7505 28.1254 33.7505C25.0237 33.7505 22.5004 31.2271 22.5004 28.1255C22.5004 25.0239 25.0237 22.5005 28.1254 22.5005ZM28.1254 37.5005C34.7259 37.5005 40.2043 42.3984 41.1169 48.7505H15.1339C16.0466 42.3984 21.5248 37.5005 28.1254 37.5005Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M13.1254 61.2003H62.2498C63.2852 61.2003 64.1248 60.3609 64.1248 59.3253C64.1248 58.2898 63.2852 57.4503 62.2498 57.4503H13.1254C12.09 57.4503 11.2504 58.2898 11.2504 59.3253C11.2504 60.3609 12.09 61.2003 13.1254 61.2003Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M62.2499 66.1503H21.5634C20.528 66.1503 19.6884 66.9897 19.6884 68.0253C19.6884 69.0609 20.528 69.9003 21.5634 69.9003H62.2499C63.2853 69.9003 64.1249 69.0609 64.1249 68.0253C64.1249 66.9897 63.2853 66.1503 62.2499 66.1503Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M13.1254 78.6001H62.2498C63.2852 78.6001 64.1248 77.7606 64.1248 76.7251C64.1248 75.6895 63.2852 74.8501 62.2498 74.8501H13.1254C12.09 74.8501 11.2504 75.6895 11.2504 76.7251C11.2504 77.7606 12.09 78.6001 13.1254 78.6001Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M13.1253 66.1503C12.09 66.1503 11.2511 66.9897 11.2511 68.0253C11.2511 69.0609 12.0911 69.9003 13.1267 69.9003C14.1622 69.9003 15.0017 69.0609 15.0017 68.0253C15.0017 66.9897 14.162 66.1503 13.1267 66.1503H13.1253Z"
                  fill="#9CA3AF"
                />
              </g>
              <defs>
                <clipPath id="clip0_9_136">
                  <rect width="96" height="96" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      )}

      <Modal
        show={openModal}
        className="text-gray-900 bg-slate-950 bg-opacity-70"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Add investor</Modal.Header>
        <Modal.Body>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={newInvestor.first_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={newInvestor.last_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={newInvestor.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount Invested
              </label>
              <input
                type="number"
                name="amount_invested"
                value={newInvestor.amount_invested}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-purple-700" onClick={handleAddInvestor}>
            Add Investor
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
