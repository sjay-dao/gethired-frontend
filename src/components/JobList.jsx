import { useState } from "react";

export default function JobList({ jobs, refreshJobs, viewMode }) {
  const [localStatus, setLocalStatus] = useState({}); // store changes before update
  const [localNotes, setLocalNotes] = useState({});

  const updateJob = async (id, status, notes) => {
    await fetch(`https://gethired-backend-rjln.onrender.com/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    refreshJobs();
  };

  if (viewMode === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Company</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Source</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Notes</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="border p-2">{job.company}</td>
                <td className="border p-2">{job.role}</td>
                <td className="border p-2">{job.source}</td>
                <td className="border p-2">{job.date}</td>
                <td className="border p-2">
                  <select
                    value={localStatus[job.id] || job.status}
                    onChange={e => setLocalStatus({ ...localStatus, [job.id]: e.target.value })}
                    className="border p-1"
                  >
                    <option>No Reply</option>
                    <option>HR</option>
                    <option>Tech</option>
                    <option>Final</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td className="border p-2">
                  <textarea
                    value={localNotes[job.id] || job.notes}
                    onChange={e => setLocalNotes({ ...localNotes, [job.id]: e.target.value })}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() =>
                      updateJob(job.id, localStatus[job.id] || job.status, localNotes[job.id] || job.notes)
                    }
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Card view
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map(job => (
        <div key={job.id} className="bg-white p-4 shadow rounded">
          <h3 className="font-bold">{job.company} — {job.role}</h3>
          <p>Source: {job.source}</p>
          <p>Date: {job.date}</p>
          <p>Status: 
            <select
              value={localStatus[job.id] || job.status}
              onChange={e => setLocalStatus({ ...localStatus, [job.id]: e.target.value })}
              className="border p-1 ml-2"
            />
          </p>
          <p>Notes:
            <textarea
              value={localNotes[job.id] || job.notes}
              onChange={e => setLocalNotes({ ...localNotes, [job.id]: e.target.value })}
              className="border p-1 w-full"
            />
          </p>
          <button
            onClick={() =>
              updateJob(job.id, localStatus[job.id] || job.status, localNotes[job.id] || job.notes)
            }
            className="bg-blue-500 text-white p-2 mt-2 rounded w-full"
          >
            Update
          </button>
        </div>
      ))}
    </div>
  );
}