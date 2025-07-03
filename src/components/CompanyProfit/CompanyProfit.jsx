import React, { useState, useEffect } from "react";
import { FaDollarSign, FaGem, FaCoins } from "react-icons/fa";
import Swal from "sweetalert2";
import "./profit.css";
import Loader from "../Loader/Loader";

const CompanyProfit = () => {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchProfitData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.frenzone.live/wallet/getWalletAmount/${adminId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProfitData(data); // Set data directly since API response is valid
        setError(null);
      } catch (error) {
        setError("Failed to fetch profit data");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch profit data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfitData();
  }, [adminId]);

  const profitItems = [
    {
      label: "Current Amount",
      value: profitData?.currentAmount
        ? `$${profitData.currentAmount.toFixed(8)}`
        : "zero",
      icon: <FaDollarSign className="profit-card-icon" />,
    },
    {
      label: "Earned Amount",
      value: profitData?.earnedAmount
        ? `$${profitData.earnedAmount.toFixed(8)}`
        : "zero",
      icon: <FaDollarSign className="profit-card-icon" />,
    },
    {
      label: "Bought Amount",
      value: profitData?.boughtAmount
        ? `$${profitData.boughtAmount.toFixed(8)}`
        : "zero",
      icon: <FaDollarSign className="profit-card-icon" />,
    },
    {
      label: "Diamonds",
      value: profitData?.diamonds !== undefined ? profitData.diamonds : "zero",
      icon: <FaGem className="profit-card-icon" />,
    },
    {
      label: "Coins",
      value: profitData?.coins !== undefined ? profitData.coins : "zero",
      icon: <FaCoins className="profit-card-icon" />,
    },
  ];

  return (
    <div className="profit-container">
      {loading && <Loader />}
      <div className="profit-container-inner">
        <div className="profit-heading">
          <h2>Company Profit</h2>
        </div>
        {error && <div className="profit-error">{error}</div>}
        {profitData ? (
          <div className="profit-cards">
            {profitItems.map((item, index) => (
              <div key={index} className="profit-card profit-animate">
                {item.icon}
                <span className="profit-card-label">{item.label}</span>
                <span className="profit-card-value">{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          !loading && <div className="profit-no-data">No data available</div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfit;
