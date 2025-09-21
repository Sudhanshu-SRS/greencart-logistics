import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    {
      path: "/simulation",
      icon: "bi-gear-wide-connected",
      label: "Simulation",
    },
    { path: "/drivers", icon: "bi-people-fill", label: "Drivers" },
    { path: "/routes", icon: "bi-map-fill", label: "Routes" },
    { path: "/orders", icon: "bi-box-seam-fill", label: "Orders" },
  ];

  return (
    <nav
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            textDecoration: "none",
            color: "#2c3e50",
            fontSize: "1.8rem",
            fontWeight: "800",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #28a745, #20c997)",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.5rem",
              boxShadow: "0 8px 20px rgba(40, 167, 69, 0.3)",
            }}
          >
            <i className="bi bi-truck-front-fill" />
          </div>
          GreenCart
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.8rem 1.5rem",
                borderRadius: "1rem",
                textDecoration: "none",
                color: location.pathname === item.path ? "white" : "#6c757d",
                background:
                  location.pathname === item.path
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "transparent",
                fontWeight: "600",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.background = "#f8f9fa";
                  e.target.style.color = "#2c3e50";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#6c757d";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              <i className={item.icon} style={{ fontSize: "1.1rem" }} />
              {item.label}
              {location.pathname === item.path && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "50%",
                    height: "2px",
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: "1px",
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.8rem 1.5rem",
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              borderRadius: "1.5rem",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #17a2b8, #6f42c1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "700",
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div
                style={{
                  fontWeight: "700",
                  color: "#2c3e50",
                  fontSize: "1rem",
                }}
              >
                {user?.username || "User"}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#6c757d",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "Member"}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              padding: "0.8rem 1.5rem",
              background: "linear-gradient(135deg, #dc3545, #c82333)",
              color: "white",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(220, 53, 69, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(220, 53, 69, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(220, 53, 69, 0.3)";
            }}
          >
            <i className="bi bi-box-arrow-right" />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#2c3e50",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          <i className={`bi bi-${isMenuOpen ? "x" : "list"}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          style={{
            display: "none",
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.1)",
            borderTop: "none",
            padding: "1rem 2rem",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "1rem",
                textDecoration: "none",
                color: location.pathname === item.path ? "white" : "#2c3e50",
                background:
                  location.pathname === item.path
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "transparent",
                fontWeight: "600",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
              }}
            >
              <i className={item.icon} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              background: "linear-gradient(135deg, #dc3545, #c82333)",
              color: "white",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            <i className="bi bi-box-arrow-right" />
            Logout
          </button>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 992px) {
          nav > div > div:nth-child(2) {
            display: none !important;
          }
          nav > div > div:nth-child(3) {
            display: none !important;
          }
          nav > div > button {
            display: block !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
