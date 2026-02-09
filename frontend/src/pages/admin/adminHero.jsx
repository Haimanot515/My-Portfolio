import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AdminHero = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    quote: "",
    name: "",
    role: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing data to edit
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await API.get("/hero");
        if (res.data) {
          setFormData({
            title: res.data.title || "",
            subtitle: res.data.subtitle || "",
            description: res.data.description || "",
            quote: res.data.quote || "",
            name: res.data.name || "",
            role: res.data.role || "",
          });
          // If there is an existing image from the server, you could set it here
          if (res.data.imageUrl) setPreview(res.data.imageUrl);
        }
      } catch (err) {
        console.log("No existing hero data found.");
      }
    };
    fetchHero();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Create a URL for the preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);
    data.append("quote", formData.quote);
    data.append("name", formData.name);
    data.append("role", formData.role);
    if (image) data.append("image", image);

    try {
      const res = await API.post("/hero", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Hero section updated successfully!");
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error updating hero");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    display: "block"
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Manage Portfolio Hero</h2>
      {message && <p style={{ color: "#0070f3", fontWeight: "bold" }}>{message}</p>}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. Building Digital Excellence." required />

        <label>Subtitle</label>
        <input name="subtitle" value={formData.subtitle} onChange={handleChange} style={inputStyle} placeholder="e.g. Senior Full-Stack Engineer." />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: "100px" }} />

        <label>Quote</label>
        <input name="quote" value={formData.quote} onChange={handleChange} style={inputStyle} />

        <label>Full Name</label>
        <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} />

        <label>Job Role</label>
        <input name="role" value={formData.role} onChange={handleChange} style={inputStyle} />

        <label>Profile Image</label>
        <input type="file" onChange={handleFileChange} style={inputStyle} accept="image/*" />

        {/* Image Preview Box */}
        {preview && (
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#666" }}>Image Preview:</p>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} 
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Uploading..." : "Save Hero Section"}
        </button>
      </form>
    </div>
  );
};

export default AdminHero;