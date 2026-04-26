import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, toast } from "../components/UI";

const TRANSFER_MODES = [
  { id: "IMPS", name: "IMPS", desc: "Instant · 24/7", limit: "₹2L/txn", icon: "⚡" },
  { id: "NEFT", name: "NEFT", desc: "2-4 hours", limit: "No limit", icon: "🏦" },
  { id: "RTGS", name: "RTGS", desc: "Same day", limit: "₹2L+", icon: "🚀" },
  { id: "UPI", name: "UPI", desc: "Instant · UPI ID", limit: "₹1L/day", icon: "📱" },
];

export default function TransferPage() {
  const { getUserAccounts, transfer } = useBank();
  const accounts = getUserAccounts();

  const [form, setForm] = useState({
    fromAccount: accounts[0]?.id || "",
    toAccount: "",
    amount: "",
    description: "",
    mode: "IMPS",
  });
  const [step, setStep] = useState(1); // 1=form, 2=confirm, 3=success
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fromAcc = accounts.find(a => a.id === form.fromAccount);
  const amt = parseFloat(form.amount) || 0;

  const validate = () => {
    if (!form.fromAccount) { toast("Select source account", "error"); return false; }
    if (!form.toAccount.trim() || form.toAccount.length < 10) { toast("Enter valid account number", "error"); return false; }
    if (amt <= 0) { toast("Enter a valid amount", "error"); return false; }
    if (fromAcc && amt > fromAcc.balance) { toast("Insufficient balance!", "error"); return false; }
    if (amt > 200000) { toast("Exceeds IMPS limit of ₹2,00,000", "error"); return false; }
    return true;
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const res = transfer(form.fromAccount, form.toAccount, amt, form.description || "Online Transfer");
    if (res.success) {
      setResult({ ref: "REF" + Date.now(), amount: amt, to: form.toAccount, mode: form.mode });
      setStep(3);
    } else {
      toast(res.message || "Transfer failed", "error");
      setStep(1);
    }
    setLoading(false);
  };

  const reset = () => {
    setForm({ fromAccount: accounts[0]?.id || "", toAccount: "", amount: "", description: "", mode: "IMPS" });
    setStep(1); setResult(null);
  };

  const recentBeneficiaries = [
    { name: "Priya Mehta", acc: "BHAR0009876543", bank: "Bharat Bank" },
    { name: "Vijay Kumar", acc: "SBIN0012345678", bank: "SBI" },
    { name: "Sneha Patel", acc: "HDFC0087654321", bank: "HDFC Bank" },
  ];

  return (
    <>
      <Topbar title="Fund Transfer" subtitle="Send money securely via NEFT, IMPS, RTGS or UPI" />
      <div className="page">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* Main Transfer Form */}
          <div>
            {step === 1 && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                {/* Transfer Mode */}
                <div className="card card-padding" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Transfer Mode</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {TRANSFER_MODES.map(m => (
                      <div key={m.id} onClick={() => set("mode", m.id)} style={{ padding: "14px 10px", borderRadius: 12, border: `2px solid ${form.mode === m.id ? "var(--saffron)" : "var(--border)"}`, background: form.mode === m.id ? "var(--saffron-dim)" : "var(--card-bg)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{m.desc}</div>
                        <div style={{ fontSize: 10, color: form.mode === m.id ? "var(--saffron)" : "var(--text-muted)", fontWeight: 600, marginTop: 4 }}>{m.limit}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* From Account */}
                <div className="card card-padding" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>From Account</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {accounts.map(acc => (
                      <div key={acc.id} onClick={() => set("fromAccount", acc.id)} style={{ padding: "14px 16px", borderRadius: 12, border: `2px solid ${form.fromAccount === acc.id ? "var(--saffron)" : "var(--border)"}`, background: form.fromAccount === acc.id ? "var(--saffron-dim)" : "var(--page-bg)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{acc.accountType} Account</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", marginTop: 2 }}>{acc.accountNumber}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Balance</div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>{fmt(acc.balance)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* To Account + Amount */}
                <div className="card card-padding">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Transfer Details</h3>

                  <div className="form-group">
                    <label className="form-label">Beneficiary Account Number</label>
                    <div className="input-icon-wrap">
                      <Icon name="card" size={14} className="input-icon" color="#8A96A8" />
                      <input type="text" className="form-input" placeholder="Enter account number" value={form.toAccount} onChange={e => set("toAccount", e.target.value.toUpperCase())} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <div className="input-icon-wrap">
                      <Icon name="rupee" size={14} className="input-icon" color="#8A96A8" />
                      <input type="number" className="form-input" placeholder="Enter transfer amount" value={form.amount} onChange={e => set("amount", e.target.value)} />
                    </div>
                    {fromAcc && <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Available: {fmt(fromAcc.balance)}</span>}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {[1000, 5000, 10000, 25000, 50000].map(p => (
                        <button key={p} onClick={() => set("amount", String(p))} className="btn btn-ghost btn-sm">₹{p >= 1000 ? p / 1000 + "K" : p}</button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Remarks (optional)</label>
                    <input type="text" className="form-input" placeholder="e.g. Rent, EMI, Personal" value={form.description} onChange={e => set("description", e.target.value)} />
                  </div>

                  <button className="btn btn-primary btn-full btn-lg" onClick={() => { if (validate()) setStep(2); }}>
                    <Icon name="arrow_right" size={18} /> Review Transfer
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card card-padding" style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ width: 64, height: 64, background: "var(--saffron-dim)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>🔍</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Review Transfer</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Please verify all details before confirming</p>
                </div>

                <div style={{ background: "var(--page-bg)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
                  {[
                    ["Transfer Mode", form.mode],
                    ["From Account", fromAcc?.accountNumber],
                    ["From Account Type", fromAcc?.accountType],
                    ["To Account", form.toAccount],
                    ["Remarks", form.description || "Online Transfer"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Transfer Amount</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "var(--saffron)" }}>{fmt(amt)}</span>
                  </div>
                </div>

                <div style={{ background: "rgba(255,107,0,0.06)", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Icon name="shield" size={14} color="var(--saffron)" style={{ marginTop: 1 }} />
                  This transaction is secured with 256-bit SSL encryption. Once confirmed, it cannot be reversed.
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Edit</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleConfirm} disabled={loading}>
                    {loading ? <><span className="spinner" /> Processing...</> : "🔒 Confirm & Transfer"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && result && (
              <div className="card card-padding" style={{ animation: "fadeUp 0.4s ease", textAlign: "center" }}>
                <div style={{ width: 80, height: 80, background: "rgba(19,136,8,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>✅</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "var(--green)", marginBottom: 6 }}>Transfer Successful!</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>Your money has been sent successfully via {result.mode}</p>

                <div style={{ background: "var(--page-bg)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>{fmt(result.amount)}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>sent to {result.to}</div>
                  <div style={{ display: "inline-block", background: "rgba(19,136,8,0.1)", color: "var(--green)", padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: "monospace" }}>
                    Ref: {result.ref.slice(-12)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => toast("Receipt sent to your email!", "success")}>
                    <Icon name="send" size={15} /> Email Receipt
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={reset}>
                    New Transfer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Recent Beneficiaries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card card-padding">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Recent Beneficiaries</h3>
              {recentBeneficiaries.map(b => (
                <div key={b.acc} onClick={() => { set("toAccount", b.acc); setStep(1); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--page-bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="avatar" style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", fontSize: 13 }}>
                    {b.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{b.acc.slice(-8)}...</div>
                  </div>
                  <Icon name="arrow_right" size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>

            <div className="card card-padding">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Transfer Limits</h3>
              {TRANSFER_MODES.map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>{m.icon} {m.name}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{m.limit}</span>
                </div>
              ))}
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>Limits are per transaction. Daily limits may apply.</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", borderRadius: 14, padding: 20, color: "#fff" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Secure Transfers</div>
              <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6 }}>All transactions are protected with bank-grade 256-bit SSL encryption and RBI compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
