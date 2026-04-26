import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, Modal, toast } from "../components/UI";

export default function DashboardPage({ onNavigate }) {
  const { currentUser, getUserAccounts, getAccountTransactions, getUserLoans, getUserFDs } = useBank();
  const accounts = getUserAccounts();
  const allTxns = accounts.flatMap(a => getAccountTransactions(a.id)).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const loans = getUserLoans();
  const fds = getUserFDs();
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const [selectedAcc, setSelectedAcc] = useState(null);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "सुप्रभात (Good Morning)";
    if (h < 17) return "नमस्कार (Good Afternoon)";
    return "शुभ संध्या (Good Evening)";
  };

  const quickActions = [
    { icon: "send", label: "Transfer", color: "#FF6B00", bg: "rgba(255,107,0,0.1)", page: "transfer" },
    { icon: "download", label: "Deposit", color: "#138808", bg: "rgba(19,136,8,0.1)", page: "accounts" },
    { icon: "arrow_up", label: "Withdraw", color: "#0D1F3C", bg: "rgba(13,31,60,0.1)", page: "accounts" },
    { icon: "history", label: "History", color: "#C9922A", bg: "rgba(201,146,42,0.1)", page: "transactions" },
    { icon: "loan", label: "Loans", color: "#6B46C1", bg: "rgba(107,70,193,0.1)", page: "loans" },
    { icon: "fd", label: "Fixed Deposit", color: "#2B6CB0", bg: "rgba(43,108,176,0.1)", page: "fd" },
    { icon: "calculator", label: "EMI Calc", color: "#D69E2E", bg: "rgba(214,158,46,0.1)", page: "calculator" },
    { icon: "account", label: "Profile", color: "#E53E3E", bg: "rgba(229,62,62,0.1)", page: "profile" },
  ];

  const categoryIcon = (cat) => {
    const m = { Salary: "💼", ATM: "🏧", Shopping: "🛍️", UPI: "📱", Bills: "📄", Insurance: "🛡️", Interest: "📈", Transfer: "💸", Deposit: "💰", Withdrawal: "💵", Business: "🏢" };
    return m[cat] || "💳";
  };

  return (
    <>
      <Topbar title={`${greeting()}, ${currentUser?.name?.split(" ")[0]}!`} subtitle={`${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`} />

      <div className="page">

        {/* Welcome Banner */}
        <div style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #1e3a6e 60%, #162d54 100%)", borderRadius: 20, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden", color: "#fff" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,107,0,0.12)" }} />
          <div style={{ position: "absolute", bottom: -50, right: 100, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,107,0,0.06)" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Total Portfolio Balance</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>
                {fmt(totalBalance)}
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>ACCOUNTS</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{accounts.length}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>ACTIVE LOANS</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{loans.length}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>FIXED DEPOSITS</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{fds.length}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>Customer ID</div>
              <div style={{ fontWeight: 700, letterSpacing: 1 }}>{currentUser?.id}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <div style={{ background: "rgba(19,136,8,0.25)", color: "#5FE070", fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600 }}>● KYC Verified</div>
                <div style={{ background: "rgba(255,107,0,0.2)", color: "#FF8C38", fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600 }}>Premium Member</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {quickActions.map(q => (
              <div key={q.label} className="quick-action" onClick={() => onNavigate(q.page)}>
                <div className="quick-action-icon" style={{ background: q.bg }}>
                  <Icon name={q.icon} size={22} color={q.color} />
                </div>
                <span className="quick-action-label">{q.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts + Recent Transactions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, marginBottom: 20 }}>

          {/* Accounts */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>My Accounts</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("accounts")}>View All</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {accounts.map(acc => (
                <div key={acc.id} className="card card-padding" style={{ cursor: "pointer" }} onClick={() => onNavigate("accounts")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>{acc.accountType} Account</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "monospace" }}>{acc.accountNumber}</div>
                    </div>
                    <div style={{ background: "rgba(19,136,8,0.1)", color: "var(--green)", fontSize: 10, padding: "3px 8px", borderRadius: 99, fontWeight: 600 }}>
                      ● {acc.status}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                    {fmt(acc.balance)}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>IFSC</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{acc.ifsc}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Branch</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{acc.branch.split(" ").slice(0, 2).join(" ")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>Recent Transactions</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("transactions")}>View All</button>
            </div>
            <div className="card">
              {allTxns.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">📭</div><h3>No transactions yet</h3></div>
              ) : (
                <div style={{ padding: "0 20px" }}>
                  {allTxns.map(t => (
                    <div key={t.id} className="txn-item">
                      <div className={`txn-icon ${t.type.toLowerCase()}`} style={{ fontSize: 18 }}>
                        {categoryIcon(t.category)}
                      </div>
                      <div className="txn-details">
                        <div className="txn-desc">{t.description}</div>
                        <div className="txn-date">{fmtDate(t.date)} · {t.ref.slice(-8)}</div>
                      </div>
                      <div>
                        <div className={`txn-amount ${t.type.toLowerCase()}`}>
                          {t.type === "Credit" ? "+" : "-"}{fmt(t.amount)}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "right", marginTop: 2 }}>{t.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loans & FD Row */}
        {(loans.length > 0 || fds.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {loans.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>Active Loans</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("loans")}>View All</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loans.map(l => (
                    <div key={l.id} className="loan-card" onClick={() => onNavigate("loans")} style={{ cursor: "pointer" }}>
                      <div className="loan-card-accent" style={{ background: l.type.includes("Home") ? "#FF6B00" : "#6B46C1" }} />
                      <div style={{ paddingLeft: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{l.type}</span>
                          <span className="pill pill-success">{l.status}</span>
                        </div>
                        <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Loan Amount</div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16 }}>{fmt(l.amount)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly EMI</div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: "#FF6B00" }}>{fmt(l.emi)}</div>
                          </div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                            <span>{l.paid} of {l.tenure} EMIs paid</span>
                            <span>{Math.round((l.paid / l.tenure) * 100)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${(l.paid / l.tenure) * 100}%` }} />
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Next EMI due: <strong style={{ color: "#FF6B00" }}>{fmtDate(l.nextDue)}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fds.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>Fixed Deposits</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("fd")}>View All</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {fds.map(fd => (
                    <div key={fd.id} className="fd-card" onClick={() => onNavigate("fd")} style={{ cursor: "pointer" }}>
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase" }}>Fixed Deposit</span>
                          <span style={{ background: "rgba(19,136,8,0.3)", color: "#5FE070", fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>{fd.status}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div>
                            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>Principal</div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700 }}>{fmt(fd.principal)}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>Maturity Value</div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#FF8C38" }}>{fmt(fd.maturityAmount)}</div>
                          </div>
                        </div>
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 20 }}>
                          <div>
                            <div style={{ fontSize: 10, opacity: 0.5 }}>RATE</div>
                            <div style={{ fontWeight: 700, color: "#FF8C38" }}>{fd.interestRate}% p.a.</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, opacity: 0.5 }}>MATURES</div>
                            <div style={{ fontWeight: 600, fontSize: 12 }}>{fmtDate(fd.maturityDate)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
