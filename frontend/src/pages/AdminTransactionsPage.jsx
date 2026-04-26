import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, toast } from "../components/UI";

export default function AdminTransactionsPage() {
  const { transactions, accounts, users } = useBank();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const getAccount = (aid) => accounts.find(a => a.id === aid);
  const getUser = (uid) => users.find(u => u.id === uid);

  const filtered = transactions
    .filter(t => {
      const matchType = typeFilter === "All" || t.type === typeFilter;
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalCredit = transactions.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit  = transactions.filter(t => t.type === "Debit").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <Topbar title="All Transactions" subtitle="Monitor all bank transactions" />
      <div className="page">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Transactions", value: transactions.length, color: "#0D1F3C" },
            { label: "Total Credits", value: fmt(totalCredit), color: "#138808" },
            { label: "Total Debits", value: fmt(totalDebit), color: "#E53E3E" },
            { label: "Net Flow", value: fmt(totalCredit - totalDebit), color: "#FF6B00" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 20 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Icon name="history" size={14} className="input-icon" color="#8A96A8" />
            <input type="text" className="form-input" placeholder="Search by description or reference..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Credit", "Debit"].map(t => (
              <button key={t} className={`btn btn-sm ${typeFilter === t ? "btn-primary" : "btn-ghost"}`} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast("Report exported!", "success")}>
            <Icon name="download" size={13} /> Export
          </button>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Account</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const acc = getAccount(t.accountId);
                  const user = acc ? getUser(acc.userId) : null;
                  return (
                    <tr key={t.id}>
                      <td><code style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--page-bg)", padding: "2px 5px", borderRadius: 4 }}>{t.ref.slice(-10)}</code></td>
                      <td style={{ fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</td>
                      <td style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{acc?.accountNumber?.slice(-8)}</td>
                      <td style={{ fontSize: 12 }}>{user?.name || "—"}</td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmtDate(t.date)}</td>
                      <td><span className={`pill ${t.type === "Credit" ? "pill-success" : "pill-danger"}`}>{t.type}</span></td>
                      <td style={{ textAlign: "right", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: t.type === "Credit" ? "var(--green)" : "#E53E3E" }}>
                        {t.type === "Credit" ? "+" : "-"}{fmt(t.amount)}
                      </td>
                      <td><span className="pill pill-success">{t.status}</span></td>
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
