import { useState } from "react";

export default function JobForm({ refreshJobs }) {

  const today = new Date().toISOString().split("T")[0];
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState("No Reply");
  const [notes, setNotes] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !role || !source || !date) return alert("Fill all required fields");

    await fetch("https://gethired-backend-rjln.onrender.com/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, source, date, status, notes }),
    });

    setCompany(""); setRole(""); setSource(""); setDate(""); setStatus("No Reply"); setNotes("");
    refreshJobs(); // refresh list after adding
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded space-y-2">
      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="border p-2 w-full"/>
      <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" className="border p-2 w-full"/>
      <input value={source} onChange={e => setSource(e.target.value)} placeholder="Source" className="border p-2 w-full"/>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 w-full"/>
      <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 w-full">
        <option>No Reply</option>
        <option>HR</option>
        <option>Tech</option>
        <option>Final</option>
        <option>Rejected</option>
      </select>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" className="border p-2 w-full"/>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Add Job</button>
    </form>
  );
}