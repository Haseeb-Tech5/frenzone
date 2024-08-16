import React, { useState } from "react";
import DrwalTable from "./DrwalTable";

const Drwal = () => {
  const [data, setData] = useState([]);
  return (
    <div className="dashboard-container">
      <div className="dashboard-container-contained">
        <div className="heading-contained">
          <h2>Withdrawals</h2>
        </div>
        <DrwalTable data={data} />
      </div>
    </div>
  );
};

export default Drwal;
