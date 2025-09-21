import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "manager",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      toast.success("Registration successful! Welcome to GreenCart!");
      navigate("/dashboard");
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "Inter, sans-serif"
    }}>
      <div className="card shadow-lg border-0" style={{
        maxWidth: "500px",
        width: "100%",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)"
      }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea, #764ba2) !important"
            }}>
              <i className="bi bi-person-plus-fill text-white" style={{fontSize: "2rem"}}></i>
            </div>
            <h2 className="mt-3 mb-2 fw-bold">Join GreenCart</h2>
            <p className="text-muted">Create your logistics management account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="bi bi-person-fill me-2 text-primary"></i>
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-control form-control-lg"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a unique username"
                style={{borderRadius: "12px", border: "2px solid #e9ecef"}}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                style={{borderRadius: "12px", border: "2px solid #e9ecef"}}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="bi bi-person-badge-fill me-2 text-primary"></i>
                Role
              </label>
              <select
                name="role"
                className="form-select form-select-lg"
                value={formData.role}
                onChange={handleChange}
                required
                style={{borderRadius: "12px", border: "2px solid #e9ecef"}}
              >
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                <i className="bi bi-lock-fill me-2 text-primary"></i>
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control form-control-lg"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  style={{borderRadius: "12px", border: "2px solid #e9ecef", paddingRight: "50px"}}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{border: "none", background: "none"}}
                >
                  <i className={`bi bi-eye${showPassword ? "-slash" : ""}-fill text-muted`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lg w-100 text-white fw-bold"
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                border: "none",
                borderRadius: "12px",
                padding: "12px"
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 p-3 rounded" style={{background: "#f8f9fa"}}>
            <p className="mb-0 text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none fw-bold" style={{color: "#667eea"}}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
