import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, Modal, toast } from "../components/UI";

const LOAN_PRODUCTS = [
  { type: "Home Loan", icon: "🏠", rate: "8.5% p.a.", min: "₹5 Lakh", max: "₹2 Crore", tenure: "Up to 30 years", desc: "Buy your dream home with lowest EMI" },
  { type: "Car Loan", icon: "🚗", rate: "9.2% p.a.", min: "₹1 Lakh", max: "₹50 Lakh", tenure: "Up to 7 years", desc: "Drive your dream car today" },
  { type: "Personal Loan", icon: "💼", rate: "11.5% p.a.", min: "₹50K", max: "₹25 Lakh", tenure: "Up to 5 years", desc: "For any personal financial need" },
  { type: "Education Loan", icon: "🎓", rate: "8.9% p.a.", min: "₹1 Lakh", max: "₹75 Lakh", tenure: "Up to 15 years", desc: "Invest in your future" },
  { type: "Gold Loan", icon: "🪙", rate: "7.8% p.a.", min: "₹10K", max: "₹50 Lakh", tenure: "Up to 3 years", desc: "Quick loan against gold ornaments" },
];

export default function LoansPage() {
  const { getUserLoans } = useBank();
  const loans = getUserLoans();
  const [applyModal, setApplyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ loanType: "", amount: "", tenure: "", income: "" });

  const totalOutstanding = loans.reduce((s, l) => s + (l.amount - (l.paid * l.emi)), 0);

  const handleApply = () => {
    toast("Loan application submitted! Our team will contact you within 24 hours. 🎉", "success");
    setApplyModal(false);
  };

  return (
    <>
      <Topbar title="Loans & EMI" subtitle="Manage your loans and apply for new ones" />
      <div className="page">

        {/* Summary */}
        {loans.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Active Loans", value: loans.length, icon: "loan", color: "#6B46C1", bg: "rgba(107,70,193,0.1)" },
              { label: "Total Outstanding", value: fmt(totalOutstanding), icon: "rupee", color: "#E53E3E", bg: "rgba(229,62,62,0.08)" },
              { label: "Monthly EMI Total", value: fmt(loans.reduce((s, l) => s + l.emi, 0)), icon: "send", color: "#FF6B00", bg: "rgba(255,107,0,0.1)" },
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
        )}

        {/* Active Loans */}
        {loans.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Active Loans</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {loans.map(l => {
                const progress = (l.paid / l.tenure) * 100;
                const outstanding = l.amount - (l.paid * l.emi);
                const colors = { "Home Loan": "#FF6B00", "Personal Loan": "#6B46C1", "Car Loan": "#2B6CB0", "Education Loan": "#D69E2E", "Gold Loan": "#C9922A" };
                const color = colors[l.type] || "#FF6B00";
                return (
                  <div key={l.id} className="card" style={{ overflow: "hidden" }}>
                    <div style={{ display: "flex", gap: 0 }}>
                      <div style={{ width: 5, background: color, flexShrink: 0 }} />
                      <div style={{ flex: 1, padding: "24px 28px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                          <div>
                            <h4 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{l.type}</h4>
                            <span className="pill pill-success">● {l.status}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 2 }}>Next EMI Due</div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#FF6B00" }}>{fmtDate(l.nextDue)}</div>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                          {[
                            { label: "Loan Amount", value: fmt(l.amount) },
                            { label: "Monthly EMI", value: fmt(l.emi), highlight: true },
                            { label: "Outstanding", value: fmt(outstanding), danger: true },
                            { label: "Interest Rate", value: l.interestRate + "% p.a." },
                          ].map(({ label, value, highlight, danger }) => (
                            <div key={label}>
                              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: highlight ? color : danger ? "#E53E3E" : "var(--text-primary)" }}>{value}</div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                            <span>{l.paid} of {l.tenure} EMIs paid</span>
                            <span>{Math.round(progress)}% complete</span>
                          </div>
                          <div className="progress-bar" style={{ height: 8 }}>
                            <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                            <span>Started</span>
                            <span>{l.tenure - l.paid} EMIs remaining</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => toast("EMI payment initiated!", "success")}>
                            <Icon name="send" size={13} /> Pay EMI Now
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast("Statement sent to email!", "success")}>
                            <Icon name="download" size={13} /> Statement
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loan Products */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Apply for a New Loan</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {LOAN_PRODUCTS.map(p => (
              <div key={p.type} className="card" style={{ padding: 20, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,107,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
                onClick={() => { setSelectedProduct(p); setForm(f => ({ ...f, loanType: p.type })); setApplyModal(true); }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{p.type}</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.4 }}>{p.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                  {[["Rate", p.rate], ["Amount", `${p.min} – ${p.max}`], ["Tenure", p.tenure]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "var(--text-muted)" }}>{k}</span>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm btn-full">Apply Now →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal open={applyModal} onClose={() => setApplyModal(false)} title={`Apply for ${selectedProduct?.type}`} subtitle="Fill in your loan application details">
        <div className="form-group">
          <label className="form-label">Loan Amount (₹)</label>
          <input type="number" className="form-input" placeholder="e.g. 500000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Tenure (in months)</label>
          <input type="number" className="form-input" placeholder="e.g. 60" value={form.tenure} onChange={e => setForm(f => ({ ...f, tenure: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Monthly Income (₹)</label>
          <input type="number" className="form-input" placeholder="e.g. 50000" value={form.income} onChange={e => setForm(f => ({ ...f, income: e.target.value }))} />
        </div>
        {form.amount && form.tenure && selectedProduct && (
          <div style={{ background: "var(--saffron-dim)", borderRadius: 10, padding: "14px 16px", marginBottom: 16, border: "1px solid rgba(255,107,0,0.2)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Estimated Monthly EMI</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "var(--saffron)" }}>
              {fmt(Math.round((parseFloat(form.amount) * (parseFloat(selectedProduct.rate) / 1200) * Math.pow(1 + parseFloat(selectedProduct.rate) / 1200, parseFloat(form.tenure))) / (Math.pow(1 + parseFloat(selectedProduct.rate) / 1200, parseFloat(form.tenure)) - 1) || 0))}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>at {selectedProduct.rate}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setApplyModal(false)}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleApply}>Submit Application</button>
        </div>
      </Modal>
    </>
  );
}
