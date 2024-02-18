import React, { Fragment, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// react icons
import { IoIosPeople } from "react-icons/io";
import { FaDollarSign } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { FaChartSimple } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const data = {
  labels: [10, 20, 30, 40, 50, 60],
  datasets: [
    {
      /* label: "Line 1", */
      data: [25, 15, 35, 13, 45, 48],
      borderColor: "#4318FF",
      borderWidth: 2,
      fill: "#4318FF", // Add this line
      backgroundColor: "transparent", // or set it to the background color
      cubicInterpolationMode: "monotone",
      pointBackgroundColor: "white",
    },
    {
      /*  label: "Line 2", */
      data: [10, 5, 15, 4, 20, 22],
      borderColor: "#6AD2FF",
      borderWidth: 2,
      fill: false, // Add this line
      backgroundColor: "transparent", // or set it to the background color
      cubicInterpolationMode: "monotone",
      pointBackgroundColor: "white",
    },
    // Add more datasets as needed
  ],
};
const initializeChart = (chartContainer, data) => {
  const monthNames = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"];

  if (chartContainer && chartContainer.current) {
    const ctx = chartContainer.current.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        maintainAspectRatio: false,
        aspectRatio: 2,
        scales: {
          x: {
            type: "category",
            position: "bottom",
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value, index, values) {
                return monthNames[index];
              },
            },
          },
          y: {
            type: "linear",
            position: "left",
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            position: "average", // Set the position to 'average' to place it at the top
            backgroundColor: "#4318FF",
            titleFontColor: "#000",
            bodyFontColor: "#000",
            titleAlign: "center",
            bodyAlign: "center",
            displayColors: false,
            callbacks: {
              title: () => "", // Empty string for title
              label: (context) => `Rs. ${context.parsed.y}`, // Show only the value
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }
};
const DashboardStore = () => {
  const chartContainer = useRef(null);

  useEffect(() => {
    initializeChart(chartContainer, data);
  }, []);

  return (
    <>
      <div className="bg-[#F4F7FE] py-12 px-4 w-[100%]">
        <h1 className="text-[#FFE11B] font-[700] text-[34px]">
          Main Dashboard
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
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
        <Grid container xs={12} spacing={3} className="pt-6">
          <Grid item xl={3} lg={4} md={6} xs={12}>
            <div className="w-[100%] flex bg-white rounded-xl py-4 px-4">
              <div className="bg-[#F4F7FE] p-3 rounded-full">
                <IoIosPeople className="text-[34px] text-[#FFE11B]" />
              </div>
              <div className="ml-4">
                <p className="text-[#A3AED0] text-[14px] leading-[24px]">
                  Total Active Orders
                </p>
                <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
                  45
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xl={3} lg={4} md={6} xs={12}>
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
          <Grid item xl={3} lg={4} md={6} xs={12}>
            <div className="w-[100%] flex bg-white rounded-xl py-4 px-4">
              <div className="bg-[#F4F7FE] p-3 rounded-full">
                <BsPersonCheck className="text-[34px] text-[#FFE11B]" />
              </div>
              <div className="ml-4">
                <p className="text-[#A3AED0] text-[14px] leading-[24px]">
                  Active Barbers
                </p>
                <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
                  22
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xl={3} lg={4} md={6} xs={12}>
            <div className=" bg-white rounded-xl pt-4 pb-4 px-4">
              <div className="text-right h-0 relative -top-[20px]">
                <Menu as="div" className="relative inline-block text-left mt-4">
                  <div>
                    <Menu.Button className="inline-flex w-[110px] justify-between gap-x-1.5 rounded-md bg-none px-3 py-1 text-md font-normal bg-[#F4F7FE] text-black">
                      Month
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
                    <Menu.Items className="absolute text-black right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#F4F7FE] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                              Week
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
                              Year
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="flex">
                <div className="bg-[#F4F7FE] p-3 rounded-full">
                  <FaDollarSign className="text-[34px] text-[#FFE11B]" />
                </div>
                <div className="ml-4">
                  <p className="text-[#A3AED0] text-[14px] leading-[24px]">
                    Total Salary
                  </p>
                  <p className="text-[24px] font-[700] leading-[32px] -tracking-[0.48px] ">
                    20000$
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container xs={12} spacing={3} className="pt-6">
          <Grid item lg={7} xs={12}>
            <div className=" bg-white rounded-xl pt-6 pb-6 px-4">
              <div className="flex justify-between items-center mb-6">
                <div className="">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal bg-[#F4F7FE] text-[#A3AED0]">
                        <FaCalendarAlt className="text-[#A3AED0] w-4 h-4" />
                        This Month
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
                      <Menu.Items className="absolute text-black right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#F4F7FE] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                                This Week
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
                                This Year
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="bg-[#F4F7FE] p-2 rounded-full">
                  <FaChartSimple className="bg-[#F4F7FE] text-[#4318FF] " />
                </div>
              </div>
              <Grid container xs={12}>
                <Grid item sm={4} xs={12}>
                  <p className="text-black text-[34px] tracking-[-0.68px] leading-[42px]">
                    Rs. 200,000
                  </p>
                  <p className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    Total Payments
                  </p>
                  <div className="flex items-center mt-4">
                    <FaCircleCheck className="w-[11px] h-[11px] text-[#05CD99]" />
                    <p className="ml-1 text-[#05CD99] text-[13px] font-[700] leading-[28px] tracking-[-0.26px]">
                      On track of this area
                    </p>
                  </div>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <div>
                    <canvas ref={chartContainer} />
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item lg={5} xs={12}>
            <Grid container xs={12} className="bg-white rounded-xl py-4 px-4">
              <Grid
                container
                xs={12}
                justifyContent="space-between"
                className="items-center"
              >
                <Grid item>
                  <h3 className="text-[20px] font-[700] leading-[32px] tracking-[-0.4px]">
                    Store Payments
                  </h3>
                </Grid>
                <Grid item>
                  <button className="bg-[#F4F7FE] rounded-2xl text-[#FFE11B] text-[14px] leading-[24px] tracking-[-0.28px] py-1 px-5">
                    See All
                  </button>
                </Grid>
              </Grid>
              {/* <Grid item xs={12} align="center"> */}
              <table className="w-[100%] mt-2">
                <tr className="">
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left">
                    Name
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left">
                    Store No.
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left">
                    Amount
                  </td>
                </tr>
                <tr className="leading-12">
                  <td className="text-[#2B3674] text-[14px] font-[700] leading-[24px] tracking-[-0.28px] leading-[30px]">
                    Virginia
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    9821
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    $2000
                  </td>
                </tr>
                <tr className="my-2">
                  <td className="text-[#2B3674] text-[14px] font-[700] leading-[24px] tracking-[-0.28px]  leading-[30px]">
                    New York
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    7032
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    $900
                  </td>
                </tr>
                <tr className="my-2">
                  <td className="text-[#2B3674] text-[14px] font-[700] leading-[24px] tracking-[-0.28px]  leading-[30px]">
                    Los Santos
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    5204
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    $1520
                  </td>
                </tr>
                <tr className="my-2">
                  <td className="text-[#2B3674] text-[14px] font-[700] leading-[24px] tracking-[-0.28px]  leading-[30px]">
                    Texas
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    4309
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    $740
                  </td>
                </tr>
                <tr className="my-2">
                  <td className="text-[#2B3674] text-[14px] font-[700] leading-[24px] tracking-[-0.28px]  leading-[30px]">
                    Marry Land
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    3871
                  </td>
                  <td className="text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px]">
                    $3200
                  </td>
                </tr>
              </table>
            </Grid>
          </Grid>
        </Grid>
        {/* Recent Payments */}
        <Grid container xs={12} className="mt-12">
          <Grid
            container
            xs={12}
            className="bg-white rounded-xl py-4 px-4 whitespace-nowrap overflow-x-hidden"
          >
            <Grid
              container
              xs={12}
              justifyContent="space-between"
              className="items-center"
            >
              <Grid item>
                <h3 className="text-[20px] font-[700] leading-[32px] tracking-[-0.4px]">
                  Recent Payments
                </h3>
              </Grid>
              <Grid item>
                <button className="bg-[#F4F7FE] rounded-2xl text-[#FFE11B] text-[14px] leading-[24px] tracking-[-0.28px] py-1 px-5">
                  See All
                </button>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} align="center"> */}
            <table className="block mt-2 overflow-x-auto whitespace-nowrap w-full">
              <tbody className="table w-[100%]">
                <tr className="shadow-md text-center rounded-lg my-2 flex justify-between items-center md:px-4 px-1">
                  <td className="w-[150px] sm:w-[30%] px-3 py-3 text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left flex items-center">
                    <img
                      src={require("../../assets/Group 246.png")}
                      alt=""
                      width="55px"
                      className="sm:w-[55px] w-[40px]"
                    />
                    <p className="text-[#1B2559] text-[12px] sm:text-[16px] font-[700] ml-1">
                      Johnson
                    </p>
                  </td>
                  <td className="w-[150px] sm:w-[25%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    Ex Saloon Studio
                  </td>
                  <td className="w-[100px] sm:w-[20%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    $300
                  </td>
                  <td className="w-[100px] sm:w-[25%] text-[#A3AED0] text-[12px] sm:text-[16px] font-[400] leading-[20px] tracking-[-0.32px] text-center">
                    30sec ago
                  </td>
                </tr>
                <tr className="shadow-md text-center rounded-lg my-2 flex justify-between items-center md:px-4 px-1 ">
                  <td className="w-[150px] sm:w-[30%] px-3 py-3 text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left flex items-center">
                    <img
                      src={require("../../assets/Group 246.png")}
                      alt=""
                      width="55px"
                      className="sm:w-[55px] w-[40px]"
                    />
                    <p className="text-[#1B2559] text-[12px] sm:text-[16px] font-[700] ml-1">
                      Johnson
                    </p>
                  </td>
                  <td className="w-[150px] sm:w-[25%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    Ex Saloon Studio
                  </td>
                  <td className="w-[100px] sm:w-[20%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    $300
                  </td>
                  <td className="w-[100px] sm:w-[25%] text-[#A3AED0] text-[12px] sm:text-[16px] font-[400] leading-[20px] tracking-[-0.32px] text-center">
                    30sec ago
                  </td>
                </tr>
                <tr className="shadow-md text-center rounded-lg my-2 flex justify-between items-center md:px-4 px-1 ">
                  <td className="w-[150px] sm:w-[30%] px-3 py-3 text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left flex items-center">
                    <img
                      src={require("../../assets/Group 246.png")}
                      alt=""
                      width="55px"
                      className="sm:w-[55px] w-[40px]"
                    />
                    <p className="text-[#1B2559] text-[12px] sm:text-[16px] font-[700] ml-1">
                      Johnson
                    </p>
                  </td>
                  <td className="w-[150px] sm:w-[25%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    Ex Saloon Studio
                  </td>
                  <td className="w-[100px] sm:w-[20%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    $300
                  </td>
                  <td className="w-[100px] sm:w-[25%] text-[#A3AED0] text-[12px] sm:text-[16px] font-[400] leading-[20px] tracking-[-0.32px] text-center">
                    30sec ago
                  </td>
                </tr>
                <tr className="shadow-md text-center rounded-lg my-2 flex justify-between items-center md:px-4 px-1 ">
                  <td className="w-[150px] sm:w-[30%] px-3 py-3 text-[#A3AED0] text-[14px] font-[500] leading-[24px] tracking-[-0.28px] text-left flex items-center">
                    <img
                      src={require("../../assets/Group 246.png")}
                      alt=""
                      width="55px"
                      className="sm:w-[55px] w-[40px]"
                    />
                    <p className="text-[#1B2559] text-[12px] sm:text-[16px] font-[700] ml-1">
                      Johnson
                    </p>
                  </td>
                  <td className="w-[150px] sm:w-[25%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    Ex Saloon Studio
                  </td>
                  <td className="w-[100px] sm:w-[20%] text-[#2B3674] text-[12px] sm:text-[16px] font-[700] leading-[20px] tracking-[-0.32px]">
                    $300
                  </td>
                  <td className="w-[100px] sm:w-[25%] text-[#A3AED0] text-[12px] sm:text-[16px] font-[400] leading-[20px] tracking-[-0.32px] text-center">
                    30sec ago
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default DashboardStore;
