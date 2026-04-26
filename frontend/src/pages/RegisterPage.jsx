import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Icon, toast } from "../components/UI";

export default function RegisterPage({ onNavigate }) {
  const { register } = useBank();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "", password: "", confirmPassword: "",
    aadhaar: "", pan: "", address: "", accountType: "Savings",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = "Enter full name (min 3 chars)";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Enter a valid email";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter valid 10-digit Indian mobile number";
    if (!form.dob) e.dob = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.aadhaar || form.aadhaar.replace(/\s/g, "").length < 12) e.aadhaar = "Enter 12-digit Aadhaar number";
    if (!form.pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/)) e.pan = "Enter valid PAN (e.g. ABCDE1234F)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!form.address.trim()) { setErrors({ address: "Address is required" }); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const res = register(form);
    if (res.success) {
      toast("Account opened successfully! 🎉", "success");
      onNavigate("dashboard");
    } else {
      toast(res.message, "error");
    }
    setLoading(false);
  };

  const Field = ({ label, name, type = "text", placeholder, icon, maxLength, pattern }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="input-icon-wrap">
        {icon && <Icon name={icon} size={14} className="input-icon" color="#8A96A8" />}
        <input
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={form[name]}
          onChange={e => set(name, e.target.value)}
          maxLength={maxLength}
          pattern={pattern}
          style={icon ? {} : {}}
        />
      </div>
      {errors[name] && <span style={{ fontSize: 11, color: "#E53E3E" }}>{errors[name]}</span>}
    </div>
  );

  const steps = ["Personal Info", "Security & KYC", "Account Setup"];

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 580, animation: "fadeUp 0.5s ease both" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, #FF6B00, #C9922A)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(255,107,0,0.3)" }}>
            🏛️
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#0D1F3C", marginBottom: 4 }}>
            Open Your Account
          </h1>
          <p style={{ color: "#8A96A8", fontSize: 13 }}>Join 1 crore+ customers who trust Bharat Bank</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28, gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: step > i + 1 ? "#138808" : step === i + 1 ? "#FF6B00" : "rgba(13,31,60,0.08)",
                  color: step >= i + 1 ? "#fff" : "#8A96A8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  transition: "all 0.3s",
                  boxShadow: step === i + 1 ? "0 4px 12px rgba(255,107,0,0.35)" : "none",
                }}>
                  {step > i + 1 ? <Icon name="check" size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, color: step === i + 1 ? "#FF6B00" : "#8A96A8", fontWeight: step === i + 1 ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: "0 8px", marginBottom: 20, background: step > i + 1 ? "#138808" : "rgba(13,31,60,0.08)", transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid rgba(13,31,60,0.08)", boxShadow: "0 8px 32px rgba(13,31,60,0.08)" }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.35s ease" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#0D1F3C", marginBottom: 6 }}>Personal Information</h3>
              <p style={{ fontSize: 13, color: "#8A96A8", marginBottom: 24 }}>Tell us about yourself</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <div style={{ gridColumn: "1/-1" }}><Field label="Full Name (as per Aadhaar)" name="name" placeholder="e.g. Arjun Kumar Sharma" icon="account" /></div>
                <Field label="Email Address" name="email" type="email" placeholder="yourname@gmail.com" icon="send" />
                <Field label="Mobile Number" name="phone" type="tel" placeholder="9876543210" icon="info" maxLength={10} />
                <div style={{ gridColumn: "1/-1" }}><Field label="Date of Birth" name="dob" type="date" icon="history" /></div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ animation: "fadeUp 0.35s ease" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#0D1F3C", marginBottom: 6 }}>Security & KYC</h3>
              <p style={{ fontSize: 13, color: "#8A96A8", marginBottom: 24 }}>Secure your account & verify identity</p>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap" style={{ position: "relative" }}>
                  <Icon name="shield" size={14} className="input-icon" color="#8A96A8" />
                  <input type={showPass ? "text" : "password"} className="form-input" placeholder="Minimum 6 characters" value={form.password} onChange={e => set("password", e.target.value)} style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8A96A8", display: "flex" }}>
                    <Icon name={showPass ? "eyeoff" : "eye"} size={15} />
                  </button>
                </div>
                {errors.password && <span style={{ fontSize: 11, color: "#E53E3E" }}>{errors.password}</span>}
              </div>

              <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter password" icon="shield" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <div className="form-group">
                  <label className="form-label">Aadhaar Number</label>
                  <input className="form-input" placeholder="XXXX XXXX XXXX" value={form.aadhaar}
                    onChange={e => { let v = e.target.value.replace(/\D/g, "").slice(0, 12); set("aadhaar", v); }}
                  />
                  {errors.aadhaar && <span style={{ fontSize: 11, color: "#E53E3E" }}>{errors.aadhaar}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">PAN Number</label>
                  <input className="form-input" placeholder="ABCDE1234F" value={form.pan}
                    onChange={e => set("pan", e.target.value.toUpperCase().slice(0, 10))}
                  />
                  {errors.pan && <span style={{ fontSize: 11, color: "#E53E3E" }}>{errors.pan}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ animation: "fadeUp 0.35s ease" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#0D1F3C", marginBottom: 6 }}>Account Setup</h3>
              <p style={{ fontSize: 13, color: "#8A96A8", marginBottom: 24 }}>Choose your account type and address</p>

              <div className="form-group">
                <label className="form-label">Account Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { type: "Savings", icon: "💰", desc: "3.5% p.a. interest" },
                    { type: "Current", icon: "🏢", desc: "For businesses" },
                  ].map(({ type, icon, desc }) => (
                    <div key={type} onClick={() => set("accountType", type)} style={{ padding: "16px 14px", borderRadius: 12, border: `2px solid ${form.accountType === type ? "#FF6B00" : "rgba(13,31,60,0.1)"}`, background: form.accountType === type ? "rgba(255,107,0,0.06)" : "#F4F7FF", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#0D1F3C" }}>{type}</div>
                      <div style={{ fontSize: 11, color: "#8A96A8" }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <textarea
                  className="form-input"
                  placeholder="House No, Street, City, State - PIN Code"
                  value={form.address}
                  onChange={e => set("address", e.target.value)}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
                {errors.address && <span style={{ fontSize: 11, color: "#E53E3E" }}>{errors.address}</span>}
              </div>

              {/* Summary */}
              <div style={{ background: "rgba(255,107,0,0.05)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(255,107,0,0.12)", marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#8A96A8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Account Summary</div>
                {[["Name", form.name], ["Email", form.email], ["Mobile", form.phone], ["Account Type", form.accountType]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "#8A96A8" }}>{k}</span>
                    <span style={{ color: "#0D1F3C", fontWeight: 500 }}>{v || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {step > 1 && (
              <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext}>
                Continue → 
              </button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : "🎉 Open Account"}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8A96A8" }}>
          Already have an account?{" "}
          <span onClick={() => onNavigate("login")} style={{ color: "#FF6B00", fontWeight: 600, cursor: "pointer" }}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
