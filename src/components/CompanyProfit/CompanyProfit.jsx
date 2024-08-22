import React, { useState, useEffect } from "react";
import "./profit.css";

const CompanyProfit = () => {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await fetch(
          `https://api.frenzone.live/wallet/getWalletAmount/${adminId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProfitData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfitData();
  }, [adminId]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-container-contained">
        <div className="heading-contained">
          <h2>Company Profit</h2>
        </div>
        <div className="profit-details">
          {loading && (
            <div className="spinner-set">
              <div className="spinner"></div>
            </div>
          )}
          {error && <div>Error: {error}</div>}
          {profitData ? (
            <div className="class-profit-complete-section">
              <div className="profit-item">
                <span className="profit-label">Current Amount:</span>
                <span className="profit-value">
                  $
                  {profitData.currentAmount
                    ? profitData.currentAmount.toFixed(8)
                    : "zero"}
                </span>
              </div>
              <div className="profit-item">
                <span className="profit-label">Earned Amount:</span>
                <span className="profit-value">
                  $
                  {profitData.earnedAmount
                    ? profitData.earnedAmount.toFixed(8)
                    : "zero"}
                </span>
              </div>
              <div className="profit-item">
                <span className="profit-label">Bought Amount:</span>
                <span className="profit-value">
                  {profitData.boughtAmount
                    ? `$${profitData.boughtAmount.toFixed(8)}`
                    : "0"}
                </span>
              </div>
              <div className="profit-item">
                <span className="profit-label">Diamonds:</span>
                <span className="profit-value">
                  {profitData.diamonds !== undefined
                    ? profitData.diamonds
                    : "zero"}
                </span>
              </div>
              <div className="profit-item">
                <span className="profit-label">Coins:</span>
                <span className="profit-value">
                  {profitData.coins !== undefined ? profitData.coins : "zero"}
                </span>
              </div>
            </div>
          ) : (
            !loading && <div>No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfit;
