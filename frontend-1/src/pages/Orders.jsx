import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Modal from "../components/Modal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    orderId: "",
    valueRs: "",
    assignedRoute: "",
    deliveryTimestamp: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchRoutes();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders", {
        params: {
          search: searchTerm,
          status: statusFilter,
        },
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get("/routes");
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingOrder) {
        await api.put(`/orders/${editingOrder._id}`, formData);
        toast.success("Order updated successfully!");
      } else {
        await api.post("/orders", formData);
        toast.success("Order created successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/orders/${id}`);
        toast.success("Order deleted successfully!");
        fetchOrders();
      } catch (error) {
        toast.error("Failed to delete order");
      }
    }
  };

  const openModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        orderId: order.orderId,
        valueRs: order.valueRs,
        assignedRoute: order.assignedRoute?._id || "",
        deliveryTimestamp: order.deliveryTimestamp
          ? new Date(order.deliveryTimestamp).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setEditingOrder(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      orderId: "",
      valueRs: "",
      assignedRoute: "",
      deliveryTimestamp: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "in-progress":
        return "primary";
      case "late":
        return "danger";
      default:
        return "warning";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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
                        className="bi bi-box-seam text-white"
                        style={{ fontSize: "1.8rem" }}
                      ></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1 fw-bold">Orders Management</h1>
                      <p className="text-muted mb-0">
                        Track and manage all delivery orders
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
                    Add Order
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
                <div className="col-md-8">
                  <label className="form-label fw-bold">Search Orders</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search by Order ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e9ecef",
                    }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Filter by Status</label>
                  <select
                    className="form-select form-select-lg"
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="delivered">Delivered</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table Card */}
          <div
            className="card shadow-lg border-0"
            style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    style={{ width: "3rem", height: "3rem" }}
                  ></div>
                  <p className="mt-3 text-muted">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center p-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h4 className="mt-3 text-muted">No Orders Found</h4>
                  <p className="text-muted">
                    Create your first order to get started
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead
                      style={{
                        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      }}
                    >
                      <tr>
                        <th className="border-0 py-3 ps-4 fw-bold">Order ID</th>
                        <th className="border-0 py-3 fw-bold">Value (₹)</th>
                        <th className="border-0 py-3 fw-bold">Route</th>
                        <th className="border-0 py-3 fw-bold">Delivery Time</th>
                        <th className="border-0 py-3 fw-bold">Status</th>
                        <th className="border-0 py-3 text-center fw-bold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr key={order._id || index}>
                          <td className="py-3 ps-4 fw-semibold">
                            {order.orderId}
                          </td>
                          <td className="py-3 text-success fw-semibold">
                            ₹{Number(order.valueRs || 0).toLocaleString()}
                          </td>
                          <td className="py-3">
                            {order.assignedRoute?.routeId || "Not assigned"}
                          </td>
                          <td className="py-3">
                            {order.deliveryTimestamp
                              ? new Date(
                                  order.deliveryTimestamp
                                ).toLocaleString()
                              : "Not scheduled"}
                          </td>
                          <td className="py-3">
                            <span
                              className={`badge bg-${getStatusColor(
                                order.status
                              )} px-3 py-2`}
                            >
                              {order.status || "pending"}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => openModal(order)}
                              style={{ borderRadius: "8px" }}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteOrder(order._id)}
                              style={{ borderRadius: "8px" }}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editingOrder ? "Edit Order" : "Add New Order"}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Order ID</label>
            <input
              type="text"
              name="orderId"
              className="form-control form-control-lg"
              value={formData.orderId}
              onChange={handleChange}
              required
              style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Value (₹)</label>
            <input
              type="number"
              name="valueRs"
              className="form-control form-control-lg"
              value={formData.valueRs}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Assigned Route</label>
            <select
              name="assignedRoute"
              className="form-select form-select-lg"
              value={formData.assignedRoute}
              onChange={handleChange}
              style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
            >
              <option value="">Select a route</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.routeId} - {route.startLocation} to {route.endLocation}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Delivery Timestamp</label>
            <input
              type="datetime-local"
              name="deliveryTimestamp"
              className="form-control form-control-lg"
              value={formData.deliveryTimestamp}
              onChange={handleChange}
              style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
            />
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
              {loading ? "Saving..." : editingOrder ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
