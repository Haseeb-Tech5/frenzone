// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// // @mui
// import Grid from "@mui/material/Grid";
// // react icons
// import { MdHome } from "react-icons/md";
// import { SiGoogleanalytics } from "react-icons/si";
// import { IoMdPerson } from "react-icons/io";
// import { FaFileInvoice } from "react-icons/fa";
// import { IoStorefrontOutline, IoCartOutline } from "react-icons/io5";
// import { MdOutlineCalendarMonth } from "react-icons/md";
// import { BsPersonBadgeFill } from "react-icons/bs";
// import { BiMessageDetail } from "react-icons/bi";
// import { GiHamburgerMenu } from "react-icons/gi";
// import WebChatModal from "../components/WebChatModal";
// const StoreAdmin = ({ children }) => {
//   const [activeItem, setActiveItem] = useState("");
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   useEffect(() => {
//     let activePage = window.location.href.split("/")[4];
//     if (activePage.includes("-")) {
//       activePage = activePage.replace(/-/g, " ");
//     }
//     console.log("active Page", activePage);
//     setActiveItem(activePage);
//     console.log("activeItem", activeItem);
//   }, [activeItem]);
//   return (
//     <div className="flex">
//       <aside className="hidden md:block min-w-[280px] w-[280px] py-8 h-[100vh]">
//         <Grid item xs={12} align="center" className="fixed pl-8 w-[280px]">
//           <div className="pr-8">
//             <img
//               src={require("../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png")}
//               width="170px"
//               alt=""
//             />
//           </div>
//           <div className="mt-16">
//             <Link to="/store-admin/dashboard">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "dashboard"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("dashboard")}
//               >
//                 <MdHome
//                   className={`text-[24px] ${
//                     activeItem == "dashboard"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "dashboard"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Dashboard
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/reports">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "reports" ? "border-r-2 border-r-[#FFE11B]" : ""
//                 }`}
//                 onClick={() => setActiveItem("reports")}
//               >
//                 <SiGoogleanalytics
//                   className={`text-[24px] ${
//                     activeItem == "reports"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "reports"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Reports
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/manage-employees">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "manage employees"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("manage employees")}
//               >
//                 <IoMdPerson
//                   className={`text-[24px] ${
//                     activeItem == "manage employees"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "manage employees"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Manage Employees
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/manage-orders">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "manage orders"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("manage orders")}
//               >
//                 <FaFileInvoice
//                   className={`text-[24px] ${
//                     activeItem == "manage orders"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "manage orders"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Manage Orders
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/appointment-calendar">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "appointment calendar"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("appointment calendar")}
//               >
//                 <MdOutlineCalendarMonth
//                   className={`text-[24px] ${
//                     activeItem == "appointment calendar"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "appointment calendar"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Appointment Calendar
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/profile">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "profile" ? "border-r-2 border-r-[#FFE11B]" : ""
//                 }`}
//                 onClick={() => setActiveItem("profile")}
//               >
//                 <BsPersonBadgeFill
//                   className={`text-[24px] ${
//                     activeItem == "profile"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "profile"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Profile
//                 </span>
//               </div>
//             </Link>
//           </div>
//           <div className="text-center mt-16 flex justify-center -ml-8">
//             <div
//               className="rounded-full bg-[#FFE11B] p-4 w-16 h-16 cursor-pointer"
//               onClick={() => setOpen(!open)}
//             >
//               <BiMessageDetail className="text-[32px]" />
//             </div>
//             <WebChatModal setOpenModal={setOpen} modalOpen={open} />
//           </div>
//           <Link to="/login">
//             <button className="text-center mt-6 -ml-8 bg-[#FFE11B] text-[#292828] rounded-full px-10 py-2">
//               Logout
//             </button>
//           </Link>
//         </Grid>
//       </aside>
//       <header className="flex z-[99999] md:hidden fixed bg-white shadow-md flex items-center w-[100vw] py-3 px-4 justify-between">
//         <img
//           src={require("../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png")}
//           width="120px"
//           alt="logo"
//         />
//         <GiHamburgerMenu
//           className="text-[25px]"
//           onClick={() => setSidebarOpen(!isSidebarOpen)}
//         />
//       </header>
//       <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
//         <Grid item xs={12} align="center" className="fixed pl-8 w-[280px]">
//           <div className="pr-8 mt-4">
//             <img
//               src={require("../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png")}
//               width="170px"
//               alt=""
//             />
//           </div>
//           <div className="mt-16">
//             <Link to="/store-admin/dashboard">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "dashboard"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("dashboard")}
//               >
//                 <MdHome
//                   className={`text-[24px] ${
//                     activeItem == "dashboard"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "dashboard"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Dashboard
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/reports">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "reports" ? "border-r-2 border-r-[#FFE11B]" : ""
//                 }`}
//                 onClick={() => setActiveItem("reports")}
//               >
//                 <SiGoogleanalytics
//                   className={`text-[24px] ${
//                     activeItem == "reports"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "reports"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Reports
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/manage-employees">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "manage employees"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("manage employees")}
//               >
//                 <IoMdPerson
//                   className={`text-[24px] ${
//                     activeItem == "manage employees"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "manage employees"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Manage Employees
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/manage-orders">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "manage orders"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("manage orders")}
//               >
//                 <FaFileInvoice
//                   className={`text-[24px] ${
//                     activeItem == "manage orders"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "manage orders"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Manage Orders
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/appointment-calendar">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "appointment calendar"
//                     ? "border-r-2 border-r-[#FFE11B]"
//                     : ""
//                 }`}
//                 onClick={() => setActiveItem("appointment calendar")}
//               >
//                 <MdOutlineCalendarMonth
//                   className={`text-[24px] ${
//                     activeItem == "appointment calendar"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "appointment calendar"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Appointment Calendar
//                 </span>
//               </div>
//             </Link>
//             <Link to="/store-admin/profile">
//               <div
//                 className={`flex items-center w-[100%] my-8 ${
//                   activeItem == "profile" ? "border-r-2 border-r-[#FFE11B]" : ""
//                 }`}
//                 onClick={() => setActiveItem("profile")}
//               >
//                 <BsPersonBadgeFill
//                   className={`text-[24px] ${
//                     activeItem == "profile"
//                       ? "text-[#FFE11B]"
//                       : "text-[#A3AED0]"
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] ml-3 ${
//                     activeItem == "profile"
//                       ? "text-[#2B3674] font-[700]"
//                       : "text-[#A3AED0] font-[500]"
//                   }`}
//                 >
//                   Profile
//                 </span>
//               </div>
//             </Link>
//           </div>
//           <div className="text-center mt-16 flex justify-center -ml-8">
//             <div
//               className="rounded-full bg-[#FFE11B] p-4 w-16 h-16 cursor-pointer"
//               onClick={() => {
//                 setSidebarOpen(false);
//                 setOpen(!open);
//               }}
//             >
//               <BiMessageDetail className="text-[32px]" />
//             </div>
//             <WebChatModal setOpenModal={setOpen} modalOpen={open} />
//           </div>
//           <Link to="/login">
//             <button className="text-center mt-6 -ml-8 bg-[#FFE11B] text-[#292828] rounded-full px-10 py-2">
//               Logout
//             </button>
//           </Link>
//         </Grid>
//       </nav>
//       <div className="w-[100%] mt-8 md:mt-0">{children}</div>
//     </div>
//   );
// };

// export default StoreAdmin;
