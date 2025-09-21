import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Modal from "../components/Modal";

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [trafficFilter, setTrafficFilter] = useState("");
  const [formData, setFormData] = useState({
    routeId: "",
    startLocation: "",
    endLocation: "",
    distanceKm: "",
    trafficLevel: "Low",
    baseTimeMinutes: "",
    isActive: true,
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRoutes();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, trafficFilter]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/routes", {
        params: {
          search: searchTerm,
          traffic: trafficFilter,
        },
      });
      setRoutes(response.data.routes || []);
    } catch (error) {
      toast.error("Failed to fetch routes");
      console.error("Fetch routes error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, formData);
        toast.success("Route updated successfully!");
      } else {
        await api.post("/routes", formData);
        toast.success("Route created successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchRoutes();
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await api.delete(`/routes/${id}`);
        toast.success("Route deleted successfully!");
        fetchRoutes();
      } catch (error) {
        toast.error("Failed to delete route");
      }
    }
  };

  const openModal = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        routeId: route.routeId,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distanceKm: route.distanceKm,
        trafficLevel: route.trafficLevel,
        baseTimeMinutes: route.baseTimeMinutes,
        isActive: route.isActive,
      });
    } else {
      setEditingRoute(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      routeId: "",
      startLocation: "",
      endLocation: "",
      distanceKm: "",
      trafficLevel: "Low",
      baseTimeMinutes: "",
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

  const handleTrafficFilter = (e) => {
    setTrafficFilter(e.target.value);
  };

  const getTrafficColor = (level) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getTrafficIcon = (level) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bi-speedometer";
      case "medium":
        return "bi-speedometer2";
      case "high":
        return "bi-exclamation-triangle";
      default:
        return "bi-question-circle";
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.routeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.startLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.endLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTraffic =
      !trafficFilter || route.trafficLevel === trafficFilter;
    return matchesSearch && matchesTraffic;
  });

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
                        className="bi bi-signpost-2 text-white"
                        style={{ fontSize: "1.8rem" }}
                      ></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1 fw-bold">Routes Management</h1>
                      <p className="text-muted mb-0">
                        Manage delivery routes and optimize logistics
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
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Add Route
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Card */}
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
                  <label className="form-label fw-bold">Search Routes</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search by route ID or locations..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e9ecef",
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">
                    Filter by Traffic
                  </label>
                  <select
                    className="form-select form-select-lg"
                    value={trafficFilter}
                    onChange={handleTrafficFilter}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <option value="">All Traffic Levels</option>
                    <option value="Low">Low Traffic</option>
                    <option value="Medium">Medium Traffic</option>
                    <option value="High">High Traffic</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <div className="d-flex gap-3 w-100">
                    <div className="text-center">
                      <div className="text-primary fw-bold fs-4">
                        {routes.length}
                      </div>
                      <small className="text-muted">Total Routes</small>
                    </div>
                    <div className="text-center">
                      <div className="text-success fw-bold fs-4">
                        {routes.filter((r) => r.isActive).length}
                      </div>
                      <small className="text-muted">Active</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Routes Grid Card */}
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
                  <p className="mt-3 text-muted">Loading routes...</p>
                </div>
              ) : filteredRoutes.length === 0 ? (
                <div className="text-center p-5">
                  <i className="bi bi-signpost display-1 text-muted"></i>
                  <h4 className="mt-3 text-muted">No Routes Found</h4>
                  <p className="text-muted">
                    Add your first route to get started
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredRoutes.map((route, index) => (
                    <div key={route._id || index} className="col-lg-4 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: "15px",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
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
                                background:
                                  "linear-gradient(135deg, #667eea, #764ba2)",
                              }}
                            >
                              <i
                                className="bi bi-geo-alt-fill text-white"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title mb-1 fw-bold">
                                {route.routeId}
                              </h5>
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  className={`badge bg-${getTrafficColor(
                                    route.trafficLevel
                                  )} px-2 py-1`}
                                >
                                  <i
                                    className={`${getTrafficIcon(
                                      route.trafficLevel
                                    )} me-1`}
                                  ></i>
                                  {route.trafficLevel}
                                </span>
                                {!route.isActive && (
                                  <span className="badge bg-secondary">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-geo me-2 text-success"></i>
                              <span className="text-muted small">From:</span>
                              <span className="ms-1 fw-semibold">
                                {route.startLocation}
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-geo-alt me-2 text-danger"></i>
                              <span className="text-muted small">To:</span>
                              <span className="ms-1 fw-semibold">
                                {route.endLocation}
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
                                  {route.distanceKm}km
                                </div>
                                <small className="text-muted">Distance</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div
                                className="text-center p-3 rounded"
                                style={{ background: "#f8f9fa" }}
                              >
                                <div className="fw-bold text-info">
                                  {route.baseTimeMinutes}min
                                </div>
                                <small className="text-muted">Base Time</small>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary flex-fill"
                              onClick={() => openModal(route)}
                              style={{ borderRadius: "10px" }}
                            >
                              <i className="bi bi-pencil-fill me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger flex-fill"
                              onClick={() => deleteRoute(route._id)}
                              style={{ borderRadius: "10px" }}
                            >
                              <i className="bi bi-trash-fill me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editingRoute ? "Edit Route" : "Add New Route"}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Route ID</label>
              <input
                type="text"
                name="routeId"
                className="form-control form-control-lg"
                value={formData.routeId}
                onChange={handleChange}
                required
                style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Traffic Level</label>
              <select
                name="trafficLevel"
                className="form-select form-select-lg"
                value={formData.trafficLevel}
                onChange={handleChange}
                style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Start Location</label>
              <input
                type="text"
                name="startLocation"
                className="form-control form-control-lg"
                value={formData.startLocation}
                onChange={handleChange}
                required
                style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">End Location</label>
              <input
                type="text"
                name="endLocation"
                className="form-control form-control-lg"
                value={formData.endLocation}
                onChange={handleChange}
                required
                style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Distance (km)</label>
              <input
                type="number"
                name="distanceKm"
                className="form-control form-control-lg"
                value={formData.distanceKm}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
                style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Base Time (minutes)</label>
              <input
                type="number"
                name="baseTimeMinutes"
                className="form-control form-control-lg"
                value={formData.baseTimeMinutes}
                onChange={handleChange}
                required
                min="0"
                style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
              />
            </div>
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
                Route is Active
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
              {loading ? "Saving..." : editingRoute ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Routes;
