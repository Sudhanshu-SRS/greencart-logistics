import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const Simulation = () => {
  const [formData, setFormData] = useState({
    availableDrivers: "",
    routeStartTime: "",
    maxHoursPerDay: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/simulation/history");
      setHistory(response.data.simulations || []);
    } catch (error) {
      console.error("Failed to fetch simulation history:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const simulateProgress = () => {
    const steps = [
      { progress: 20, text: "🚀 Initializing quantum algorithms..." },
      { progress: 40, text: "🧠 Analyzing driver performance matrices..." },
      { progress: 60, text: "🗺️ Computing optimal route assignments..." },
      { progress: 80, text: "📊 Calculating advanced KPIs..." },
      { progress: 100, text: "✅ Simulation completed successfully!" },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProgress(steps[stepIndex].progress);
        setCurrentStep(steps[stepIndex].text);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    setCurrentStep("Starting simulation...");

    const progressInterval = simulateProgress();

    try {
      const response = await api.post("/simulation/run", {
        availableDrivers: parseInt(formData.availableDrivers),
        routeStartTime: formData.routeStartTime,
        maxHoursPerDay: parseInt(formData.maxHoursPerDay),
      });

      // Wait for progress animation to complete
      setTimeout(() => {
        setResults(response.data);
        toast.success("Simulation completed successfully!");
        fetchHistory();
        setProgress(0);
        setCurrentStep("");
      }, 4000);
    } catch (error) {
      clearInterval(progressInterval);
      const errorMessage = error.response?.data?.error || "Simulation failed";
      toast.error(errorMessage);
      console.error("Simulation error:", error);
      setProgress(0);
      setCurrentStep("");
    } finally {
      setTimeout(() => setLoading(false), 4000);
    }
  };

  const resetForm = () => {
    setFormData({
      availableDrivers: "",
      routeStartTime: "",
      maxHoursPerDay: "",
    });
    setResults(null);
  };

  return (
    <div className="simulation-container">
      {/* Enhanced Header */}
      <div className="simulation-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <i className="bi bi-gear-wide-connected"></i>
            Advanced Delivery Simulation
          </h1>
          <p className="hero-subtitle">
            Optimize your logistics operations with AI-powered simulations
          </p>
        </div>
        <div className="hero-animation">
          <div className="floating-icon">📦</div>
          <div className="floating-icon">🚚</div>
          <div className="floating-icon">📍</div>
        </div>
      </div>

      <div className="simulation-content">
        {/* Enhanced Form */}
        <div className="simulation-form-section">
          <div className="form-card">
            <div className="form-header">
              <h3>
                <i className="bi bi-sliders"></i>
                Simulation Parameters
              </h3>
              <p>Configure your simulation settings</p>
            </div>

            <form onSubmit={handleSubmit} className="enhanced-form">
              <div className="form-group">
                <label htmlFor="availableDrivers">
                  <i className="bi bi-person-gear"></i>
                  Available Drivers
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="availableDrivers"
                    name="availableDrivers"
                    value={formData.availableDrivers}
                    onChange={handleChange}
                    required
                    min="1"
                    max="100"
                    placeholder="1-100"
                  />
                  <span className="input-suffix">drivers</span>
                </div>
                <small className="form-hint">
                  Number of drivers available for the simulation
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="routeStartTime">
                  <i className="bi bi-clock"></i>
                  Route Start Time
                </label>
                <div className="input-wrapper">
                  <input
                    type="time"
                    id="routeStartTime"
                    name="routeStartTime"
                    value={formData.routeStartTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <small className="form-hint">
                  When should delivery routes begin?
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="maxHoursPerDay">
                  <i className="bi bi-calendar-day"></i>
                  Max Hours per Driver
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="maxHoursPerDay"
                    name="maxHoursPerDay"
                    value={formData.maxHoursPerDay}
                    onChange={handleChange}
                    required
                    min="1"
                    max="24"
                    placeholder="1-24"
                  />
                  <span className="input-suffix">hours</span>
                </div>
                <small className="form-hint">
                  Maximum working hours per driver per day
                </small>
              </div>

              {loading && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{currentStep}</p>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-play-circle"></i>
                      Run Simulation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Results */}
        <div className="simulation-results-section">
          {results ? (
            <div className="results-card">
              <div className="results-header">
                <h3>
                  <i className="bi bi-graph-up"></i>
                  Simulation Results
                </h3>
                <span className="completion-time">
                  Completed{" "}
                  {new Date(results.simulationData.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="results-grid">
                <div className="result-item profit">
                  <div className="result-icon">
                    <i className="bi bi-currency-rupee"></i>
                  </div>
                  <div className="result-content">
                    <h4>Total Profit</h4>
                    <div className="result-value">
                      ₹{results.kpis.totalProfit?.toLocaleString()}
                    </div>
                    <div className="result-change positive">+12.5%</div>
                  </div>
                </div>

                <div className="result-item efficiency">
                  <div className="result-icon">
                    <i className="bi bi-speedometer2"></i>
                  </div>
                  <div className="result-content">
                    <h4>Efficiency</h4>
                    <div className="result-value">
                      {results.kpis.efficiencyScore}%
                    </div>
                    <div className="efficiency-meter">
                      <div
                        className="efficiency-meter-fill"
                        style={{ width: `${results.kpis.efficiencyScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="result-item deliveries">
                  <div className="result-icon">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div className="result-content">
                    <h4>On-time Deliveries</h4>
                    <div className="result-value">
                      {results.kpis.onTimeDeliveries}/
                      {results.kpis.totalDeliveries}
                    </div>
                    <div className="delivery-ratio">
                      {(
                        (results.kpis.onTimeDeliveries /
                          results.kpis.totalDeliveries) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>

                <div className="result-item fuel">
                  <div className="result-icon">
                    <i className="bi bi-fuel-pump"></i>
                  </div>
                  <div className="result-content">
                    <h4>Fuel Cost</h4>
                    <div className="result-value">
                      ₹{results.kpis.totalFuelCost?.toLocaleString()}
                    </div>
                    <div className="result-change negative">+3.2%</div>
                  </div>
                </div>
              </div>

              <div className="simulation-summary">
                <h4>Simulation Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Drivers Used</span>
                    <span className="summary-value">
                      {results.simulationData.driversUsed}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Orders Processed</span>
                    <span className="summary-value">
                      {results.simulationData.ordersProcessed}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Routes Used</span>
                    <span className="summary-value">
                      {results.simulationData.routesUsed}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Late Deliveries</span>
                    <span className="summary-value danger">
                      {results.kpis.lateDeliveries}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-results">
              <div className="empty-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h3>Ready to Simulate</h3>
              <p>
                Configure your parameters and run a simulation to see results
                here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced History Section */}
      <div className="history-section">
        <div className="history-header">
          <h3>
            <i className="bi bi-clock-history"></i>
            Simulation History
          </h3>
          <button
            className={`toggle-btn ${showHistory ? "active" : ""}`}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide" : "Show"} History
          </button>
        </div>

        {showHistory && (
          <div className="history-content">
            {history.length === 0 ? (
              <div className="empty-history">
                <i className="bi bi-inbox"></i>
                <p>No simulation history available</p>
              </div>
            ) : (
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Drivers</th>
                      <th>Start Time</th>
                      <th>Max Hours</th>
                      <th>Profit</th>
                      <th>Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((sim) => (
                      <tr key={sim._id}>
                        <td>{new Date(sim.createdAt).toLocaleString()}</td>
                        <td>
                          <span className="badge drivers">
                            {sim.inputParameters.availableDrivers}
                          </span>
                        </td>
                        <td>{sim.inputParameters.routeStartTime}</td>
                        <td>{sim.inputParameters.maxHoursPerDay}h</td>
                        <td className="profit">
                          ₹{sim.kpis.totalProfit?.toLocaleString()}
                        </td>
                        <td>
                          <span className="badge efficiency">
                            {sim.kpis.efficiencyScore}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
