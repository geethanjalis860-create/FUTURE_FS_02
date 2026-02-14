import { useEffect, useState } from "react";
import "./App.css";


interface Note {
  text: string;
  date: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  source: string;
  status: string;
  notes: Note[];
}

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [noteText, setNoteText] = useState("");

  const API = "http://localhost:5000/api/leads";

  // ================= FETCH LEADS =================
  const fetchLeads = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ================= ADD LEAD =================
  const addLead = async () => {
    if (!name || !email || !source) return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, source }),
    });

    setName("");
    setEmail("");
    setSource("");
    fetchLeads();
  };

  // ================= DELETE =================
  const deleteLead = async (id: string) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchLeads();
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchLeads();
  };

  // ================= ADD NOTE =================
  const addNote = async (id: string) => {
    if (!noteText) return;

    await fetch(`${API}/${id}/notes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteText }),
    });

    setNoteText("");
    fetchLeads();
  };

  return (
  <div className="container">
    <h1 className="title">CRM Lead Manager</h1>

    {/* ================= ADD FORM ================= */}
    <div className="form-card">
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Source (Website / Instagram)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />

      <button className="primary-btn" onClick={addLead}>
        Add Lead
      </button>
    </div>

    {/* ================= LEADS ================= */}
    <div className="leads-section">
      <h2>All Leads</h2>

      {leads.length === 0 && <p>No leads available</p>}

      {leads.map((lead) => (
        <div key={lead._id} className="lead-card">
          <div className="lead-header">
            <div>
              <h3>{lead.name}</h3>
              <p className="email">{lead.email}</p>
            </div>

            <select
              value={lead.status}
              onChange={(e) =>
                updateStatus(lead._id, e.target.value)
              }
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          <p className="source">
            <strong>Source:</strong> {lead.source}
          </p>

          <button
            className="delete-btn"
            onClick={() => deleteLead(lead._id)}
          >
            Delete
          </button>

          {/* NOTES */}
          <div className="notes">
            <h4>Notes</h4>

            {lead.notes && lead.notes.length > 0 ? (
              lead.notes.map((note, index) => (
                <div key={index} className="note-item">
                  <p>{note.text}</p>
                  <small>
                    {new Date(note.date).toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p className="no-notes">No notes yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default App;
