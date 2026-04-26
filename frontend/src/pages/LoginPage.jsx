import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Icon, toast } from "../components/UI";

export default function LoginPage({ onNavigate }) {
  const { login } = useBank();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
   
   const res = await login(form.email, form.password);
    if (res.success) {
      toast("Welcome back! 🙏", "success");
      onNavigate(res.user.role === "admin" ? "admin-dashboard" : "dashboard");
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const fillDemo = (role) => {
    if (role === "customer") setForm({ email: "arjun@bharatbank.in", password: "password123" });
    else setForm({ email: "admin@bharatbank.in", password: "admin123" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #0D1F3C 0%, #1e3a6e 50%, #0D1F3C 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 40px",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}>
        {/* Decorative circles */}
        {[
          { w: 400, h: 400, top: -100, left: -100, opacity: 0.05 },
          { w: 300, h: 300, bottom: -80, right: -80, opacity: 0.07 },
          { w: 200, h: 200, top: "40%", right: "10%", opacity: 0.04 },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            width: s.w, height: s.h,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FF6B00, transparent)",
            top: s.top, left: s.left, bottom: s.bottom, right: s.right,
            opacity: s.opacity,
          }} />
        ))}

        {/* Tricolor top stripe */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #FF6B00 33%, #FFFFFF 33% 66%, #138808 66%)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
          {/* Logo */}
          <div style={{
            width: 80, height: 80,
            background: "linear-gradient(135deg, #FF6B00, #C9922A)",
            borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40,
            margin: "0 auto 24px",
            boxShadow: "0 12px 40px rgba(255,107,0,0.35)",
            animation: "float 3s ease-in-out infinite",
          }}>
            🏛️
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 42,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            Bharat Bank
          </h1>

          <p style={{ color: "#FF8C38", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500, marginBottom: 40 }}>
            Mee Nammakam, Maa Baadhyatha
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: "shield", title: "Bank-Grade Security", desc: "256-bit SSL encryption for all transactions" },
              { icon: "send", title: "Instant Transfers", desc: "NEFT, RTGS & IMPS available 24/7" },
              { icon: "trending_up", title: "Grow Your Wealth", desc: "Best FD & savings rates in India" },
            ].map(f => (
              <div key={f.icon} style={{ display: "flex", alignItems: "flex-start", gap: 14, textAlign: "left", background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,107,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={f.icon} size={18} color="#FF8C38" />
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: "16px 20px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Protected by</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {["RBI Licensed", "DICGC Insured", "ISO 27001"].map(t => (
                <div key={t} style={{ background: "rgba(255,107,0,0.15)", color: "#FF8C38", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        width: "100%",
        maxWidth: 480,
        background: "#F4F7FF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 48px",
      }}>
        <div style={{ animation: "fadeUp 0.5s ease both" }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: "#0D1F3C", marginBottom: 6 }}>
              Welcome Back 🙏
            </h2>
            <p style={{ color: "#8A96A8", fontSize: 14 }}>Sign in to your Bharat Bank account</p>
          </div>

          {/* Demo Quick Login Buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <button onClick={() => fillDemo("customer")} style={{ flex: 1, padding: "9px 14px", borderRadius: 9, border: "1.5px solid rgba(13,31,60,0.12)", background: "#fff", color: "#0D1F3C", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B00"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(13,31,60,0.12)"}
            >
              <Icon name="account" size={13} /> Demo Customer
            </button>
            <button onClick={() => fillDemo("admin")} style={{ flex: 1, padding: "9px 14px", borderRadius: 9, border: "1.5px solid rgba(13,31,60,0.12)", background: "#fff", color: "#0D1F3C", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B00"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(13,31,60,0.12)"}
            >
              <Icon name="shield" size={13} /> Demo Admin
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(13,31,60,0.1)" }} />
            <span style={{ fontSize: 12, color: "#8A96A8" }}>or sign in manually</span>
            <div style={{ flex: 1, height: 1, background: "rgba(13,31,60,0.1)" }} />
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 8, color: "#E53E3E", fontSize: 13 }}>
                <Icon name="warning" size={15} color="#E53E3E" />
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Icon name="account" size={15} className="input-icon" color="#8A96A8" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="yourname@bharatbank.in"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap" style={{ position: "relative" }}>
                <Icon name="shield" size={15} className="input-icon" color="#8A96A8" />
                <input
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8A96A8", display: "flex", alignItems: "center" }}>
                  <Icon name={showPass ? "eyeoff" : "eye"} size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8, marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: "#FF6B00", cursor: "pointer", fontWeight: 500 }}>Forgot Password?</span>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner" /> : <><Icon name="arrow_right" size={17} />Sign In</>}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <span style={{ color: "#8A96A8", fontSize: 13 }}>Don't have an account? </span>
            <span onClick={() => onNavigate("register")} style={{ color: "#FF6B00", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
              Open Account →
            </span>
          </div>

          <div style={{ marginTop: 32, padding: "14px 16px", background: "rgba(255,107,0,0.06)", borderRadius: 10, border: "1px solid rgba(255,107,0,0.12)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Icon name="shield" size={14} color="#FF6B00" style={{ marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "#8A96A8", lineHeight: 1.6 }}>
                Bharat Bank will never ask for your password or OTP over call or SMS. If someone asks, please report to our helpline: <strong style={{ color: "#0D1F3C" }}>1800-XXX-XXXX</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
