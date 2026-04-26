import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Topbar, Icon, fmt, fmtDate, toast } from "../components/UI";

export default function ProfilePage({ onNavigate }) {
  const { currentUser, logout } = useBank();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    email: currentUser?.email || "",
  });

  const handleSave = () => {
    toast("Profile updated successfully! ✓", "success");
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate("login");
  };

  const infoRows = [
    { label: "Full Name", value: currentUser?.name, icon: "account" },
    { label: "Email Address", value: currentUser?.email, icon: "send" },
    { label: "Mobile Number", value: currentUser?.phone, icon: "info" },
    { label: "Date of Birth", value: currentUser?.dob ? fmtDate(currentUser.dob) : "—", icon: "history" },
    { label: "Aadhaar Number", value: currentUser?.aadhaar || "XXXX-XXXX-XXXX", icon: "shield" },
    { label: "PAN Number", value: currentUser?.pan || "—", icon: "card" },
    { label: "Address", value: currentUser?.address || "—", icon: "bank" },
    { label: "Member Since", value: currentUser?.createdAt ? fmtDate(currentUser.createdAt) : "—", icon: "fd" },
  ];

  const securityItems = [
    { label: "Change Password", icon: "shield", color: "#6B46C1", action: () => toast("Password change email sent!", "success") },
    { label: "Enable 2-Factor Auth", icon: "user_check", color: "#138808", action: () => toast("2FA setup initiated!", "success") },
    { label: "Registered Devices", icon: "card", color: "#2B6CB0", action: () => toast("2 devices registered", "info") },
    { label: "Login Activity", icon: "history", color: "#C9922A", action: () => toast("Last login: Today, 9:30 AM from Mumbai", "success") },
  ];

  return (
    <>
      <Topbar title="My Profile" subtitle="Manage your personal information and security" />
      <div className="page">
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left - Avatar Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card card-padding" style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B00, #C9922A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "#fff",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(255,107,0,0.3)",
              }}>
                {currentUser?.avatar}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{currentUser?.name}</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{currentUser?.email}</p>
              <span style={{ background: currentUser?.role === "admin" ? "rgba(107,70,193,0.12)" : "rgba(19,136,8,0.1)", color: currentUser?.role === "admin" ? "#6B46C1" : "#138808", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 99 }}>
                {currentUser?.role === "admin" ? "🛡 Administrator" : "✓ Verified Customer"}
              </span>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                  <span>Customer ID</span>
                  <strong style={{ color: "var(--text-primary)", fontFamily: "monospace" }}>{currentUser?.id}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                  <span>KYC Status</span>
                  <strong style={{ color: "var(--green)" }}>● Verified</strong>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 16 }} onClick={() => toast("Photo upload feature coming soon!", "info")}>
                <Icon name="refresh" size={13} /> Update Photo
              </button>
            </div>

            {/* Security */}
            <div className="card card-padding">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Security</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {securityItems.map(s => (
                  <button key={s.label} onClick={s.action} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--page-bg)", cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--saffron)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={s.icon} size={14} color={s.color} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", flex: 1 }}>{s.label}</span>
                    <Icon name="arrow_right" size={13} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button className="btn btn-danger btn-full" onClick={handleLogout}>
              <Icon name="logout" size={15} /> Sign Out
            </button>
          </div>

          {/* Right - Info + Edit */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card card-padding">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Personal Information</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Your official details as per KYC</p>
                </div>
                {!editing ? (
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                    <Icon name="refresh" size={13} /> Edit Profile
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Changes</button>
                  </div>
                )}
              </div>

              {editing ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  {[
                    { label: "Full Name", key: "name", type: "text" },
                    { label: "Phone Number", key: "phone", type: "tel" },
                    { label: "Email Address", key: "email", type: "email" },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input type={f.type} className="form-input" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Address</label>
                    <textarea className="form-input" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ gridColumn: "1/-1", background: "rgba(255,107,0,0.06)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center" }}>
                    <Icon name="shield" size={13} color="var(--saffron)" />
                    Aadhaar and PAN cannot be changed online. Please visit your nearest branch.
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {infoRows.map((row, i) => (
                    <div key={row.label} style={{ padding: "14px 0", borderBottom: i < infoRows.length - 2 ? "1px solid var(--border)" : "none", gridColumn: row.label === "Address" || row.label === "Member Since" ? "1/-1" : "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Icon name={row.icon} size={13} color="var(--saffron)" />
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", paddingLeft: 21 }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Accounts */}
            <div className="card card-padding">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Preferences & Notifications</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "SMS Alerts for transactions", enabled: true },
                  { label: "Email notifications", enabled: true },
                  { label: "Monthly e-statement", enabled: false },
                  { label: "Promotional offers", enabled: false },
                ].map(p => (
                  <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{p.label}</span>
                    <div onClick={() => toast(`${p.label} preference updated`, "success")} style={{ width: 44, height: 24, borderRadius: 99, background: p.enabled ? "var(--green)" : "var(--border)", display: "flex", alignItems: "center", padding: "2px 3px", cursor: "pointer", transition: "background 0.2s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", transform: p.enabled ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
