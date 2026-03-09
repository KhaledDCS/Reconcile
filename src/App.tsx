// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f2eb; }
  :root {
    --ink: #1a1814;
    --ink2: #4a4640;
    --ink3: #8a8680;
    --paper: #f5f2eb;
    --paper2: #ede9e0;
    --paper3: #e2ddd4;
    --rule: #d4cfc6;
    --accent: #c84b2f;
    --accent2: #e8b84b;
    --green: #2d6a4f;
    --blue: #1a4f7a;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'Cabinet Grotesk', sans-serif;
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--paper2); }
  ::-webkit-scrollbar-thumb { background: var(--rule); border-radius: 2px; }
  input, select, textarea {
    font-family: var(--mono);
    font-size: 12px;
    background: var(--paper);
    border: 1px solid var(--rule);
    color: var(--ink);
    border-radius: 6px;
    padding: 7px 10px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--ink2); }
  select { cursor: pointer; }
  button { cursor: pointer; font-family: var(--sans); font-weight: 700; border: none; transition: all 0.15s; }
  .btn-primary {
    background: var(--ink);
    color: var(--paper);
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    letter-spacing: 0.01em;
  }
  .btn-primary:hover { background: var(--accent); }
  .btn-secondary {
    background: var(--paper2);
    color: var(--ink);
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    border: 1px solid var(--rule);
  }
  .btn-secondary:hover { background: var(--paper3); }
  .btn-ghost {
    background: transparent;
    color: var(--ink2);
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: var(--mono);
    font-weight: 500;
  }
  .btn-ghost:hover { background: var(--paper2); color: var(--ink); }
  .card {
    background: var(--paper);
    border: 1px solid var(--rule);
    border-radius: 12px;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 500;
  }
  .tag-green { background: #d4edda; color: #1a5c35; border: 1px solid #b8dfc6; }
  .tag-amber { background: #fef3cd; color: #7d5a00; border: 1px solid #fde08d; }
  .tag-red { background: #fde8e4; color: #8b2013; border: 1px solid #f5bdb5; }
  .tag-blue { background: #dce8f5; color: #0f3a5c; border: 1px solid #b8d4ed; }
  .tag-gray { background: var(--paper2); color: var(--ink2); border: 1px solid var(--rule); }
  .tag-ai { background: #f0e8ff; color: #4a1c8a; border: 1px solid #d4b8f5; }
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(26,24,20,0.55);
    backdrop-filter: blur(3px);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { transform: translateY(12px); opacity:0 } to { transform: translateY(0); opacity:1 } }
  .modal-box { animation: slideUp 0.2s ease; }
  .tx-row { border-bottom: 1px solid var(--rule); transition: background 0.1s; }
  .tx-row:hover { background: var(--paper2); }
  .tx-row.selected { background: #fef8e8; }
  .spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
  .drop-zone {
    border: 2px dashed var(--rule);
    border-radius: 10px;
    transition: all 0.2s;
    cursor: pointer;
  }
  .drop-zone:hover, .drop-zone.drag-over {
    border-color: var(--ink2);
    background: var(--paper2);
  }
  .progress-bar {
    height: 3px;
    background: var(--rule);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--green);
    border-radius: 2px;
    transition: width 0.4s ease;
  }
  .match-confidence {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .conf-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
  }
  .tooltip {
    position: relative;
  }
  .tooltip:hover::after {
    content: attr(data-tip);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--ink);
    color: var(--paper);
    font-family: var(--mono);
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 99;
    pointer-events: none;
  }
  .nav-tab {
    padding: 10px 18px;
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--ink3);
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
    background: none;
    border-top: none; border-left: none; border-right: none;
    white-space: nowrap;
  }
  .nav-tab.active { color: var(--ink); border-bottom-color: var(--accent); }
  .nav-tab:hover:not(.active) { color: var(--ink2); }
  .sidebar-label {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink3);
    margin-bottom: 8px;
    display: block;
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const SAMPLE_TRANSACTIONS = [
  { id: 1, date: "2025-03-01", vendor: "Amazon Web Services", description: "Cloud infrastructure - Feb", amount: 4821.50, card: "Visa ••4291", cardholder: "Jordan Lee" },
  { id: 2, date: "2025-03-02", vendor: "Slack Technologies", description: "Team plan monthly subscription", amount: 312.00, card: "Visa ••4291", cardholder: "Jordan Lee" },
  { id: 3, date: "2025-03-03", vendor: "Delta Air Lines", description: "SFO → JFK — conference travel", amount: 689.00, card: "Amex ••8812", cardholder: "Alex Kim" },
  { id: 4, date: "2025-03-04", vendor: "Marriott Hotels", description: "NY accommodation 3 nights", amount: 1240.00, card: "Amex ••8812", cardholder: "Alex Kim" },
  { id: 5, date: "2025-03-05", vendor: "DoorDash", description: "Team working lunch", amount: 187.40, card: "Visa ••4291", cardholder: "Jordan Lee" },
  { id: 6, date: "2025-03-06", vendor: "Amazon.com", description: "Office supplies - Q1 restock", amount: 94.32, card: "Visa ••4291", cardholder: "Morgan Chen" },
  { id: 7, date: "2025-03-07", vendor: "Uber", description: "Airport transfer - JFK", amount: 62.15, card: "Amex ••8812", cardholder: "Alex Kim" },
  { id: 8, date: "2025-03-08", vendor: "Zoom Video", description: "Pro annual renewal", amount: 149.90, card: "Visa ••4291", cardholder: "Jordan Lee" },
  { id: 9, date: "2025-03-09", vendor: "LinkedIn", description: "Recruiter lite seat — March", amount: 825.00, card: "Amex ••8812", cardholder: "Morgan Chen" },
  { id: 10, date: "2025-03-10", vendor: "Acme Legal Group", description: "Contract review services", amount: 3500.00, card: "Amex ••8812", cardholder: "Alex Kim" },
  { id: 11, date: "2025-03-12", vendor: "Salesforce", description: "CRM seats - March", amount: 2100.00, card: "Visa ••4291", cardholder: "Jordan Lee" },
  { id: 12, date: "2025-03-14", vendor: "FedEx", description: "Overnight shipping - client samples", amount: 78.60, card: "Visa ••4291", cardholder: "Morgan Chen" },
];

const GL_RULES = {
  "amazon web services": { gl: "6100", glName: "Cloud Infrastructure", dept: "Engineering" },
  "aws": { gl: "6100", glName: "Cloud Infrastructure", dept: "Engineering" },
  "slack": { gl: "6110", glName: "Software & SaaS", dept: "Operations" },
  "zoom": { gl: "6110", glName: "Software & SaaS", dept: "Operations" },
  "google": { gl: "6110", glName: "Software & SaaS", dept: "Engineering" },
  "microsoft": { gl: "6110", glName: "Software & SaaS", dept: "Operations" },
  "openai": { gl: "6110", glName: "Software & SaaS", dept: "Engineering" },
  "salesforce": { gl: "6120", glName: "CRM & Sales Tools", dept: "Sales" },
  "hubspot": { gl: "6120", glName: "CRM & Sales Tools", dept: "Marketing" },
  "delta": { gl: "6210", glName: "Airfare", dept: "G&A" },
  "united airlines": { gl: "6210", glName: "Airfare", dept: "G&A" },
  "american airlines": { gl: "6210", glName: "Airfare", dept: "G&A" },
  "marriott": { gl: "6220", glName: "Hotels & Lodging", dept: "G&A" },
  "hilton": { gl: "6220", glName: "Hotels & Lodging", dept: "G&A" },
  "airbnb": { gl: "6220", glName: "Hotels & Lodging", dept: "G&A" },
  "uber": { gl: "6230", glName: "Ground Transportation", dept: "G&A" },
  "lyft": { gl: "6230", glName: "Ground Transportation", dept: "G&A" },
  "doordash": { gl: "6300", glName: "Meals & Entertainment", dept: "G&A" },
  "grubhub": { gl: "6300", glName: "Meals & Entertainment", dept: "G&A" },
  "uber eats": { gl: "6300", glName: "Meals & Entertainment", dept: "G&A" },
  "amazon.com": { gl: "6020", glName: "Office Supplies", dept: "Operations" },
  "amazon": { gl: "6020", glName: "Office Supplies", dept: "Operations" },
  "staples": { gl: "6020", glName: "Office Supplies", dept: "Operations" },
  "fedex": { gl: "6600", glName: "Shipping & Postage", dept: "Operations" },
  "ups": { gl: "6600", glName: "Shipping & Postage", dept: "Operations" },
  "linkedin": { gl: "6500", glName: "Recruiting & HR", dept: "HR" },
  "indeed": { gl: "6500", glName: "Recruiting & HR", dept: "HR" },
};

const DEFAULT_GL_ACCOUNTS = [
  { code: "6020", name: "Office Supplies" },
  { code: "6100", name: "Cloud Infrastructure" },
  { code: "6110", name: "Software & SaaS" },
  { code: "6120", name: "CRM & Sales Tools" },
  { code: "6210", name: "Airfare" },
  { code: "6220", name: "Hotels & Lodging" },
  { code: "6230", name: "Ground Transportation" },
  { code: "6300", name: "Meals & Entertainment" },
  { code: "6400", name: "Professional Services" },
  { code: "6500", name: "Recruiting & HR" },
  { code: "6600", name: "Shipping & Postage" },
  { code: "6800", name: "Miscellaneous" },
];

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Operations", "G&A", "HR", "Finance", "Legal"];
const CARDHOLDERS = ["All cardholders", "Jordan Lee", "Alex Kim", "Morgan Chen"];
const ROLES = [
  { name: "Jordan Lee", role: "Cardholder", card: "Visa ••4291", avatar: "JL", color: "#1a4f7a" },
  { name: "Alex Kim", role: "Cardholder", card: "Amex ••8812", avatar: "AK", color: "#2d6a4f" },
  { name: "Morgan Chen", role: "Cardholder", card: "Visa ••4291", avatar: "MC", color: "#7d4a1a" },
  { name: "Sam Rivera", role: "Finance Reviewer", card: null, avatar: "SR", color: "#c84b2f" },
];

function autoAssign(vendor) {
  const v = vendor.toLowerCase();
  for (const [key, val] of Object.entries(GL_RULES)) {
    if (v.includes(key)) return { ...val, confidence: "high", autoAssigned: true };
  }
  return { gl: "6800", glName: "Miscellaneous", dept: "G&A", confidence: "low", autoAssigned: true };
}

function initTx() {
  return SAMPLE_TRANSACTIONS.map(t => {
    const assigned = autoAssign(t.vendor);
    return {
      ...t,
      ...assigned,
      status: "pending",
      receipt: null,
      receiptMatch: null,
      memo: "",
      flagReason: "",
      submittedAt: null,
      reviewedAt: null,
      reviewedBy: null,
    };
  });
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => {
  const [y, m, day] = d.split("-");
  return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${+day}`;
};
const fmtDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// Generates: RECON-2025-0001, RECON-2025-0002, etc.
// Counter is stored in module scope so it persists across exports within the session
let _reconCounter = 1;
const generateReconId = () => {
  const year = new Date().getFullYear();
  const seq = String(_reconCounter++).padStart(4, "0");
  return `RECON-${year}-${seq}`;
};

function StatusTag({ status }) {
  const map = {
    pending:   ["tag-amber", "● Pending"],
    submitted: ["tag-blue",  "↑ Submitted"],
    approved:  ["tag-green", "✓ Approved"],
    flagged:   ["tag-red",   "⚑ Flagged"],
    exported:  ["tag-gray",  "→ Exported"],
  };
  const [cls, label] = map[status] || ["tag-gray", status];
  return <span className={`tag ${cls}`}>{label}</span>;
}

function ConfidenceDot({ level }) {
  const colors = { high: "#2d6a4f", medium: "#b8860b", low: "#c84b2f" };
  return (
    <span className="match-confidence tooltip" data-tip={`AI confidence: ${level}`}>
      <span className="conf-dot" style={{ background: colors[level] || "#aaa" }} />
    </span>
  );
}

function Avatar({ name, color, size = 28 }) {
  const initials = name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color || "#8a8680",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "white",
      fontFamily: "var(--sans)", flexShrink: 0
    }}>{initials}</div>
  );
}

// ─── RECEIPT UPLOAD PANEL ─────────────────────────────────────────────────────
function ReceiptMatcher({ receipts, transactions, onMatchConfirm, onClose }) {
  const [matches, setMatches] = useState(() => {
    // Simulate AI matching
    const m = {};
    receipts.forEach((r, i) => {
      const tx = transactions[i % transactions.length];
      const conf = ["high","medium","low"][i % 3];
      m[r.name] = { txId: tx?.id, confidence: conf, suggested: true };
    });
    return m;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-box card" style={{ width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>AI Receipt Matching</div>
            <div style={{ fontSize: 12, color: "var(--ink3)", fontFamily: "var(--mono)", marginTop: 2 }}>{receipts.length} receipts · AI read vendor, amount & date from each file</div>
          </div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{ overflow: "auto", flex: 1, padding: "16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, marginBottom: 12, fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span>Receipt file</span><span></span><span>Matched transaction</span>
          </div>
          {receipts.map((r) => {
            const match = matches[r.name];
            const tx = transactions.find(t => t.id === match?.txId);
            return (
              <div key={r.name} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
                <div style={{ background: "var(--paper2)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📄 {r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink3)" }}>{(r.size / 1024).toFixed(0)} KB</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <ConfidenceDot level={match?.confidence} />
                  <div style={{ fontSize: 9, color: "var(--ink3)", fontFamily: "var(--mono)" }}>AI</div>
                </div>
                <div>
                  <select
                    value={match?.txId || ""}
                    onChange={e => setMatches(m => ({ ...m, [r.name]: { ...m[r.name], txId: +e.target.value, suggested: false } }))}
                    style={{ fontSize: 12 }}
                  >
                    <option value="">— Unmapped —</option>
                    {transactions.map(t => (
                      <option key={t.id} value={t.id}>{fmtDate(t.date)} · {t.vendor} · {fmt(t.amount)}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--rule)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onMatchConfirm(matches)}>Confirm Matches</button>
        </div>
      </div>
    </div>
  );
}

// ─── TRANSACTION DETAIL DRAWER ────────────────────────────────────────────────
function TxDrawer({ tx, glAccounts, currentUser, onUpdate, onClose }) {
  const [localTx, setLocalTx] = useState({ ...tx });
  const fileRef = useRef();
  const isReviewer = currentUser.role === "Finance Reviewer";

  const save = () => { onUpdate(localTx.id, localTx); onClose(); };

  const handleReceiptFile = (file) => {
    if (!file) return;
    setLocalTx(t => ({ ...t, receipt: { name: file.name, size: file.size, url: URL.createObjectURL(file) } }));
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex" }}>
      <div style={{ flex: 1, background: "rgba(26,24,20,0.4)" }} onClick={onClose} />
      <div style={{ width: 420, background: "var(--paper)", borderLeft: "1px solid var(--rule)", overflowY: "auto", display: "flex", flexDirection: "column", animation: "slideUp 0.2s ease" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--rule)", position: "sticky", top: 0, background: "var(--paper)", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <StatusTag status={localTx.status} />
            <button className="btn-ghost" onClick={onClose} style={{ fontSize: 16 }}>✕</button>
          </div>
          <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.02em" }}>{localTx.vendor}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 28, fontWeight: 500, color: "var(--ink)", marginTop: 4 }}>{fmt(localTx.amount)}</div>
          <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 6, fontFamily: "var(--mono)" }}>
            {fmtDate(localTx.date)} · {localTx.card} · {localTx.cardholder}
          </div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
          {/* GL + Dept */}
          <div>
            <span className="sidebar-label">GL Account</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {localTx.autoAssigned && <span className="tag tag-ai">⚡ AI assigned</span>}
              {localTx.confidence && <ConfidenceDot level={localTx.confidence} />}
            </div>
            <select value={localTx.gl} onChange={e => {
              const found = glAccounts.find(g => g.code === e.target.value);
              setLocalTx(t => ({ ...t, gl: e.target.value, glName: found?.name || "", autoAssigned: false }));
            }}>
              {glAccounts.map(g => <option key={g.code} value={g.code}>{g.code} · {g.name}</option>)}
            </select>
          </div>

          <div>
            <span className="sidebar-label">Department</span>
            <select value={localTx.dept} onChange={e => setLocalTx(t => ({ ...t, dept: e.target.value }))}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <span className="sidebar-label">Memo / Notes</span>
            <textarea
              rows={3}
              value={localTx.memo}
              onChange={e => setLocalTx(t => ({ ...t, memo: e.target.value }))}
              placeholder="Add a note for the finance team..."
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Receipt */}
          <div>
            <span className="sidebar-label">Receipt</span>
            {localTx.receipt ? (
              <div style={{ background: "var(--paper2)", border: "1px solid var(--rule)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{localTx.receipt.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink3)" }}>{(localTx.receipt.size / 1024).toFixed(0)} KB</div>
                </div>
                {localTx.receiptMatch && <span className="tag tag-ai">⚡ AI matched</span>}
                <button className="btn-ghost" style={{ color: "var(--accent)" }} onClick={() => setLocalTx(t => ({ ...t, receipt: null }))}>Remove</button>
              </div>
            ) : (
              <div
                className="drop-zone"
                style={{ padding: "24px", textAlign: "center" }}
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
                onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("drag-over"); handleReceiptFile(e.dataTransfer.files[0]); }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>📎</div>
                <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ink2)" }}>Drop receipt or click to upload</div>
                <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>PDF, JPG, PNG accepted</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
              onChange={e => handleReceiptFile(e.target.files[0])} />
          </div>

          {/* Flag reason (reviewer only) */}
          {isReviewer && localTx.status === "submitted" && (
            <div>
              <span className="sidebar-label">Flag Reason (optional)</span>
              <input value={localTx.flagReason} onChange={e => setLocalTx(t => ({ ...t, flagReason: e.target.value }))} placeholder="e.g. Missing receipt, wrong GL..." />
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--rule)", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!isReviewer && localTx.status === "pending" && (
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setLocalTx(t => ({ ...t, status: "submitted", submittedAt: new Date().toISOString() })); setTimeout(save, 50); }}>
              Submit for Review
            </button>
          )}
          {isReviewer && localTx.status === "submitted" && (
            <>
              <button className="btn-primary" style={{ flex: 1, background: "var(--green)" }} onClick={() => {
                setLocalTx(t => ({ ...t, status: "approved", reviewedAt: new Date().toISOString(), reviewedBy: currentUser.name }));
                setTimeout(save, 50);
              }}>✓ Approve</button>
              <button className="btn-primary" style={{ flex: 1, background: "var(--accent)" }} onClick={() => {
                setLocalTx(t => ({ ...t, status: "flagged", reviewedAt: new Date().toISOString(), reviewedBy: currentUser.name }));
                setTimeout(save, 50);
              }}>⚑ Flag</button>
            </>
          )}
          {localTx.status === "flagged" && !isReviewer && (
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setLocalTx(t => ({ ...t, status: "submitted", flagReason: "" })); setTimeout(save, 50); }}>
              Resubmit
            </button>
          )}
          <button className="btn-secondary" onClick={save}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── NETSUITE EXPORT MODAL ────────────────────────────────────────────────────
function NetSuiteModal({ transactions, onClose, onExportComplete }) {
  const [step, setStep] = useState(0); // 0=confirm, 1=loading, 2=success
  const [reconId] = useState(() => generateReconId());
  const [exportedAt] = useState(() => new Date().toISOString());
  const approved = transactions.filter(t => t.status === "approved");
  const total = approved.reduce((s, t) => s + t.amount, 0);
  const withReceipts = approved.filter(t => t.receipt).length;

  const handleExport = () => {
    setStep(1);
    setTimeout(() => {
      setStep(2);
      onExportComplete({
        reconId,
        exportedAt,
        nsId: "EXP-2025-" + String(Math.floor(Math.random() * 9000) + 1000),
        txCount: approved.length,
        total,
        receiptCount: withReceipts,
        exportedBy: null, // will be filled by parent
      });
    }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box card" style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, background: "var(--ink)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "var(--accent2)", fontFamily: "var(--sans)", fontWeight: 900, fontSize: 16 }}>N</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 17, color: "var(--ink)" }}>Export to NetSuite</div>
            <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ink3)" }}>Create expense report · Simulated API</div>
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {step === 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  ["Report Name", "CC Recon · Mar 2025"],
                  ["Transactions", `${approved.length} approved lines`],
                  ["Total Amount", fmt(total)],
                  ["Receipts", `${withReceipts}/${approved.length} attached`],
                  ["Subsidiary", "Acme Corp US"],
                  ["Period", "March 2025"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--paper2)", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink3)", fontFamily: "var(--mono)", background: "var(--paper2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                📎 All receipts will be compiled into a single PDF and attached to the expense report in NetSuite.
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                {approved.map(t => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--paper2)", borderRadius: 6, fontSize: 12, fontFamily: "var(--mono)" }}>
                    <div style={{ color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "50%" }}>{t.vendor}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "var(--ink3)" }}>{t.gl} · {t.dept}</span>
                      <span style={{ color: "var(--ink)", fontWeight: 600 }}>{fmt(t.amount)}</span>
                      {t.receipt ? <span title="Receipt attached">📎</span> : <span title="No receipt" style={{ opacity: 0.3 }}>📎</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 48, height: 48, border: "3px solid var(--rule)", borderTopColor: "var(--ink)", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
              <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>Connecting to NetSuite...</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", fontFamily: "var(--mono)", marginTop: 6 }}>Compiling receipts PDF · Posting expense lines via REST API</div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "24px 0 16px" }}>
              <div style={{ width: 56, height: 56, background: "#d4edda", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✓</div>
              <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>Expense Report Created</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", fontFamily: "var(--mono)", marginBottom: 20 }}>Submitted · Pending approval in NetSuite</div>

              {/* Internal ID — highlighted */}
              <div style={{ background: "var(--ink)", borderRadius: 10, padding: "14px 18px", marginBottom: 14, textAlign: "left" }}>
                <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Internal Reconciliation ID</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.04em" }}>{reconId}</div>
                <div style={{ fontSize: 10, color: "var(--ink3)", fontFamily: "var(--mono)", marginTop: 4 }}>Use this ID to reference this batch in any system</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, textAlign: "left" }}>
                {[
                  ["NetSuite ID", "EXP-2025-" + reconId.split("-")[2]],
                  ["Status", "Pending Approval"],
                  ["Lines created", approved.length],
                  ["Receipts PDF", "1 file attached"],
                  ["Exported at", fmtDateTime(exportedAt)],
                  ["Period", "March 2025"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--paper2)", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--rule)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {step === 0 && <><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={handleExport}>Create Expense Report →</button></>}
          {step === 2 && <button className="btn-primary" onClick={onClose}>Done</button>}
        </div>
      </div>
    </div>
  );
}

// ─── GL SETTINGS PANEL ───────────────────────────────────────────────────────
function GLSettings({ glAccounts, onSave, onClose }) {
  const [rawText, setRawText] = useState(glAccounts.map(g => `${g.code}\t${g.name}`).join("\n"));
  const [parsed, setParsed] = useState(glAccounts);
  const [error, setError] = useState("");

  const handleParse = (text) => {
    setRawText(text);
    try {
      const lines = text.trim().split("\n").filter(Boolean).map(line => {
        const parts = line.split(/[\t,·\-]/).map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) throw new Error(`Bad line: "${line}"`);
        return { code: parts[0], name: parts.slice(1).join(" ") };
      });
      setParsed(lines);
      setError("");
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box card" style={{ width: "100%", maxWidth: 560 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 17, color: "var(--ink)" }}>Chart of Accounts</div>
            <div style={{ fontSize: 12, color: "var(--ink3)", fontFamily: "var(--mono)", marginTop: 2 }}>Paste your GL codes — one per line: CODE · Name</div>
          </div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <textarea
            rows={12}
            value={rawText}
            onChange={e => handleParse(e.target.value)}
            placeholder={"6020\tOffice Supplies\n6100\tCloud Infrastructure\n6110\tSoftware & SaaS\n..."}
            style={{ fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.7, resize: "vertical" }}
          />
          {error && <div style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--mono)", marginTop: 8 }}>⚠ {error}</div>}
          {!error && parsed.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--green)", fontFamily: "var(--mono)", marginTop: 8 }}>✓ {parsed.length} accounts parsed</div>
          )}
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--rule)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!!error || !parsed.length} onClick={() => { onSave(parsed); onClose(); }}>Save Accounts</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState(initTx);
  const [glAccounts, setGlAccounts] = useState(DEFAULT_GL_ACCOUNTS);
  const [activeTab, setActiveTab] = useState("transactions");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCardholder, setFilterCardholder] = useState("All cardholders");
  const [search, setSearch] = useState("");
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [showReceipts, setShowReceipts] = useState(false);
  const [showNS, setShowNS] = useState(false);
  const [showGLSettings, setShowGLSettings] = useState(false);
  const [uploadedReceipts, setUploadedReceipts] = useState([]);
  const [showReceiptMatcher, setShowReceiptMatcher] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [exportHistory, setExportHistory] = useState([]);
  const csvRef = useRef();
  const receiptFolderRef = useRef();

  const update = useCallback((id, changes) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
  }, []);

  const handleCSV = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const lines = e.target.result.split("\n").filter(Boolean);
        const headers = lines[0].toLowerCase().split(",").map(h => h.trim().replace(/"/g, ""));
        const rows = lines.slice(1).map((line, i) => {
          const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
          const obj = {};
          headers.forEach((h, j) => obj[h] = vals[j] || "");
          const vendor = obj.vendor || obj.merchant || obj.description || "Unknown";
          const amount = parseFloat((obj.amount || obj.debit || "0").replace(/[$,]/g, "")) || 0;
          const date = obj.date || obj["transaction date"] || new Date().toISOString().slice(0, 10);
          const assigned = autoAssign(vendor);
          return {
            id: Date.now() + i,
            date, vendor,
            description: obj.description || obj.memo || "",
            amount, card: obj.card || obj["card number"] || "Unknown",
            cardholder: currentUser?.name || "Unknown",
            ...assigned,
            status: "pending", receipt: null, receiptMatch: null, memo: "", flagReason: "",
          };
        });
        setTransactions(prev => [...prev, ...rows]);
        setCsvError("");
      } catch (err) { setCsvError("Could not parse CSV. Ensure columns: Date, Vendor, Amount, Card"); }
    };
    reader.readAsText(file);
  };

  const handleReceiptFolder = (files) => {
    const arr = Array.from(files).map(f => ({ name: f.name, size: f.size, file: f, url: URL.createObjectURL(f) }));
    setUploadedReceipts(arr);
    setShowReceiptMatcher(true);
  };

  const handleMatchConfirm = (matches) => {
    setTransactions(prev => prev.map(t => {
      const match = Object.entries(matches).find(([, v]) => v.txId === t.id);
      if (!match) return t;
      const r = uploadedReceipts.find(r => r.name === match[0]);
      return r ? { ...t, receipt: { name: r.name, size: r.size, url: r.url }, receiptMatch: match[1].confidence } : t;
    }));
    setShowReceiptMatcher(false);
  };

  const handleExportComplete = (record) => {
    const fullRecord = { ...record, exportedBy: currentUser.name };
    setExportHistory(prev => [fullRecord, ...prev]);
    // Stamp all approved transactions with the reconciliation ID
    setTransactions(prev => prev.map(t =>
      t.status === "approved" ? { ...t, status: "exported", reconId: fullRecord.reconId } : t
    ));
  };

  const filtered = transactions.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterCardholder !== "All cardholders" && t.cardholder !== filterCardholder) return false;
    if (search && !t.vendor.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    // Cardholder only sees own transactions
    if (currentUser?.role === "Cardholder" && t.cardholder !== currentUser.name) return false;
    return true;
  });

  const counts = {
    all: transactions.filter(t => currentUser?.role !== "Cardholder" || t.cardholder === currentUser?.name).length,
    pending: transactions.filter(t => t.status === "pending" && (currentUser?.role !== "Cardholder" || t.cardholder === currentUser?.name)).length,
    submitted: transactions.filter(t => t.status === "submitted").length,
    approved: transactions.filter(t => t.status === "approved").length,
    flagged: transactions.filter(t => t.status === "flagged" && (currentUser?.role !== "Cardholder" || t.cardholder === currentUser?.name)).length,
    exported: transactions.filter(t => t.status === "exported").length,
  };

  const totalApproved = transactions.filter(t => t.status === "approved").reduce((s, t) => s + t.amount, 0);
  const totalSubmitted = transactions.filter(t => t.status === "submitted").reduce((s, t) => s + t.amount, 0);
  const isReviewer = currentUser?.role === "Finance Reviewer";

  // ─── USER SELECTOR ──────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{CSS}</style>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--sans)", fontWeight: 900, fontSize: 32, color: "var(--ink)", letterSpacing: "-0.04em", marginBottom: 8 }}>
              Reconcile<span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--ink3)" }}>Credit card reconciliation · NetSuite integration</div>
          </div>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Who are you?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ROLES.map(r => (
                <button key={r.name} onClick={() => setCurrentUser(r)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--paper2)", border: "1px solid var(--rule)", borderRadius: 10, textAlign: "left", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink2)"; e.currentTarget.style.background = "var(--paper3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.background = "var(--paper2)"; }}>
                  <Avatar name={r.name} color={r.color} size={40} />
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{r.name}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink3)" }}>{r.role}{r.card ? ` · ${r.card}` : ""}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 16, color: "var(--ink3)" }}>→</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "var(--ink3)", fontFamily: "var(--mono)" }}>
            No login required · Shared workspace
          </div>
        </div>
      </div>
    );
  }

  const selectedTx = transactions.find(t => t.id === selectedTxId);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--mono)" }}>
      <style>{CSS}</style>

      {/* ── TOP NAV ── */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--rule)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 0 }}>
          {/* Logo */}
          <div style={{ fontFamily: "var(--sans)", fontWeight: 900, fontSize: 18, color: "var(--ink)", letterSpacing: "-0.04em", paddingRight: 28, borderRight: "1px solid var(--rule)", marginRight: 4 }}>
            Reconcile<span style={{ color: "var(--accent)" }}>.</span>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", flex: 1, overflowX: "auto" }}>
            {["transactions", "receipts", "settings"].map(tab => (
              <button key={tab} className={`nav-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab === "transactions" && "Transactions"}
                {tab === "receipts" && `Receipts ${uploadedReceipts.length > 0 ? `(${uploadedReceipts.length})` : ""}`}
                {tab === "settings" && `Settings ${exportHistory.length > 0 ? `· ${exportHistory.length} export${exportHistory.length > 1 ? "s" : ""}` : ""}`}
              </button>
            ))}
          </div>
          {/* Right: user + export */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 16 }}>
            {isReviewer && counts.approved > 0 && (
              <button className="btn-primary" style={{ fontSize: 12, padding: "7px 14px", background: "var(--ink)" }} onClick={() => setShowNS(true)}>
                Export to NetSuite →
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--paper2)", borderRadius: 8, border: "1px solid var(--rule)", cursor: "pointer" }}
              onClick={() => setCurrentUser(null)}>
              <Avatar name={currentUser.name} color={ROLES.find(r => r.name === currentUser.name)?.color} size={24} />
              <div style={{ fontSize: 11 }}>
                <div style={{ color: "var(--ink)", fontWeight: 500 }}>{currentUser.name}</div>
                <div style={{ color: "var(--ink3)", fontSize: 10 }}>{currentUser.role}</div>
              </div>
              <span style={{ color: "var(--ink3)", fontSize: 10, marginLeft: 4 }}>↩</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── TRANSACTIONS TAB ── */}
        {activeTab === "transactions" && (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Total", value: fmt(transactions.reduce((s,t) => s+t.amount, 0)), sub: `${transactions.length} transactions`, color: "var(--ink)" },
                { label: "Pending", value: fmt(transactions.filter(t=>t.status==="pending").reduce((s,t)=>s+t.amount,0)), sub: `${counts.pending} to submit`, color: "#b8860b" },
                { label: "In Review", value: fmt(totalSubmitted), sub: `${counts.submitted} submitted`, color: "var(--blue)" },
                { label: "Approved", value: fmt(totalApproved), sub: `${counts.approved} lines`, color: "var(--green)" },
                { label: "No Receipt", value: transactions.filter(t=>!t.receipt).length, sub: "missing", color: "var(--accent)" },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="card" style={{ padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink3)", marginBottom: 6 }}>
                  <span>Review progress</span>
                  <span>{counts.approved} / {transactions.length} approved</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(counts.approved / transactions.length) * 100}%` }} />
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink3)" }}>
                {Math.round((counts.approved / transactions.length) * 100)}%
              </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", background: "var(--paper2)", borderRadius: 8, border: "1px solid var(--rule)", overflow: "hidden" }}>
                {["all","pending","submitted","approved","flagged","exported"].map(f => (
                  <button key={f} onClick={() => setFilterStatus(f)}
                    style={{ padding: "7px 12px", fontSize: 11, border: "none", background: filterStatus===f ? "var(--ink)" : "transparent", color: filterStatus===f ? "var(--paper)" : "var(--ink2)", fontFamily: "var(--mono)", fontWeight: filterStatus===f ? 600 : 400, transition: "all 0.15s" }}>
                    {f.charAt(0).toUpperCase()+f.slice(1)} <span style={{ opacity: 0.6 }}>({counts[f] ?? filtered.length})</span>
                  </button>
                ))}
              </div>

              {isReviewer && (
                <select value={filterCardholder} onChange={e => setFilterCardholder(e.target.value)} style={{ width: "auto", minWidth: 160 }}>
                  {CARDHOLDERS.map(c => <option key={c}>{c}</option>)}
                </select>
              )}

              <input
                type="text" placeholder="Search vendor or description..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: 220 }}
              />

              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => csvRef.current.click()}>
                  ↑ Import CSV
                </button>
                <input ref={csvRef} type="file" accept=".csv,.xlsx" style={{ display: "none" }} onChange={e => handleCSV(e.target.files[0])} />
                <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => receiptFolderRef.current.click()}>
                  📎 Upload Receipts Folder
                </button>
                <input ref={receiptFolderRef} type="file" accept="image/*,application/pdf" multiple style={{ display: "none" }}
                  onChange={e => handleReceiptFolder(e.target.files)} />
              </div>
            </div>

            {csvError && <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 12, fontFamily: "var(--mono)" }}>⚠ {csvError}</div>}

            {/* Table */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 100px 100px 100px 90px 60px", gap: 0, padding: "10px 16px", background: "var(--paper2)", borderBottom: "1px solid var(--rule)", fontSize: 10, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <span>Date</span><span>Vendor</span><span>GL · Dept</span><span>Cardholder</span><span style={{ textAlign: "right" }}>Amount</span><span style={{ textAlign: "center" }}>Receipt</span><span style={{ textAlign: "center" }}>Status</span><span></span>
              </div>
              <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
                {filtered.length === 0 && (
                  <div style={{ padding: 32, textAlign: "center", color: "var(--ink3)", fontSize: 13 }}>No transactions match your filters</div>
                )}
                {filtered.map(t => (
                  <div key={t.id} className={`tx-row ${selectedTxId === t.id ? "selected" : ""}`}
                    style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 100px 100px 100px 90px 60px", alignItems: "center", padding: "11px 16px", cursor: "pointer", gap: 0 }}
                    onClick={() => setSelectedTxId(t.id)}>
                    <span style={{ fontSize: 12, color: "var(--ink2)" }}>{fmtDate(t.date)}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, fontFamily: "var(--sans)" }}>{t.vendor}</div>
                      <div style={{ fontSize: 11, color: "var(--ink3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{t.description}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: "var(--ink2)" }}>{t.gl}</span>
                        <span style={{ color: "var(--ink3)" }}>· {t.glName}</span>
                        {t.autoAssigned && <span className="tag tag-ai" style={{ fontSize: 9, padding: "1px 5px" }}>AI</span>}
                        {t.confidence && <ConfidenceDot level={t.confidence} />}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>
                        {t.dept}
                        {t.reconId && <span style={{ marginLeft: 6, fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent2)", background: "var(--ink)", borderRadius: 3, padding: "1px 5px" }}>{t.reconId}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--ink2)" }}>{t.cardholder.split(" ")[0]}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--ink)", fontWeight: 600, textAlign: "right" }}>{fmt(t.amount)}</span>
                    <div style={{ textAlign: "center" }}>
                      {t.receipt
                        ? <span className="tooltip" data-tip={t.receipt.name} style={{ cursor: "default" }}>
                            📎{t.receiptMatch && <span style={{ fontSize: 9, color: "#4a1c8a" }}> ⚡</span>}
                          </span>
                        : <span style={{ opacity: 0.25, fontSize: 14 }}>📎</span>}
                    </div>
                    <div style={{ textAlign: "center" }}><StatusTag status={t.status} /></div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 16, color: "var(--ink3)" }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk actions for reviewer */}
            {isReviewer && counts.submitted > 0 && (
              <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <button className="btn-secondary" style={{ fontSize: 12, background: "#d4edda", color: "#1a5c35", border: "1px solid #b8dfc6" }}
                  onClick={() => setTransactions(prev => prev.map(t => t.status === "submitted" ? { ...t, status: "approved", reviewedBy: currentUser.name, reviewedAt: new Date().toISOString() } : t))}>
                  ✓ Approve All Submitted ({counts.submitted})
                </button>
              </div>
            )}
          </>
        )}

        {/* ── RECEIPTS TAB ── */}
        {activeTab === "receipts" && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: 6 }}>Receipt Management</div>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 24 }}>Upload your monthly receipt folder. AI reads each file and matches it to a transaction by vendor, amount, and date.</div>

            {/* Upload zone */}
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <div
                className="drop-zone"
                style={{ padding: "40px 24px", textAlign: "center" }}
                onClick={() => receiptFolderRef.current.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
                onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("drag-over"); handleReceiptFolder(e.dataTransfer.files); }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
                <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>Drop your receipts folder here</div>
                <div style={{ fontSize: 12, color: "var(--ink3)" }}>Select multiple files · PDF, JPG, PNG accepted · AI will match to transactions</div>
              </div>
              <input ref={receiptFolderRef} type="file" accept="image/*,application/pdf" multiple style={{ display: "none" }}
                onChange={e => handleReceiptFolder(e.target.files)} />
            </div>

            {/* Matched summary */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Receipt Status by Transaction</div>
              {transactions.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--rule)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--ink)", fontFamily: "var(--sans)", fontWeight: 500 }}>{t.vendor}</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)" }}>{fmtDate(t.date)} · {fmt(t.amount)}</div>
                  </div>
                  {t.receipt ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {t.receiptMatch && <span className="tag tag-ai">⚡ AI matched</span>}
                      <span className="tag tag-green">📎 {t.receipt.name.length > 18 ? t.receipt.name.slice(0,15) + "…" : t.receipt.name}</span>
                    </div>
                  ) : (
                    <span className="tag tag-red">Missing</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: 24 }}>Settings</div>

            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>Chart of Accounts</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16 }}>Your GL codes power the AI auto-assignment. Keep them current with your NetSuite chart of accounts.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
                {glAccounts.map(g => (
                  <div key={g.code} style={{ display: "flex", gap: 12, fontSize: 12, padding: "6px 10px", background: "var(--paper2)", borderRadius: 6 }}>
                    <span style={{ color: "var(--ink)", fontWeight: 600, minWidth: 48 }}>{g.code}</span>
                    <span style={{ color: "var(--ink2)" }}>{g.name}</span>
                  </div>
                ))}
              </div>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setShowGLSettings(true)}>Edit Chart of Accounts</button>
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>NetSuite Connection</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16 }}>Configure your TBA credentials to enable live export. Currently running in simulation mode.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {["Account ID", "Consumer Key", "Consumer Secret", "Token ID", "Token Secret"].map(f => (
                  <div key={f}>
                    <label style={{ fontSize: 10, color: "var(--ink3)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{f}</label>
                    <input type={f.includes("Secret") || f.includes("Key") ? "password" : "text"} placeholder={`Enter ${f}...`} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" style={{ fontSize: 12 }}>Save Credentials</button>
                <button className="btn-secondary" style={{ fontSize: 12 }}>Test Connection</button>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--ink3)", background: "var(--paper2)", borderRadius: 6, padding: "8px 12px" }}>
                ℹ Credentials are stored locally in your browser. Never shared externally. Use TBA (Token-Based Authentication) from NetSuite Setup → Integrations.
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>Auto-Assignment Rules</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14 }}>Vendor → GL mapping used by AI. Editing coming soon.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                {Object.entries(GL_RULES).slice(0, 12).map(([vendor, rule]) => (
                  <div key={vendor} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 8, fontSize: 11, padding: "5px 8px", background: "var(--paper2)", borderRadius: 5 }}>
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>{vendor}</span>
                    <span style={{ color: "var(--ink3)", textAlign: "center" }}>→</span>
                    <span style={{ color: "var(--ink2)" }}>{rule.gl} · {rule.glName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export History */}
            <div className="card" style={{ padding: 24, marginTop: 16 }}>
              <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>Export History</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16 }}>Every reconciliation pushed to NetSuite, with its internal ID for cross-referencing.</div>
              {exportHistory.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--ink3)", fontFamily: "var(--mono)", padding: "20px 0", textAlign: "center", borderTop: "1px solid var(--rule)" }}>
                  No exports yet. Approve transactions and export to NetSuite to see history here.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {exportHistory.map((r) => (
                    <div key={r.reconId} style={{ background: "var(--paper2)", border: "1px solid var(--rule)", borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 15, color: "var(--ink)", letterSpacing: "0.02em" }}>{r.reconId}</div>
                        <span className="tag tag-green">Exported</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                          ["NetSuite ID", r.nsId],
                          ["Total", fmt(r.total)],
                          ["Lines", r.txCount],
                          ["Receipts", `${r.receiptCount} attached`],
                          ["Exported by", r.exportedBy],
                          ["Exported at", fmtDateTime(r.exportedAt)],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500 }}>{v}</div>
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

      {/* ── DRAWERS & MODALS ── */}
      {selectedTx && (
        <TxDrawer
          tx={selectedTx}
          glAccounts={glAccounts}
          currentUser={currentUser}
          onUpdate={update}
          onClose={() => setSelectedTxId(null)}
        />
      )}
      {showReceiptMatcher && (
        <ReceiptMatcher
          receipts={uploadedReceipts}
          transactions={transactions}
          onMatchConfirm={handleMatchConfirm}
          onClose={() => setShowReceiptMatcher(false)}
        />
      )}
      {showNS && (
        <NetSuiteModal transactions={transactions} onClose={() => setShowNS(false)} onExportComplete={handleExportComplete} />
      )}
      {showGLSettings && (
        <GLSettings glAccounts={glAccounts} onSave={setGlAccounts} onClose={() => setShowGLSettings(false)} />
      )}
    </div>
  );
}
