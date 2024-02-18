import React, { Fragment, useState } from "react";
import Grid from "@mui/material/Grid";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// react icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const members = [
  { id: 1, name: "Johnson" },
  { id: 2, name: "Ali" },
  { id: 3, name: "Jason" },
  { id: 4, name: "Abdullah" },
  { id: 5, name: "Ahmed" },
  // Add more members as needed
];

const times = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const AppointmentCalendarStore = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [personSelected, setPersonSelected] = useState(0);

  const handleChangeMonth = (value) => {
    setCurrentMonth(value);
  };
  const handlePersonSelect = (number) => {
    if (
      personSelected + number >= 0 &&
      personSelected + number <= members.length
    ) {
      setPersonSelected((prev) => prev + number);
    }
  };
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
              Appointment Calendar
            </h1>
            {/* Dropdown */}
            <Menu as="div" className="relative inline-block text-left mt-4">
              <div>
                <Menu.Button className="inline-flex w-[170px] justify-between gap-x-1.5 rounded-md bg-none px-3 py-1 text-md font-normal bg-[#FFE11B] text-black">
                  Virginia
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
        <Grid container xs={12} className="mt-4" justifyContent="space-between">
          <Grid
            item
            className="pt-2 cursor-pointer"
            onClick={() => setPersonSelected(0)}
          >
            <div
              className={`${
                personSelected === 0 ? "bg-[#FFE11B]" : "bg-white"
              } text-center py-2 px-1 rounded-lg`}
            >
              <img src={require("../../assets/image 18.png")} alt="" />
              <p className="text-[12px] font-[600] mt-2">All Team</p>
            </div>
          </Grid>

          {members.map((member, index) => (
            <Grid
              item
              className="pt-2 cursor-pointer"
              onClick={() => setPersonSelected(member.id)}
              key={member.id}
            >
              <div
                className={`${
                  personSelected === member.id ? "bg-[#FFE11B]" : "bg-white"
                } text-center py-2 px-1 rounded-lg`}
              >
                <img src={require("../../assets/image 18.png")} alt="" />
                <p className="text-[12px] font-[600] mt-2">{member.name}</p>
              </div>
            </Grid>
          ))}
        </Grid>
        {/* Calendar */}
        <div className="sm:container sm:mx-auto p-4">
          <div className="flex justify-between items-center mb-12">
            <Grid container className="justify-between items-center">
              <Grid item xs={4}>
                <button
                  /*    onClick={() =>
                    handleChangeMonth((currentMonth - 1 + 12) % 12)
                  } */
                  onClick={() => handlePersonSelect(-1)}
                  className="mr-2 px-3 py-3 bg-none border border-[#707070] text-black rounded cursor-pointer"
                  style={{
                    cursor: "pointer",
                    opacity: `${personSelected === 0 ? "0.5" : "1"}`,
                  }}
                >
                  <FaChevronLeft className="cursor-pointer" />
                </button>
                <button
                  /*    onClick={() =>
                    handleChangeMonth((currentMonth - 1 + 12) % 12)
                  } */
                  onClick={() => handlePersonSelect(1)}
                  className="mr-2 px-3 py-3 bg-none border border-[#707070] text-black rounded cursor-pointer"
                  style={{
                    cursor: "pointer",
                    opacity: `${
                      personSelected === members.length ? "0.5" : "1"
                    }`,
                  }}
                >
                  <FaChevronRight className="cursor-pointer" />
                </button>
              </Grid>
              <Grid item xs={4} align="center">
                <div className="flex items-center">
                  <select
                    value={currentMonth}
                    onChange={(e) =>
                      handleChangeMonth(parseInt(e.target.value))
                    }
                    className="appearance-none border-[#F4F7FE] bg-[#F4F7FE] px-4 pr-0 py-2 focus:border-[#F4F7FE] rounded ring-[#F4F7FE] focus:outline-none"
                  >
                    {months.map((month, index) => (
                      <>
                        <option key={index} value={index}>
                          {month}
                        </option>
                      </>
                    ))}
                  </select>
                  <ChevronDownIcon className="relative w-6 h-6 -top-2 right-0 mt-3 mr-3 text-gray-600" />
                </div>
              </Grid>
              <Grid item sm={4} xs={0}></Grid>
            </Grid>
          </div>

          <Grid container xs={12} spacing={8}>
            <Grid item>
              <div className="mb-4 md:mb-0">
                <div className="font-bold mb-4 text-[#FFE11B]">Timing</div>
                {times.map((time, index) => (
                  <div key={index} className="mb-4 text-[#FFE11B]">
                    {time}
                  </div>
                ))}
              </div>
            </Grid>
            {/* <div className=""> */}
            {personSelected === 0
              ? members.map((member) => (
                  <Grid item>
                    <div key={member.id} className="col-span-3 font-bold mb-4">
                      {member.name}
                    </div>
                    <div className="mb-4">9:00 AM</div>
                    <div className="mb-4">10:00 AM</div>
                    <div className="mb-4">11:00 AM</div>
                    <div className="mb-4">12:00 AM</div>
                  </Grid>
                ))
              : members
                  .filter((member) => member.id === personSelected)
                  .map((member) => (
                    <Grid item>
                      <div
                        key={member.id}
                        className="col-span-3 font-bold mb-4"
                      >
                        {member.name}
                      </div>
                      <div className="mb-4">9:00 AM</div>
                      <div className="mb-4">10:00 AM</div>
                      <div className="mb-4">11:00 AM</div>
                      <div className="mb-4">12:00 AM</div>
                    </Grid>
                  ))}

            {/* </div> */}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default AppointmentCalendarStore;
