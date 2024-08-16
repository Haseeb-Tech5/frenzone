import React, { useEffect, useState } from "react";
import "./balance.css";
import { useSelector } from "react-redux";

const BalanceOverview = () => {
  const [wallet, setWallet] = useState(null);
  const [withdrawal, setWithdrawal] = useState(null);
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

    const fetchWithdrawalData = async () => {
      try {
        const response = await fetch(
          `https://api.frenzone.live/wallet/getWithdrawById/${selectedUser._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch withdrawal data");
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setWithdrawal(data[0]);
        } else {
          setError("No withdrawal data found for this user");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (selectedUser) {
      fetchWalletData();
      fetchWithdrawalData();
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
                <div className="error-message">No Wallet for this user</div>
              )}
            </div>
          </div>
          <div className="card red blackket-super">
            <div className="data-set-max-flex center-aligned-set">
              <div className="amount-gained">Withdraw Status</div>
              {withdrawal ? (
                <div className="current-amiount-currently-full">
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Withdraw Amount</div>
                    <div className="current-amount-gained cent">
                      {withdrawal.amount}
                    </div>
                  </div>
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Status</div>
                    <div className="current-amount-gained cent">
                      {withdrawal.status}
                    </div>
                  </div>
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Withdrawal Date</div>
                    <div className="current-amount-gained cent">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="current-amiount-currently">
                    <div className="current-amount cent">Withdrawal Time</div>
                    <div className="current-amount-gained cent">
                      {new Date(withdrawal.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="error-message">
                  No withdrawal data found for this user
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceOverview;
