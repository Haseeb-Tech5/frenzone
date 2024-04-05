// import React, { useState, Fragment, useEffect } from "react";
// import Grid from "@mui/material/Grid";
// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { ChevronUpIcon } from "@heroicons/react/20/solid";

// // react icons
// import { FaDollarSign } from "react-icons/fa";
// import { CiSearch } from "react-icons/ci";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const ReportsEmployee = () => {
//   const [sortOrder, setSortOrder] = useState({
//     client: "asc",
//     uid: "asc",
//     store: "asc",
//     date: "asc",
//     time: "asc",
//     orderId: "asc",
//     amount: "asc",
//     method: "asc",
//   });
//   const [sortOrderSalary, setSortOrderSalary] = useState({
//     employee: "asc",
//     employeeId: "asc",
//     store: "asc",
//     joinDate: "asc",
//     workTime: "asc",
//     type: "asc",
//     amount: "asc",
//     status: "asc",
//   });
//   const [sortedColumn, setSortedColumn] = useState(null);
//   const [sortedColumnSalary, setSortedColumnSalary] = useState(null);

//   const paymentDetailsData = [
//     {
//       client: "Pattrick",
//       uid: "2",
//       store: "New York",
//       date: "14 Jan 2021",
//       time: "01:00 PM",
//       orderId: "2",
//       amount: "350",
//       method: "Cash",
//     },
//     {
//       client: "Johnson",
//       uid: "1",
//       store: "Manspire",
//       date: "12 Jan 2021",
//       time: "11:00 AM",
//       orderId: "1",
//       amount: "250",
//       method: "Cash",
//     },
//     {
//       client: "Zees",
//       uid: "3",
//       store: "New York",
//       date: "15 Jan 2021",
//       time: "01:00 PM",
//       orderId: "3",
//       amount: "450",
//       method: "Cash",
//     },
//   ];
//   const salaryDetailsData = [
//     {
//       employee: "Pattrick",
//       employeeId: "2",
//       store: "New York",
//       joinDate: "14 Jan 2021",
//       workTime: "01:00 PM",
//       type: "2",
//       amount: "350",
//       status: "Pending",
//     },
//     {
//       employee: "Johnson",
//       employeeId: "1",
//       store: "Manspire",
//       joinDate: "12 Jan 2021",
//       workTime: "11:00 AM",
//       type: "1",
//       amount: "250",
//       status: "Completed",
//     },
//     {
//       employee: "Zees",
//       employeeId: "3",
//       store: "New York",
//       joinDate: "15 Jan 2021",
//       workTime: "01:00 PM",
//       type: "3",
//       amount: "450",
//       status: "Pending",
//     },
//   ];
//   const convertTo24HourFormat = (time) => {
//     const [rawTime, period] = time.split(" ");
//     const [hours, minutes] = rawTime.split(":");
//     const adjustedHours = period === "PM" ? parseInt(hours, 10) + 12 : hours;

//     return `${adjustedHours}:${minutes}`;
//   };

//   const [values, setValues] = useState({
//     payment: "",
//     salary: "",
//   });
//   const handleInput = (e) => {
//     const Value = e.target.value;
//     setValues({
//       ...values,
//       [e.target.name]: Value,
//     });
//   };
//   useEffect(() => {
//     setSortedColumn(null);
//     setSortedColumnSalary(null);
//   }, []);
//   const [filteredData, setFilteredData] = useState(paymentDetailsData);
//   const [filteredDataSalary, setFilteredDataSalary] =
//     useState(salaryDetailsData);
//   const handleSort = (column) => {
//     const sortorderTemp = {
//       ...sortOrder,
//       [column]: sortOrder[column] === "asc" ? "desc" : "asc",
//     };
//     setSortOrder((prevSortOrder) => ({
//       ...prevSortOrder,
//       [column]: prevSortOrder[column] === "asc" ? "desc" : "asc",
//     }));
//     const sortedColumnTemp = column;
//     setSortedColumn(column);

//     const sortedData = filteredData.slice().sort((a, b) => {
//       if (sortedColumnTemp) {
//         const order = sortOrder[sortedColumnTemp];
//         if (sortedColumnTemp === "date" || sortedColumnTemp === "time") {
//           const timeA = convertTo24HourFormat(a[sortedColumnTemp]);
//           const timeB = convertTo24HourFormat(b[sortedColumnTemp]);

//           return order === "asc"
//             ? timeA.localeCompare(timeB)
//             : timeB.localeCompare(timeA);
//         } else {
//           if (order === "asc") {
//             return a[sortedColumnTemp] > b[sortedColumnTemp] ? 1 : -1;
//           } else {
//             return a[sortedColumnTemp] < b[sortedColumnTemp] ? 1 : -1;
//           }
//         }
//       }
//       return 0;
//     });
//     setFilteredData(sortedData);
//   };
//   const handleSortSalary = (column) => {
//     const sortorderTemp = {
//       ...sortOrderSalary,
//       [column]: sortOrderSalary[column] === "asc" ? "desc" : "asc",
//     };
//     setSortOrderSalary((prevSortOrder) => ({
//       ...prevSortOrder,
//       [column]: prevSortOrder[column] === "asc" ? "desc" : "asc",
//     }));
//     const sortedColumnSalaryTemp = column;
//     setSortedColumnSalary(column);

//     const sortedDataSalaray = filteredDataSalary.slice().sort((a, b) => {
//       if (sortedColumnSalaryTemp) {
//         const order = sortOrderSalary[sortedColumnSalaryTemp];
//         if (
//           sortedColumnSalaryTemp === "date" ||
//           sortedColumnSalary === "time"
//         ) {
//           const timeA = convertTo24HourFormat(a[sortedColumnSalaryTemp]);
//           const timeB = convertTo24HourFormat(b[sortedColumnSalaryTemp]);

//           return order === "asc"
//             ? timeA.localeCompare(timeB)
//             : timeB.localeCompare(timeA);
//         } else {
//           if (order === "asc") {
//             return a[sortedColumnSalaryTemp] > b[sortedColumnSalaryTemp]
//               ? 1
//               : -1;
//           } else {
//             return a[sortedColumnSalaryTemp] < b[sortedColumnSalaryTemp]
//               ? 1
//               : -1;
//           }
//         }
//       }
//       return 0;
//     });
//     setFilteredDataSalary(sortedDataSalaray);
//   };
//   useEffect(() => {
//     const filteredPaymentData = paymentDetailsData.filter((item) =>
//       Object.values(item).some(
//         (value) =>
//           typeof value === "string" &&
//           value.toLowerCase().includes(values.payment.toLowerCase())
//       )
//     );

//     const filteredSalaryData = salaryDetailsData.filter((item) =>
//       Object.values(item).some(
//         (value) =>
//           typeof value === "string" &&
//           value.toLowerCase().includes(values.salary.toLowerCase())
//       )
//     );

//     setFilteredData(filteredPaymentData);
//     setFilteredDataSalary(filteredSalaryData);
//   }, [values.payment, values.salary /* sortedData */ /* sortedDataSalaray */]);

//   return (
//     <>
//       <div className="bg-[#F4F7FE] py-12 px-4 w-[100%]">
//         <Grid
//           container
//           xs={12}
//           justifyContent="space-between"
//           className="items-center"
//         >
//           <Grid item lg={4} xs={12}>
//             <h1 className="text-[#FFE11B] font-[700] text-[34px]">Reports</h1>
//             {/* Dropdown */}
//             <Menu as="div" className="relative inline-block text-left mt-4">
//               <div>
//                 <Menu.Button className="inline-flex w-[170px] justify-between gap-x-1.5 rounded-md bg-none px-3 py-1 text-md font-normal bg-[#FFE11B] text-black">
//                   ALL
//                   <ChevronDownIcon
//                     className="-mr-1 h-5 w-5 text-black"
//                     aria-hidden="true"
//                   />
//                 </Menu.Button>
//               </div>

//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <Menu.Items className="absolute text-black right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#FFE11B] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                   <div className="py-1 border-b border-gray">
//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="#profit"
//                           className={classNames(
//                             active
//                               ? "bg-gray-100 text-gray-900"
//                               : "text-gray-700",
//                             "block px-4 py-2 text-sm"
//                           )}
//                         >
//                           Profit
//                         </a>
//                       )}
//                     </Menu.Item>
//                   </div>
//                   <div className="py-1 border-b-2 border-gray">
//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="#revenue"
//                           className={classNames(
//                             active
//                               ? "bg-gray-100 text-gray-900"
//                               : "text-gray-700",
//                             "block px-4 py-2 text-sm"
//                           )}
//                         >
//                           Revenue
//                         </a>
//                       )}
//                     </Menu.Item>
//                   </div>
//                 </Menu.Items>
//               </Transition>
//             </Menu>
//           </Grid>
//           <Grid item xl={6} lg={8} xs={12} className="lg:pt-0 pt-6">
//             <Grid container xs={12} spacing={3}>
//               <Grid item xl={6} lg={6} md={6} xs={12}>
//                 <div className="w-[100%] flex bg-white rounded-xl py-4 px-4">
//                   <div className="bg-[#F4F7FE] p-3 rounded-full">
//                     <FaDollarSign className="text-[34px] text-[#FFE11B]" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-[#A3AED0] text-[14px] leading-[24px]">
//                       Total Payments
//                     </p>
//                     <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
//                       Rs. 200,000
//                     </p>
//                   </div>
//                 </div>
//               </Grid>
//               <Grid item xl={6} lg={6} md={6} xs={12}>
//                 <div className="w-[100%] flex bg-white rounded-xl py-4 px-4">
//                   <div className="bg-[#F4F7FE] p-3 rounded-full">
//                     <FaDollarSign className="text-[34px] text-[#FFE11B]" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-[#A3AED0] text-[14px] leading-[24px]">
//                       Total Payments
//                     </p>
//                     <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
//                       Rs. 200,000
//                     </p>
//                   </div>
//                 </div>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Payment Details */}
//         <Grid container xs={12} className="mt-12">
//           <Grid
//             container
//             xs={12}
//             className="bg-white rounded-xl py-4 px-4 whitespace-nowrap overflow-x-hidden"
//           >
//             <Grid
//               container
//               xs={12}
//               justifyContent="space-between"
//               className="items-center"
//             >
//               <Grid item>
//                 <h3 className="text-[20px] font-[700] leading-[32px] tracking-[-0.4px]">
//                   Payment Details
//                 </h3>
//               </Grid>
//               <Grid item lg={4} md={5} sm={6} xs={12} className="pt-4 sm:pt-0">
//                 <div className="flex justify-end items-center">
//                   <span>
//                     <CiSearch className="relative text-[18px] left-8" />
//                   </span>
//                   <input
//                     type="text"
//                     className="rounded-full bg-[#F4F7FE] py-2 px-6 pl-10 w-[100%] sm:w-[unset] relative sm:static -left-[10px] sm:left-0"
//                     placeholder="Search"
//                     name="payment"
//                     value={values.payment}
//                     onChange={handleInput}
//                   />
//                 </div>
//               </Grid>
//             </Grid>
//             {/* <Grid item xs={12} align="center"> */}
//             <table className="block mt-2 overflow-x-auto whitespace-nowrap w-full">
//               <thead className="table w-[100%]">
//                 <tr className="flex justify-between">
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Client
//                       {sortOrder.client === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("client")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("client")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Uid
//                       {sortOrder.uid === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("uid")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("uid")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Store
//                       {sortOrder.store === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("store")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("store")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Date
//                       {sortOrder.date === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("date")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("date")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Time
//                       {sortOrder.time === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("time")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("time")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       OrderId
//                       {sortOrder.orderId === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("orderId")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("orderId")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Amount
//                       {sortOrder.amount === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("amount")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("amount")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Method
//                       {sortOrder.method === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("method")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSort("method")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               </thead>
//               <tbody className="table w-[100%]">
//                 {filteredData.map((item, index) => (
//                   <tr
//                     className="text-center flex justify-between my-2"
//                     key={index}
//                   >
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.client}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.uid}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.store}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.date}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.time}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.orderId}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       $ {item.amount}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.method}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Grid>
//         </Grid>
//         {/* Salary Details */}
//         <Grid container xs={12} className="mt-12">
//           <Grid
//             container
//             xs={12}
//             className="bg-white rounded-xl py-4 px-4 whitespace-nowrap overflow-x-hidden"
//           >
//             <Grid
//               container
//               xs={12}
//               justifyContent="space-between"
//               className="items-center"
//             >
//               <Grid item>
//                 <h3 className="text-[20px] font-[700] leading-[32px] tracking-[-0.4px]">
//                   Salary Details
//                 </h3>
//               </Grid>
//               <Grid item lg={4} md={5} sm={6} xs={12} className="pt-4 sm:pt-0">
//                 <div className="flex justify-end items-center">
//                   <span>
//                     <CiSearch className="relative text-[18px] left-8" />
//                   </span>
//                   <input
//                     type="text"
//                     className="rounded-full bg-[#F4F7FE] py-2 px-6 pl-10 w-[100%] sm:w-[unset] relative sm:static -left-[10px] sm:left-0"
//                     placeholder="Search"
//                     name="salary"
//                     value={values.salary}
//                     onChange={handleInput}
//                   />
//                 </div>
//               </Grid>
//             </Grid>
//             {/* <Grid item xs={12} align="center"> */}
//             <table className="block mt-2 overflow-x-auto whitespace-nowrap w-full">
//               <thead className="table w-[100%]">
//                 <tr className="flex justify-between">
//                   <td className="w-[110px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Employee
//                       {sortOrderSalary.employee === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("employee")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("employee")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[130px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Employee Id
//                       {sortOrderSalary.employeeId === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           /*   aria-hidden="true" */
//                           onClick={() => handleSortSalary("employeeId")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("employeeId")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Store
//                       {sortOrderSalary.store === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("store")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("store")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[110px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Join Date
//                       {sortOrderSalary.joinDate === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("joinDate")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("joinDate")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[115px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Work Time
//                       {sortOrderSalary.workTime === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("workTime")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("workTime")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Type
//                       {sortOrderSalary.type === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("type")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("type")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Amount
//                       {sortOrderSalary.amount === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("amount")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("amount")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                   <td className="w-[100px] text-center">
//                     <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
//                       Status
//                       {sortOrderSalary.status === "asc" ? (
//                         <ChevronDownIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("status")}
//                         />
//                       ) : (
//                         <ChevronUpIcon
//                           className="-mr-1 h-5 w-5 text-black cursor-pointer"
//                           aria-hidden="true"
//                           onClick={() => handleSortSalary("status")}
//                         />
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               </thead>
//               <tbody className="table w-[100%]">
//                 {filteredDataSalary.map((item, index) => (
//                   <tr className="text-center flex justify-between my-2">
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.employee}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.employeeId}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.store}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.joinDate}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.workTime}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.type}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       $ {item.amount}
//                     </td>
//                     <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
//                       {item.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Grid>
//         </Grid>
//       </div>
//     </>
//   );
// };

// export default ReportsEmployee;
import React, { useState } from "react";
import "../employee/broadcast.css";

const ReportsEmployee = () => {
  const [isSending, setIsSending] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSendClick = () => {
    setIsSending(true);
  };

  const handleClose = () => {
    setIsSending(false);
  };

  const handleSend = () => {
    fetch("https://api.frenzone.live/admin/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: notificationMessage }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send notification");
        }
        // Handle success
        console.log("Notification sent successfully");
        handleClose(); // Close the send container
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        // Handle error
      });
  };

  return (
    <div className="broad-container">
      <div className="broad-container-full">
        <div className="broad-heading">
          <h2>BroadCast</h2>
        </div>
        <div className="send-heading">
          <div className="btn-head-set">
            <button onClick={handleSendClick}>Send Notifications</button>
          </div>
        </div>
        {isSending && (
          <div className="send-container">
            <textarea
              placeholder="Write your message..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            ></textarea>
            <div className="button-container">
              <button onClick={handleClose}>Cancel</button>
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsEmployee;
