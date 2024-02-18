import React, { useState, Fragment, useEffect } from "react";

import Grid from "@mui/material/Grid";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

// react icons
import { MdEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ManageOrdersStore = () => {
  const [sortOrder, setSortOrder] = useState({
    client: "asc",
    uid: "asc",
    store: "asc",
    date: "asc",
    time: "asc",
    orderId: "asc",
    amount: "asc",
  });
  const [sortOrderProduct, setSortOrderProduct] = useState({
    name: "asc",
    productId: "asc",
    price: "asc",
    address: "asc",
    size: "asc",
    color: "asc",
    status: "asc",
  });
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortedColumnProduct, setSortedColumnProduct] = useState(null);

  const paymentDetailsData = [
    {
      client: "Pattrick",
      uid: "2",
      store: "New York",
      date: "14 Jan 2021",
      time: "01:00 PM",
      orderId: "2",
      amount: "350",
    },
    {
      client: "Johnson",
      uid: "1",
      store: "Manspire",
      date: "12 Jan 2021",
      time: "11:00 AM",
      orderId: "1",
      amount: "250",
    },
    {
      client: "Zees",
      uid: "3",
      store: "New York",
      date: "15 Jan 2021",
      time: "01:00 PM",
      orderId: "3",
      amount: "450",
    },
  ];
  const ProductDetailsData = [
    {
      name: "Pattrick",
      productId: "2",
      price: "100",
      address: "abc",
      size: "10",
      color: "Red",
      status: "Pending",
    },
    {
      name: "Johnson",
      productId: "1",
      price: "200",
      address: "bac",
      size: "20",
      color: "White",
      status: "Completed",
    },
    {
      name: "Zees",
      productId: "3",
      price: "400",
      address: "cab",
      size: "30",
      color: "Black",
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
    setSortedColumn(null);
    setSortedColumnProduct(null);
  }, []);
  const [values, setValues] = useState({
    order: "",
    product: "",
  });
  const handleInput = (e) => {
    const Value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: Value,
    });
  };

  const [filteredData, setFilteredData] = useState(paymentDetailsData);
  const [filteredDataProduct, setFilteredDataProduct] =
    useState(ProductDetailsData);
  const handleSort = (column) => {
    const sortorderTemp = {
      ...sortOrder,
      [column]: sortOrder[column] === "asc" ? "desc" : "asc",
    };
    setSortOrder((prevSortOrder) => ({
      ...prevSortOrder,
      [column]: prevSortOrder[column] === "asc" ? "desc" : "asc",
    }));
    const sortedColumnTemp = column;
    setSortedColumn(column);

    const sortedData = paymentDetailsData.slice().sort((a, b) => {
      if (sortedColumnTemp) {
        const order = sortOrder[sortedColumnTemp];
        if (sortedColumnTemp === "date" || sortedColumnTemp === "time") {
          const timeA = convertTo24HourFormat(a[sortedColumnTemp]);
          const timeB = convertTo24HourFormat(b[sortedColumnTemp]);

          return order === "asc"
            ? timeA.localeCompare(timeB)
            : timeB.localeCompare(timeA);
        } else {
          if (order === "asc") {
            return a[sortedColumnTemp] > b[sortedColumnTemp] ? 1 : -1;
          } else {
            return a[sortedColumnTemp] < b[sortedColumnTemp] ? 1 : -1;
          }
        }
      }
      return 0;
    });

    setFilteredData(sortedData);
  };

  const handleSortProduct = (column) => {
    const sortOrderProductTemp = {
      ...sortOrderProduct,
      [column]: sortOrderProduct[column] === "asc" ? "desc" : "asc",
    };
    setSortOrderProduct((prevSortOrder) => ({
      ...prevSortOrder,
      [column]: prevSortOrder[column] === "asc" ? "desc" : "asc",
    }));
    const sortedColumnProductTemp = column;
    setSortedColumnProduct(column);

    const sortedDataProduct = ProductDetailsData.slice().sort((a, b) => {
      if (sortedColumnProductTemp) {
        const order = sortOrderProduct[sortedColumnProductTemp];
        if (
          sortedColumnProductTemp === "date" ||
          sortedColumnProductTemp === "time"
        ) {
          const timeA = convertTo24HourFormat(a[sortedColumnProductTemp]);
          const timeB = convertTo24HourFormat(b[sortedColumnProductTemp]);

          return order === "asc"
            ? timeA.localeCompare(timeB)
            : timeB.localeCompare(timeA);
        } else {
          if (order === "asc") {
            return a[sortedColumnProductTemp] > b[sortedColumnProductTemp]
              ? 1
              : -1;
          } else {
            return a[sortedColumnProductTemp] < b[sortedColumnProductTemp]
              ? 1
              : -1;
          }
        }
      }
      return 0;
    });
    setFilteredDataProduct(sortedDataProduct);
  };
  useEffect(() => {
    const filteredPaymentData = paymentDetailsData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(values.order.toLowerCase())
      )
    );

    const filteredProductData = ProductDetailsData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(values.product.toLowerCase())
      )
    );

    setFilteredData(filteredPaymentData);
    setFilteredDataProduct(filteredProductData);
  }, [values.order, values.product /* sortedData */ /* sortedDataProduct */]);

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
              Manage Orders
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
        </Grid>

        {/* Order Details */}
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
                  Order Details
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
                    name="order"
                    value={values.order}
                    onChange={handleInput}
                  />
                </div>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} align="center"> */}
            <table className="block mt-2 overflow-x-auto whitespace-nowrap w-full">
              <thead className="table w-[100%]">
                <tr className="flex justify-between">
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Client
                      {sortOrder.client === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("client")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("client")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Uid
                      {sortOrder.uid === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("uid")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("uid")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Store
                      {sortOrder.store === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("store")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("store")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Date
                      {sortOrder.date === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("date")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("date")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Time
                      {sortOrder.time === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("time")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("time")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      OrderId
                      {sortOrder.orderId === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("orderId")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("orderId")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Amount
                      {sortOrder.amount === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("amount")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSort("amount")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Actions
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="table w-[100%]">
                {filteredData.map((item, index) => (
                  <tr className="text-center flex justify-between my-2">
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.client}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.uid}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.store}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.date}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.time}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.orderId}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      $ {item.amount}
                    </td>
                    <td className="w-[100px] flex justify-evenly text-center text-[#2B3674] text-[14px] font-[700]">
                      <MdEdit />
                      <MdOutlineDelete />
                      <IoNotifications />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </Grid>
        {/* Product Details */}
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
                  Product Details
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
                    name="product"
                    value={values.product}
                    onChange={handleInput}
                  />
                </div>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} align="center"> */}
            <table className="block mt-2 overflow-x-auto whitespace-nowrap w-full">
              <thead className="table w-[100%]">
                <tr className="flex justify-between">
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Name
                      {sortOrderProduct.name === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("name")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("name")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[115px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Product Id
                      {sortOrderProduct.productId === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("productId")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("productId")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Price
                      {sortOrderProduct.price === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("price")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("price")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Address
                      {sortOrderProduct.address === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("address")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("address")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Size
                      {sortOrderProduct.size === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("size")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("size")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Color
                      {sortOrderProduct.color === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("color")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("color")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Status
                      {sortOrderProduct.status === "asc" ? (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("status")}
                        />
                      ) : (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-black cursor-pointer"
                          aria-hidden="true"
                          onClick={() => handleSortProduct("status")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="tableheading inline-flex items-center justify-between gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-normal text-[#A3AED0]">
                      Actions
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="table w-[100%]">
                {filteredDataProduct.map((item, index) => (
                  <tr className="text-center flex justify-between my-2">
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.name}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.productId}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      ${item.price}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.address}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.size}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.color}
                    </td>
                    <td className="w-[100px] text-center text-[#2B3674] text-[14px] font-[700]">
                      {item.status}
                    </td>
                    <td className="w-[100px] flex justify-evenly text-center text-[#2B3674] text-[14px] font-[700]">
                      <MdEdit />
                      <MdOutlineDelete />
                      <IoNotifications />
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

export default ManageOrdersStore;
