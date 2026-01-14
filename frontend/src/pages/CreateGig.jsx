import { useState } from "react";
import { createGig } from "../api/gigApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function CreateGig() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("My_token");
    if (!token) {
      alert("No token found — please log in first");
      return;
    }

    try {
      await createGig(form);
      navigate("/");
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || "Unknown error";
      alert(`Create gig failed: ${serverMsg}`);
      console.error("Create gig error:", err);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <h2>Create Gig</h2>

        <input
          className="form-input"
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="form-textarea"
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="form-input"
          type="number"
          placeholder="Budget"
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <button>Create</button>
      </form>
    </div>
  );
}