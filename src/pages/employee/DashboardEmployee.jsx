import React, { useState } from "react";
import "./dashboard.css";
import ResponsivePaginatedTable from "../../../src/Paginated/Paginated";
import Paginated from "../../../src/Paginated/Paginated";

const DashboardEmployee = () => {
  const [data, setData] = useState([]);

  return (
    <>
      <Paginated data={data} />
    </>
  );
};

export default DashboardEmployee;
