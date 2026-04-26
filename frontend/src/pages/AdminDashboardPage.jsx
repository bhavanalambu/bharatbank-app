import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate } from "../components/UI";

export default function AdminDashboardPage({ onNavigate }) {
  const { users, accounts, transactions } = useBank();

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalTxns = transactions.length;
  const totalCredit = transactions.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Total Customers", value: users.filter(u => u.role === "customer").length, icon: "account", color: "#2B6CB0", bg: "rgba(43,108,176,0.1)", delta: "+3 this month" },
    { label: "Total Accounts", value: accounts.length, icon: "card", color: "#138808", bg: "rgba(19,136,8,0.08)", delta: "+1 this week" },
    { label: "Total Deposits", value: fmt(totalBalance), icon: "rupee", color: "#C9922A", bg: "rgba(201,146,42,0.1)", delta: "Across all accounts" },
    { label: "Total Transactions", value: totalTxns, icon: "history", color: "#FF6B00", bg: "rgba(255,107,0,0.1)", delta: `${fmt(totalCredit)} credited` },
  ];

  return (
    <>
      <Topbar title="Admin Dashboard" subtitle="Bank overview and management" />
      <div className="page">

        {/* Welcome Banner */}
        <div style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", borderRadius: 20, padding: "28px 32px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,107,0,0.1)" }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Welcome, Admin! 🛡️</h2>
          <p style={{ opacity: 0.65, fontSize: 13 }}>Here's your bank overview for today — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("admin-users")}>Manage Users</button>
            <button className="btn btn-ghost btn-sm" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }} onClick={() => onNavigate("admin-transactions")}>View Transactions</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-icon-wrap" style={{ background: s.bg }}><Icon name={s.icon} size={20} color={s.color} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Recent Users */}
          <div className="card">
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>Recent Customers</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("admin-users")}>View All</button>
            </div>
            <div style={{ padding: "12px 24px" }}>
              {users.filter(u => u.role === "customer").map(u => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B00, #C9922A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{u.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.email}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Since {fmtDate(u.createdAt)}</div>
                    <span className="pill pill-success" style={{ marginTop: 2 }}>Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>Recent Transactions</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("admin-transactions")}>View All</button>
            </div>
            <div style={{ padding: "8px 0" }}>
              {transactions.slice(0, 6).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 24px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: t.type === "Credit" ? "rgba(19,136,8,0.1)" : "rgba(229,62,62,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                    {t.type === "Credit" ? "💚" : "🔴"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{fmtDate(t.date)}</div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: t.type === "Credit" ? "var(--green)" : "#E53E3E", flexShrink: 0 }}>
                    {t.type === "Credit" ? "+" : "-"}{fmt(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
