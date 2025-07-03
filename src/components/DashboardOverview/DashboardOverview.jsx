import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaPhotoVideo,
  FaVideo,
  FaDollarSign,
  FaGem,
  FaCoins,
} from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import Swal from "sweetalert2";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../Loader/Loader";
import "./dashboardOverview.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReels: 0,
    nudityPosts: 0,
    nudityReels: 0,
    companyProfit: {
      currentAmount: 0,
      earnedAmount: 0,
      boughtAmount: 0,
      diamonds: 0,
      coins: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const publicIp = "https://api.frenzone.live";
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const statsResponse = await fetch(`${publicIp}/admin/getStats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats");
        }
        const statsData = await statsResponse.json();

        let profitData = dashboardData.companyProfit;
        if (adminId) {
          try {
            const profitResponse = await fetch(
              `${publicIp}/wallet/getWalletAmount/${adminId}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!profitResponse.ok) {
              throw new Error("Failed to fetch profit data");
            }
            const profitResult = await profitResponse.json();
            profitData = profitResult || {
              currentAmount: 0,
              earnedAmount: 0,
              boughtAmount: 0,
              diamonds: 0,
              coins: 0,
            };
          } catch (profitError) {
            console.error("Error fetching profit data:", profitError);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to fetch profit data.",
            });
          }
        }

        setDashboardData({
          totalUsers: statsData.usersCount || 0,
          totalPosts: statsData.postsCount || 0,
          totalReels: statsData.reelsCount || 0,
          nudityPosts: statsData.nudityPostsCount || 0,
          nudityReels: statsData.nudityReelsCount || 0,
          companyProfit: profitData,
        });
        setError(null);
      } catch (error) {
        setError("Failed to fetch dashboard data");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch dashboard data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adminId]);

  // Dashboard items for dynamic card rendering
  const dashboardItems = [
    {
      label: "Total Users",
      value: dashboardData.totalUsers,
      icon: <FaUsers className="dash-card-icon" />,
    },
    {
      label: "Total Posts",
      value: dashboardData.totalPosts,
      icon: <FaPhotoVideo className="dash-card-icon" />,
    },
    {
      label: "Total Reels",
      value: dashboardData.totalReels,
      icon: <FaVideo className="dash-card-icon" />,
    },
    {
      label: "Adult Posts",
      value: dashboardData.nudityPosts,
      icon: <ImBlocked className="dash-card-icon" />,
    },
    {
      label: "Adult Reels",
      value: dashboardData.nudityReels,
      icon: <ImBlocked className="dash-card-icon" />,
    },
    {
      label: "Current Amount",
      value: dashboardData.companyProfit?.currentAmount
        ? `$${dashboardData.companyProfit.currentAmount.toFixed(2)}`
        : "zero",
      icon: <FaDollarSign className="dash-card-icon" />,
    },
    {
      label: "Earned Amount",
      value: dashboardData.companyProfit?.earnedAmount
        ? `$${dashboardData.companyProfit.earnedAmount.toFixed(2)}`
        : "zero",
      icon: <FaDollarSign className="dash-card-icon" />,
    },
    {
      label: "Bought Amount",
      value: dashboardData.companyProfit?.boughtAmount
        ? `$${dashboardData.companyProfit.boughtAmount.toFixed(2)}`
        : "zero",
      icon: <FaDollarSign className="dash-card-icon" />,
    },
    {
      label: "Diamonds",
      value:
        dashboardData.companyProfit?.diamonds !== undefined
          ? dashboardData.companyProfit.diamonds
          : "zero",
      icon: <FaGem className="dash-card-icon" />,
    },
    {
      label: "Coins",
      value:
        dashboardData.companyProfit?.coins !== undefined
          ? dashboardData.companyProfit.coins.toFixed(2)
          : "zero",
      icon: <FaCoins className="dash-card-icon" />,
    },
  ];

  // Bar chart data
  const barChartData = {
    labels: ["Users", "Posts", "Reels", "Adult Posts", "Adult Reels"],
    datasets: [
      {
        label: "Dashboard Metrics",
        data: [
          dashboardData.totalUsers,
          dashboardData.totalPosts,
          dashboardData.totalReels,
          dashboardData.nudityPosts,
          dashboardData.nudityReels,
        ],
        backgroundColor: "rgba(255, 165, 0, 0.7)",
        borderColor: "var(--orange)",
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart data for Profit Breakdown
  const doughnutChartData = {
    labels: [
      "Current Amount",
      "Earned Amount",
      "Bought Amount",
      "Diamonds",
      "Coins",
    ],
    datasets: [
      {
        data: [
          dashboardData.companyProfit?.currentAmount || 0,
          dashboardData.companyProfit?.earnedAmount || 0,
          dashboardData.companyProfit?.boughtAmount || 0,
          dashboardData.companyProfit?.diamonds || 0,
          dashboardData.companyProfit?.coins || 0,
        ],
        backgroundColor: [
          "rgba(255, 165, 0, 0.7)",
          "rgba(128, 128, 128, 0.7)",
          "rgba(255, 255, 255, 0.7)",
          "rgba(0, 0, 0, 0.7)",
          "rgba(255, 165, 0, 0.5)",
        ],
        borderColor: [
          "var(--orange)",
          "var(--grey)",
          "var(--white)",
          "var(--black)",
          "var(--orange)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    animation: {
      duration: 1500,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: {
        labels: {
          font: { family: "Montserrat", size: 14 },
          color: "var(--white)",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="dash-container">
      {loading && <Loader />}
      <div className="dash-container-inner">
        <div className="dash-heading">
          <h2>Dashboard Overview</h2>
        </div>
        {error && <div className="dash-error">{error}</div>}
        <div className="dash-cards">
          {dashboardItems.map((item, index) => (
            <div key={index} className="dash-card dash-animate">
              {item.icon}
              <span className="dash-card-label">{item.label}</span>
              <span className="dash-card-value">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="dash-charts">
          <div className="dash-chart-container dash-animate">
            <h3 className="dash-chart-title">Metrics Breakdown</h3>
            <div className="dash-chart-wrapper">
              <Bar
                data={barChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      ticks: {
                        color: "var(--white)",
                        font: { family: "Montserrat" },
                      },
                    },
                    x: {
                      ticks: {
                        color: "var(--white)",
                        font: { family: "Montserrat" },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="dash-chart-container dash-animate">
            <h3 className="dash-chart-title">Profit Breakdown</h3>
            <div className="dash-chart-wrapper">
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
