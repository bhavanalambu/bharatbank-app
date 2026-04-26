import { useState, useMemo } from "react";
import { Topbar, Icon, fmt } from "../components/UI";

export default function CalculatorPage() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);
  const [loanType, setLoanType] = useState("Home Loan");

  const PRESETS = [
    { type: "Home Loan", principal: 2500000, rate: 8.5, tenure: 240, icon: "🏠" },
    { type: "Car Loan", principal: 800000, rate: 9.2, tenure: 84, icon: "🚗" },
    { type: "Personal Loan", principal: 200000, rate: 12, tenure: 36, icon: "💼" },
    { type: "Education Loan", principal: 500000, rate: 8.9, tenure: 120, icon: "🎓" },
  ];

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = tenure;
    const emi = r === 0 ? principal / n : Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    let balance = principal;
    const schedule = [];
    for (let i = 1; i <= Math.min(n, 12); i++) {
      const interestPart = Math.round(balance * r);
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({ month: i, emi, principal: principalPart, interest: interestPart, balance });
    }
    return { emi, totalPayment, totalInterest, schedule };
  }, [principal, rate, tenure]);

  const principalPct = Math.round((principal / (principal + totalInterest)) * 100);

  return (
    <>
      <Topbar title="EMI Calculator" subtitle="Plan your loan with accurate EMI calculations" />
      <div className="page">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24, alignItems: "start" }}>

          {/* Sliders */}
          <div>
            {/* Presets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {PRESETS.map(p => (
                <div key={p.type} onClick={() => { setPrincipal(p.principal); setRate(p.rate); setTenure(p.tenure); setLoanType(p.type); }} style={{ padding: "14px 10px", borderRadius: 12, border: `2px solid ${loanType === p.type ? "var(--saffron)" : "var(--border)"}`, background: loanType === p.type ? "var(--saffron-dim)" : "var(--card-bg)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{p.type}</div>
                </div>
              ))}
            </div>

            <div className="card card-padding">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 20 }}>Loan Parameters</h3>

              {[
                { label: "Loan Amount", value: principal, set: setPrincipal, min: 10000, max: 10000000, step: 10000, display: fmt(principal), unit: "₹" },
                { label: "Annual Interest Rate", value: rate, set: setRate, min: 5, max: 20, step: 0.1, display: rate.toFixed(1) + "%", unit: "%" },
                { label: "Tenure", value: tenure, set: setTenure, min: 1, max: 360, step: 1, display: tenure + " months (" + (tenure / 12).toFixed(1) + " yrs)", unit: "mo" },
              ].map(({ label, value, set, min, max, step, display }) => (
                <div key={label} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</label>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "var(--saffron)" }}>{display}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#FF6B00", height: 6, cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    <span>{label === "Loan Amount" ? fmt(min) : label === "Annual Interest Rate" ? min + "%" : min + " mo"}</span>
                    <span>{label === "Loan Amount" ? fmt(max) : label === "Annual Interest Rate" ? max + "%" : max + " mo"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Amortization Schedule */}
            <div className="card" style={{ marginTop: 20 }}>
              <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>First 12 Months Schedule</h3>
                <span className="pill pill-info">Monthly Breakdown</span>
              </div>
              <div className="table-wrap">
                <table style={{ marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>EMI</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(s => (
                      <tr key={s.month}>
                        <td style={{ fontWeight: 600 }}>Month {s.month}</td>
                        <td style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{fmt(s.emi)}</td>
                        <td style={{ color: "var(--green)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{fmt(s.principal)}</td>
                        <td style={{ color: "#E53E3E", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{fmt(s.interest)}</td>
                        <td style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "var(--text-primary)" }}>{fmt(s.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>

            {/* EMI Card */}
            <div style={{ background: "linear-gradient(135deg, #0D1F3C, #1e3a6e)", borderRadius: 20, padding: 28, color: "#fff", textAlign: "center" }}>
              <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Monthly EMI</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, letterSpacing: -2, color: "#FF8C38", marginBottom: 4 }}>{fmt(emi)}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>per month for {tenure} months</div>

              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Principal", value: fmt(principal), color: "#6B9FFF" },
                  { label: "Total Interest", value: fmt(Math.round(totalInterest)), color: "#FF8C38" },
                  { label: "Total Payment", value: fmt(Math.round(totalPayment)), color: "#5FE070" },
                  { label: "Loan Tenure", value: tenure + " months", color: "#fff" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 10px" }}>
                    <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart Visual */}
            <div className="card card-padding">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Payment Breakdown</h4>

              {/* Visual Bar */}
              <div style={{ height: 24, borderRadius: 12, overflow: "hidden", display: "flex", marginBottom: 14 }}>
                <div style={{ width: `${principalPct}%`, background: "var(--navy)", transition: "width 0.5s" }} />
                <div style={{ flex: 1, background: "var(--saffron)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Principal Amount", value: fmt(principal), pct: principalPct, color: "#0D1F3C" },
                  { label: "Total Interest", value: fmt(Math.round(totalInterest)), pct: 100 - principalPct, color: "#FF6B00" },
                ].map(({ label, value, pct, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{value}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{pct}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, color: "var(--saffron)", marginBottom: 8, fontSize: 14 }}>💡 Tip: Save on Interest</div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                Making part-prepayments reduces total interest significantly. Even one extra EMI per year can save you years of repayment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
