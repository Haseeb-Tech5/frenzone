import React, { useEffect, useState } from "react";
import "./balance.css";
import { useSelector } from "react-redux";

const BalanceOverview = () => {
  const [wallet, setWallet] = useState(null);
  const [withdrawal, setWithdrawal] = useState(null);
  const [error, setError] = useState(null);

  const selectedUser = useSelector((state) => state.user.selectedUser);
  console.log(selectedUser, "selectedUser");
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
    <div className="bal-overview-container">
      <div className="bal-content-wrapper">
        <div className="bal-cards-grid">
          <div className="bal-card bal-card-red">
            <div className="bal-card-content bal-card-wallet">
              <div className="bal-title">Amount Gained</div>
              {wallet ? (
                <div className="bal-data-container">
                  <div className="bal-data-item">
                    <div className="bal-label">Current Amount</div>
                    <div className="bal-value">{wallet.currentAmount}</div>
                  </div>
                  <div className="bal-data-item">
                    <div className="bal-label">Earned Amount</div>
                    <div className="bal-value">{wallet.earnedAmount}</div>
                  </div>
                  <div className="bal-data-item">
                    <div className="bal-label">Bought Amount</div>
                    <div className="bal-value">{wallet.boughtAmount}</div>
                  </div>
                </div>
              ) : (
                <div className="bal-error">No Wallet for this user</div>
              )}
            </div>
          </div>
          <div className="bal-card bal-card-red">
            <div className="bal-card-content bal-card-withdrawal">
              <div className="bal-title">Withdraw Status</div>
              {withdrawal ? (
                <div className="bal-data-container">
                  <div className="bal-data-item">
                    <div className="bal-label">Withdraw Amount</div>
                    <div className="bal-value">{withdrawal.amount}</div>
                  </div>
                  <div className="bal-data-item">
                    <div className="bal-label">Status</div>
                    <div className="bal-value">{withdrawal.status}</div>
                  </div>
                  <div className="bal-data-item">
                    <div className="bal-label">Withdrawal Date</div>
                    <div className="bal-value">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bal-data-item">
                    <div className="bal-label">Withdrawal Time</div>
                    <div className="bal-value">
                      {new Date(withdrawal.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bal-error">
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
