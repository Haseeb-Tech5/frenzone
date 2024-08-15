import React, { useEffect, useState } from "react";
import "./balance.css";
import { useSelector } from "react-redux";

const BalanceOverview = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const selectedUser = useSelector((state) => state.user.selectedUser);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch(
          `https://api.frenzone.live/wallet/getWalletAmount/${selectedUser._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        if (data.currentAmount !== undefined) {
          setWallet(data);
        } else {
          setError("There is no wallet for this user");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (selectedUser) {
      fetchWalletData();
    }
  }, [selectedUser]);

  return (
    <div className="container2-sett">
      <div className="container-set-max-flex">
        <div className="cards">
          <div className="card red blackket-super">
            <div className="data-set-max-flex center-aligned-set">
              <div className="amount-gained">Amount Gained</div>
              {wallet ? (
                <div className="current-amiount-currently-full">
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Current Amount</div>
                    <div className="current-amount-gained cent">
                      {wallet.currentAmount}
                    </div>
                  </div>
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Earned Amount</div>
                    <div className="current-amount-gained cent">
                      {wallet.earnedAmount}
                    </div>
                  </div>
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Bought Amount</div>
                    <div className="current-amount-gained cent">
                      {wallet.boughtAmount}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="error-message">{error}</div>
              )}
            </div>
          </div>
          <div className="card blue">
            <div className="data-set-max-flex">
              <h1>Withdraw</h1>
              <h1 style={{ color: "red" }}>50</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceOverview;
