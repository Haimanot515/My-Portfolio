import React, { useState } from "react";
import API from "../../api/api.jsx";

// Added switchToVerify prop here
const Form = ({ setLoggedIn, setIsAdmin, closeModal, switchToLogin, switchToVerify }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await API.post("/auth/register", form);

      // ✅ Store pending user correctly
      localStorage.setItem("pendingUser", JSON.stringify(form));

      setSuccess("Verification code sent! Switching...");
      
      // ✅ Instead of navigate (which kills the landing page), 
      // we switch the modal content to the Verify component.
      setTimeout(() => {
        if (switchToVerify) {
          switchToVerify();
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <>
      <h1 style={{ color: "#111", marginBottom: "20px" }}>Register</h1>
      <form className="register-form" onSubmit={handleSubmit} style={{ margin: 0, padding: 0 }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>

      {success && <p className="success" style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      {error && <p className="error" style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        Already have an account?{" "}
        <button 
          type="button" 
          onClick={switchToLogin} 
          style={{ 
            background: "none", 
            border: "none", 
            color: "#0077ff", 
            textDecoration: "underline", 
            cursor: "pointer",
            fontWeight: "bold",
            padding: 0,
            fontSize: "14px"
          }}
        >
          Login here
        </button>
      </div>
    </>
  );
};

export default Form;