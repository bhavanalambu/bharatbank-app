import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, Modal, toast } from "../components/UI";

const FD_RATES = [
  { tenure: "7 - 14 days",  rate: 4.50 }, { tenure: "15 - 29 days", rate: 4.75 },
  { tenure: "30 - 45 days", rate: 5.50 }, { tenure: "46 - 60 days", rate: 5.75 },
  { tenure: "61 - 90 days", rate: 6.00 }, { tenure: "91 - 120 days",rate: 6.25 },
  { tenure: "121 - 180 days",rate:6.50 }, { tenure: "181 days - 1 year", rate: 6.75 },
  { tenure: "1 year - 2 years",rate:7.10,"highlight":true },
  { tenure: "2 years - 3 years",rate:7.25,"highlight":true },
  { tenure: "3 years - 5 years",rate:7.00 },
  { tenure: "5 years - 10 years",rate:6.80 },
];

export default function FDPage() {
  const { getUserFDs } = useBank();
  const fds = getUserFDs();
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ principal: "", tenure: "12", type: "Cumulative" });

  const rate = tenure => {
    const m = parseInt(tenure);
    if (m <= 1) return 4.50; if (m <= 3) return 5.50; if (m <= 6) return 6.00;
    if (m <= 9) return 6.50; if (m <= 12) return 6.75; if (m <= 24) return 7.10;
    if (m <= 36) return 7.25; if (m <= 60) return 7.00; return 6.80;
  };

  const calcMaturity = (p, t) => {
    const r = rate(t) / 100;
    const n = parseInt(t) / 12;
    return Math.round(parseFloat(p) * Math.pow(1 + r, n));
  };

  const p = parseFloat(form.principal) || 0;
  const t = parseInt(form.tenure) || 12;
  const maturity = p > 0 ? calcMaturity(p, t) : 0;
  const interest = maturity - p;

  return (
    <>
      <Topbar title="Fixed Deposits" subtitle="Grow your savings with guaranteed returns" />
      <div className="page">

        {/* Summary */}
        {fds.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Active FDs", value: fds.length, icon: "fd", color: "#2B6CB0", bg: "rgba(43,108,176,0.1)" },
              { label: "Total Principal", value: fmt(fds.reduce((s, f) => s + f.principal, 0)), icon: "rupee", color: "#C9922A", bg: "rgba(201,146,42,0.1)" },
              { label: "Total Maturity", value: fmt(fds.reduce((s, f) => s + f.maturityAmount, 0)), icon: "trending_up", color: "#138808", bg: "rgba(19,136,8,0.08)" },
            ].map(s => (
              <div key={s.label} className="card stat-card">
                <div className="stat-icon-wrap" style={{ background: s.bg }}><Icon name={s.icon} size={20} color={s.color} /></div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
          <div>
            {/* Existing FDs */}
            {fds.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Your Fixed Deposits</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {fds.map(fd => {
                    const today = new Date();
                    const mature = new Date(fd.maturityDate);
                    const totalDays = Math.round((mature - new Date(fd.maturityDate.replace(/\d{4}$/, m => parseInt(m) - (fd.tenure / 12 > 1 ? Math.floor(fd.tenure / 12) : 1)))) / (1000 * 60 * 60 * 24));
                    const elapsed = Math.max(0, Math.round((today - new Date("2024-01-15")) / (1000 * 60 * 60 * 24)));
                    const progress = Math.min(100, Math.round((elapsed / (fd.tenure * 30)) * 100));
                    return (
                      <div key={fd.id} className="card" style={{ overflow: "hidden" }}>
                        <div style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", padding: "22px 24px", color: "#fff" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                            <div>
                              <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Fixed Deposit · {fd.status}</div>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700 }}>{fmt(fd.principal)}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>Maturity Value</div>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#FF8C38" }}>{fmt(fd.maturityAmount)}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 20 }}>
                            <div><div style={{ fontSize: 10, opacity: 0.5 }}>RATE</div><div style={{ fontWeight: 700, color: "#FF8C38" }}>{fd.interestRate}% p.a.</div></div>
                            <div><div style={{ fontSize: 10, opacity: 0.5 }}>TENURE</div><div style={{ fontWeight: 700 }}>{fd.tenure} months</div></div>
                            <div><div style={{ fontSize: 10, opacity: 0.5 }}>MATURES</div><div style={{ fontWeight: 700 }}>{fmtDate(fd.maturityDate)}</div></div>
                            <div><div style={{ fontSize: 10, opacity: 0.5 }}>INTEREST EARNED</div><div style={{ fontWeight: 700, color: "#5FE070" }}>{fmt(fd.maturityAmount - fd.principal)}</div></div>
                          </div>
                        </div>
                        <div style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
                            <span>FD Progress</span>
                            <span>{progress}% of tenure elapsed</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => toast("Cannot break FD before maturity. Penalty: 1%", "warning")}>
                              Break FD
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => toast("FD certificate sent to email!", "success")}>
                              <Icon name="download" size={13} /> Certificate
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FD Interest Rates */}
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Interest Rate Card</h3>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tenure</th>
                        <th>General (% p.a.)</th>
                        <th>Senior Citizen (% p.a.)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {FD_RATES.map(r => (
                        <tr key={r.tenure} style={{ background: r.highlight ? "rgba(255,107,0,0.04)" : "" }}>
                          <td style={{ fontWeight: r.highlight ? 600 : 400 }}>{r.tenure}</td>
                          <td>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: r.highlight ? "var(--saffron)" : "var(--text-primary)" }}>
                              {r.rate.toFixed(2)}%
                            </span>
                          </td>
                          <td>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: "#138808" }}>
                              {(r.rate + 0.5).toFixed(2)}%
                            </span>
                          </td>
                          <td>{r.highlight && <span className="pill pill-warning">Best Rate</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Open FD Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card card-padding">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>Open New FD</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Get guaranteed returns up to 7.25% p.a.</p>

              <div className="form-group">
                <label className="form-label">Principal Amount (₹)</label>
                <div className="input-icon-wrap">
                  <Icon name="rupee" size={14} className="input-icon" color="#8A96A8" />
                  <input type="number" className="form-input" placeholder="Min ₹10,000" value={form.principal} onChange={e => setForm(f => ({ ...f, principal: e.target.value }))} min={10000} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                  {[10000, 25000, 50000, 100000].map(amt => (
                    <button key={amt} className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({ ...f, principal: String(amt) }))}>
                      {amt >= 100000 ? "1L" : amt / 1000 + "K"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tenure (months): <strong style={{ color: "var(--saffron)" }}>{form.tenure} months</strong></label>
                <input type="range" min={1} max={120} value={form.tenure} onChange={e => setForm(f => ({ ...f, tenure: e.target.value }))} style={{ width: "100%", accentColor: "var(--saffron)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
                  <span>1 month</span><span>5 years</span><span>10 years</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Interest Payout</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Cumulative", "Monthly"].map(t => (
                    <button key={t} className={`btn btn-sm ${form.type === t ? "btn-primary" : "btn-ghost"}`} style={{ flex: 1 }} onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
                  ))}
                </div>
              </div>

              {p > 0 && (
                <div style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", borderRadius: 14, padding: 20, marginBottom: 16, color: "#fff" }}>
                  <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Your Returns</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.5 }}>INTEREST RATE</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#FF8C38" }}>{rate(t)}% p.a.</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.5 }}>INTEREST EARNED</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#5FE070" }}>{fmt(interest)}</div>
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                      <div style={{ fontSize: 10, opacity: 0.5 }}>MATURITY AMOUNT</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700 }}>{fmt(maturity)}</div>
                    </div>
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-full" onClick={() => { if (!p || p < 10000) { toast("Minimum deposit is ₹10,000", "error"); return; } toast("FD opened successfully! Certificate sent to email. 🎉", "success"); }}>
                🎉 Open Fixed Deposit
              </button>
            </div>

            <div style={{ background: "rgba(201,146,42,0.08)", border: "1px solid rgba(201,146,42,0.2)", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, color: "#C9922A", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                🪙 Senior Citizen Benefit
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>Customers above 60 years get an additional 0.50% interest on all FDs. Present your Aadhaar at branch to avail this benefit.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
