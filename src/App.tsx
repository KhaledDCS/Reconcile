// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";
import * as api from "./lib/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Code+Pro:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #1a3354; font-family: 'Source Sans 3', 'Segoe UI', Tahoma, sans-serif; color: #ccd9e8; -webkit-font-smoothing: antialiased; font-size: 14px; }
  :root {
    --bg:       #1a3354;
    --bg2:      #162d49;
    --surface:  #1e3a5f;
    --surface2: #234470;
    --surface3: #284d80;
    --border:   #2a4a6e;
    --border2:  #335a84;
    --text:     #ccd9e8;
    --text2:    #7a9aba;
    --text3:    #4a6a8a;
    --accent:   #2e6db4;
    --accent2:  #3a82d0;
    --accent-dim:    rgba(46,109,180,0.18);
    --accent-border: rgba(46,109,180,0.4);
    --green:  #4a9e72; --green-dim: rgba(74,158,114,0.15); --green-border: rgba(74,158,114,0.35);
    --amber:  #b8891a; --amber-dim: rgba(184,137,26,0.15);  --amber-border: rgba(184,137,26,0.35);
    --red:    #b84a4a; --red-dim:   rgba(184,74,74,0.15);   --red-border:   rgba(184,74,74,0.35);
    --purple: #7a5aaa; --purple-dim: rgba(122,90,170,0.15); --purple-border: rgba(122,90,170,0.35);
    --mono: 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    --sans: 'Source Sans 3', 'Segoe UI', Tahoma, sans-serif;
    --radius: 3px; --radius-lg: 4px;
    --shadow: 0 2px 8px rgba(0,0,0,0.4); --shadow-sm: 0 1px 4px rgba(0,0,0,0.3);
  }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 0; border: 1px solid var(--border); }
  ::-webkit-scrollbar-thumb:hover { background: var(--surface3); }

  input, select, textarea {
    font-family: var(--mono); font-size: 12px;
    background: var(--bg2); border: 1px solid var(--border2);
    color: var(--text); border-radius: var(--radius);
    padding: 6px 8px; outline: none; transition: border-color 0.1s; width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent2); outline: 1px solid var(--accent-dim); }
  input::placeholder, textarea::placeholder { color: var(--text3); font-style: italic; }
  select { cursor: pointer; appearance: auto; }
  select option { background: var(--surface2); color: var(--text); }

  button { cursor: pointer; font-family: var(--sans); font-weight: 600; border: none; outline: none; border-radius: var(--radius); font-size: 13px; transition: filter 0.1s; }
  button:active { filter: brightness(0.85); }

  .btn-primary { background: var(--accent); color: #e8f0f8; padding: 7px 16px; border: 1px solid rgba(0,0,0,0.25); border-bottom-color: rgba(0,0,0,0.4); text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .btn-primary:hover { background: var(--accent2); }
  .btn-primary:disabled { background: var(--surface3); color: var(--text3); cursor: not-allowed; border-color: var(--border); text-shadow: none; filter: none; }

  .btn-secondary { background: var(--surface2); color: var(--text); padding: 7px 16px; border: 1px solid var(--border2); }
  .btn-secondary:hover { background: var(--surface3); }

  .btn-ghost { background: transparent; color: var(--text2); padding: 5px 10px; font-size: 12px; font-weight: 500; border: 1px solid transparent; }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); border-color: var(--border); }

  .btn-danger { background: var(--red-dim); color: var(--red); padding: 6px 12px; font-size: 12px; border: 1px solid var(--red-border); }
  .btn-danger:hover { background: rgba(184,74,74,0.25); }

  .btn-success { background: var(--green-dim); color: var(--green); padding: 7px 16px; border: 1px solid var(--green-border); }
  .btn-success:hover { background: rgba(74,158,114,0.25); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }

  .tag { display: inline-flex; align-items: center; gap: 3px; padding: 1px 6px; border-radius: 2px; font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; }
  .tag-green  { background: var(--green-dim);  color: var(--green);  border: 1px solid var(--green-border); }
  .tag-amber  { background: var(--amber-dim);  color: var(--amber);  border: 1px solid var(--amber-border); }
  .tag-red    { background: var(--red-dim);    color: var(--red);    border: 1px solid var(--red-border); }
  .tag-blue   { background: var(--accent-dim); color: var(--accent2);border: 1px solid var(--accent-border); }
  .tag-gray   { background: rgba(255,255,255,0.04); color: var(--text2); border: 1px solid var(--border2); }
  .tag-purple { background: var(--purple-dim); color: var(--purple); border: 1px solid var(--purple-border); }
  .tag-ai     { background: var(--purple-dim); color: var(--purple); border: 1px solid var(--purple-border); }

  .modal-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(8,18,32,0.85); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.1s ease; }
  @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { transform:translateY(8px); opacity:0 } to { transform:translateY(0); opacity:1 } }
  @keyframes spin    { to { transform:rotate(360deg); } }
  .modal-box { animation: slideUp 0.12s ease; }

  .tx-row { border-bottom: 1px solid var(--border); transition: background 0.06s; }
  .tx-row:hover { background: rgba(46,109,180,0.08); }
  .tx-row.selected { background: rgba(46,109,180,0.15); border-left: 3px solid var(--accent2); }

  .drop-zone { border: 2px dashed var(--border2); border-radius: var(--radius-lg); transition: all 0.12s; cursor: pointer; }
  .drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent2); background: var(--accent-dim); }

  .progress-bar  { height: 4px; background: var(--bg2); border: 1px solid var(--border); border-radius: 0; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--accent2); border-radius: 0; transition: width 0.3s ease; }

  .nav-tab { padding: 0 16px; height: 44px; font-size: 11px; font-weight: 700; color: var(--text2); border-bottom: 3px solid transparent; cursor: pointer; transition: color 0.1s, border-color 0.1s; background: none; border-top: none; border-left: none; border-right: none; white-space: nowrap; display: inline-flex; align-items: center; letter-spacing: 0.06em; text-transform: uppercase; }
  .nav-tab.active { color: #e8f0f8; border-bottom-color: var(--accent2); }
  .nav-tab:hover:not(.active) { color: var(--text); }

  .sidebar-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--text3); margin-bottom: 5px; display: block; }
  .input-group   { display: flex; flex-direction: column; gap: 4px; }
  .input-label   { font-size: 11px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.05em; }

  .alert-error   { background: var(--red-dim);   border: 1px solid var(--red-border);   border-left: 3px solid var(--red);   color: var(--red);   border-radius: var(--radius); padding: 8px 12px; font-size: 12px; font-family: var(--mono); }
  .alert-warning { background: var(--amber-dim); border: 1px solid var(--amber-border); border-left: 3px solid var(--amber); color: var(--amber); border-radius: var(--radius); padding: 8px 12px; font-size: 12px; }
  .alert-success { background: var(--green-dim); border: 1px solid var(--green-border); border-left: 3px solid var(--green); color: var(--green); border-radius: var(--radius); padding: 8px 12px; font-size: 12px; }

  .user-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid var(--border); transition: background 0.06s; }
  .user-row:hover { background: rgba(46,109,180,0.06); }
  .user-row:last-child { border-bottom: none; }

  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 14px 16px; border-top: 2px solid var(--border2); }

  .conf-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

  .tooltip { position: relative; }
  .tooltip:hover::after { content: attr(data-tip); position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background: #0d1e30; color: var(--text); font-family: var(--mono); font-size: 10px; padding: 4px 8px; border-radius: 2px; white-space: nowrap; z-index: 99; pointer-events: none; border: 1px solid var(--border2); }

  .login-bg {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg2); position: relative; overflow: hidden; padding: 20px;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(255,255,255,0.025) 29px, rgba(255,255,255,0.025) 30px),
      repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(255,255,255,0.025) 29px, rgba(255,255,255,0.025) 30px);
  }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: "u1", name: "Admin User",  email: "admin@company.com",  password: "admin123", role: "admin", active: true, card: null,         createdAt: "2025-01-01" },
  { id: "u2", name: "Jordan Lee",  email: "jordan@company.com", password: "pass123",  role: "user",  active: true, card: "Visa ••4291", createdAt: "2025-01-10" },
  { id: "u3", name: "Alex Kim",    email: "alex@company.com",   password: "pass123",  role: "user",  active: true, card: "Amex ••8812", createdAt: "2025-01-10" },
  { id: "u4", name: "Morgan Chen", email: "morgan@company.com", password: "pass123",  role: "user",  active: true, card: "Visa ••4291", createdAt: "2025-01-15" },
  { id: "u5", name: "Sam Rivera",  email: "sam@company.com",    password: "pass123",  role: "user",  active: true, card: null,         createdAt: "2025-01-05" },
];

const INITIAL_CARDS = [
  { id: "c1", name: "Visa ••4291",  network: "Visa",  last4: "4291", division: "Engineering", active: true },
  { id: "c2", name: "Amex ••8812",  network: "Amex",  last4: "8812", division: "Operations",  active: true },
  { id: "c3", name: "MC ••3301",    network: "MC",    last4: "3301", division: "Sales",        active: false },
];

const CATEGORIES = [
  { id:"cat-01",  name:"Transportation",              billable:"Non-Billable" },
  { id:"cat-02",  name:"Airfare",                     billable:"Non-Billable" },
  { id:"cat-03",  name:"Lodging",                     billable:"Non-Billable" },
  { id:"cat-04",  name:"Office Expense",              billable:"Non-Billable" },
  { id:"cat-05",  name:"Telephone",                   billable:"Non-Billable" },
  { id:"cat-06",  name:"Meals",                       billable:"Non-Billable" },
  { id:"cat-07",  name:"Software Expense",            billable:"Non-Billable" },
  { id:"cat-08",  name:"Hosting COGS",                billable:"Non-Billable" },
  { id:"cat-09",  name:"Marketing and Sales Expense", billable:"Non-Billable" },
  { id:"cat-10",  name:"Conference/Seminar",          billable:"Non-Billable" },
  { id:"cat-11",  name:"License COGS",                billable:"Non-Billable" },
  { id:"cat-12",  name:"Internet",                    billable:"Non-Billable" },
  { id:"cat-13",  name:"Hardware Expense",            billable:"Non-Billable" },
  { id:"cat-14",  name:"Hardware COGS",               billable:"Billable"     },
  { id:"cat-15",  name:"Transactional COGS",          billable:"Non-Billable" },
  { id:"cat-16",  name:"Other COGS",                  billable:"Billable"     },
];

const GL_RULES_DATA = {
  "amazon web services": { categoryId:"cat-08", categoryName:"Hosting COGS",                dept:"IT"                    },
  "aws":                 { categoryId:"cat-08", categoryName:"Hosting COGS",                dept:"IT"                    },
  "slack":               { categoryId:"cat-07", categoryName:"Software Expense",            dept:"General & Administration" },
  "zoom":                { categoryId:"cat-07", categoryName:"Software Expense",            dept:"General & Administration" },
  "google":              { categoryId:"cat-07", categoryName:"Software Expense",            dept:"IT"                    },
  "microsoft":           { categoryId:"cat-07", categoryName:"Software Expense",            dept:"IT"                    },
  "openai":              { categoryId:"cat-07", categoryName:"Software Expense",            dept:"Research & Development" },
  "salesforce":          { categoryId:"cat-09", categoryName:"Marketing and Sales Expense", dept:"Sales"                 },
  "delta":               { categoryId:"cat-02", categoryName:"Airfare",                     dept:"General & Administration" },
  "united airlines":     { categoryId:"cat-02", categoryName:"Airfare",                     dept:"General & Administration" },
  "marriott":            { categoryId:"cat-03", categoryName:"Lodging",                     dept:"General & Administration" },
  "hilton":              { categoryId:"cat-03", categoryName:"Lodging",                     dept:"General & Administration" },
  "airbnb":              { categoryId:"cat-03", categoryName:"Lodging",                     dept:"General & Administration" },
  "uber":                { categoryId:"cat-01", categoryName:"Transportation",              dept:"General & Administration" },
  "lyft":                { categoryId:"cat-01", categoryName:"Transportation",              dept:"General & Administration" },
  "doordash":            { categoryId:"cat-06", categoryName:"Meals",                       dept:"General & Administration" },
  "grubhub":             { categoryId:"cat-06", categoryName:"Meals",                       dept:"General & Administration" },
  "amazon.com":          { categoryId:"cat-04", categoryName:"Office Expense",              dept:"Operations"            },
  "amazon":              { categoryId:"cat-04", categoryName:"Office Expense",              dept:"Operations"            },
  "staples":             { categoryId:"cat-04", categoryName:"Office Expense",              dept:"Operations"            },
  "fedex":               { categoryId:"cat-04", categoryName:"Office Expense",              dept:"Operations"            },
  "ups":                 { categoryId:"cat-04", categoryName:"Office Expense",              dept:"Operations"            },
  "linkedin":            { categoryId:"cat-09", categoryName:"Marketing and Sales Expense", dept:"Sales & Marketing"     },
};

const DEFAULT_GL_ACCOUNTS = CATEGORIES;

const DEPARTMENTS = ["IT","Research & Development","General & Administration","Marketing","Customer Support","G&A Corporate","Sales","Sales & Marketing","Operations"];

// Category IDs that flag a transaction as recurring/subscription
const RECURRING_GL_CODES = new Set(["cat-07","cat-08","cat-11","cat-12"]);

// Vendor keyword → userId auto-assignee (admin can edit in Settings)
const DEFAULT_VENDOR_ASSIGNEES = {
  "amazon web services": "u2",
  "aws":                 "u2",
  "slack":               "u2",
  "zoom":                "u2",
  "salesforce":          "u2",
  "openai":              "u2",
  "google":              "u2",
  "linkedin":            "u4",
};

function getAssigneeId(vendor, rules) {
  const v = vendor.toLowerCase();
  for (const [k, uid] of Object.entries(rules)) { if (v.includes(k)) return uid; }
  return null;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const SAMPLE_TXS = [
  { id:1,  date:"2025-03-01", vendor:"Amazon Web Services", description:"Cloud infrastructure Feb",  amount:4821.50, card:"Visa ••4291",  userId:"u2" },
  { id:2,  date:"2025-03-02", vendor:"Slack Technologies",  description:"Team plan monthly",         amount:312.00,  card:"Visa ••4291",  userId:"u2" },
  { id:3,  date:"2025-03-03", vendor:"Delta Air Lines",     description:"SFO→JFK conference",        amount:689.00,  card:"Amex ••8812",  userId:"u3" },
  { id:4,  date:"2025-03-04", vendor:"Marriott Hotels",     description:"NY accommodation 3 nights", amount:1240.00, card:"Amex ••8812",  userId:"u3" },
  { id:5,  date:"2025-03-05", vendor:"DoorDash",            description:"Team working lunch",         amount:187.40,  card:"Visa ••4291",  userId:"u2" },
  { id:6,  date:"2025-03-06", vendor:"Amazon.com",          description:"Office supplies Q1",         amount:94.32,   card:"Visa ••4291",  userId:"u4" },
  { id:7,  date:"2025-03-07", vendor:"Uber",                description:"Airport transfer JFK",       amount:62.15,   card:"Amex ••8812",  userId:"u3" },
  { id:8,  date:"2025-03-08", vendor:"Zoom Video",          description:"Pro annual renewal",         amount:149.90,  card:"Visa ••4291",  userId:"u2" },
  { id:9,  date:"2025-03-09", vendor:"LinkedIn",            description:"Recruiter lite March",       amount:825.00,  card:"Amex ••8812",  userId:"u4" },
  { id:10, date:"2025-03-10", vendor:"Acme Legal Group",    description:"Contract review",            amount:3500.00, card:"Amex ••8812",  userId:"u3" },
  { id:11, date:"2025-03-12", vendor:"Salesforce",          description:"CRM seats March",            amount:2100.00, card:"Visa ••4291",  userId:"u2" },
  { id:12, date:"2025-03-14", vendor:"FedEx",               description:"Overnight shipping",         amount:78.60,   card:"Visa ••4291",  userId:"u4" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + (+n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtDate = (d) => { const [,m,day]=d.split("-"); return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${+day}`; };
const fmtDateTime = (iso) => { const d=new Date(iso); return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})+" · "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}); };
let _seq = 1;
const genReconId = () => `RECON-${new Date().getFullYear()}-${String(_seq++).padStart(4,"0")}`;

function autoAssign(vendor) {
  const v = vendor.toLowerCase();
  for (const [k,val] of Object.entries(GL_RULES_DATA)) { if (v.includes(k)) return {...val, confidence:"high", autoAssigned:true}; }
  return { categoryId:"cat-04", categoryName:"Office Expense", dept:"General & Administration", confidence:"low", autoAssigned:true };
}

function initTx(vendorAssignees=DEFAULT_VENDOR_ASSIGNEES) {
  return SAMPLE_TXS.map(t => {
    const assigned = autoAssign(t.vendor);
    return {
      ...t, ...assigned,
      isRecurring: RECURRING_GL_CODES.has(assigned.categoryId),
      assigneeId: getAssigneeId(t.vendor, vendorAssignees) || t.userId,
      autoAssignee: !!getAssigneeId(t.vendor, vendorAssignees),
      status:"pending", receipt:null, receiptMatch:null, memo:"", flagReason:"", reconId:null
    };
  });
}

const ROLE_COLOR = { admin:"#a855f7", user:"#4f7df3" };
const ROLE_LABEL = { admin:"Admin", user:"User" };

// ── SMALL UI ──────────────────────────────────────────────────────────────────
function Av({ name, color="#4f7df3", size=30 }) {
  const i = name.split(" ").map(p=>p[0]).join("").toUpperCase().slice(0,2);
  return <div style={{width:size,height:size,borderRadius:"50%",background:color+"28",border:`1px solid ${color}45`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:600,color,flexShrink:0}}>{i}</div>;
}

function RoleTag({ role }) {
  const m={admin:"tag-purple", user:"tag-blue"};
  return <span className={`tag ${m[role]||"tag-gray"}`}>{ROLE_LABEL[role]||role}</span>;
}

function StatusTag({ status }) {
  const m={pending:["tag-amber","● Pending"],submitted:["tag-blue","↑ Submitted"],approved:["tag-green","✓ Approved"],flagged:["tag-red","⚑ Flagged"],exported:["tag-gray","→ Exported"]};
  const [cls,label]=m[status]||["tag-gray",status];
  return <span className={`tag ${cls}`}>{label}</span>;
}

function StmtTag({ status }) {
  const m={open:["tag-amber","● Open"],submitted:["tag-blue","↑ Submitted"],approved:["tag-green","✓ Approved"],rejected:["tag-red","✕ Rejected"],exported:["tag-gray","→ Exported"]};
  const [cls,label]=m[status]||["tag-gray",status];
  return <span className={`tag ${cls}`}>{label}</span>;
}

function ConfDot({ level }) {
  const c={high:"#22c55e",medium:"#f59e0b",low:"#ef4444"};
  return <span className="tooltip" data-tip={`AI confidence: ${level}`} style={{cursor:"default"}}><span className="conf-dot" style={{background:c[level]||"#aaa"}} /></span>;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    const u = await onLogin(email.trim().toLowerCase(), pw);
    if(!u){ setErr("Invalid email or password."); setLoading(false); }
  };

  return (
    <div className="login-bg">
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:400,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:52,height:52,background:"var(--accent-dim)",border:"1px solid var(--accent-border)",borderRadius:16,marginBottom:16}}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10C5 7.2 7.2 5 10 5h10" stroke="#4f7df3" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M20 5l-3-3M20 5l-3 3" stroke="#4f7df3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 18C23 20.8 20.8 23 18 23H8" stroke="#4f7df3" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M8 23l3 3M8 23l3-3" stroke="#4f7df3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{fontSize:28,fontWeight:700,color:"var(--text)",letterSpacing:"-0.04em",marginBottom:6}}>Reconcile</div>
          <div style={{fontSize:13,color:"var(--text3)"}}>Credit card reconciliation · NetSuite integration</div>
        </div>

        <div className="card" style={{padding:28,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:20}}>Sign in to your account</div>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="email"/>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="current-password"/>
            </div>
          </div>
          {err&&<div className="alert-error" style={{marginBottom:14}}>⚠ {err}</div>}
          <button className="btn-primary" style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={submit} disabled={loading||!email||!pw}>
            {loading&&<span style={{width:15,height:15,border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>}
            {loading?"Signing in...":"Sign in →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ACCOUNT SETTINGS MODAL ───────────────────────────────────────────────────
function AccountSettingsModal({ currentUser, onClose, onPasswordChanged }) {
  const [currentPw,setCurrentPw]=useState("");
  const [newPw,setNewPw]=useState("");
  const [confirmPw,setConfirmPw]=useState("");
  const [err,setErr]=useState("");
  const [success,setSuccess]=useState(false);
  const [saving,setSaving]=useState(false);

  // Password strength: min 6 chars + at least one special character
  const SPECIAL = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
  const sanitize = (s) => s.replace(/[<>"'`;]/g,""); // strip injection chars

  const validate = () => {
    if(!currentPw||!newPw||!confirmPw){ setErr("All fields are required."); return false; }
    if(newPw.length < 6){ setErr("Password must be at least 6 characters."); return false; }
    if(!SPECIAL.test(newPw)){ setErr("Password must contain at least one special character (!@#$%^&* etc.)."); return false; }
    if(newPw !== confirmPw){ setErr("New passwords do not match."); return false; }
    if(newPw === currentPw){ setErr("New password must be different from current password."); return false; }
    return true;
  };

  const save = async () => {
    setErr(""); setSuccess(false);
    if(!validate()) return;
    setSaving(true);
    try {
      // Verify current password matches DB
      const u = await api.loginUser(currentUser.email, currentPw);
      if(!u){ setErr("Current password is incorrect."); setSaving(false); return; }
      // Save sanitized new password
      await api.updateUser(currentUser.id, { password: sanitize(newPw) });
      setSuccess(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      onPasswordChanged();
    } catch(e) {
      setErr("Failed to update password. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box card" style={{width:"100%",maxWidth:420,padding:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Account Settings</div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{currentUser.name} · {currentUser.email}</div>
          </div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:14}}>Change Password</div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
          <div className="input-group">
            <label className="input-label">Current Password</label>
            <input type="password" value={currentPw} onChange={e=>setCurrentPw(e.target.value)} placeholder="••••••••" autoComplete="current-password"/>
          </div>
          <div className="input-group">
            <label className="input-label">New Password</label>
            <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min 6 chars + special character" autoComplete="new-password"/>
            {newPw.length>0&&(
              <div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:newPw.length>=6?"var(--green)":"var(--red)"}}>
                  {newPw.length>=6?"✓":"✗"} 6+ characters
                </span>
                <span style={{fontSize:10,color:SPECIAL.test(newPw)?"var(--green)":"var(--red)"}}>
                  {SPECIAL.test(newPw)?"✓":"✗"} Special character
                </span>
              </div>
            )}
          </div>
          <div className="input-group">
            <label className="input-label">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="••••••••" autoComplete="new-password"/>
            {confirmPw.length>0&&(
              <div style={{marginTop:6}}>
                <span style={{fontSize:10,color:newPw===confirmPw?"var(--green)":"var(--red)"}}>
                  {newPw===confirmPw?"✓ Passwords match":"✗ Passwords do not match"}
                </span>
              </div>
            )}
          </div>
        </div>

        {err&&<div className="alert-error" style={{marginBottom:14}}>⚠ {err}</div>}
        {success&&<div className="alert-success" style={{marginBottom:14}}>✓ Password updated successfully.</div>}

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving||!currentPw||!newPw||!confirmPw}>
            {saving?"Saving…":"Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── USER MANAGEMENT ───────────────────────────────────────────────────────────
const SPECIAL_RE = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
const sanitizeInput = s => String(s).replace(/[<>"'`;]/g,"").trim();

function UserMgmt({ users, onUpdate }) {
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",email:"",password:"",role:"user",card:""});
  const [addErr,setAddErr]=useState("");
  const [editId,setEditId]=useState(null);
  const [editForm,setEditForm]=useState({});
  const [editErr,setEditErr]=useState("");
  const [resetId,setResetId]=useState(null);
  const [resetPw,setResetPw]=useState("");
  const [resetErr,setResetErr]=useState("");
  const [resetOk,setResetOk]=useState(false);
  const [deleteId,setDeleteId]=useState(null);
  const [saving,setSaving]=useState(false);

  const validatePw = pw => {
    if(pw.length < 6) return "Password must be at least 6 characters.";
    if(!SPECIAL_RE.test(pw)) return "Password must contain a special character.";
    return null;
  };

  const add = async () => {
    if(!form.name||!form.email||!form.password){setAddErr("Name, email and password required.");return;}
    const pwErr = validatePw(form.password);
    if(pwErr){setAddErr(pwErr);return;}
    if(users.find(u=>u.email===form.email.toLowerCase())){setAddErr("Email already exists.");return;}
    setSaving(true);
    try{
      const newUser = await api.createUser({
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email).toLowerCase(),
        password: sanitizeInput(form.password),
        role: form.role,
        card: sanitizeInput(form.card),
      });
      onUpdate([...users,{...newUser,createdAt:newUser.created_at}]);
      setForm({name:"",email:"",password:"",role:"user",card:""});
      setShowAdd(false);setAddErr("");
    }catch(e){setAddErr("Failed to create user.");}
    setSaving(false);
  };

  const saveEdit = async () => {
    if(!editForm.name||!editForm.email){setEditErr("Name and email required.");return;}
    setSaving(true);
    try{
      await api.updateUser(editId,{
        name: sanitizeInput(editForm.name),
        email: sanitizeInput(editForm.email).toLowerCase(),
        role: editForm.role,
        card: sanitizeInput(editForm.card||""),
      });
      onUpdate(users.map(u=>u.id===editId?{...u,...editForm,email:sanitizeInput(editForm.email).toLowerCase()}:u));
      setEditId(null);setEditErr("");
    }catch(e){setEditErr("Failed to save.");}
    setSaving(false);
  };

  const resetPassword = async () => {
    const pwErr = validatePw(resetPw);
    if(pwErr){setResetErr(pwErr);return;}
    setSaving(true);
    try{
      await api.updateUser(resetId,{password:sanitizeInput(resetPw)});
      setResetOk(true);setResetErr("");
      setTimeout(()=>{setResetId(null);setResetPw("");setResetOk(false);},1500);
    }catch(e){setResetErr("Failed to reset password.");}
    setSaving(false);
  };

  const deleteUser = async () => {
    setSaving(true);
    try{
      await api.updateUser(deleteId,{active:false});
      onUpdate(users.map(u=>u.id===deleteId?{...u,active:false}:u));
      setDeleteId(null);
    }catch(e){}
    setSaving(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"var(--text)",letterSpacing:"-0.02em"}}>User Management</div>
          <div style={{fontSize:13,color:"var(--text3)",marginTop:2}}>{users.length} users · {users.filter(u=>u.active).length} active</div>
        </div>
        <button className="btn-primary" style={{fontSize:12}} onClick={()=>setShowAdd(true)}>+ Add User</button>
      </div>

      <div className="card" style={{overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px 100px",padding:"10px 16px",background:"var(--surface2)",borderBottom:"1px solid var(--border)",fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>
          <span>User</span><span>Email</span><span>Role</span><span style={{textAlign:"right"}}>Actions</span>
        </div>
        {users.map(u=>(
          <div key={u.id} className="user-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px 100px",opacity:u.active?1:0.45}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Av name={u.name} color={ROLE_COLOR[u.role]} size={32}/>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{u.name}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:2}}>
                  {u.card&&<span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--mono)"}}>{u.card}</span>}
                  {!u.active&&<span className="tag tag-red" style={{fontSize:9}}>Inactive</span>}
                </div>
              </div>
            </div>
            <div style={{fontSize:12,color:"var(--text2)",fontFamily:"var(--mono)",alignSelf:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
            <div style={{alignSelf:"center"}}>
              <RoleTag role={u.role}/>
            </div>
            <div style={{alignSelf:"center",display:"flex",gap:6,justifyContent:"flex-end"}}>
              <button className="btn-ghost" style={{fontSize:11,padding:"4px 8px"}} title="Edit user" onClick={()=>{setEditId(u.id);setEditForm({name:u.name,email:u.email,role:u.role,card:u.card||""});}}>✎</button>
              <button className="btn-ghost" style={{fontSize:11,padding:"4px 8px"}} title="Reset password" onClick={()=>{setResetId(u.id);setResetPw("");setResetErr("");setResetOk(false);}}>🔑</button>
              <button className="btn-ghost" style={{fontSize:11,padding:"4px 8px",color:u.active?"var(--red)":"var(--green)"}} title={u.active?"Deactivate":"Activate"} onClick={async()=>{await api.updateUser(u.id,{active:!u.active});onUpdate(users.map(x=>x.id===u.id?{...x,active:!x.active}:x));}}>
                {u.active?"⊘":"✓"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD USER MODAL */}
      {showAdd&&(
        <div className="modal-overlay">
          <div className="modal-box card" style={{width:"100%",maxWidth:440,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Add New User</div>
              <button className="btn-ghost" onClick={()=>{setShowAdd(false);setAddErr("");}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:18}}>
              {[{l:"Full Name",k:"name",t:"text",p:"Jane Smith"},{l:"Email",k:"email",t:"email",p:"jane@company.com"},{l:"Password",k:"password",t:"password",p:"Min 6 chars + special character"},{l:"Card (optional)",k:"card",t:"text",p:"Visa ••1234"}].map(f=>(
                <div key={f.k} className="input-group">
                  <label className="input-label">{f.l}</label>
                  <input type={f.t} value={form[f.k]} placeholder={f.p} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
              <div className="input-group">
                <label className="input-label">Role</label>
                <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {addErr&&<div className="alert-error" style={{marginBottom:14}}>⚠ {addErr}</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-secondary" onClick={()=>{setShowAdd(false);setAddErr("");}}>Cancel</button>
              <button className="btn-primary" onClick={add} disabled={saving}>{saving?"Saving…":"Create User"}</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editId&&(
        <div className="modal-overlay">
          <div className="modal-box card" style={{width:"100%",maxWidth:440,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Edit User</div>
              <button className="btn-ghost" onClick={()=>{setEditId(null);setEditErr("");}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:18}}>
              {[{l:"Full Name",k:"name",t:"text"},{l:"Email",k:"email",t:"email"},{l:"Card (optional)",k:"card",t:"text",p:"Visa ••1234"}].map(f=>(
                <div key={f.k} className="input-group">
                  <label className="input-label">{f.l}</label>
                  <input type={f.t} value={editForm[f.k]||""} placeholder={f.p||""} onChange={e=>setEditForm(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
              <div className="input-group">
                <label className="input-label">Role</label>
                <select value={editForm.role} onChange={e=>setEditForm(p=>({...p,role:e.target.value}))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {editErr&&<div className="alert-error" style={{marginBottom:14}}>⚠ {editErr}</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-secondary" onClick={()=>{setEditId(null);setEditErr("");}}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit} disabled={saving}>{saving?"Saving…":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetId&&(
        <div className="modal-overlay">
          <div className="modal-box card" style={{width:"100%",maxWidth:400,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Reset Password</div>
                <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{users.find(u=>u.id===resetId)?.name}</div>
              </div>
              <button className="btn-ghost" onClick={()=>{setResetId(null);setResetPw("");setResetErr("");setResetOk(false);}}>✕</button>
            </div>
            <div className="input-group" style={{marginBottom:8}}>
              <label className="input-label">New Password</label>
              <input type="password" value={resetPw} onChange={e=>setResetPw(e.target.value)} placeholder="Min 6 chars + special character" autoComplete="new-password"/>
            </div>
            {resetPw.length>0&&(
              <div style={{display:"flex",gap:10,marginBottom:12}}>
                <span style={{fontSize:10,color:resetPw.length>=6?"var(--green)":"var(--red)"}}>
                  {resetPw.length>=6?"✓":"✗"} 6+ characters
                </span>
                <span style={{fontSize:10,color:SPECIAL_RE.test(resetPw)?"var(--green)":"var(--red)"}}>
                  {SPECIAL_RE.test(resetPw)?"✓":"✗"} Special character
                </span>
              </div>
            )}
            {resetErr&&<div className="alert-error" style={{marginBottom:14}}>⚠ {resetErr}</div>}
            {resetOk&&<div className="alert-success" style={{marginBottom:14}}>✓ Password reset successfully.</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-secondary" onClick={()=>{setResetId(null);setResetPw("");}}>Cancel</button>
              <button className="btn-primary" onClick={resetPassword} disabled={saving||!resetPw}>{saving?"Saving…":"Reset Password"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GL SETTINGS ───────────────────────────────────────────────────────────────
function GLSettings({ glAccounts, onSave, onClose }) {
  const [raw,setRaw]=useState(glAccounts.map(g=>`${g.code}\t${g.name}`).join("\n"));
  const [parsed,setParsed]=useState(glAccounts);
  const [err,setErr]=useState("");
  const parse=(text)=>{
    setRaw(text);
    try{const lines=text.trim().split("\n").filter(Boolean).map(l=>{const p=l.split(/[\t,·\-]/).map(s=>s.trim()).filter(Boolean);if(p.length<2)throw new Error(`Bad line: "${l}"`);return{code:p[0],name:p.slice(1).join(" ")};});setParsed(lines);setErr("");}
    catch(e){setErr(e.message);}
  };
  return(
    <div className="modal-overlay">
      <div className="modal-box card" style={{width:"100%",maxWidth:520}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Chart of Accounts</div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>One GL per line: <span style={{fontFamily:"var(--mono)",color:"var(--text2)"}}>CODE · Name</span></div>
          <textarea rows={12} value={raw} onChange={e=>parse(e.target.value)} style={{fontFamily:"var(--mono)",fontSize:12,lineHeight:1.8,resize:"vertical"}}/>
          {err&&<div className="alert-error" style={{marginTop:8}}>⚠ {err}</div>}
          {!err&&parsed.length>0&&<div style={{fontSize:12,color:"var(--green)",fontFamily:"var(--mono)",marginTop:8}}>✓ {parsed.length} accounts parsed</div>}
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!!err||!parsed.length} onClick={()=>{onSave(parsed);onClose();}}>Save Accounts</button>
        </div>
      </div>
    </div>
  );
}

// ── RECEIPT MATCHER ───────────────────────────────────────────────────────────
// Convert a File/Blob URL back to base64 for the API
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ReceiptMatcher({ receipts, rawFiles, transactions, onConfirm, onClose }) {
  const [matches, setMatches]   = useState({});
  const [extracted, setExtracted] = useState({}); // { filename: {vendor,amount,date,raw} }
  const [status, setStatus]     = useState("idle"); // idle | running | done | error
  const [current, setCurrent]   = useState(""); // which file is being processed
  const [errMsg, setErrMsg]     = useState("");

  // Run AI matching as soon as modal opens
  useEffect(() => { runMatching(); }, []);

  const runMatching = async () => {
    setStatus("running");
    setErrMsg("");
    const newExtracted = {};
    const newMatches   = {};

    for (const file of rawFiles) {
      setCurrent(file.name);
      try {
        // 1. Convert file to base64
        const b64  = await fileToBase64(file);
        const isPdf = file.type === "application/pdf";
        const mediaType = isPdf ? "application/pdf" : (file.type || "image/jpeg");

        // 2. Build transaction list for Claude to compare against
        const txList = transactions.map(t =>
          `ID:${t.id} | ${fmtDate(t.date)} | ${t.vendor} | ${fmt(t.amount)}`
        ).join("\n");

        // 3. Call Claude vision API via secure server proxy
        const response = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: [
                {
                  type: isPdf ? "document" : "image",
                  source: { type: "base64", media_type: mediaType, data: b64 },
                },
                {
                  type: "text",
                  text: `You are a receipt matching assistant. Analyze this receipt and extract key fields, then match it to the best transaction from the list below.

TRANSACTIONS:
${txList}

Instructions:
1. Extract from the receipt: vendor name, total amount, and date.
2. Find the best matching transaction by comparing vendor, amount, and date.
3. Assign a confidence level: "high" (vendor+amount match well), "medium" (partial match), "low" (weak match), or "none" (no match found).

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "extracted": {
    "vendor": "...",
    "amount": 0.00,
    "date": "YYYY-MM-DD",
    "notes": "brief note about what you saw"
  },
  "match": {
    "txId": <number or null>,
    "confidence": "high|medium|low|none",
    "reason": "why you chose this match"
  }
}`
                }
              ]
            }]
          })
        });

        const data = await response.json();
        const text = data.content?.find(b => b.type === "text")?.text || "";

        // 4. Parse JSON response
        let parsed;
        try {
          const clean = text.replace(/```json|```/g, "").trim();
          parsed = JSON.parse(clean);
        } catch {
          parsed = { extracted: { vendor:"?", amount:0, date:"?", notes:"Parse error" }, match: { txId:null, confidence:"low", reason:"Could not parse AI response" } };
        }

        newExtracted[file.name] = parsed.extracted;
        if (parsed.match?.txId && parsed.match.confidence !== "none") {
          newMatches[file.name] = { txId: parsed.match.txId, confidence: parsed.match.confidence, reason: parsed.match.reason };
        } else {
          newMatches[file.name] = { txId: null, confidence: "low", reason: parsed.match?.reason || "No match found" };
        }

      } catch (err) {
        console.error("Receipt matching error:", err);
        newExtracted[file.name] = { vendor:"Error", amount:0, date:"?", notes: err.message };
        newMatches[file.name]   = { txId: null, confidence: "low", reason: "Processing failed" };
      }
    }

    setExtracted(newExtracted);
    setMatches(newMatches);
    setStatus("done");
    setCurrent("");
  };

  const confidenceColor = { high:"var(--green)", medium:"var(--amber)", low:"var(--red)", none:"var(--text3)" };

  return (
    <div className="modal-overlay">
      <div className="modal-box card" style={{width:"100%",maxWidth:740,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>AI Receipt Matching</div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>
              {status==="running" ? `Reading ${current}…` : `${receipts.length} receipt${receipts.length!==1?"s":""} · Claude vision · review and confirm`}
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        {/* Running state */}
        {status==="running" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:40}}>
            <div style={{width:40,height:40,border:"3px solid var(--border2)",borderTopColor:"var(--purple)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>Claude is reading your receipts</div>
              <div style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--mono)"}}>{current}</div>
              <div style={{fontSize:11,color:"var(--text3)",marginTop:8}}>Extracting vendor · amount · date · finding best match</div>
            </div>
          </div>
        )}

        {/* Results */}
        {status==="done" && (
          <div style={{overflow:"auto",flex:1,padding:"16px 24px",display:"flex",flexDirection:"column",gap:16}}>
            {receipts.map(r => {
              const match = matches[r.name] || {};
              const ext   = extracted[r.name] || {};
              const matchedTx = transactions.find(t => t.id === match.txId);
              return (
                <div key={r.name} className="card" style={{padding:16,border:"1px solid var(--border2)"}}>

                  {/* Receipt extracted info */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                    <div>
                      <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>📄 Receipt</div>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2}}>{r.name}</div>
                      <div style={{fontSize:11,color:"var(--text3)"}}>{(r.size/1024).toFixed(0)} KB</div>
                      {ext.vendor && (
                        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:3}}>
                          <div style={{fontSize:12,color:"var(--text2)"}}>Vendor: <span style={{color:"var(--text)",fontWeight:500}}>{ext.vendor}</span></div>
                          <div style={{fontSize:12,color:"var(--text2)"}}>Amount: <span style={{color:"var(--text)",fontWeight:500,fontFamily:"var(--mono)"}}>{ext.amount ? fmt(ext.amount) : "?"}</span></div>
                          <div style={{fontSize:12,color:"var(--text2)"}}>Date: <span style={{color:"var(--text)",fontWeight:500,fontFamily:"var(--mono)"}}>{ext.date||"?"}</span></div>
                          {ext.notes && <div style={{fontSize:11,color:"var(--text3)",fontStyle:"italic",marginTop:2}}>{ext.notes}</div>}
                        </div>
                      )}
                    </div>

                    {/* AI match result */}
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                        <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>⚡ AI Match</div>
                        {match.confidence && <span style={{fontSize:10,fontWeight:600,color:confidenceColor[match.confidence],background:confidenceColor[match.confidence]+"18",padding:"1px 7px",borderRadius:4,border:"1px solid "+confidenceColor[match.confidence]+"33"}}>{match.confidence}</span>}
                      </div>
                      {matchedTx ? (
                        <div style={{background:"var(--surface2)",borderRadius:8,padding:"10px 12px",border:"1px solid var(--border)"}}>
                          <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2}}>{matchedTx.vendor}</div>
                          <div style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--text2)"}}>{fmtDate(matchedTx.date)} · {fmt(matchedTx.amount)}</div>
                          {match.reason && <div style={{fontSize:11,color:"var(--text3)",marginTop:4,fontStyle:"italic"}}>{match.reason}</div>}
                        </div>
                      ) : (
                        <div style={{background:"var(--red-dim)",borderRadius:8,padding:"10px 12px",border:"1px solid var(--red-border)"}}>
                          <div style={{fontSize:12,color:"var(--red)",fontWeight:500}}>No match found</div>
                          {match.reason && <div style={{fontSize:11,color:"var(--red)",opacity:0.8,marginTop:3}}>{match.reason}</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Override dropdown */}
                  <div>
                    <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Assign to transaction (override if needed)</div>
                    <select value={match.txId||""} onChange={e=>setMatches(m=>({...m,[r.name]:{...m[r.name],txId:+e.target.value||null,confidence:"medium"}}))}>
                      <option value="">— Leave unmapped —</option>
                      {transactions.map(t=><option key={t.id} value={t.id}>{fmtDate(t.date)} · {t.vendor} · {fmt(t.amount)}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
          <div style={{fontSize:11,color:"var(--text3)"}}>
            {status==="done" && `${Object.values(matches).filter(m=>m.txId).length} of ${receipts.length} matched · unmapped receipts saved for later`}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            {status==="done" && <button className="btn-primary" onClick={()=>onConfirm(matches)}>Confirm Matches →</button>}
            {status==="done" && <button className="btn-ghost" style={{fontSize:12}} onClick={runMatching}>↻ Re-run AI</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TRANSACTION DRAWER ────────────────────────────────────────────────────────
function TxDrawer({ tx, currentUser, allUsers, onUpdate, onClose, locked }) {
  const [local,setLocal]=useState({...tx});
  const fileRef=useRef();
  const isAdmin=currentUser.role==="admin";
  const canEdit=!locked||(isAdmin&&tx.status==="submitted");

  const save=()=>{onUpdate(local.id,local);onClose();};
  const handleFile=(file)=>{if(!file)return;setLocal(t=>({...t,receipt:{name:file.name,size:file.size,url:URL.createObjectURL(file)}}));};

  return(
    <div style={{position:"fixed",inset:0,zIndex:90,display:"flex"}}>
      <div style={{flex:1,background:"rgba(0,0,0,0.55)"}} onClick={onClose}/>
      <div style={{width:420,background:"var(--surface)",borderLeft:"1px solid var(--border)",overflowY:"auto",display:"flex",flexDirection:"column",animation:"slideUp 0.2s ease"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"var(--surface)",zIndex:2}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <StatusTag status={local.status}/>
            <button className="btn-ghost" onClick={onClose} style={{fontSize:16,padding:"4px 8px"}}>✕</button>
          </div>
          <div style={{fontSize:18,fontWeight:700,color:"var(--text)",letterSpacing:"-0.02em"}}>{local.vendor}</div>
          <div style={{fontSize:26,fontWeight:600,color:"var(--text)",marginTop:4,fontFamily:"var(--mono)"}}>{fmt(local.amount)}</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:6,fontFamily:"var(--mono)"}}>{fmtDate(local.date)} · {local.card}</div>
        </div>

        <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:18,flex:1}}>
          <div>
            <span className="sidebar-label">Category</span>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              {local.autoAssigned&&<span className="tag tag-ai">⚡ AI assigned</span>}
              {local.confidence&&<ConfDot level={local.confidence}/>}
              {local.categoryId&&(()=>{const cat=CATEGORIES.find(c=>c.id===local.categoryId);return cat?<span className={cat.billable==="Billable"?"tag tag-green":"tag tag-gray"} style={{fontSize:10}}>{cat.billable}</span>:null;})()}
            </div>
            <select value={local.categoryId} disabled={!canEdit} onChange={e=>{const cat=CATEGORIES.find(c=>c.id===e.target.value);setLocal(t=>({...t,categoryId:e.target.value,categoryName:cat?.name||"",autoAssigned:false}));}}>
              {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name} · {c.billable}</option>)}
            </select>
          </div>
          <div>
            <span className="sidebar-label">Department</span>
            <select value={local.dept} disabled={!canEdit} onChange={e=>setLocal(t=>({...t,dept:e.target.value}))}>
              {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <span className="sidebar-label">Assignee {local.autoAssignee&&<span className="tag tag-ai" style={{fontSize:9,padding:"1px 5px",verticalAlign:"middle"}}>⚡ Auto</span>}</span>
            <select value={local.assigneeId||""} disabled={!isAdmin} onChange={e=>setLocal(t=>({...t,assigneeId:e.target.value,autoAssignee:false}))}>
              <option value="">— Unassigned —</option>
              {allUsers.filter(u=>u.active).map(u=><option key={u.id} value={u.id}>{u.name} ({ROLE_LABEL[u.role]})</option>)}
            </select>
            {local.isRecurring&&<div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}><span className="tag tag-purple" style={{fontSize:10}}>↻ Recurring charge</span><span style={{fontSize:11,color:"var(--text3)"}}>Auto-detected from category</span></div>}
          </div>
          <div>
            <span className="sidebar-label">Memo</span>
            <textarea rows={3} value={local.memo} disabled={!canEdit} onChange={e=>setLocal(t=>({...t,memo:e.target.value}))} placeholder="Add a note for finance..." style={{resize:"vertical"}}/>
          </div>

          <div>
            <span className="sidebar-label">Receipt {!local.receipt&&<span style={{color:"var(--red)"}}>* required</span>}</span>
            {local.receipt?(
              <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>📄</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{local.receipt.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{(local.receipt.size/1024).toFixed(0)} KB</div>
                </div>
                {local.receiptMatch&&<span className="tag tag-ai">⚡ AI</span>}
                {canEdit&&<button className="btn-ghost" style={{color:"var(--red)",fontSize:11}} onClick={()=>setLocal(t=>({...t,receipt:null}))}>Remove</button>}
              </div>
            ):canEdit?(
              <div className="drop-zone" style={{padding:"24px",textAlign:"center"}} onClick={()=>fileRef.current.click()}
                onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag-over");}}
                onDragLeave={e=>e.currentTarget.classList.remove("drag-over")}
                onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove("drag-over");handleFile(e.dataTransfer.files[0]);}}>
                <div style={{fontSize:24,marginBottom:8}}>📎</div>
                <div style={{fontSize:12,color:"var(--text2)"}}>Drop receipt or click to upload</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>PDF, JPG, PNG</div>
              </div>
            ):(
              <div style={{fontSize:12,color:"var(--red)",fontFamily:"var(--mono)"}}>No receipt attached</div>
            )}
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>

          {isAdmin&&local.status==="submitted"&&(
            <div>
              <span className="sidebar-label">Flag reason (if rejecting)</span>
              <input value={local.flagReason} onChange={e=>setLocal(t=>({...t,flagReason:e.target.value}))} placeholder="e.g. Wrong GL, missing memo..."/>
            </div>
          )}
        </div>

        <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",gap:8,flexWrap:"wrap"}}>
          {isAdmin&&local.status==="submitted"&&(
            <>
              <button className="btn-success" style={{flex:1}} onClick={()=>{setLocal(t=>({...t,status:"approved"}));setTimeout(save,50);}}>✓ Approve</button>
              <button className="btn-danger" style={{flex:1}} onClick={()=>{setLocal(t=>({...t,status:"flagged"}));setTimeout(save,50);}}>⚑ Flag</button>
            </>
          )}
          {canEdit&&<button className="btn-secondary" style={{flex:1}} onClick={save}>Save</button>}
          {!canEdit&&<button className="btn-secondary" style={{flex:1}} onClick={onClose}>Close</button>}
        </div>
      </div>
    </div>
  );
}

// ── STATEMENT SUBMIT MODAL ────────────────────────────────────────────────────
function StatementModal({ myTxs, onConfirm, onClose }) {
  const missing=myTxs.filter(t=>!t.receipt);
  const ok=missing.length===0;
  return(
    <div className="modal-overlay">
      <div className="modal-box card" style={{width:"100%",maxWidth:500}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Submit Statement for Review</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:4}}>{myTxs.length} transactions · March 2025</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          {!ok?(
            <>
              <div className="alert-error" style={{marginBottom:16}}>⚠ {missing.length} transaction{missing.length>1?"s are":" is"} missing a receipt. All receipts must be attached before submitting.</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {missing.map(t=>(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"var(--surface2)",borderRadius:8,fontSize:12,border:"1px solid var(--red-border)"}}>
                    <span style={{color:"var(--text)"}}>{t.vendor}</span>
                    <span style={{fontFamily:"var(--mono)",color:"var(--text2)"}}>{fmt(t.amount)}</span>
                  </div>
                ))}
              </div>
            </>
          ):(
            <>
              <div className="alert-success" style={{marginBottom:16}}>✓ All {myTxs.length} transactions have receipts attached. Ready to submit.</div>
              <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:220,overflowY:"auto"}}>
                {myTxs.map(t=>(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"var(--surface2)",borderRadius:8,fontSize:12}}>
                    <div><span style={{color:"var(--text)",fontWeight:500}}>{t.vendor}</span><span style={{color:"var(--text3)",marginLeft:8}}>{fmtDate(t.date)}</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{color:"var(--green)",fontSize:11}}>📎</span>
                      <span style={{fontFamily:"var(--mono)",color:"var(--text)"}}>{fmt(t.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!ok} onClick={onConfirm}>Submit Statement →</button>
        </div>
      </div>
    </div>
  );
}

// ── NETSUITE MODAL ────────────────────────────────────────────────────────────
// ── CREDIT CARD SETTINGS ─────────────────────────────────────────────────────
function CreditCardSettings({ cards, onUpdate }) {
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",network:"Visa",last4:"",division:""});
  const [err,setErr]=useState("");
  const [editId,setEditId]=useState(null);
  const [editForm,setEditForm]=useState({});
  const [saving,setSaving]=useState(false);

  const add=async()=>{
    if(!form.name||!form.last4||!form.division){setErr("All fields required.");return;}
    if(cards.find(c=>c.name===form.name)){setErr("Card name already exists.");return;}
    setSaving(true);
    try{
      const newCard=await api.createCard({...form,active:true});
      onUpdate([...cards,{id:newCard.id,name:newCard.name,network:newCard.network,last4:newCard.last4,division:newCard.division,active:newCard.active}]);
      setForm({name:"",network:"Visa",last4:"",division:""});setShowAdd(false);setErr("");
    }catch(e){setErr("Failed to save. Try again.");}
    setSaving(false);
  };

  const startEdit=(c)=>{setEditId(c.id);setEditForm({...c});};
  const saveEdit=async()=>{
    setSaving(true);
    try{
      await api.updateCard(editId,{name:editForm.name,division:editForm.division});
      onUpdate(cards.map(c=>c.id===editId?{...editForm}:c));
      setEditId(null);
    }catch(e){setErr("Failed to save.");}
    setSaving(false);
  };

  const toggleActive=async(c)=>{
    try{
      await api.updateCard(c.id,{active:!c.active});
      onUpdate(cards.map(x=>x.id===c.id?{...x,active:!x.active}:x));
    }catch(e){setErr("Failed to update.");}
  };

  return(
    <div className="card" style={{padding:24,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>Credit Cards</div>
        <button className="btn-primary" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setShowAdd(v=>!v)}>+ Add Card</button>
      </div>
      <div style={{fontSize:12,color:"var(--text3)",marginBottom:16}}>Manage cards available for statement imports. Division is a custom label per card.</div>

      {/* Add form */}
      {showAdd&&(
        <div style={{background:"var(--surface2)",border:"1px solid var(--accent-border)",borderRadius:10,padding:16,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div className="input-group"><label className="input-label">Card Name / Label</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Visa ••4291"/></div>
            <div className="input-group"><label className="input-label">Network</label>
              <select value={form.network} onChange={e=>setForm(p=>({...p,network:e.target.value}))}>
                {["Visa","Mastercard","Amex","Discover"].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="input-group"><label className="input-label">Last 4 Digits</label><input value={form.last4} onChange={e=>setForm(p=>({...p,last4:e.target.value.slice(0,4)}))} placeholder="4291" maxLength={4}/></div>
            <div className="input-group"><label className="input-label">Division</label><input value={form.division} onChange={e=>setForm(p=>({...p,division:e.target.value}))} placeholder="e.g. Engineering"/></div>
          </div>
          {err&&<div className="alert-error" style={{marginBottom:10}}>{err}</div>}
          <div style={{display:"flex",gap:8}}>
            <button className="btn-primary" style={{fontSize:12}} onClick={add} disabled={saving}>{saving?"Saving…":"Add Card"}</button>
            <button className="btn-secondary" style={{fontSize:12}} onClick={()=>{setShowAdd(false);setErr("");}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Cards list */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {cards.map(c=>(
          <div key={c.id} style={{display:"grid",gridTemplateColumns:"40px 1fr 120px 100px 90px",gap:12,alignItems:"center",padding:"12px 14px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)",opacity:c.active?1:0.5}}>
            <div style={{width:32,height:32,borderRadius:8,background:"var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
              {c.network==="Visa"?"💳":c.network==="Amex"?"🟦":c.network==="Mastercard"?"🔴":"💳"}
            </div>
            {editId===c.id?(
              <>
                <input value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} style={{fontSize:12}} placeholder="Card name"/>
                <input value={editForm.division} onChange={e=>setEditForm(p=>({...p,division:e.target.value}))} style={{fontSize:12}} placeholder="Division"/>
                <button className="btn-success" style={{fontSize:11,padding:"5px 10px"}} onClick={saveEdit} disabled={saving}>{saving?"…":"Save"}</button>
                <button className="btn-ghost" style={{fontSize:11}} onClick={()=>setEditId(null)}>Cancel</button>
              </>
            ):(
              <>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{c.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{c.network} · ••{c.last4} · {c.active?"Active":"Inactive"}</div>
                </div>
                <span style={{fontSize:12,background:"var(--accent-dim)",color:"var(--accent)",borderRadius:6,padding:"3px 10px",border:"1px solid var(--accent-border)",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.division||"—"}</span>
                <button className="btn-ghost" style={{fontSize:11}} onClick={()=>startEdit(c)}>✎ Edit</button>
                <button className={c.active?"btn-danger":"btn-success"} style={{fontSize:11,padding:"5px 10px"}} onClick={()=>toggleActive(c)}>
                  {c.active?"Deactivate":"Activate"}
                </button>
              </>
            )}
          </div>
        ))}
        {cards.length===0&&<div style={{fontSize:12,color:"var(--text3)",textAlign:"center",padding:"20px 0"}}>No cards yet. Add one above.</div>}
      </div>
    </div>
  );
}

// ── CSV IMPORT MODAL ─────────────────────────────────────────────────────────
function ImportModal({ cards, currentUser, onImport, onClose }) {
  const [selectedCard,setSelectedCard]=useState("");
  const [selectedMonth,setSelectedMonth]=useState("");
  const [file,setFile]=useState(null);
  const [err,setErr]=useState("");
  const fileRef=useRef();
  const activeCards=cards.filter(c=>c.active);
  const monthOptions=[];
  const now=new Date();
  for(let i=0;i<12;i++){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    monthOptions.push({value:d.toISOString().slice(0,7),label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]+" "+d.getFullYear()});
  }
  const process=()=>{
    if(!selectedCard){setErr("Please select a card.");return;}
    if(!selectedMonth){setErr("Please select a statement month.");return;}
    if(!file){setErr("Please select a CSV file.");return;}
    const r=new FileReader();
    r.onload=e=>{
      try{
        const lines=e.target.result.split("\n").filter(Boolean);
        const headers=lines[0].toLowerCase().split(",").map(h=>h.trim().replace(/"/g,""));
        const rows=lines.slice(1).map((line,i)=>{
          const vals=line.split(",").map(v=>v.trim().replace(/"/g,""));
          const obj={};headers.forEach((h,j)=>obj[h]=vals[j]||"");
          const vendor=obj.vendor||obj.merchant||obj.description||"Unknown";
          const amount=parseFloat((obj.amount||obj.debit||"0").replace(/[$,]/g,""))||0;
          const date=obj.date||selectedMonth+"-01";
          const a=autoAssign(vendor);
          return{id:Date.now()+i,date,vendor,description:obj.description||"",amount,
            card:selectedCard,stmtMonth:selectedMonth,userId:currentUser.id,
            ...a,isRecurring:RECURRING_GL_CODES.has(a.categoryId),
            assigneeId:currentUser.id,autoAssignee:false,
            status:"pending",receipt:null,receiptMatch:null,memo:"",flagReason:"",reconId:null};
        });
        onImport(rows);onClose();
      }catch{setErr("Could not parse CSV. Ensure columns: Date, Vendor, Amount.");}
    };
    r.readAsText(file);
  };
  return(
    <div className="modal-overlay">
      <div className="modal-box card" style={{width:"100%",maxWidth:480,padding:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Import Credit Card Statement</div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
          <div className="input-group"><label className="input-label">Credit Card</label>
            <select value={selectedCard} onChange={e=>setSelectedCard(e.target.value)}>
              <option value="">— Select card —</option>
              {activeCards.map(c=><option key={c.id} value={c.name}>{c.name} · {c.division}</option>)}
            </select>
          </div>
          <div className="input-group"><label className="input-label">Statement Month</label>
            <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
              <option value="">— Select month —</option>
              {monthOptions.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="input-group"><label className="input-label">CSV File</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{flex:1,padding:"8px 12px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",fontSize:12,color:file?"var(--text)":"var(--text3)",cursor:"pointer",fontFamily:"var(--mono)"}} onClick={()=>fileRef.current.click()}>
                {file?file.name:"Click to select CSV…"}
              </div>
              <button className="btn-secondary" style={{fontSize:12,whiteSpace:"nowrap"}} onClick={()=>fileRef.current.click()}>Browse</button>
            </div>
            <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
          </div>
        </div>
        {err&&<div className="alert-error" style={{marginBottom:14}}>⚠ {err}</div>}
        {selectedCard&&selectedMonth&&<div style={{background:"var(--accent-dim)",border:"1px solid var(--accent-border)",borderRadius:"var(--radius)",padding:"10px 14px",marginBottom:14,fontSize:12,color:"var(--accent)"}}>
          ℹ All rows tagged: <strong>{selectedCard}</strong> · <strong>{monthOptions.find(m=>m.value===selectedMonth)?.label}</strong>
        </div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={process}>Import Statement →</button>
        </div>
      </div>
    </div>
  );
}

function NSModal({ transactions, onClose, onDone }) {
  const [step,setStep]=useState(0);
  const [reconId]=useState(genReconId);
  const [ts]=useState(()=>new Date().toISOString());
  const approved=transactions.filter(t=>t.status==="approved");
  const total=approved.reduce((s,t)=>s+t.amount,0);
  const wReceipts=approved.filter(t=>t.receipt).length;

  const go=()=>{setStep(1);setTimeout(()=>{setStep(2);onDone({reconId,exportedAt:ts,nsId:"EXP-"+reconId.split("-")[2],txCount:approved.length,total,receiptCount:wReceipts});},2500);};

  return(
    <div className="modal-overlay">
      <div className="modal-box card" style={{width:"100%",maxWidth:520}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,background:"var(--surface2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border)"}}>
            <span style={{fontWeight:900,fontSize:16,color:"var(--accent)"}}>N</span>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>Export to NetSuite</div>
            <div style={{fontSize:12,color:"var(--text3)"}}>Create expense report · Simulated API</div>
          </div>
        </div>
        <div style={{padding:24}}>
          {step===0&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[["Report","CC Recon · Mar 2025"],["Transactions",`${approved.length} lines`],["Total",fmt(total)],["Receipts",`${wReceipts}/${approved.length}`],["Subsidiary","Acme Corp US"],["Period","March 2025"]].map(([k,v])=>(
                  <div key={k} style={{background:"var(--surface2)",borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{k}</div>
                    <div style={{fontSize:13,fontFamily:"var(--mono)",color:"var(--text)",fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--mono)",background:"var(--surface2)",borderRadius:8,padding:"10px 14px",marginBottom:14}}>📎 All receipts compiled into a single PDF attached to the report.</div>
              <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                {approved.map(t=>(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"var(--surface2)",borderRadius:6,fontSize:12,fontFamily:"var(--mono)"}}>
                    <span style={{color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"50%"}}>{t.vendor}</span>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{color:"var(--text3)"}}>{CATEGORIES.find(c=>c.id===t.categoryId)?.name||t.categoryName||"—"}</span>
                      <span style={{color:"var(--text)",fontWeight:600}}>{fmt(t.amount)}</span>
                      <span style={{opacity:t.receipt?1:0.2}}>📎</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {step===1&&(
            <div style={{textAlign:"center",padding:"44px 0"}}>
              <div style={{width:44,height:44,border:"3px solid var(--border2)",borderTopColor:"var(--accent)",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 0.8s linear infinite"}}/>
              <div style={{fontSize:15,fontWeight:600,color:"var(--text)"}}>Connecting to NetSuite...</div>
              <div style={{fontSize:12,color:"var(--text3)",marginTop:6}}>Compiling receipts PDF · Posting via REST API</div>
            </div>
          )}
          {step===2&&(
            <div style={{textAlign:"center",padding:"20px 0 10px"}}>
              <div style={{width:52,height:52,background:"var(--green-dim)",border:"1px solid var(--green-border)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>✓</div>
              <div style={{fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:4}}>Expense Report Created</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:20}}>Pending approval in NetSuite</div>
              <div style={{background:"var(--surface2)",borderRadius:12,padding:"14px 18px",marginBottom:14,textAlign:"left",border:"1px solid var(--accent-border)"}}>
                <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Internal Reconciliation ID</div>
                <div style={{fontFamily:"var(--mono)",fontSize:20,fontWeight:600,color:"var(--accent)"}}>{reconId}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,textAlign:"left"}}>
                {[["NetSuite ID","EXP-"+reconId.split("-")[2]],["Status","Pending Approval"],["Lines",approved.length],["Receipts PDF","1 file attached"],["Exported at",fmtDateTime(ts)],["Period","March 2025"]].map(([k,v])=>(
                  <div key={k} style={{background:"var(--surface2)",borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{k}</div>
                    <div style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--text)",fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",gap:10,justifyContent:"flex-end"}}>
          {step===0&&<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={go}>Create Expense Report →</button></>}
          {step===2&&<button className="btn-primary" onClick={onClose}>Done</button>}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [users,setUsers]=useState([]);
  const [currentUser,setCurrentUser]=useState(null);
  const [vendorAssignees,setVendorAssignees]=useState(DEFAULT_VENDOR_ASSIGNEES);
  const [transactions,setTransactions]=useState([]);
  const [loading,setLoading]=useState(false);
  const [cards,setCards]=useState([]);
  const [showImport,setShowImport]=useState(false);
  const [activeTab,setActiveTab]=useState("transactions");
  const [filterStatus,setFilterStatus]=useState("all");
  const [filterUser,setFilterUser]=useState("all");
  const [filterCard,setFilterCard]=useState("all");
  const [filterMonth,setFilterMonth]=useState("all");
  const [search,setSearch]=useState("");
  const [selectedTxId,setSelectedTxId]=useState(null);
  const [showNS,setShowNS]=useState(false);
  const [showStmt,setShowStmt]=useState(false);
  const [showAccountSettings,setShowAccountSettings]=useState(false);
  const [showUserMenu,setShowUserMenu]=useState(false);
  const [uploadedReceipts,setUploadedReceipts]=useState([]);
  const [showMatcher,setShowMatcher]=useState(false);
  const [unmappedReceipts,setUnmappedReceipts]=useState([]);
  const [exportHistory,setExportHistory]=useState([]);
  const [stmtStatus,setStmtStatus]=useState({});
  const [csvErr,setCsvErr]=useState("");
  const csvRef=useRef();
  const rcptRef=useRef();

  // ── LOAD FROM DB ON LOGIN ──────────────────────────────────────────────────
  useEffect(()=>{
    if(!currentUser)return;
    setLoading(true);
    const getCards = api.getCards || (()=>Promise.resolve([]));
    Promise.all([
      api.getUsers(),
      api.getTransactions(),
      api.getExportHistory(),
      api.getStatementStatuses(),
      getCards(),
    ]).then(([u,t,e,s,c])=>{
      setUsers(u);
      setTransactions(t);
      setExportHistory(e);
      setStmtStatus(s);
      setCards(c);
      setLoading(false);
    }).catch(err=>{console.error("DB load error:",err);setLoading(false);});
  },[currentUser]);

  const isAdmin=currentUser?.role==="admin";
  const isUser=currentUser?.role==="user";

  const update=useCallback(async (id,changes)=>{
    // Handle receipt separately
    if('receipt' in changes){
      if(changes.receipt){
        await api.attachReceipt(id,{...changes.receipt,receiptMatch:changes.receiptMatch});
      } else {
        await api.removeReceipt(id);
      }
    }
    // Update transaction row in DB
    await api.updateTransaction(id,changes);
    // Update local state
    setTransactions(prev=>prev.map(t=>t.id===id?{...t,...changes}:t));
  },[]);
  const myTxs=transactions.filter(t=>t.userId===currentUser?.id);
  const myStmt=stmtStatus[currentUser?.id]||"open";
  const stmtLocked=["submitted","approved","exported"].includes(myStmt);

  const submitStmt=async ()=>{
    const period=new Date().toISOString().slice(0,7);
    const ids=myTxs.filter(t=>t.status==="pending").map(t=>t.id);
    await Promise.all([
      api.bulkUpdateStatus(ids,"submitted"),
      api.setStatementStatus(currentUser.id,period,"submitted"),
    ]);
    setTransactions(prev=>prev.map(t=>t.userId===currentUser.id&&t.status==="pending"?{...t,status:"submitted"}:t));
    setStmtStatus(s=>({...s,[currentUser.id]:"submitted"}));
    setShowStmt(false);
  };

  const handleImport=(rows)=>{ setTransactions(prev=>[...prev,...rows]); };

  const [rawFiles,setRawFiles]=useState([]);

  const handleRcptFolder=(files)=>{
    const arr=Array.from(files).map(f=>({name:f.name,size:f.size,url:URL.createObjectURL(f)}));
    setUploadedReceipts(arr);
    setRawFiles(Array.from(files));
    setShowMatcher(true);
  };

  const handleMatchConfirm=(matches)=>{
    const mapped=new Set();
    setTransactions(prev=>prev.map(t=>{
      const match=Object.entries(matches).find(([,v])=>v.txId===t.id);
      if(!match)return t;
      const r=uploadedReceipts.find(r=>r.name===match[0]);
      if(r)mapped.add(r.name);
      return r?{...t,receipt:{name:r.name,size:r.size,url:r.url},receiptMatch:match[1].confidence}:t;
    }));
    // persist receipts that were left unmapped
    const leftover=uploadedReceipts.filter(r=>!mapped.has(r.name));
    setUnmappedReceipts(prev=>{const names=new Set(prev.map(x=>x.name));return [...prev,...leftover.filter(x=>!names.has(x.name))];});
    setShowMatcher(false);
  };

  const handleExportDone=async (record)=>{
    const full={...record,exportedBy:currentUser.name};
    await Promise.all([
      api.saveExportRecord(full),
      api.bulkUpdateStatus(
        transactions.filter(t=>t.status==="approved").map(t=>t.id),
        "exported",
        full.reconId
      ),
    ]);
    setExportHistory(prev=>[full,...prev]);
    setTransactions(prev=>prev.map(t=>t.status==="approved"?{...t,status:"exported",reconId:full.reconId}:t));
  };

  // derive available months from all transactions
  const availableMonths = [...new Set(transactions.map(t=>t.date.slice(0,7)))].sort();

  const vis=transactions.filter(t=>{
    if(isUser&&t.userId!==currentUser.id)return false;
    if(filterStatus!=="all"&&t.status!==filterStatus)return false;
    if(filterUser!=="all"&&t.userId!==filterUser)return false;
    if(filterCard!=="all"&&t.card!==filterCard)return false;
    if(filterMonth!=="all"&&!t.date.startsWith(filterMonth))return false;
    if(search&&!t.vendor.toLowerCase().includes(search.toLowerCase())&&!t.description.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  const counts={
    all:isUser?myTxs.length:transactions.length,
    pending:transactions.filter(t=>t.status==="pending"&&(isUser?t.userId===currentUser?.id:true)).length,
    submitted:transactions.filter(t=>t.status==="submitted").length,
    approved:transactions.filter(t=>t.status==="approved").length,
    flagged:transactions.filter(t=>t.status==="flagged"&&(isUser?t.userId===currentUser?.id:true)).length,
    exported:transactions.filter(t=>t.status==="exported").length,
  };

  const approvedAmt=transactions.filter(t=>t.status==="approved").reduce((s,t)=>s+t.amount,0);
  const totalAmt=vis.reduce((s,t)=>s+t.amount,0);
  const selectedTx=transactions.find(t=>t.id===selectedTxId);

  const handleLogin=async (email,pw)=>{
    const u=await api.loginUser(email,pw);
    if(u)setCurrentUser({...u,role:u.role,name:u.name,id:u.id,card:u.card});
    return u;
  };

  if(!currentUser)return <LoginPage onLogin={handleLogin}/>;
  if(loading)return(
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{CSS}</style>
      <div style={{width:36,height:36,border:"3px solid var(--border2)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <div style={{fontSize:13,color:"var(--text3)"}}>Loading your data…</div>
    </div>
  );;

  const tabs=isAdmin?["transactions","receipts","users","settings"]:["transactions","receipts"];
  const totalRcptBadge=unmappedReceipts.length+uploadedReceipts.length;
  const tabLabel={transactions:"Transactions",receipts:"Receipts"+(unmappedReceipts.length>0?" ("+unmappedReceipts.length+" unmapped)":""),users:"Users",settings:"Settings"};

  return(
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <style>{CSS}</style>

      {/* NAV */}
      <div style={{background:"var(--bg2)",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:1340,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,paddingRight:24,borderRight:"1px solid var(--border)",marginRight:4,height:56,flexShrink:0}}>
            <div style={{width:28,height:28,background:"var(--accent-dim)",border:"1px solid var(--accent-border)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10C5 7.2 7.2 5 10 5h10" stroke="#4f7df3" strokeWidth="2.6" strokeLinecap="round"/>
                <path d="M20 5l-3-3M20 5l-3 3" stroke="#4f7df3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 18C23 20.8 20.8 23 18 23H8" stroke="#4f7df3" strokeWidth="2.6" strokeLinecap="round"/>
                <path d="M8 23l3 3M8 23l3-3" stroke="#4f7df3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{fontSize:15,fontWeight:700,color:"var(--text)",letterSpacing:"-0.02em"}}>Reconcile</span>
          </div>
          <div style={{display:"flex",flex:1,overflowX:"auto"}}>
            {tabs.map(t=><button key={t} className={`nav-tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>{tabLabel[t]}</button>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,paddingLeft:16,flexShrink:0}}>
            {isAdmin&&counts.approved>0&&(
              <button className="btn-primary" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>setShowNS(true)}>Export to NetSuite →</button>
            )}
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"var(--surface2)",borderRadius:8,border:"1px solid var(--border)",cursor:"pointer",userSelect:"none"}} onClick={()=>setShowUserMenu(v=>!v)}>
                <Av name={currentUser.name} color={ROLE_COLOR[currentUser.role]} size={22}/>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--text)",lineHeight:1.2}}>{currentUser.name}</div>
                  <div style={{fontSize:10,color:"var(--text3)",lineHeight:1.2}}>{ROLE_LABEL[currentUser.role]}</div>
                </div>
                <span style={{fontSize:10,color:"var(--text3)",marginLeft:2}}>▾</span>
              </div>
              {showUserMenu&&(
                <>
                  <div style={{position:"fixed",inset:0,zIndex:98}} onClick={()=>setShowUserMenu(false)}/>
                  <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:6,minWidth:180,zIndex:99,boxShadow:"var(--shadow)"}}>
                    <button className="btn-ghost" style={{width:"100%",textAlign:"left",padding:"8px 12px",fontSize:13,borderRadius:6}} onClick={()=>{setShowUserMenu(false);setShowAccountSettings(true);}}>
                      ⚙ Account Settings
                    </button>
                    <div style={{height:1,background:"var(--border)",margin:"4px 0"}}/>
                    <button className="btn-ghost" style={{width:"100%",textAlign:"left",padding:"8px 12px",fontSize:13,borderRadius:6,color:"var(--red)"}} onClick={()=>{setShowUserMenu(false);setCurrentUser(null);}}>
                      ↩ Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1340,margin:"0 auto",padding:"28px 24px"}}>

        {/* TRANSACTIONS */}
        {activeTab==="transactions"&&(
          <>
            {isUser&&myTxs.filter(t=>!t.receipt).length>0&&(
              <div className="alert-error" style={{marginBottom:20,fontSize:13}}>⚠ {myTxs.filter(t=>!t.receipt).length} transaction{myTxs.filter(t=>!t.receipt).length>1?"s are":" is"} missing a receipt.</div>
            )}

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:12,marginBottom:24}}>
              {[{l:"Total",v:fmt(totalAmt),s:`${vis.length} transactions`},{l:"Pending",v:counts.pending,s:"to review",c:"var(--amber)"},{l:"In Review",v:counts.submitted,s:"submitted",c:"var(--accent)"},{l:"Approved",v:fmt(approvedAmt),s:`${counts.approved} lines`,c:"var(--green)"},{l:"Flagged",v:counts.flagged,s:"need attention",c:"var(--red)"},{l:"Recurring",v:vis.filter(t=>t.isRecurring).length,s:"subscriptions",c:"var(--purple)"}].map(s=>(
                <div key={s.l} className="stat-card">
                  <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{s.l}</div>
                  <div style={{fontSize:22,fontWeight:700,color:s.c||"var(--text)",letterSpacing:"-0.03em"}}>{s.v}</div>
                  <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>{s.s}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="card" style={{padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginBottom:6}}>
                  <span>Review progress</span>
                  <span>{counts.approved} / {isUser?myTxs.length:transactions.length} approved</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${(counts.approved/Math.max(isUser?myTxs.length:transactions.length,1))*100}%`}}/></div>
              </div>
              <span style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--mono)"}}>{Math.round((counts.approved/Math.max(isUser?myTxs.length:transactions.length,1))*100)}%</span>
            </div>

            {/* Toolbar */}
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{display:"flex",background:"var(--surface)",borderRadius:10,border:"1px solid var(--border)",overflow:"hidden"}}>
                {["all","pending","submitted","approved","flagged","exported"].map(f=>(
                  <button key={f} onClick={()=>setFilterStatus(f)} style={{padding:"7px 11px",fontSize:11,border:"none",background:filterStatus===f?"var(--surface3)":"transparent",color:filterStatus===f?"var(--text)":"var(--text3)",fontFamily:"var(--mono)",fontWeight:filterStatus===f?600:400,transition:"all 0.15s"}}>
                    {f.charAt(0).toUpperCase()+f.slice(1)}<span style={{opacity:0.5,marginLeft:4}}>({counts[f]??vis.length})</span>
                  </button>
                ))}
              </div>
              {/* Month / statement dropdown */}
              <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{width:"auto",minWidth:130,fontSize:12}}>
                <option value="all">All months</option>
                {availableMonths.map(m=>{
                  const [y,mo]=m.split("-");
                  return <option key={m} value={m}>{MONTHS[+mo-1]} {y}</option>;
                })}
              </select>
              {isAdmin&&(
                <select value={filterUser} onChange={e=>setFilterUser(e.target.value)} style={{width:"auto",minWidth:160,fontSize:12}}>
                  <option value="all">All users</option>
                  {users.filter(u=>u.role==="user").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              )}
              {isAdmin&&(
                <select value={filterCard} onChange={e=>setFilterCard(e.target.value)} style={{width:"auto",minWidth:160,fontSize:12}}>
                  <option value="all">All cards</option>
                  {cards.filter(c=>c.active).map(c=><option key={c.id} value={c.name}>{c.name} · {c.division}</option>)}
                </select>
              )}
              <input type="text" placeholder="Search vendor or description..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:220}}/>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <button className="btn-secondary" style={{fontSize:12}} onClick={()=>setShowImport(true)}>↑ Import Statement</button>
              </div>
            </div>
            {csvErr&&<div className="alert-error" style={{marginBottom:12}}>{csvErr}</div>}

            {/* Table */}
            <div className="card" style={{overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"82px 1fr 1fr 96px 96px 110px 80px 80px 28px",padding:"10px 16px",background:"var(--surface2)",borderBottom:"1px solid var(--border)",fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>
                <span>Date</span><span>Vendor</span><span>Category · Dept</span><span>User</span><span>Assignee</span><span style={{textAlign:"right"}}>Amount</span><span style={{textAlign:"center"}}>Receipt</span><span style={{textAlign:"center"}}>Status</span><span/>
              </div>
              <div style={{overflowY:"auto",maxHeight:"calc(100vh - 420px)"}}>
                {vis.length===0&&<div style={{padding:40,textAlign:"center",color:"var(--text3)",fontSize:13}}>No transactions match your filters.</div>}
                {vis.map(t=>{
                  const owner=users.find(u=>u.id===t.userId);
                  const assignee=users.find(u=>u.id===t.assigneeId);
                  const cat=CATEGORIES.find(c=>c.id===t.categoryId);
                  return(
                    <div key={t.id} className={"tx-row"+(selectedTxId===t.id?" selected":"")}
                      style={{display:"grid",gridTemplateColumns:"82px 1fr 1fr 96px 96px 110px 80px 80px 28px",alignItems:"center",padding:"11px 16px",cursor:"pointer"}}
                      onClick={()=>setSelectedTxId(t.id)}>
                      <span style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--mono)"}}>{fmtDate(t.date)}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--text)",display:"flex",alignItems:"center",gap:6}}>
                          {t.vendor}
                          {t.isRecurring&&<span className="tag tag-purple" style={{fontSize:9,padding:"1px 6px"}}>↻ Recurring</span>}
                        </div>
                        <div style={{fontSize:11,color:"var(--text3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{t.description}</div>
                      </div>
                      <div>
                        <div style={{fontSize:12,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                          <span style={{color:"var(--text)",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{t.categoryName||"—"}</span>
                          {cat&&<span className={cat.billable==="Billable"?"tag tag-green":"tag tag-gray"} style={{fontSize:9,padding:"1px 5px"}}>{cat.billable}</span>}
                          {t.autoAssigned&&<span className="tag tag-ai" style={{fontSize:9,padding:"1px 5px"}}>AI</span>}
                        </div>
                        <div style={{fontSize:11,color:"var(--text3)",marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                          {t.dept}
                          {t.reconId&&<span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent)",background:"var(--accent-dim)",borderRadius:4,padding:"1px 5px",border:"1px solid var(--accent-border)"}}>{t.reconId}</span>}
                        </div>
                      </div>
                      <span style={{fontSize:12,color:"var(--text2)"}}>{owner?.name.split(" ")[0]||"—"}</span>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        {assignee?<><Av name={assignee.name} color={ROLE_COLOR[assignee.role]} size={20}/><span style={{fontSize:11,color:"var(--text2)"}}>{assignee.name.split(" ")[0]}</span>{t.autoAssignee&&<span style={{fontSize:9,color:"var(--purple)"}}>⚡</span>}</>:<span style={{fontSize:11,color:"var(--text3)"}}>—</span>}
                      </div>
                      <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:600,color:"var(--text)",textAlign:"right"}}>{fmt(t.amount)}</span>
                      <div style={{textAlign:"center"}}>{t.receipt?<span title={t.receipt.name} style={{cursor:"default"}}>📎{t.receiptMatch&&<span style={{fontSize:9,color:"var(--purple)"}}> ⚡</span>}</span>:<span style={{opacity:0.2}}>📎</span>}</div>
                      <div style={{textAlign:"center"}}><StatusTag status={t.status}/></div>
                      <div style={{color:"var(--text3)"}}>›</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {isAdmin&&counts.submitted>0&&(
              <div style={{marginTop:14}}>
                <button className="btn-success" style={{fontSize:12}} onClick={()=>setTransactions(prev=>prev.map(t=>t.status==="submitted"?{...t,status:"approved"}:t))}>
                  ✓ Approve All Submitted ({counts.submitted})
                </button>
              </div>
            )}
          </>
        )}

        {/* RECEIPTS */}
        {activeTab==="receipts"&&(
          <div style={{maxWidth:700}}>
            <div style={{fontSize:18,fontWeight:700,color:"var(--text)",letterSpacing:"-0.02em",marginBottom:6}}>Receipt Management</div>
            <div style={{fontSize:13,color:"var(--text3)",marginBottom:24}}>Upload your monthly receipts folder. AI reads each file and matches it to a transaction by vendor, amount & date.</div>
            <div className="card" style={{padding:24,marginBottom:20}}>
              <div className="drop-zone" style={{padding:"44px 24px",textAlign:"center"}} onClick={()=>rcptRef.current.click()}
                onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag-over");}}
                onDragLeave={e=>e.currentTarget.classList.remove("drag-over")}
                onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove("drag-over");handleRcptFolder(e.dataTransfer.files);}}>
                <div style={{fontSize:32,marginBottom:12}}>📂</div>
                <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:6}}>Drop receipts folder here</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>Multiple files · PDF, JPG, PNG · AI will match to transactions</div>
              </div>
              <input ref={rcptRef} type="file" accept="image/*,application/pdf" multiple style={{display:"none"}} onChange={e=>handleRcptFolder(e.target.files)}/>
            </div>
            {/* Unmapped receipts holding area */}
            {unmappedReceipts.length>0&&(
              <div className="card" style={{overflow:"hidden",marginBottom:20,border:"1px solid var(--amber-border)"}}>
                <div style={{padding:"12px 16px",background:"var(--amber-dim)",borderBottom:"1px solid var(--amber-border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:13}}>📥</span>
                    <span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--amber)"}}>Unmapped Receipts ({unmappedReceipts.length})</span>
                  </div>
                  <span style={{fontSize:11,color:"var(--amber)"}}>Assign each receipt to a transaction below</span>
                </div>
                {unmappedReceipts.map(r=>(
                  <div key={r.name} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:12,alignItems:"center",padding:"12px 16px",borderBottom:"1px solid var(--border)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:20}}>📄</span>
                      <div>
                        <div style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--text)",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{r.name}</div>
                        <div style={{fontSize:11,color:"var(--text3)"}}>{(r.size/1024).toFixed(0)} KB</div>
                      </div>
                    </div>
                    <select defaultValue="" onChange={e=>{
                      const txId=+e.target.value;
                      if(!txId)return;
                      update(txId,{receipt:{name:r.name,size:r.size,url:r.url},receiptMatch:null});
                      setUnmappedReceipts(prev=>prev.filter(x=>x.name!==r.name));
                    }} style={{fontSize:12}}>
                      <option value="">— Assign to transaction —</option>
                      {(isUser?myTxs:transactions).filter(t=>!t.receipt).map(t=>(
                        <option key={t.id} value={t.id}>{fmtDate(t.date)} · {t.vendor} · {fmt(t.amount)}</option>
                      ))}
                    </select>
                    <button className="btn-ghost" style={{color:"var(--red)",fontSize:12,padding:"4px 8px"}} onClick={()=>setUnmappedReceipts(prev=>prev.filter(x=>x.name!==r.name))} title="Discard receipt">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="card" style={{overflow:"hidden"}}>
              <div style={{padding:"12px 16px",background:"var(--surface2)",borderBottom:"1px solid var(--border)",fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Receipt Status · All Transactions</div>
              {(isUser?myTxs:transactions).map(t=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:"1px solid var(--border)"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{t.vendor}</div>
                    <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--mono)"}}>{fmtDate(t.date)} · {fmt(t.amount)}</div>
                  </div>
                  {t.receipt?(
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      {t.receiptMatch&&<span className="tag tag-ai">⚡ AI</span>}
                      <span className="tag tag-green">📎 {t.receipt.name.length>20?t.receipt.name.slice(0,17)+"…":t.receipt.name}</span>
                    </div>
                  ):<span className="tag tag-red">⚠ Missing</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab==="users"&&isAdmin&&<UserMgmt users={users} onUpdate={setUsers}/>}

        {/* SETTINGS */}
        {activeTab==="settings"&&isAdmin&&(
          <div style={{maxWidth:660}}>
            <div style={{fontSize:18,fontWeight:700,color:"var(--text)",letterSpacing:"-0.02em",marginBottom:24}}>Settings</div>

            {/* ── CREDIT CARDS ── */}
            <CreditCardSettings cards={cards} onUpdate={setCards}/>

            <div className="card" style={{padding:24,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>Expense Categories</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>Fixed categories used for AI auto-assignment. Billable status shown per category.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:6,maxHeight:260,overflowY:"auto"}}>
                {CATEGORIES.map(c=>(
                  <div key={c.id} style={{display:"contents"}}>
                    <div style={{fontSize:12,padding:"7px 10px",background:"var(--surface2)",borderRadius:6,color:"var(--text)",display:"flex",alignItems:"center"}}>{c.name}</div>
                    <div style={{padding:"7px 0",display:"flex",alignItems:"center"}}>
                      <span className={c.billable==="Billable"?"tag tag-green":"tag tag-gray"} style={{fontSize:10,whiteSpace:"nowrap"}}>{c.billable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{padding:24,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>NetSuite Connection</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>TBA credentials for live export. Currently simulated.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {["Account ID","Consumer Key","Consumer Secret","Token ID","Token Secret"].map(f=>(
                  <div key={f} className="input-group"><label className="input-label">{f}</label><input type={f.includes("Secret")||f.includes("Key")?"password":"text"} placeholder={`Enter ${f}...`}/></div>
                ))}
              </div>
              <div style={{display:"flex",gap:10,marginBottom:12}}>
                <button className="btn-primary" style={{fontSize:12}}>Save Credentials</button>
                <button className="btn-secondary" style={{fontSize:12}}>Test Connection</button>
              </div>
              <div style={{fontSize:11,color:"var(--text3)",background:"var(--surface2)",borderRadius:8,padding:"10px 14px"}}>ℹ Use TBA from NetSuite Setup → Integrations. Credentials stored locally in browser.</div>
            </div>

            <div className="card" style={{padding:24,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>Auto-Assignment Rules</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>Vendor → Category mapping used by AI.</div>
              <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:200,overflowY:"auto"}}>
                {Object.entries(GL_RULES_DATA).map(([vendor,rule])=>(
                  <div key={vendor} style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr",gap:8,fontSize:11,padding:"6px 10px",background:"var(--surface2)",borderRadius:6}}>
                    <span style={{color:"var(--text)"}}>{vendor}</span>
                    <span style={{color:"var(--text3)",textAlign:"center"}}>→</span>
                    <span style={{color:"var(--accent)"}}>{rule.categoryName}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{padding:24,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>Assignee Rules</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>Map vendor keywords to a default assignee. Finance and admin can override per transaction.</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                {Object.entries(vendorAssignees).map(([vendor,uid])=>{
                  const u=users.find(x=>x.id===uid);
                  return(
                    <div key={vendor} style={{display:"grid",gridTemplateColumns:"1fr auto 1fr auto",gap:8,alignItems:"center",padding:"8px 12px",background:"var(--surface2)",borderRadius:8}}>
                      <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--text)"}}>{vendor}</span>
                      <span style={{color:"var(--text3)",fontSize:12}}>→</span>
                      <select value={uid} onChange={e=>setVendorAssignees(a=>({...a,[vendor]:e.target.value}))} style={{fontSize:12}}>
                        {users.filter(x=>x.active).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}
                      </select>
                      <button className="btn-danger" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>setVendorAssignees(a=>{const n={...a};delete n[vendor];return n;})}>✕</button>
                    </div>
                  );
                })}
              </div>
              <button className="btn-secondary" style={{fontSize:12}} onClick={()=>{
                const vendor=prompt("Vendor keyword (lowercase):");
                if(!vendor)return;
                setVendorAssignees(a=>({...a,[vendor.toLowerCase()]:users.find(u=>u.role==="user")?.id||""}));
              }}>+ Add Rule</button>
            </div>

            <div className="card" style={{padding:24}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>Export History</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>All reconciliation batches pushed to NetSuite.</div>
              {exportHistory.length===0?(
                <div style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--mono)",padding:"20px 0",textAlign:"center",borderTop:"1px solid var(--border)"}}>No exports yet.</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {exportHistory.map(r=>(
                    <div key={r.reconId} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{fontFamily:"var(--mono)",fontWeight:600,fontSize:14,color:"var(--accent)"}}>{r.reconId}</div>
                        <span className="tag tag-green">Exported</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                        {[["NetSuite ID",r.nsId],["Total",fmt(r.total)],["Lines",r.txCount],["Receipts",`${r.receiptCount} attached`],["By",r.exportedBy],["At",fmtDateTime(r.exportedAt)]].map(([k,v])=>(
                          <div key={k}>
                            <div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{k}</div>
                            <div style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--text)",fontWeight:500}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* OVERLAYS */}
      {showAccountSettings&&<AccountSettingsModal currentUser={currentUser} onClose={()=>setShowAccountSettings(false)} onPasswordChanged={()=>setTimeout(()=>setShowAccountSettings(false),1500)}/>}
      {selectedTx&&<TxDrawer tx={selectedTx} currentUser={currentUser} allUsers={users} onUpdate={update} onClose={()=>setSelectedTxId(null)} locked={isUser&&stmtLocked}/>}
      {showStmt&&<StatementModal myTxs={myTxs} onConfirm={submitStmt} onClose={()=>setShowStmt(false)}/>}
      {showMatcher&&<ReceiptMatcher receipts={uploadedReceipts} rawFiles={rawFiles} transactions={isUser?myTxs:transactions} onConfirm={handleMatchConfirm} onClose={()=>setShowMatcher(false)}/>}
      {showImport&&<ImportModal cards={cards} currentUser={currentUser} onImport={handleImport} onClose={()=>setShowImport(false)}/>}
      {showNS&&<NSModal transactions={transactions} onClose={()=>setShowNS(false)} onDone={handleExportDone}/>}
    </div>
  );
}