import { useState, useMemo } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, toast } from "../components/UI";

export default function TransactionsPage() {
  const { getUserAccounts, getAccountTransactions } = useBank();
  const accounts = getUserAccounts();
  const [selectedAcc, setSelectedAcc] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const allTxns = useMemo(() => {
    const src = selectedAcc === "all"
      ? accounts.flatMap(a => getAccountTransactions(a.id))
      : getAccountTransactions(selectedAcc);
    return src.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedAcc, accounts]);

  const filtered = useMemo(() => allTxns.filter(t => {
    if (typeFilter !== "All" && t.type !== typeFilter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.ref.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(t.date) > new Date(dateTo)) return false;
    return true;
  }), [allTxns, typeFilter, search, dateFrom, dateTo]);

  const totalCredit = filtered.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit  = filtered.filter(t => t.type === "Debit").reduce((s, t) => s + t.amount, 0);

  const categoryIcon = (cat) => ({ Salary: "💼", ATM: "🏧", Shopping: "🛍️", UPI: "📱", Bills: "📄", Insurance: "🛡️", Interest: "📈", Transfer: "💸", Deposit: "💰", Withdrawal: "💵", Business: "🏢" }[cat] || "💳");

  const grouped = filtered.reduce((acc, t) => {
    const key = fmtDate(t.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <>
      <Topbar title="Transactions" subtitle="Complete history of your transactions" />
      <div className="page">

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Transactions", value: filtered.length, icon: "history", color: "#0D1F3C", bg: "rgba(13,31,60,0.08)" },
            { label: "Total Credits", value: fmt(totalCredit), icon: "download", color: "#138808", bg: "rgba(19,136,8,0.08)" },
            { label: "Total Debits", value: fmt(totalDebit), icon: "arrow_up", color: "#E53E3E", bg: "rgba(229,62,62,0.08)" },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-icon-wrap" style={{ background: s.bg }}>
                <Icon name={s.icon} size={20} color={s.color} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card card-padding" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            {/* Account Filter */}
            <div style={{ flex: "1 1 160px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Account</div>
              <select className="form-select" value={selectedAcc} onChange={e => setSelectedAcc(e.target.value)}>
                <option value="all">All Accounts</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.accountType} - ...{a.accountNumber.slice(-6)}</option>)}
              </select>
            </div>

            {/* Type Filter */}
            <div style={{ flex: "1 1 120px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Type</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "Credit", "Debit"].map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={`btn btn-sm ${typeFilter === t ? "btn-primary" : "btn-ghost"}`} style={{ flex: 1 }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div style={{ flex: "1 1 130px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>From</div>
              <input type="date" className="form-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div style={{ flex: "1 1 130px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>To</div>
              <input type="date" className="form-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>

            {/* Search */}
            <div style={{ flex: "2 1 200px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Search</div>
              <div className="input-icon-wrap">
                <Icon name="history" size={14} className="input-icon" color="#8A96A8" />
                <input type="text" className="form-input" placeholder="Search description or ref..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); setTypeFilter("All"); setSelectedAcc("all"); }}>
                <Icon name="refresh" size={14} /> Reset
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => toast("Statement downloaded!", "success")}>
                <Icon name="download" size={14} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List - Grouped by Date */}
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No transactions found</h3>
              <p>Try changing your filter options</p>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txns]) => (
            <div key={date} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ height: 1, flex: 0, width: 20, background: "var(--border)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{date}</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{txns.length} txn{txns.length > 1 ? "s" : ""}</span>
              </div>

              <div className="card">
                {txns.map((t, i) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < txns.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--page-bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: t.type === "Credit" ? "rgba(19,136,8,0.1)" : "rgba(229,62,62,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {categoryIcon(t.category)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        <code style={{ background: "var(--page-bg)", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>{t.ref}</code>
                        {" · "}{t.category}
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <span className={`pill ${t.type === "Credit" ? "pill-success" : "pill-danger"}`}>{t.type}</span>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: t.type === "Credit" ? "var(--green)" : "#E53E3E" }}>
                        {t.type === "Credit" ? "+" : "-"}{fmt(t.amount)}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{t.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
