import React, { Fragment, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

// react icons
import { FaDollarSign, FaPhoneAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa6";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ManageProfile = () => {
  const [sortOrderSalary, setSortOrderSalary] = useState({
    employee: "asc",
    employeeId: "asc",
    store: "asc",
    joinDate: "asc",
    workTime: "asc",
    type: "asc",
    amount: "asc",
    status: "asc",
  });

  const [sortedColumnSalary, setSortedColumnSalary] = useState(null);

  const salaryDetailsData = [
    {
      employee: "Pattrick",
      employeeId: "2",
      store: "New York",
      joinDate: "14 Jan 2021",
      workTime: "01:00 PM",
      type: "2",
      amount: "350",
      status: "Pending",
    },
    {
      employee: "Johnson",
      employeeId: "1",
      store: "Manspire",
      joinDate: "12 Jan 2021",
      workTime: "11:00 AM",
      type: "1",
      amount: "250",
      status: "Complete",
    },
    {
      employee: "Zees",
      employeeId: "3",
      store: "New York",
      joinDate: "15 Jan 2021",
      workTime: "01:00 PM",
      type: "3",
      amount: "450",
      status: "Pending",
    },
  ];

  const convertTo24HourFormat = (time) => {
    const [rawTime, period] = time.split(" ");
    const [hours, minutes] = rawTime.split(":");
    const adjustedHours = period === "PM" ? parseInt(hours, 10) + 12 : hours;

    return `${adjustedHours}:${minutes}`;
  };

  useEffect(() => {
    setSortedColumnSalary(null);
  }, []);
  const [values, setValues] = useState({
    salary: "",
  });
  const handleInput = (e) => {
    const Value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: Value,
    });
  };

  const [filteredDataSalary, setFilteredDataSalary] =
    useState(salaryDetailsData);

  const handleSortSalary = (column) => {
    const sortordersalaryTemp = {
      ...sortOrderSalary,
      [column]: sortOrderSalary[column] === "asc" ? "desc" : "asc",
    };
    setSortOrderSalary((prevSortOrder) => ({
      ...prevSortOrder,
      [column]: prevSortOrder[column] === "asc" ? "desc" : "asc",
    }));
    const sortcolumnsalartTemp = column;
    setSortedColumnSalary(column);

    const sortedDataSalaray = salaryDetailsData.slice().sort((a, b) => {
      if (sortcolumnsalartTemp) {
        const order = sortOrderSalary[sortcolumnsalartTemp];
        if (
          sortcolumnsalartTemp === "date" ||
          sortcolumnsalartTemp === "time"
        ) {
          const timeA = convertTo24HourFormat(a[sortcolumnsalartTemp]);
          const timeB = convertTo24HourFormat(b[sortcolumnsalartTemp]);

          return order === "asc"
            ? timeA.localeCompare(timeB)
            : timeB.localeCompare(timeA);
        } else {
          if (order === "asc") {
            return a[sortcolumnsalartTemp] > b[sortcolumnsalartTemp] ? 1 : -1;
          } else {
            return a[sortcolumnsalartTemp] < b[sortcolumnsalartTemp] ? 1 : -1;
          }
        }
      }
      return 0;
    });

    setFilteredDataSalary(sortedDataSalaray);
  };
  useEffect(() => {
    const filteredSalaryData = salaryDetailsData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(values.salary.toLowerCase())
      )
    );

    setFilteredDataSalary(filteredSalaryData);
  }, [values.salary /* sortedDataSalaray */]);
  return (
    <>
      <div className="bg-[#F4F7FE] py-12 px-4 w-[100%]">
        <Grid
          container
          xs={12}
          justifyContent="space-between"
          className="items-center"
        >
          <Grid item lg={4} xs={12}>
            <h1 className="text-[#FFE11B] font-[700] text-[34px]">
              Manage Profile
            </h1>
            {/* Dropdown */}
            <Menu as="div" className="relative inline-block text-left mt-4">
              <div>
                <Menu.Button className="inline-flex w-[170px] justify-between gap-x-1.5 rounded-md bg-none px-3 py-1 text-md font-normal bg-[#FFE11B] text-black">
                  ALL
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-black"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute text-black right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#FFE11B] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 border-b border-gray">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#profit"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Profit
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1 border-b-2 border-gray">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#revenue"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Revenue
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </Grid>
          <Grid item xl={6} lg={8} xs={12} className="lg:pt-0 pt-6">
            <Grid container xs={12} spacing={3}>
              <Grid item xl={6} lg={6} md={6} xs={12}>
                <div className="w-[100%] flex bg-white rounded-xl py-4 px-4">
                  <div className="bg-[#F4F7FE] p-3 rounded-full">
                    <FaDollarSign className="text-[34px] text-[#FFE11B]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#A3AED0] text-[14px] leading-[24px]">
                      Total Payments
                    </p>
                    <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
                      Rs. 200,000
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} xs={12}>
                <div className="w-[100%] flex bg-white rounded-xl py-4 px-4">
                  <div className="bg-[#F4F7FE] p-3 rounded-full">
                    <FaDollarSign className="text-[34px] text-[#FFE11B]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#A3AED0] text-[14px] leading-[24px]">
                      Total Payments
                    </p>
                    <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
                      Rs. 200,000
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={12} className="mt-4">
          <Grid container xs={12} className="bg-white rounded-xl py-8 px-4">
            <Grid item xs={12}>
              <h2 className="text-black text-[24px] font-[700] leading-[30px] tracking-[-0.48px]">
                Add Employee
              </h2>
            </Grid>
            <Grid container xs={12} className="flex-row-reverse md:flex-row">
              <Grid item lg={9} md={9} sm={8} xs={12}>
                <Grid
                  container
                  xs={12}
                  spacing={3}
                  justifyContent="space-between"
                  className="pt-8"
                >
                  <Grid item sm={6} xs={12}>
                    <p className="text-[14px] font-[500] tracking-[-0.28px]">
                      Employee Type
                    </p>
                    <input
                      type="text"
                      placeholder="Employee Type"
                      className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12} className="">
                    <p className="text-[14px] font-[500] tracking-[-0.28px]">
                      Store
                    </p>
                    <input
                      type="text"
                      placeholder="Store"
                      className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={3} sm={4} xs={12} align="center">
                <img
                  src={require("../../assets/Group 260.png")}
                  alt=""
                  width="50%"
                  max-width="200px"
                  className="sm:mt-0 mt-4"
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className="pt-4">
              <Grid item xs={12}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Employee Id
                </p>
                <input
                  type="text"
                  placeholder="Employee Id"
                  className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                />
              </Grid>
              <Grid item xs={6}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Full Name
                </p>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                />
              </Grid>
              <Grid item xs={6}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Price
                </p>
                <input
                  type="text"
                  placeholder="Price"
                  className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                />
              </Grid>
              <Grid item xs={6}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Address
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Address"
                    className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                  />
                  <div className="w-0 h-0 relative -left-[30px] -top-[5px]">
                    <FaLocationDot className="text-[#A3AED0] text-[18px]" />
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Phone No.
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Phone No."
                    className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                  />
                  <div className="w-0 h-0 relative -left-[30px] -top-[5px]">
                    <FaPhoneAlt className="text-[#A3AED0] text-[18px]" />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Email
                </p>
                <div className="flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                  />
                  <div className="w-0 h-0 relative -left-[30px] -top-[5px]">
                    <MdEmail className="text-[#A3AED0] text-[18px]" />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <p className="text-[14px] font-[500] tracking-[-0.28px]">
                  Password
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Password"
                    className="mt-2 border border-[#D8DADC] rounded-lg py-2 px-4 w-[100%]"
                  />
                  <div className="w-0 h-0 relative -left-[30px] -top-[5px]">
                    <FaEyeSlash className="text-[#A3AED0] text-[18px]" />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} align="center">
                <button className="bg-[#FFE11B] text-[#292828] text-[16px] font-[600] rounded-lg py-3 px-12">
                  ADD
                </button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Salary Details */}
        <Grid container xs={12} className="mt-12">
          <Grid
            container
            xs={12}
            className="bg-white rounded-xl py-4 px-4 whitespace-nowrap"
          >
            <Grid
              container
              xs={12}
              justifyContent="space-between"
              className="items-center"
            >
              <Grid item>
                <h3 className="text-[20px] font-[700] leading-[32px] tracking-[-0.4px]">
                  Salary Details
                </h3>
              </Grid>
              <Grid item lg={4} md={5} sm={6} xs={12} className="pt-4 sm:pt-0">
                <div className="flex justify-end items-center">
                  <span>
                    <CiSearch className="relative text-[18px] left-8" />
                  </span>
                  <input
                    type="text"
                    className="rounded-full bg-[#F4F7FE] py-2 px-6 pl-10 w-[100%] sm:w-[unset] relative sm:static -left-[10px] sm:left-0"
                    placeholder="Search"
                    name="salary"
                    value={values.salary}
                    onChange={handleInput}
                  />
                </div>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} align="center"> */}
            <table className="block mt-2 overflow-x-auto whitespace-nowrap w-full">
              <thead className="table w-[100%]">
                <tr className="flex justify-between">
                  <td className="w-[110px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Employee
                      {sortOrderSalary.employee === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("employee")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("employee")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[130px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Employee Id
                      {sortOrderSalary.employeeId === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          /*   aria-hidden="true" */
                          onClick={() => handleSortSalary("employeeId")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("employeeId")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Store
                      {sortOrderSalary.store === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("store")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("store")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[110px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Join Date
                      {sortOrderSalary.joinDate === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("joinDate")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("joinDate")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[115px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Work Time
                      {sortOrderSalary.workTime === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("workTime")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("workTime")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Type
                      {sortOrderSalary.type === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("type")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("type")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Amount
                      {sortOrderSalary.amount === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("amount")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("amount")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Status
                      {sortOrderSalary.status === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("status")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortSalary("status")}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="table w-[100%]">
                {filteredDataSalary.map((item, index) => (
                  <tr className="text-center flex justify-between my-2">
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.employee}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.employeeId}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.store}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.joinDate}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.workTime}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.type}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      $ {item.amount}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ManageProfile;
