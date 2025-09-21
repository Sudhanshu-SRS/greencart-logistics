import React, { useState, useEffect } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import api from "../services/api";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeDrivers: 0,
    completedOrders: 0,
    totalRoutes: 0,
  });
  const [chartData, setChartData] = useState({
    orderTrends: [],
    driverStatus: [],
    routeMetrics: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7");

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch various statistics
      const [ordersRes, driversRes, routesRes] = await Promise.all([
        api.get("/orders"),
        api.get("/drivers"),
        api.get("/routes"),
      ]);

      const orders = ordersRes.data.orders || [];
      const drivers = driversRes.data.drivers || [];
      const routes = routesRes.data.routes || [];

      // Calculate stats
      const newStats = {
        totalOrders: orders.length,
        activeDrivers: drivers.filter(d => d.status === "Active").length,
        completedOrders: orders.filter(o => o.status === "Delivered").length,
        totalRoutes: routes.filter(r => r.isActive).length,
      };

      setStats(newStats);

      // Prepare chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }).reverse();

      const orderTrendData = {
        labels: last7Days,
        datasets: [
          {
            label: "Orders",
            data: last7Days.map(() => Math.floor(Math.random() * 20) + 5),
            borderColor: "rgb(102, 126, 234)",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Deliveries",
            data: last7Days.map(() => Math.floor(Math.random() * 15) + 3),
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      const driverStatusData = {
        labels: ["Active", "Fatigued", "Overtime", "Inactive"],
        datasets: [
          {
            data: [
              drivers.filter(d => d.status === "Active").length,
              drivers.filter(d => d.status === "Fatigued").length,
              drivers.filter(d => d.status === "Overtime").length,
              drivers.filter(d => d.status === "Inactive").length,
            ],
            backgroundColor: [
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#6b7280",
            ],
            borderWidth: 0,
          },
        ],
      };

      const routeMetricsData = {
        labels: ["Low Traffic", "Medium Traffic", "High Traffic"],
        datasets: [
          {
            label: "Routes",
            data: [
              routes.filter(r => r.trafficLevel === "Low").length,
              routes.filter(r => r.trafficLevel === "Medium").length,
              routes.filter(r => r.trafficLevel === "High").length,
            ],
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(251, 191, 36, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: [
              "rgb(34, 197, 94)",
              "rgb(251, 191, 36)",
              "rgb(239, 68, 68)",
            ],
            borderWidth: 2,
          },
        ],
      };

      setChartData({
        orderTrends: orderTrendData,
        driverStatus: driverStatusData,
        routeMetrics: routeMetricsData,
      });

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 12,
            weight: "bold",
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 1800,
      easing: "easeInOutQuart",
    },
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        className="card h-100 border-0 shadow-lg"
        style={{
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "60px",
                height: "60px",
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              }}
            >
              <i className={`${icon} text-white`} style={{ fontSize: "1.8rem" }}></i>
            </div>
            <div>
              <h3 className="mb-0 fw-bold" style={{ color: color }}>
                {value}
              </h3>
              <p className="text-muted mb-0 fw-semibold">{title}</p>
              {subtitle && (
                <small className="text-muted">{subtitle}</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card shadow-lg border-0"
            style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                      }}
                    >
                      <i className="bi bi-speedometer2 text-white" style={{ fontSize: "1.8rem" }}></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1 fw-bold">Dashboard Overview</h1>
                      <p className="text-muted mb-0">Monitor your logistics operations in real-time</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <select
                    className="form-select form-select-lg"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                  >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-white" style={{ width: "3rem", height: "3rem" }}></div>
          <p className="mt-3 text-white fs-5">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="row mb-4">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon="bi bi-box-seam"
              color="#667eea"
              subtitle="All time orders"
            />
            <StatCard
              title="Active Drivers"
              value={stats.activeDrivers}
              icon="bi bi-person-check"
              color="#10b981"
              subtitle="Currently available"
            />
            <StatCard
              title="Completed Orders"
              value={stats.completedOrders}
              icon="bi bi-check2-circle"
              color="#22c55e"
              subtitle="Successfully delivered"
            />
            <StatCard
              title="Active Routes"
              value={stats.totalRoutes}
              icon="bi bi-signpost-2"
              color="#f59e0b"
              subtitle="Available routes"
            />
          </div>

          {/* Charts Row */}
          <div className="row">
            {/* Order Trends Chart */}
            <div className="col-lg-8 mb-4">
              <div
                className="card shadow-lg border-0 h-100"
                style={{
                  borderRadius: "20px",
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="card-title text-white fw-bold mb-4">
                    <i className="bi bi-graph-up me-2"></i>
                    Order Trends & Deliveries
                  </h5>
                  <div style={{ height: "300px", position: "relative" }}>
                    {chartData.orderTrends.labels ? (
                      <Line data={chartData.orderTrends} options={lineChartOptions} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="spinner-border text-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Status Chart */}
            <div className="col-lg-4 mb-4">
              <div
                className="card shadow-lg border-0 h-100"
                style={{
                  borderRadius: "20px",
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="card-title text-white fw-bold mb-4">
                    <i className="bi bi-people me-2"></i>
                    Driver Status
                  </h5>
                  <div style={{ height: "300px", position: "relative" }}>
                    {chartData.driverStatus.labels ? (
                      <Doughnut data={chartData.driverStatus} options={doughnutOptions} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="spinner-border text-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Metrics Chart */}
          <div className="row">
            <div className="col-12">
              <div
                className="card shadow-lg border-0"
                style={{
                  borderRadius: "20px",
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="card-title text-white fw-bold mb-4">
                    <i className="bi bi-bar-chart me-2"></i>
                    Route Traffic Distribution
                  </h5>
                  <div style={{ height: "250px", position: "relative" }}>
                    {chartData.routeMetrics.labels ? (
                      <Bar data={chartData.routeMetrics} options={barChartOptions} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="spinner-border text-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
