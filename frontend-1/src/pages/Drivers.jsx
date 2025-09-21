import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Modal from "../components/Modal";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    fatigued: 0,
    inactive: 0,
    overtime: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    currentShiftHours: "",
    past7DayWorkHours: "",
    isActive: true,
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDrivers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/drivers", {
        params: { search: searchTerm },
      });
      setDrivers(response.data.drivers || []);
      setStats(response.data.stats || stats);
    } catch (error) {
      toast.error("Failed to fetch drivers");
      console.error("Fetch drivers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDriver) {
        await api.put(`/drivers/${editingDriver._id}`, formData);
        toast.success("Driver updated successfully!");
      } else {
        await api.post("/drivers", formData);
        toast.success("Driver created successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await api.delete(`/drivers/${id}`);
        toast.success("Driver deleted successfully!");
        fetchDrivers();
      } catch (error) {
        toast.error("Failed to delete driver");
      }
    }
  };

  const openModal = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        currentShiftHours: driver.currentShiftHours,
        past7DayWorkHours: driver.past7DayWorkHours,
        isActive: driver.isActive,
      });
    } else {
      setEditingDriver(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      currentShiftHours: "",
      past7DayWorkHours: "",
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getDriverStatus = (driver) => {
    if (!driver.isActive) return { status: "Inactive", color: "secondary" };
    if (driver.isFatigued) return { status: "Fatigued", color: "warning" };
    if (driver.currentShiftHours > 8)
      return { status: "Overtime", color: "danger" };
    return { status: "Active", color: "success" };
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="row">
        <div className="col-12">
          {/* Header Card */}
          <div
            className="card shadow-lg border-0 mb-4"
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
                      <i
                        className="bi bi-person-gear text-white"
                        style={{ fontSize: "1.8rem" }}
                      ></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1 fw-bold">Drivers Management</h1>
                      <p className="text-muted mb-0">
                        Manage your delivery team efficiently
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button
                    className="btn btn-lg text-white fw-bold"
                    onClick={() => openModal()}
                    style={{
                      background: "linear-gradient(45deg, #28a745, #20c997)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  >
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Add Driver
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div
            className="card shadow-lg border-0 mb-4"
            style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Search Drivers</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search by driver name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e9ecef",
                    }}
                  />
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="d-flex gap-3 w-100">
                    <div className="text-center">
                      <div className="text-primary fw-bold fs-4">
                        {stats.total}
                      </div>
                      <small className="text-muted">Total Drivers</small>
                    </div>
                    <div className="text-center">
                      <div className="text-success fw-bold fs-4">
                        {stats.active}
                      </div>
                      <small className="text-muted">Active</small>
                    </div>
                    <div className="text-center">
                      <div className="text-warning fw-bold fs-4">
                        {stats.fatigued}
                      </div>
                      <small className="text-muted">Fatigued</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drivers Grid Card */}
          <div
            className="card shadow-lg border-0"
            style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    style={{ width: "3rem", height: "3rem" }}
                  ></div>
                  <p className="mt-3 text-muted">Loading drivers...</p>
                </div>
              ) : filteredDrivers.length === 0 ? (
                <div className="text-center p-5">
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h4 className="mt-3 text-muted">No Drivers Found</h4>
                  <p className="text-muted">
                    Add your first driver to get started
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredDrivers.map((driver, index) => {
                    const driverStatus = getDriverStatus(driver);
                    return (
                      <div
                        key={driver._id || index}
                        className="col-lg-4 col-md-6"
                      >
                        <div
                          className="card h-100 border-0 shadow-sm"
                          style={{
                            borderRadius: "15px",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-5px)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 30px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 10px rgba(0,0,0,0.1)";
                          }}
                        >
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  background: `linear-gradient(135deg, ${
                                    driverStatus.color === "success"
                                      ? "#28a745, #20c997"
                                      : driverStatus.color === "warning"
                                      ? "#ffc107, #fd7e14"
                                      : driverStatus.color === "danger"
                                      ? "#dc3545, #e83e8c"
                                      : "#6c757d, #adb5bd"
                                  })`,
                                }}
                              >
                                <i
                                  className="bi bi-person-fill text-white"
                                  style={{ fontSize: "1.5rem" }}
                                ></i>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title mb-1 fw-bold">
                                  {driver.name}
                                </h5>
                                <span
                                  className={`badge bg-${driverStatus.color} px-2 py-1`}
                                >
                                  {driverStatus.status}
                                </span>
                              </div>
                            </div>

                            <div className="row g-3 mb-4">
                              <div className="col-6">
                                <div
                                  className="text-center p-3 rounded"
                                  style={{ background: "#f8f9fa" }}
                                >
                                  <div className="fw-bold text-primary">
                                    {driver.currentShiftHours || 0}h
                                  </div>
                                  <small className="text-muted">
                                    Current Shift
                                  </small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div
                                  className="text-center p-3 rounded"
                                  style={{ background: "#f8f9fa" }}
                                >
                                  <div className="fw-bold text-info">
                                    {driver.past7DayWorkHours || 0}h
                                  </div>
                                  <small className="text-muted">
                                    Past 7 Days
                                  </small>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary flex-fill"
                                onClick={() => openModal(driver)}
                                style={{ borderRadius: "10px" }}
                              >
                                <i className="bi bi-pencil-fill me-1"></i>
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger flex-fill"
                                onClick={() => deleteDriver(driver._id)}
                                style={{ borderRadius: "10px" }}
                              >
                                <i className="bi bi-trash-fill me-1"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editingDriver ? "Edit Driver" : "Add New Driver"}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Driver Name</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-lg"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "2px solid #e9ecef",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Current Shift Hours</label>
            <input
              type="number"
              name="currentShiftHours"
              className="form-control form-control-lg"
              value={formData.currentShiftHours}
              onChange={handleChange}
              min="0"
              max="24"
              step="0.5"
              style={{
                borderRadius: "12px",
                border: "2px solid #e9ecef",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Past 7 Day Work Hours</label>
            <input
              type="number"
              name="past7DayWorkHours"
              className="form-control form-control-lg"
              value={formData.past7DayWorkHours}
              onChange={handleChange}
              min="0"
              max="168"
              step="0.5"
              style={{
                borderRadius: "12px",
                border: "2px solid #e9ecef",
              }}
            />
          </div>
          <div className="mb-4">
            <div className="form-check form-switch">
              <input
                type="checkbox"
                name="isActive"
                className="form-check-input"
                checked={formData.isActive}
                onChange={handleChange}
                style={{ transform: "scale(1.2)" }}
              />
              <label className="form-check-label fw-bold ms-2">
                Driver is Active
              </label>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
              style={{ borderRadius: "12px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn text-white fw-bold"
              disabled={loading}
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                border: "none",
                borderRadius: "12px",
              }}
            >
              {loading ? "Saving..." : editingDriver ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Drivers;
