import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, toast } from "../components/UI";

export default function AdminAccountsPage() {
  const { accounts, users } = useBank();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const getUser = (uid) => users.find(u => u.id === uid);

  const filtered = accounts.filter(a => {
    const user = getUser(a.userId);
    const matchSearch = a.accountNumber.includes(search) || user?.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || a.accountType === typeFilter;
    return matchSearch && matchType;
  });

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <>
      <Topbar title="All Accounts" subtitle="Manage all bank accounts" />
      <div className="page">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Accounts", value: accounts.length, color: "#2B6CB0" },
            { label: "Total Balance", value: fmt(totalBalance), color: "#138808" },
            { label: "Active Accounts", value: accounts.filter(a => a.status === "Active").length, color: "#FF6B00" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 20 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Icon name="card" size={14} className="input-icon" color="#8A96A8" />
            <input type="text" className="form-input" placeholder="Search account number or customer name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Savings", "Current"].map(t => (
              <button key={t} className={`btn btn-sm ${typeFilter === t ? "btn-primary" : "btn-ghost"}`} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Branch</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => {
                  const user = getUser(a.userId);
                  return (
                    <tr key={a.id}>
                      <td><code style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--page-bg)", padding: "2px 6px", borderRadius: 4 }}>{a.accountNumber}</code></td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{user?.email}</div>
                      </td>
                      <td><span className="pill pill-info">{a.accountType}</span></td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.branch}</td>
                      <td style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16 }}>{fmt(a.balance)}</td>
                      <td><span className="pill pill-success">{a.status}</span></td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmtDate(a.createdAt)}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast(`Account ${a.accountNumber} details viewed`, "success")}>View</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast(`Account ${a.accountNumber} frozen`, "warning")}>Freeze</button>
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
    </>
  );
}
