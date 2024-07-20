import React, { useEffect, useState } from "react";
import { Investor } from "../../utils/interfaces";
import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import DatePicker from "react-datepicker";
import "../../css/custom-datepicker.css";
import { addInvestor, fetchInvestors } from "../../api/api";

export default function InvestorsSection() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newInvestor, setNewInvestor] = useState<Investor>({
    id: 10,
    first_name: "",
    last_name: "",
    email: "",
    amount_invested: 0,
    investment_date: new Date().toISOString().split("T")[0],
  });

  const hasInvestors = investors.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvestor((prev) => ({
      ...prev,
      [name]: name === "amount_invested" ? parseFloat(value) : value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setNewInvestor((prev) => ({
      ...prev,
      investment_date: date ? date.toISOString().split("T")[0] : null,
    }));
  };

  const handleAddInvestor = async () => {
    try {
      const investorToAdd = {
        ...newInvestor,
        investment_date: newInvestor.investment_date, // Date is already in YYYY-MM-DD format
      };

      console.log("Formatted investor data:", investorToAdd); // Log the formatted data
      const addedInvestor = await addInvestor(investorToAdd);

      setInvestors((prev) => [...prev, addedInvestor]);
      setOpenModal(false);
      setNewInvestor({
        id: 0,
        first_name: "",
        last_name: "",
        email: "",
        amount_invested: 0,
        investment_date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Failed to add investor:", error);
    }
  };

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        const data = await fetchInvestors();
        setInvestors(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load investors:", error);
      }
    };

    loadInvestors();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-medium">Investors</h1>
      <div className="flex justify-center">
        <button
          onClick={() => setOpenModal(true)}
          className="text-lg text-violet-600 border-2 border-violet-600 font-medium hover:bg-violet-600 hover:text-white p-4 rounded-xl mt-10 "
        >
          <i className={`fi-rr-user-add mr-4`}></i>
          Add Investor
        </button>
      </div>

      {hasInvestors ? (
        <div className="mt-4">
          <Table>
            <Table.Head>
              <Table.HeadCell>Investor Id</Table.HeadCell>
              <Table.HeadCell>First Name</Table.HeadCell>
              <Table.HeadCell>Last Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Amount Invested</Table.HeadCell>
              <Table.HeadCell>Investment Date</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {investors.map((investor) => (
                <Table.Row key={investor.id}>
                  <Table.Cell>{investor.id}</Table.Cell>
                  <Table.Cell>{investor.first_name}</Table.Cell>
                  <Table.Cell>{investor.last_name}</Table.Cell>
                  <Table.Cell>{investor.email}</Table.Cell>
                  <Table.Cell>{investor.amount_invested}</Table.Cell>
                  <Table.Cell>{investor.investment_date}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center">
          <div className="bg-slate-100 p-12 my-8 rounded-3xl">
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_9_136)">
                <path
                  d="M89.9998 21.0937C89.9998 9.46262 80.5372 0 68.9062 0C62.6725 0 57.0615 2.71809 53.1967 7.0314H5.27342C2.36566 7.0314 0 9.39705 0 12.3048V84.7266C0 87.6343 2.36566 90 5.27324 90H65.3906C68.2983 90 70.664 87.6343 70.664 84.7266V42.1147C81.4759 41.2186 89.9998 32.1329 89.9998 21.0937ZM5.27342 10.547H50.6434C48.8436 13.6515 47.8125 17.2544 47.8125 21.0937C47.8125 24.7327 48.7475 28.2943 50.5229 31.4427C50.0291 33.2823 49.5357 35.1222 49.0417 36.9652C48.7364 38.1113 49.0584 39.2926 49.9029 40.1251C50.7345 40.9447 51.9447 41.2597 53.0645 40.9491C54.895 40.4585 56.7254 39.9676 58.5558 39.4764C61.1957 40.9653 64.1256 41.863 67.1482 42.1144V78.3282H3.51561V12.3048C3.51561 11.3356 4.30416 10.547 5.27342 10.547ZM65.3906 86.4844H5.27342C4.30416 86.4844 3.51579 85.6958 3.51579 84.7266V81.8438H67.1485V84.7266C67.1484 85.6958 66.3598 86.4844 65.3906 86.4844ZM68.9062 38.6717C65.6581 38.6717 62.4854 37.7788 59.7309 36.0893C59.4518 35.9181 59.1335 35.8299 58.8118 35.8299C58.6594 35.8299 58.5063 35.8497 58.3562 35.89C56.4215 36.4091 54.4871 36.928 52.5524 37.4465C53.0711 35.5107 53.5899 33.5767 54.109 31.6424C54.2341 31.1763 54.162 30.6793 53.9096 30.2678C52.2207 27.5141 51.3278 24.3417 51.3278 21.0937C51.3278 11.4011 59.2131 3.51561 68.9058 3.51561C78.5985 3.51561 86.4839 11.4011 86.4839 21.0937C86.4839 30.7862 78.5989 38.6717 68.9062 38.6717Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M79.4529 15.8203C79.4529 14.4118 78.9044 13.0876 77.9085 12.0918C76.9127 11.0959 75.5885 10.5472 74.1798 10.5472C72.7713 10.5472 71.4471 11.0959 70.4511 12.0918L68.9065 13.6366L67.3616 12.0917C65.3055 10.0357 61.96 10.0357 59.9042 12.0917C57.8485 14.1476 57.8485 17.4929 59.9042 19.5488L61.4492 21.0938L59.9042 22.6385C57.8485 24.6945 57.8485 28.0398 59.9042 30.0957C61.96 32.1515 65.3055 32.1515 67.3616 30.0957L68.9065 28.5509L70.4511 30.0957C71.4471 31.0917 72.7713 31.6401 74.1798 31.6401C75.5885 31.6401 76.9127 31.0915 77.9085 30.0957C78.9043 29.0999 79.4529 27.7757 79.4529 26.3672C79.4529 24.9587 78.9044 23.6345 77.9085 22.6387L76.3635 21.0938L77.9083 19.5488C78.9043 18.553 79.4529 17.2289 79.4529 15.8203ZM72.6347 22.3367L75.4222 25.1244C75.7543 25.4563 75.9371 25.8977 75.9371 26.367C75.9371 26.8365 75.7543 27.2777 75.4222 27.6098C75.0903 27.9417 74.6491 28.1245 74.1796 28.1245C73.7101 28.1245 73.2687 27.9417 72.937 27.6098L70.1495 24.8221C69.8062 24.4788 69.3564 24.3072 68.9065 24.3072C68.4567 24.3072 68.0069 24.4788 67.6638 24.8221L64.8757 27.6098C64.5438 27.9419 64.1026 28.1245 63.6331 28.1245C63.1636 28.1245 62.7222 27.9417 62.3905 27.6098C61.7055 26.9246 61.7055 25.8096 62.3903 25.1244L65.1782 22.3367C65.508 22.0071 65.6932 21.5599 65.6932 21.0938C65.6932 20.6276 65.508 20.1804 65.1784 19.8508L62.3905 17.0631C61.7055 16.3779 61.7055 15.2629 62.3905 14.5777C62.7224 14.2457 63.1636 14.063 63.6331 14.063C64.1026 14.063 64.544 14.2459 64.8757 14.5777L67.6636 17.3654C67.9933 17.695 68.4404 17.8803 68.9065 17.8803C69.3727 17.8803 69.8199 17.695 70.1495 17.3654L72.937 14.5777C73.2689 14.2457 73.7101 14.063 74.1796 14.063C74.6491 14.063 75.0905 14.2459 75.4222 14.5777C75.7543 14.9094 75.9373 15.3508 75.9373 15.8203C75.9373 16.2898 75.7544 16.731 75.4224 17.0631L72.6349 19.851C71.9483 20.5372 71.9483 21.6503 72.6347 22.3367Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M12.305 49.2192H40.43C41.4007 49.2192 42.1878 48.4323 42.1878 47.4614C42.1878 40.8496 38.1107 35.1722 32.3388 32.8111C34.0709 31.2048 35.1566 28.9107 35.1566 26.3677C35.1566 21.5214 31.2138 17.5786 26.3675 17.5786C21.5212 17.5786 17.5784 21.5214 17.5784 26.3677C17.5784 28.9107 18.6641 31.2048 20.3962 32.8111C14.6243 35.1722 10.5472 40.8498 10.5472 47.4614C10.5472 48.4323 11.3343 49.2192 12.305 49.2192ZM26.3675 21.0942C29.2753 21.0942 31.6409 23.4599 31.6409 26.3677C31.6409 29.2755 29.2753 31.6411 26.3675 31.6411C23.4597 31.6411 21.0941 29.2755 21.0941 26.3677C21.0941 23.4599 23.4597 21.0942 26.3675 21.0942ZM26.3675 35.1567C32.5555 35.1567 37.6915 39.7485 38.547 45.7036H14.188C15.0437 39.7485 20.1795 35.1567 26.3675 35.1567Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M12.305 57.3754H58.3591C59.3298 57.3754 60.1169 56.5884 60.1169 55.6175C60.1169 54.6467 59.3298 53.8597 58.3591 53.8597H12.305C11.3343 53.8597 10.5472 54.6467 10.5472 55.6175C10.5472 56.5884 11.3343 57.3754 12.305 57.3754Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M58.3593 62.0159H20.2156C19.245 62.0159 18.4578 62.8028 18.4578 63.7737C18.4578 64.7445 19.245 65.5315 20.2156 65.5315H58.3593C59.33 65.5315 60.1171 64.7445 60.1171 63.7737C60.1171 62.8028 59.33 62.0159 58.3593 62.0159Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M12.305 73.6876H58.3591C59.3298 73.6876 60.1169 72.9006 60.1169 71.9298C60.1169 70.959 59.3298 70.172 58.3591 70.172H12.305C11.3343 70.172 10.5472 70.959 10.5472 71.9298C10.5472 72.9006 11.3343 73.6876 12.305 73.6876Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M12.305 62.0159C11.3344 62.0159 10.5479 62.8028 10.5479 63.7737C10.5479 64.7445 11.3354 65.5315 12.3063 65.5315C13.2771 65.5315 14.0641 64.7445 14.0641 63.7737C14.0641 62.8028 13.2769 62.0159 12.3063 62.0159H12.305Z"
                  fill="#9CA3AF"
                />
              </g>
              <defs>
                <clipPath id="clip0_9_136">
                  <rect width="90" height="90" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <p className=" text-gray-400 text-2xl">
            There are no investors to display.
          </p>
        </div>
      )}

      <Modal
        show={openModal}
        className="text-gray-900 bg-slate-950 bg-opacity-70"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>
          <span className="text-2xl text-gray-600">Add investor</span>
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-full">
                <Label className="block text-md font-medium text-gray-700 mb-1">
                  First Name
                </Label>
                <TextInput
                  type="text"
                  name="first_name"
                  value={newInvestor.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <Label className="block text-md font-medium text-gray-700 mb-1">
                  Last Name
                </Label>
                <TextInput
                  type="text"
                  name="last_name"
                  value={newInvestor.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label className="block text-md font-medium text-gray-700 mb-1">
                Email
              </Label>
              <TextInput
                type="email"
                name="email"
                value={newInvestor.email}
                placeholder="johndoe@archimed.com"
                onChange={handleChange}
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-full">
                <Label
                  htmlFor="amount_invested"
                  className="block text-md font-medium text-gray-700 mb-1"
                >
                  Amount Invested ($)
                </Label>
                <TextInput
                  type="number"
                  name="amount_invested"
                  value={newInvestor.amount_invested}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <Label className="block text-md font-medium text-gray-700 mb-1">
                  Investment Date
                </Label>
                <DatePicker
                  selected={
                    newInvestor.investment_date
                      ? new Date(newInvestor.investment_date)
                      : null
                  }
                  onChange={(date) => handleDateChange(date as Date | null)}
                  dateFormat="dd/MM/yyyy"
                  className="datepicker-input min-w-72 rounded-md sm:text-md"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-4 justify-end w-full">
            <Button className="bg-purple-700" onClick={handleAddInvestor}>
              <i className="fi-rr-disk mr-4 mt-0.5"></i>
              Save
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// import React, { useEffect, useState } from "react";
// import { Investor } from "../../utils/interfaces";
// import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
// import DatePicker from "react-datepicker";
// import "../../css/custom-datepicker.css";
// import { addInvestor, fetchInvestors } from "../../api/api";

// // const INVESTORS: Investor[] = [
// //   {
// //     id: 1,
// //     first_name: "John",
// //     last_name: "Doe",
// //     email: "john.doe@example.com",
// //     amount_invested: 10000,
// //     investment_date: new Date().toISOString(),
// //   },
// //   {
// //     id: 2,
// //     first_name: "Jane",
// //     last_name: "Smith",
// //     email: "jane.smith@example.com",
// //     amount_invested: 15000,
// //     investment_date: new Date().toISOString(),
// //   },
// //   {
// //     id: 3,
// //     first_name: "Alice",
// //     last_name: "Johnson",
// //     email: "alice.johnson@example.com",
// //     amount_invested: 20000,
// //     investment_date: new Date().toISOString(),
// //   },
// //   {
// //     id: 4,
// //     first_name: "Bob",
// //     last_name: "Brown",
// //     email: "bob.brown@example.com",
// //     amount_invested: 25000,
// //     investment_date: new Date().toISOString(),
// //   },
// //   {
// //     id: 5,
// //     first_name: "Charlie",
// //     last_name: "Davis",
// //     email: "charlie.davis@example.com",
// //     amount_invested: 30000,
// //     investment_date: new Date().toISOString(),
// //   },
// // ];

// export default function InvestorsSection() {
//   const [investors, setInvestors] = useState<Investor[]>([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [newInvestor, setNewInvestor] = useState<Investor>({
//     id: 10,
//     first_name: "",
//     last_name: "",
//     email: "",
//     amount_invested: 0,
//     investment_date: new Date().toISOString().split("T")[0],
//   });

//   const hasInvestors = investors.length > 0;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewInvestor((prev) => ({
//       ...prev,
//       [name]: name === "amount_invested" ? parseFloat(value) : value,
//     }));
//   };

//   const handleDateChange = (date: Date | null) => {
//     setNewInvestor((prev) => ({
//       ...prev,
//       investment_date: date ? date.toISOString().split("T")[0] : null,
//     }));
//   };

//   const handleAddInvestor = async () => {
//     try {
//       const investmentDate = newInvestor.investment_date
//         ? new Date(newInvestor.investment_date)
//         : null;

//       const investorToAdd = {
//         ...newInvestor,
//         investment_date: investmentDate
//           ? investmentDate.toISOString().split("T")[0]
//           : null, // Convert date to YYYY-MM-DD format
//       };

//       console.log("Formatted investor data:", investorToAdd); // Log the formatted data
//       const addedInvestor = await addInvestor(investorToAdd);

//       setInvestors((prev) => [...prev, addedInvestor]);
//       setOpenModal(false);
//       setNewInvestor({
//         id: 0,
//         first_name: "",
//         last_name: "",
//         email: "",
//         amount_invested: 0,
//         investment_date: new Date().toISOString().split("T")[0],
//       });
//     } catch (error) {
//       console.error("Failed to add investor:", error);
//     }
//   };

//   useEffect(() => {
//     const loadInvestors = async () => {
//       try {
//         const data = await fetchInvestors();
//         setInvestors(data);
//         console.log(data);
//       } catch (error) {
//         console.error("Failed to load investors:", error);
//       }
//     };

//     loadInvestors();
//   }, []);

//   return (
//     <>
//       <h1 className="text-3xl font-medium">Investors</h1>
//       <div className="flex justify-center">
//         <button
//           onClick={() => setOpenModal(true)}
//           className="text-lg text-violet-600 border-2 border-violet-600 font-medium hover:bg-violet-600 hover:text-white p-4 rounded-xl mt-10 "
//         >
//           <i className={`fi-rr-user-add mr-4`}></i>
//           Add Investor
//         </button>
//       </div>

//       {hasInvestors ? (
//         <div className="mt-4">
//           <Table>
//             <Table.Head>
//               <Table.HeadCell>Investor Id</Table.HeadCell>
//               <Table.HeadCell>First Name</Table.HeadCell>
//               <Table.HeadCell>Last Name</Table.HeadCell>
//               <Table.HeadCell>Email</Table.HeadCell>
//               <Table.HeadCell>Amount Invested</Table.HeadCell>
//               <Table.HeadCell>Investment Date</Table.HeadCell>
//             </Table.Head>
//             <Table.Body>
//               {investors.map((investor) => (
//                 <Table.Row key={investor.id}>
//                   <Table.Cell>{investor.id}</Table.Cell>
//                   <Table.Cell>{investor.first_name}</Table.Cell>
//                   <Table.Cell>{investor.last_name}</Table.Cell>
//                   <Table.Cell>{investor.email}</Table.Cell>
//                   <Table.Cell>{investor.amount_invested}</Table.Cell>
//                   <Table.Cell>{investor.investment_date}</Table.Cell>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table>
//         </div>
//       ) : (
//         <div className="mt-4 flex flex-col items-center">
//           <div className="bg-slate-100 p-12 my-8 rounded-3xl">
//             <svg
//               width="90"
//               height="90"
//               viewBox="0 0 90 90"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g clipPath="url(#clip0_9_136)">
//                 <path
//                   d="M89.9998 21.0937C89.9998 9.46262 80.5372 0 68.9062 0C62.6725 0 57.0615 2.71809 53.1967 7.0314H5.27342C2.36566 7.0314 0 9.39705 0 12.3048V84.7266C0 87.6343 2.36566 90 5.27324 90H65.3906C68.2983 90 70.664 87.6343 70.664 84.7266V42.1147C81.4759 41.2186 89.9998 32.1329 89.9998 21.0937ZM5.27342 10.547H50.6434C48.8436 13.6515 47.8125 17.2544 47.8125 21.0937C47.8125 24.7327 48.7475 28.2943 50.5229 31.4427C50.0291 33.2823 49.5357 35.1222 49.0417 36.9652C48.7364 38.1113 49.0584 39.2926 49.9029 40.1251C50.7345 40.9447 51.9447 41.2597 53.0645 40.9491C54.895 40.4585 56.7254 39.9676 58.5558 39.4764C61.1957 40.9653 64.1256 41.863 67.1482 42.1144V78.3282H3.51561V12.3048C3.51561 11.3356 4.30416 10.547 5.27342 10.547ZM65.3906 86.4844H5.27342C4.30416 86.4844 3.51579 85.6958 3.51579 84.7266V81.8438H67.1485V84.7266C67.1484 85.6958 66.3598 86.4844 65.3906 86.4844ZM68.9062 38.6717C65.6581 38.6717 62.4854 37.7788 59.7309 36.0893C59.4518 35.9181 59.1335 35.8299 58.8118 35.8299C58.6594 35.8299 58.5063 35.8497 58.3562 35.89C56.4215 36.4091 54.4871 36.928 52.5524 37.4465C53.0711 35.5107 53.5899 33.5767 54.109 31.6424C54.2341 31.1763 54.162 30.6793 53.9096 30.2678C52.2207 27.5141 51.3278 24.3417 51.3278 21.0937C51.3278 11.4011 59.2131 3.51561 68.9058 3.51561C78.5985 3.51561 86.4839 11.4011 86.4839 21.0937C86.4839 30.7862 78.5989 38.6717 68.9062 38.6717Z"
//                   fill="#9CA3AF"
//                 />
//                 <path
//                   d="M79.4529 15.8203C79.4529 14.4118 78.9044 13.0876 77.9085 12.0918C76.9127 11.0959 75.5885 10.5472 74.1798 10.5472C72.7713 10.5472 71.4471 11.0959 70.4511 12.0918L68.9065 13.6366L67.3616 12.0917C65.3055 10.0357 61.96 10.0357 59.9042 12.0917C57.8485 14.1476 57.8485 17.4929 59.9042 19.5488L61.4492 21.0938L59.9042 22.6385C57.8485 24.6945 57.8485 28.0398 59.9042 30.0957C61.96 32.1515 65.3055 32.1515 67.3616 30.0957L68.9065 28.5509L70.4511 30.0957C71.4471 31.0917 72.7713 31.6401 74.1798 31.6401C75.5885 31.6401 76.9127 31.0915 77.9085 30.0957C78.9043 29.0999 79.4529 27.7757 79.4529 26.3672C79.4529 24.9587 78.9044 23.6345 77.9085 22.6387L76.3635 21.0938L77.9083 19.5488C78.9043 18.553 79.4529 17.2289 79.4529 15.8203ZM72.6347 22.3367L75.4222 25.1244C75.7543 25.4563 75.9371 25.8977 75.9371 26.367C75.9371 26.8365 75.7543 27.2777 75.4222 27.6098C75.0903 27.9417 74.6491 28.1245 74.1796 28.1245C73.7101 28.1245 73.2687 27.9417 72.937 27.6098L70.1495 24.8221C69.8062 24.4788 69.3564 24.3072 68.9065 24.3072C68.4567 24.3072 68.0069 24.4788 67.6638 24.8221L64.8757 27.6098C64.5438 27.9419 64.1026 28.1245 63.6331 28.1245C63.1636 28.1245 62.7222 27.9417 62.3905 27.6098C61.7055 26.9246 61.7055 25.8096 62.3903 25.1244L65.1782 22.3367C65.508 22.0071 65.6932 21.5599 65.6932 21.0938C65.6932 20.6276 65.508 20.1804 65.1784 19.8508L62.3905 17.0631C61.7055 16.3779 61.7055 15.2629 62.3905 14.5777C62.7224 14.2457 63.1636 14.063 63.6331 14.063C64.1026 14.063 64.544 14.2459 64.8757 14.5777L67.6636 17.3654C67.9933 17.695 68.4404 17.8803 68.9065 17.8803C69.3727 17.8803 69.8199 17.695 70.1495 17.3654L72.937 14.5777C73.2689 14.2457 73.7101 14.063 74.1796 14.063C74.6491 14.063 75.0905 14.2459 75.4222 14.5777C75.7543 14.9094 75.9373 15.3508 75.9373 15.8203C75.9373 16.2898 75.7544 16.731 75.4224 17.0631L72.6349 19.851C71.9483 20.5372 71.9483 21.6503 72.6347 22.3367Z"
//                   fill="#9CA3AF"
//                 />
//                 <path
//                   d="M12.305 49.2192H40.43C41.4007 49.2192 42.1878 48.4323 42.1878 47.4614C42.1878 40.8496 38.1107 35.1722 32.3388 32.8111C34.0709 31.2048 35.1566 28.9107 35.1566 26.3677C35.1566 21.5214 31.2138 17.5786 26.3675 17.5786C21.5212 17.5786 17.5784 21.5214 17.5784 26.3677C17.5784 28.9107 18.6641 31.2048 20.3962 32.8111C14.6243 35.1722 10.5472 40.8498 10.5472 47.4614C10.5472 48.4323 11.3343 49.2192 12.305 49.2192ZM26.3675 21.0942C29.2753 21.0942 31.6409 23.4599 31.6409 26.3677C31.6409 29.2755 29.2753 31.6411 26.3675 31.6411C23.4597 31.6411 21.0941 29.2755 21.0941 26.3677C21.0941 23.4599 23.4597 21.0942 26.3675 21.0942ZM26.3675 35.1567C32.5555 35.1567 37.6915 39.7485 38.547 45.7036H14.188C15.0437 39.7485 20.1795 35.1567 26.3675 35.1567Z"
//                   fill="#9CA3AF"
//                 />
//                 <path
//                   d="M12.305 57.3754H58.3591C59.3298 57.3754 60.1169 56.5884 60.1169 55.6175C60.1169 54.6467 59.3298 53.8597 58.3591 53.8597H12.305C11.3343 53.8597 10.5472 54.6467 10.5472 55.6175C10.5472 56.5884 11.3343 57.3754 12.305 57.3754Z"
//                   fill="#9CA3AF"
//                 />
//                 <path
//                   d="M58.3593 62.0159H20.2156C19.245 62.0159 18.4578 62.8028 18.4578 63.7737C18.4578 64.7445 19.245 65.5315 20.2156 65.5315H58.3593C59.33 65.5315 60.1171 64.7445 60.1171 63.7737C60.1171 62.8028 59.33 62.0159 58.3593 62.0159Z"
//                   fill="#9CA3AF"
//                 />
//                 <path
//                   d="M12.305 73.6876H58.3591C59.3298 73.6876 60.1169 72.9006 60.1169 71.9298C60.1169 70.959 59.3298 70.172 58.3591 70.172H12.305C11.3343 70.172 10.5472 70.959 10.5472 71.9298C10.5472 72.9006 11.3343 73.6876 12.305 73.6876Z"
//                   fill="#9CA3AF"
//                 />
//                 <path
//                   d="M12.305 62.0159C11.3344 62.0159 10.5479 62.8028 10.5479 63.7737C10.5479 64.7445 11.3354 65.5315 12.3063 65.5315C13.2771 65.5315 14.0641 64.7445 14.0641 63.7737C14.0641 62.8028 13.2769 62.0159 12.3063 62.0159H12.305Z"
//                   fill="#9CA3AF"
//                 />
//               </g>
//               <defs>
//                 <clipPath id="clip0_9_136">
//                   <rect width="90" height="90" fill="white" />
//                 </clipPath>
//               </defs>
//             </svg>
//           </div>
//           <p className=" text-gray-400 text-2xl">
//             There are no investors to display.
//           </p>
//         </div>
//       )}

//       <Modal
//         show={openModal}
//         className="text-gray-900 bg-slate-950 bg-opacity-70"
//         onClose={() => setOpenModal(false)}
//       >
//         <Modal.Header>
//           <span className="text-2xl text-gray-600">Add investor</span>
//         </Modal.Header>
//         <Modal.Body>
//           <form className="space-y-6">
//             <div className="flex space-x-4">
//               <div className="w-full">
//                 <Label className="block text-md font-medium text-gray-700 mb-1">
//                   First Name
//                 </Label>
//                 <TextInput
//                   type="text"
//                   name="first_name"
//                   value={newInvestor.first_name}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="w-full">
//                 <Label className="block text-md font-medium text-gray-700 mb-1">
//                   Last Name
//                 </Label>
//                 <TextInput
//                   type="text"
//                   name="last_name"
//                   value={newInvestor.last_name}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div>
//               <Label className="block text-md font-medium text-gray-700 mb-1">
//                 Email
//               </Label>
//               <TextInput
//                 type="email"
//                 name="email"
//                 value={newInvestor.email}
//                 placeholder="johndoe@archimed.com"
//                 onChange={handleChange}
//                 // className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
//               />
//             </div>
//             <div className="flex space-x-4">
//               <div className="w-full">
//                 <Label
//                   htmlFor="amount_invested"
//                   className="block text-md font-medium text-gray-700 mb-1"
//                 >
//                   Amount Invested ($)
//                 </Label>
//                 <TextInput
//                   type="number"
//                   name="amount_invested"
//                   value={newInvestor.amount_invested}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="w-full">
//                 <Label className="block text-md font-medium text-gray-700 mb-1">
//                   Investment Date
//                 </Label>
//                 <DatePicker
//                   selected={
//                     newInvestor.investment_date
//                       ? new Date(newInvestor.investment_date)
//                       : null
//                   }
//                   onChange={(date) => handleDateChange(date as Date | null)}
//                   dateFormat="dd/MM/yyyy"
//                   className="datepicker-input min-w-72 rounded-md sm:text-md"
//                 />
//               </div>
//             </div>
//           </form>
//         </Modal.Body>
//         <Modal.Footer>
//           <div className="flex space-x-4 justify-end w-full">
//             <Button className="bg-purple-700" onClick={handleAddInvestor}>
//               <i className="fi-rr-disk mr-4 mt-0.5"></i>
//               Save
//             </Button>
//             <Button color="gray" onClick={() => setOpenModal(false)}>
//               Cancel
//             </Button>
//           </div>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }
