import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, Modal, toast } from "../components/UI";

export default function AccountsPage() {
  const { getUserAccounts, getAccountTransactions, deposit, withdraw } = useBank();
  const accounts = getUserAccounts();
  const [selected, setSelected] = useState(accounts[0]?.id || null);
  const [modal, setModal] = useState(null); // "deposit" | "withdraw"
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAcc = accounts.find(a => a.id === selected);
  const txns = selected ? getAccountTransactions(selected) : [];

  const handleAction = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast("Enter a valid amount", "error"); return; }
    if (modal === "withdraw" && amt > selectedAcc.balance) { toast("Insufficient balance!", "error"); return; }
    if (amt > 1000000) { toast("Maximum ₹10,00,000 per transaction", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const res = modal === "deposit"
      ? deposit(selected, amt, desc || "Cash Deposit")
      : withdraw(selected, amt, desc || "Cash Withdrawal");
    if (res.success) {
      toast(`${modal === "deposit" ? "Deposited" : "Withdrawn"} ${fmt(amt)} successfully! ✓`, "success");
      setModal(null); setAmount(""); setDesc("");
    } else {
      toast(res.message, "error");
    }
    setLoading(false);
  };

  const presets = modal === "deposit"
    ? [1000, 5000, 10000, 25000, 50000]
    : [500, 1000, 2000, 5000, 10000];

  const categoryIcon = (cat) => ({ Salary: "💼", ATM: "🏧", Shopping: "🛍️", UPI: "📱", Bills: "📄", Insurance: "🛡️", Interest: "📈", Transfer: "💸", Deposit: "💰", Withdrawal: "💵", Business: "🏢" }[cat] || "💳");

  return (
    <>
      <Topbar title="My Accounts" subtitle="Manage your bank accounts" />

      <div className="page">
        {/* Account Selector */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
          {accounts.map(acc => (
            <div key={acc.id} className={`account-chip ${selected === acc.id ? "selected" : ""}`} onClick={() => setSelected(acc.id)} style={{ minWidth: 240, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 0.5, textTransform: "uppercase" }}>{acc.accountType} Account</div>
                <div style={{ fontSize: 10, background: "rgba(19,136,8,0.1)", color: "var(--green)", padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>● Active</div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{fmt(acc.balance)}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{acc.accountNumber}</div>
            </div>
          ))}
        </div>

        {selectedAcc && (
          <>
            {/* Account Detail Card */}
            <div className="card" style={{ marginBottom: 24, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", padding: "28px 28px 24px", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{selectedAcc.accountType} Account</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>{fmt(selectedAcc.balance)}</div>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>Available Balance</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Account Number</div>
                    <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>{selectedAcc.accountNumber}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 24, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
                  {[
                    ["IFSC Code", selectedAcc.ifsc],
                    ["Branch", selectedAcc.branch],
                    ["Interest Rate", selectedAcc.interestRate + "% p.a."],
                    ["Nominee", selectedAcc.nominee || "Not set"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ padding: "20px 28px", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => { setModal("deposit"); setAmount(""); setDesc(""); }}>
                  <Icon name="download" size={16} />  Deposit Money
                </button>
                <button className="btn btn-ghost" onClick={() => { setModal("withdraw"); setAmount(""); setDesc(""); }}>
                  <Icon name="arrow_up" size={16} />  Withdraw
                </button>
                <button className="btn btn-ghost" onClick={() => toast("Statement sent to your email!", "success")}>
                  <Icon name="send" size={16} />  Email Statement
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div className="card">
              <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>Transaction History</h3>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{txns.length} transactions</span>
              </div>

              {txns.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <h3>No transactions yet</h3>
                  <p>Your transactions will appear here</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table style={{ marginTop: 8 }}>
                    <thead>
                      <tr>
                        <th>Transaction</th>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Type</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txns.map(t => (
                        <tr key={t.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 18 }}>{categoryIcon(t.category)}</span>
                              <span style={{ fontWeight: 500, fontSize: 13 }}>{t.description}</span>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{fmtDate(t.date)}</td>
                          <td><code style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--page-bg)", padding: "2px 6px", borderRadius: 4 }}>{t.ref.slice(-10)}</code></td>
                          <td><span className={`pill ${t.type === "Credit" ? "pill-success" : "pill-danger"}`}>{t.type}</span></td>
                          <td style={{ textAlign: "right" }}>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: t.type === "Credit" ? "var(--green)" : "#E53E3E" }}>
                              {t.type === "Credit" ? "+" : "-"}{fmt(t.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Deposit / Withdraw Modal */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "deposit" ? "💰 Deposit Money" : "💵 Withdraw Cash"}
        subtitle={modal === "deposit" ? `Adding to ${selectedAcc?.accountNumber}` : `Withdrawing from ${selectedAcc?.accountNumber}`}
      >
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <div className="input-icon-wrap">
            <Icon name="rupee" size={14} className="input-icon" color="#8A96A8" />
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={1}
              max={1000000}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {presets.map(p => (
              <button key={p} onClick={() => setAmount(String(p))} className="btn btn-ghost btn-sm">
                +{p >= 1000 ? (p / 1000) + "K" : p}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder={modal === "deposit" ? "e.g. Salary, Gift, etc." : "e.g. Personal use"}
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>

        {modal === "withdraw" && selectedAcc && (
          <div style={{ background: "var(--page-bg)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Available Balance</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>{fmt(selectedAcc.balance)}</span>
          </div>
        )}

        {amount && parseFloat(amount) > 0 && (
          <div style={{ background: modal === "deposit" ? "rgba(19,136,8,0.06)" : "rgba(229,62,62,0.06)", border: `1px solid ${modal === "deposit" ? "rgba(19,136,8,0.15)" : "rgba(229,62,62,0.15)"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>You are about to <strong>{modal}</strong></div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: modal === "deposit" ? "var(--green)" : "#E53E3E" }}>{fmt(parseFloat(amount) || 0)}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
          <button className={`btn ${modal === "deposit" ? "btn-primary" : "btn-danger"}`} style={{ flex: 1 }} onClick={handleAction} disabled={loading}>
            {loading ? <span className="spinner" /> : `Confirm ${modal === "deposit" ? "Deposit" : "Withdrawal"}`}
          </button>
        </div>
      </Modal>
    </>
  );
}
