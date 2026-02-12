import React, { useState, useEffect } from "react";
import Login from "../pages/Login";
import Form from "../pages/Registration/Form";
import Verify from "../pages/Registration/Verify"; 
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Navbar = ({ loggedIn, isAdmin, setLoggedIn, setIsAdmin }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  // Sync: When user becomes logged in, close all modals
  useEffect(() => {
    if (loggedIn) {
      closeModals();
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsAdmin(false);
    closeModals();
    navigate("/"); 
  };

  const handleNavClick = (e) => {
    if (!loggedIn) {
      e.preventDefault(); 
      e.stopPropagation(); 
      openLogin();
    }
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowVerify(false);
  };

  const openRegister = () => {
    closeModals();
    setShowRegister(true);
  };

  const openLogin = () => {
    closeModals();
    setShowLogin(true);
  };

  const openVerify = () => {
    closeModals();
    setShowVerify(true);
  };

  const centeredCardStyle = {
    position: "relative", 
    backgroundColor: "#fff", 
    padding: "35px",
    borderRadius: "16px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    display: "flex",
    justifyContent: "center", 
    alignItems: "center",     
    zIndex: 1000
  };

  // Specifically styling the button to be centered just below the top edge
  const closeBtnStyle = {
    border: 'none', 
    background: 'none', 
    cursor: 'pointer', 
    marginBottom: '20px',
    marginTop: '-10px', // Pulls it slightly closer to the top edge inside
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  };

  return (
    <>
      <nav className="navbar">
        {!loggedIn ? (
          <>
            <div className="nav-links">
              <Link to="/home" onClick={handleNavClick}>Home</Link>
              <Link to="/projects" onClick={handleNavClick}>Projects</Link>
              <Link to="/skill" onClick={handleNavClick}>Skills</Link>
              <Link to="/contact" onClick={handleNavClick}>Contact</Link>
              <Link to="/about" onClick={handleNavClick}>About</Link>
              <Link to="/testimonials" onClick={handleNavClick}>Testimony</Link>
            </div>
            <div className="nav-auth">
              <button onClick={openLogin}>Login</button>
              <button onClick={openRegister}>Register</button>
            </div>
          </>
        ) : (
          <div className="nav-links" style={{ width: "100%", justifyContent: "space-around" }}>
            <Link to="/home">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/skill">Skills</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
            <Link to="/testimonials">Testimony</Link>
            {(isAdmin === true || isAdmin === "true") && (
              <Link to="/admin/users/view">Admin</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="overlay" style={overlayStyle} onClick={closeModals}>
          <div className="auth-card" style={centeredCardStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} style={closeBtnStyle}>
              <FaTimes style={{ fontSize: "25px", color: "#333" }} />
            </button>
            <Login 
                setLoggedIn={setLoggedIn} 
                setIsAdmin={setIsAdmin} 
                closeModal={closeModals} 
                switchToRegister={openRegister} 
            />
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="overlay" style={overlayStyle} onClick={closeModals}>
          <div className="auth-card" style={centeredCardStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} style={closeBtnStyle}>
              <FaTimes style={{ fontSize: "25px", color: "#333" }} />
            </button>
            <Form 
                closeModal={closeModals} 
                switchToLogin={openLogin} 
                switchToVerify={openVerify} 
            />
          </div>
        </div>
      )}

      {/* VERIFY MODAL */}
      {showVerify && (
        <div className="overlay" style={overlayStyle} onClick={closeModals}>
          <div className="auth-card" style={centeredCardStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} style={closeBtnStyle}>
              <FaTimes style={{ fontSize: "25px", color: "#333" }} />
            </button>
            <Verify 
              setLoggedIn={setLoggedIn} 
              setIsAdmin={setIsAdmin} 
              closeModal={closeModals} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
