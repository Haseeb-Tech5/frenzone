import React, { useState } from "react";
import DrwalTable from "./DrwalTable";

const Drwal = () => {
  const [data, setData] = useState([]);
  return (
    <>
      <DrwalTable data={data} />
    </>
  );
};

export default Drwal;
