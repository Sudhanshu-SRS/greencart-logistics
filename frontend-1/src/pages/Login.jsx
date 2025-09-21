import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Update time every second for dynamic greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12)
      return { text: "Good Morning", icon: "☀️", color: "text-warning" };
    if (hour < 17)
      return { text: "Good Afternoon", icon: "🌤️", color: "text-primary" };
    return { text: "Good Evening", icon: "🌙", color: "text-info" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your username or email";
    } else if (
      formData.email.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ ...formData, rememberMe });

      if (result.success) {
        toast.success("Welcome back! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(result.error || "Login failed", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error("Connection failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    const credentials = {
      admin: { email: "admin", password: "admin123" },
      manager: { email: "manager", password: "manager123" },
      user: { email: "user", password: "user123" },
    };

    setFormData(credentials[type]);
    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} credentials loaded`,
      {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            fillDemoCredentials("admin");
            break;
          case "2":
            e.preventDefault();
            fillDemoCredentials("manager");
            break;
          case "3":
            e.preventDefault();
            fillDemoCredentials("user");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const greeting = getGreeting();

  return (
    <div
      className="min-vh-100 d-flex position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                                radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)`,
          }}
        ></div>

        {/* Floating Elements */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "60px",
            height: "60px",
            top: "20%",
            left: "10%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "float 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "80px",
            height: "80px",
            top: "60%",
            right: "15%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "float 12s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "40px",
            height: "40px",
            bottom: "30%",
            left: "20%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "float 10s ease-in-out infinite",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div
        className="container-fluid d-flex min-vh-100 position-relative"
        style={{ zIndex: 1 }}
      >
        {/* Left Side - Branding */}
        <div
          className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center p-5"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="text-center text-white" style={{ maxWidth: "500px" }}>
            {/* Logo Section */}
            <div className="mb-5">
              <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-4"
                style={{
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <i className="bi bi-truck display-3"></i>
              </div>
              <h1
                className="display-4 fw-bold mb-2"
                style={{
                  background: "linear-gradient(45deg, #fff, #e0e7ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                GreenCart
              </h1>
              <p className="lead opacity-75">Logistics Management System</p>
            </div>

            {/* Greeting Section */}
            <div
              className="mb-5 p-4 rounded-4"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="display-1 mb-3">{greeting.icon}</div>
              <h2 className={`h3 fw-semibold mb-2 ${greeting.color}`}>
                {greeting.text}
              </h2>
              <p className="h5 opacity-75 mb-0">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>

            {/* Features Preview */}
            <div className="row g-3">
              {[
                { icon: "speedometer2", text: "Real-time Analytics" },
                { icon: "geo-alt", text: "Smart Routing" },
                { icon: "graph-up", text: "Performance Insights" },
              ].map((feature, index) => (
                <div key={index} className="col-12">
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded-3 transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "translateX(10px)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "translateX(0)")
                    }
                  >
                    <i className={`bi bi-${feature.icon} fs-4 opacity-75`}></i>
                    <span className="fw-medium">{feature.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-lg-5 col-12 bg-white d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            {/* Form Header */}
            <div className="text-center mb-5">
              <div className="d-lg-none mb-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-truck text-primary fs-3"></i>
                </div>
                <h2 className="fw-bold text-primary">GreenCart</h2>
              </div>
              <h3 className="h2 fw-bold text-dark mb-2">Welcome back</h3>
              <p className="text-muted mb-0">Please sign in to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              {/* Email/Username Field */}
              <div className="mb-4">
                <div className="position-relative">
                  <input
                    type="text"
                    name="email"
                    className={`form-control form-control-lg ps-5 ${
                      errors.email ? "is-invalid" : ""
                    } ${
                      focusedField === "email" ? "border-primary shadow-sm" : ""
                    }`}
                    placeholder="Username or Email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    disabled={isLoading}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <i className="bi bi-person position-absolute top-50 translate-middle-y ms-3 text-muted fs-5"></i>
                  {errors.email && (
                    <div className="invalid-feedback d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control form-control-lg ps-5 pe-5 ${
                      errors.password ? "is-invalid" : ""
                    } ${
                      focusedField === "password"
                        ? "border-primary shadow-sm"
                        : ""
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    disabled={isLoading}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <i className="bi bi-lock position-absolute top-50 translate-middle-y ms-3 text-muted fs-5"></i>
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-2 text-muted p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    style={{ zIndex: 5 }}
                  >
                    <i
                      className={`bi bi-eye${
                        showPassword ? "-slash" : ""
                      } fs-5`}
                    ></i>
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="rememberMe"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-decoration-none small text-primary"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-lg w-100 mb-4 d-flex align-items-center justify-content-center gap-2 ${
                  isLoading ? "btn-secondary" : "btn-primary"
                }`}
                disabled={isLoading || !formData.email || !formData.password}
                style={{
                  borderRadius: "12px",
                  background: !isLoading
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : undefined,
                  border: "none",
                  transition: "all 0.3s ease",
                  transform: isLoading ? "none" : "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && !e.target.disabled) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 10px 25px rgba(102, 126, 234, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              {/* Demo Credentials */}
              <div className="mb-4">
                <div className="text-center mb-3">
                  <small className="text-muted">
                    Quick Access (Ctrl + 1/2/3)
                  </small>
                </div>
                <div className="row g-2">
                  {[
                    {
                      type: "admin",
                      icon: "shield-check",
                      color: "primary",
                      key: "1",
                    },
                    {
                      type: "manager",
                      icon: "person-badge",
                      color: "success",
                      key: "2",
                    },
                    { type: "user", icon: "person", color: "info", key: "3" },
                  ].map((demo) => (
                    <div key={demo.type} className="col-4">
                      <button
                        type="button"
                        className={`btn btn-outline-${demo.color} btn-sm w-100 d-flex flex-column align-items-center gap-1 py-2`}
                        onClick={() => fillDemoCredentials(demo.type)}
                        disabled={isLoading}
                        title={`Ctrl + ${demo.key}`}
                        style={{ borderRadius: "8px", fontSize: "0.75rem" }}
                      >
                        <i className={`bi bi-${demo.icon} fs-6`}></i>
                        <span className="text-capitalize">{demo.type}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Form Footer */}
            <div className="text-center pt-4 border-top">
              <p className="text-muted mb-0">
                New to GreenCart?
                <Link
                  to="/register"
                  className="text-decoration-none text-primary fw-semibold ms-2"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Additional Links */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center gap-4 small">
                <Link to="/help" className="text-muted text-decoration-none">
                  <i className="bi bi-question-circle me-1"></i>Help
                </Link>
                <Link to="/privacy" className="text-muted text-decoration-none">
                  <i className="bi bi-shield-lock me-1"></i>Privacy
                </Link>
                <Link to="/terms" className="text-muted text-decoration-none">
                  <i className="bi bi-file-text me-1"></i>Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(30px) rotate(240deg);
          }
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Login;
