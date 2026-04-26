import { useState, useRef, useEffect } from "react";
import { useBank } from "../context/BankContext";

export const Icon = ({ name, size = 18, color = "currentColor", className = "" }) => {
  const icons = {
    home:        <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></>,
    account:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    transfer:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    history:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    loan:        <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    fd:          <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h6"/></>,
    logout:      <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    bell:        <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></>,
    sun:         <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    send:        <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    download:    <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    close:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:       <polyline points="20 6 9 17 4 12"/>,
    info:        <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    warning:     <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    eye:         <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeoff:      <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    card:        <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    arrow_right: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrow_up:    <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    arrow_down:  <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    calculator:  <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></>,
    refresh:     <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    bank:        <><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></>,
    shield:      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    rupee:       <><line x1="5" y1="6" x2="19" y2="6"/><line x1="5" y1="10" x2="19" y2="10"/><path d="M5 14l14-8"/><path d="M5 18l4-8h2a5 5 0 000-10"/></>,
    user_check:  <><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></>,
    trending_up: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ display:"inline-block", flexShrink:0 }}>
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

let _addToast = null;
export const toast = (msg, type = "success") => _addToast?.(msg, type);

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _addToast = (msg, type) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
  }, []);
  if (!toasts.length) return null;
  const icons = { success:"✓", error:"✕", warning:"⚠", info:"ℹ" };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}><span>{icons[t.type]||"ℹ"}</span>{t.msg}</div>
      ))}
    </div>
  );
}

export function Sidebar({ activePage, onNavigate }) {
  const { currentUser, logout, darkMode, setDarkMode } = useBank();
  const customerNav = [
    { section:"Main" },
    { id:"dashboard",    label:"Dashboard",      icon:"home" },
    { id:"accounts",     label:"My Accounts",    icon:"card" },
    { id:"transfer",     label:"Fund Transfer",  icon:"transfer" },
    { section:"Finance" },
    { id:"transactions", label:"Transactions",   icon:"history" },
    { id:"loans",        label:"Loans & EMI",    icon:"loan" },
    { id:"fd",           label:"Fixed Deposits", icon:"fd" },
    { id:"calculator",   label:"EMI Calculator", icon:"calculator" },
    { section:"Account" },
    { id:"profile",      label:"My Profile",     icon:"account" },
  ];
  const adminNav = [
    { section:"Admin Panel" },
    { id:"admin-dashboard",    label:"Dashboard",        icon:"home" },
    { id:"admin-users",        label:"Manage Users",     icon:"account" },
    { id:"admin-accounts",     label:"All Accounts",     icon:"card" },
    { id:"admin-transactions", label:"All Transactions", icon:"history" },
    { section:"Account" },
    { id:"profile",            label:"My Profile",       icon:"account" },
  ];
  const nav = currentUser?.role === "admin" ? adminNav : customerNav;
  return (
    <aside className="sidebar">
      <div className="tricolor-strip"/>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛️</div>
        <div className="sidebar-logo-text"><h1>Bharat Bank</h1><span>Aapka Vishwas, Hamari Zimmedari</span></div>
      </div>
      <nav className="sidebar-nav">
        {nav.map((item, i) => {
          if (item.section) return <div key={i} className="nav-section-label">{item.section}</div>;
          return (
            <button key={item.id} className={`nav-item ${activePage===item.id?"active":""}`}
              onClick={() => onNavigate(item.id)}
              style={{ background:"none", border:"none", textAlign:"left", width:"100%", cursor:"pointer" }}>
              <Icon name={item.icon} size={17}/>{item.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button onClick={() => setDarkMode(d => !d)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, width:"100%", padding:"9px 14px", color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:13, marginBottom:8 }}>
          <Icon name={darkMode?"sun":"moon"} size={15}/>{darkMode?"Light Mode":"Dark Mode"}
        </button>
        <div className="user-card-sidebar" onClick={() => onNavigate("profile")}>
          <div className="avatar">{currentUser?.avatar}</div>
          <div className="user-info" style={{ flex:1, minWidth:0 }}>
            <h4 style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{currentUser?.name}</h4>
            <span>{currentUser?.role==="admin"?"Administrator":"Customer"}</span>
          </div>
          <button onClick={e=>{ e.stopPropagation(); logout(); onNavigate("login"); }}
            style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,107,0,0.7)", padding:4, borderRadius:6, display:"flex", alignItems:"center" }} title="Logout">
            <Icon name="logout" size={15}/>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ title, subtitle }) {
  const { notifications, markAllRead } = useBank();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <header className="topbar">
      <div className="topbar-left"><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>
      <div className="topbar-right">
        <div style={{ position:"relative" }} ref={ref}>
          <button className="icon-btn" onClick={() => { setOpen(o=>!o); if(!open) markAllRead(); }}>
            <Icon name="bell" size={17}/>{unread>0&&<span className="badge"/>}
          </button>
          {open && (
            <div className="notif-panel">
              <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600, fontSize:13, color:"var(--text-primary)" }}>Notifications</span>
                <span style={{ fontSize:11, color:"var(--saffron)", cursor:"pointer" }} onClick={markAllRead}>Mark all read</span>
              </div>
              {notifications.slice(0,5).map(n=>(
                <div key={n.id} className="notif-item">
                  <div className={`notif-dot ${n.type}`}/>
                  <span style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.4 }}>{n.text}</span>
                </div>
              ))}
              {!notifications.length && <div style={{ padding:24, textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>No notifications</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Modal({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" size={14}/></button>
        <h2 className="modal-title">{title}</h2>
        {subtitle&&<p className="modal-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export const fmt = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
export const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
export const fmtShort = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
