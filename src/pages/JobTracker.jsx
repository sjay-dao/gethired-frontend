import { useEffect, useState } from "react";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("card"); // toggle: "card" or "table"

  const fetchJobs = async () => {
    try {
      const res = await fetch("https://gethired-backend-rjln.onrender.com/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs for search & status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Dashboard stats
  const today = new Date().toISOString().split("T")[0];
  const stats = jobs.reduce((acc, job) => {
    acc.total += 1;
    acc[job.status] = (acc[job.status] || 0) + 1;
    if (job.date === today) acc.appliedToday += 1;
    return acc;
  }, { total: 0, appliedToday: 0 });

  return (
    <div className="p-4 space-y-4">
      {/* Header + View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Job Tracker Dashboard</h1>

        <div className="flex gap-4 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search by company or role"
            className="border rounded p-2"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded p-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option>No Reply</option>
            <option>HR</option>
            <option>Tech</option>
            <option>Final</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-blue-100 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats.total}</p>
          <p>Total Applied</p>
        </div>
        <div className="bg-green-100 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats.appliedToday}</p>
          <p>Applied Today</p>
        </div>
        <div className="bg-gray-100 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats["No Reply"] || 0}</p>
          <p>No Reply</p>
        </div>
        <div className="bg-blue-200 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats.HR || 0}</p>
          <p>HR</p>
        </div>
        <div className="bg-yellow-200 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats.Tech || 0}</p>
          <p>Tech</p>
        </div>
        <div className="bg-green-200 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats.Final || 0}</p>
          <p>Final</p>
        </div>
        <div className="bg-red-200 p-3 rounded text-center">
          <p className="font-bold text-lg">{stats.Rejected || 0}</p>
          <p>Rejected</p>
        </div>
      </div>
      
      {/* Job Form */}
      <JobForm refreshJobs={fetchJobs} />
      {/* View Toggle */}
      <button
        className={`px-3 py-1 rounded ${viewMode === "card" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setViewMode("card")}
      >
        Card
      </button>
      <button
        className={`px-3 py-1 rounded ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setViewMode("table")}
      >
        Table
      </button>
      {/* Job List */}
      <JobList jobs={filteredJobs} refreshJobs={fetchJobs} viewMode={viewMode} />
    </div>
  );
}