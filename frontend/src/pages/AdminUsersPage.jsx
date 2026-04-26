import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, Modal, toast } from "../components/UI";

export default function AdminUsersPage() {
  const { users, accounts } = useBank();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const getUserAccounts = (uid) => accounts.filter(a => a.userId === uid);

  return (
    <>
      <Topbar title="Manage Users" subtitle="View and manage all registered customers" />
      <div className="page">
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <div className="input-icon-wrap" style={{ flex: 1 }}>
            <Icon name="account" size={14} className="input-icon" color="#8A96A8" />
            <input type="text" className="form-input" placeholder="Search by name, email or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => toast("Add customer feature coming soon!", "info")}>
            <Icon name="plus" size={14} /> Add Customer
          </button>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>KYC</th>
                  <th>Accounts</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const accs = getUserAccounts(u.id);
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B00,#C9922A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{u.avatar}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>{u.email}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.phone}</div>
                      </td>
                      <td><span className="pill pill-success">Verified</span></td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{accs.length} account{accs.length !== 1 ? "s" : ""}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{fmt(accs.reduce((s, a) => s + a.balance, 0))}</div>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmtDate(u.createdAt)}</td>
                      <td>
                        <span className={`pill ${u.role === "admin" ? "pill-warning" : "pill-info"}`}>
                          {u.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setSelected(u)}>View</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast(`${u.name}'s account frozen`, "warning")}>Freeze</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} subtitle={`Customer ID: ${selected?.id}`}>
        {selected && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                ["Email", selected.email], ["Phone", selected.phone],
                ["PAN", selected.pan], ["Aadhaar", selected.aadhaar],
                ["Date of Birth", selected.dob ? fmtDate(selected.dob) : "—"],
                ["Joined", fmtDate(selected.createdAt)],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "var(--page-bg)", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Linked Accounts</div>
              {getUserAccounts(selected.id).map(a => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                  <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{a.accountNumber}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{fmt(a.balance)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { toast(`${selected.name}'s account suspended`, "error"); setSelected(null); }}>Suspend Account</button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
