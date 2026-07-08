import { useState, useEffect } from "react";

const STORAGE_KEY = "hh-true-organic-brief";

const defaultData = {
  client: {
    name: "John",
    business: "True Organics (Distributor)",
    type: "MLM Distributor",
    location: "North West",
    email: "johnztrueorganics@gmail.com",
    phone: "061 110 4495",
    referralLink: "https://trueorganics.life/join-us/TO10700879953",
    bankName: "ABSA",
    bankAccount: "9408096014",
    bankHolder: "NTOBANA MARTHA MATHULWE",
    directorID: "9503230255089",
    directorDOB: "23 Mar 1995",
    registeredAddress: "32 Murray Avenue, Brits",
    notes: "John operates under True Organics parent company. Wants to run independently as 'Johnz True Organics'. Company registration names submitted 20 May. Director registered under spouse: Ntobana Martha Mathulwe. Business address: 32 Murray Avenue, Brits."
  },
  financial: {
    quoted: 1200,
    registration: 800,
    domain: 280,
    chatgpt: 199,
    payments: [
      { date: "14 Apr", amount: 300, method: "Capitec", note: "Initial deposit" },
      { date: "18 Apr", amount: 280, method: "Transfer", note: "Domain payment" },
      { date: "4 May", amount: 400, method: "Capitec (partner)", note: "After family emergency mention" },
      { date: "21 May", amount: 500, method: "NoticeOfPayment PDF", note: "Latest payment" }
    ]
  },
  scope: [
    { task: "Landing page (basic)", status: "done", note: "Built and shown to client" },
    { task: "Landing page (payment system)", status: "pending", note: "Needs outsourced tool + payment" },
    { task: "Domain (johnztrueorganics.org)", status: "done", note: "~$20 paid, secured" },
    { task: "WhatsApp CRM/automation", status: "pending", note: "Discussed only" },
    { task: "App", status: "not-started", note: "Never initiated" },
    { task: "Company registration (CIPC)", status: "in-progress", note: "Name reservation lodged. Ref: 9459157689. First choice: Johnz True Organics and Wellness (Pty) Ltd. Awaiting approval 2–5 business days. Incorporation next (R175). B-BBEE to be added post-registration." },
    { task: "AI tools setup (ChatGPT Pro)", status: "pending", note: "R199, not yet delivered" },
    { task: "Social media strategy", status: "pending", note: "Discussed, never formalised" }
  ],
  flags: [
    { severity: "high", text: "John registered Lesego in True Organics without clear consent — check before accepting" },
    { severity: "high", text: "Balance of R1200 still outstanding as of 21 May" },
    { severity: "medium", text: "Scope has tripled from original agreement — no formal written contract exists" },
    { severity: "medium", text: "Client pushed Chlorophyll juice as diabetes treatment for mom — unprofessional" },
    { severity: "low", text: "Joining True Organics as member conflicts with agency positioning — avoid downline entanglement" }
  ],
  timeline: [
    { date: "10 Apr", event: "First contact, marketing strategy offer" },
    { date: "11 Apr", event: "MLM structure revealed, app discussed" },
    { date: "12–13 Apr", event: "Landing page in progress, domain discussed" },
    { date: "14 Apr", event: "First partial payment received" },
    { date: "18 Apr", event: "Domain R280 paid, project ongoing" },
    { date: "23 Apr", event: "FNB eWallet R200 — ATM complications" },
    { date: "4 May", event: "R400 sent to partner account" },
    { date: "21 May", event: "Company registration names submitted, R500 paid" },
    { date: "22 May", event: "John confirms Lesego 'registered' in True Organics" },
    { date: "26 May", event: "Director ID confirmed: Ntobana Martha Mathulwe (spouse). Address: 32 Murray Ave, Brits. ABSA 9408096014." },
    { date: "26 May", event: "Name reservation lodged on BizPortal. Ref: 9459157689. First choice: Johnz True Organics and Wellness (Pty) Ltd." }
  ],
  nextSteps: [
    "Await CIPC name approval SMS (2–5 business days) — Ref: 9459157689",
    "File incorporation once name approved (R175)",
    "B-BBEE certificate — apply post-registration when trading begins",
    "Send formal invoice with all payments received vs. balance",
    "Do NOT deliver final site until payment confirmed",
    "Clarify True Organics registration — do not accept if in lieu of payment",
    "Draft service agreement for remaining scope"
  ],
  lastUpdated: "26 May 2026"
};

const statusColors = {
  done: "#22c55e",
  "in-progress": "#f59e0b",
  pending: "#3b82f6",
  "not-started": "#6b7280"
};

const statusLabels = {
  done: "Done",
  "in-progress": "In Progress",
  pending: "Pending",
  "not-started": "Not Started"
};

const severityColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280"
};

export default function ClientBrief() {
  const [data, setData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(defaultData.client.notes);
  const [newStep, setNewStep] = useState("");
  const [newPayment, setNewPayment] = useState({ date: "", amount: "", method: "", note: "" });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result) {
          const parsed = JSON.parse(result.value);
          setData(parsed);
          setNoteText(parsed.client.notes);
        }
      } catch {
        // Key doesn't exist yet — use defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async (updated) => {
    const d = {
      ...updated,
      lastUpdated: new Date().toLocaleDateString("en-ZA", {
        day: "numeric", month: "short", year: "numeric"
      })
    };
    setData(d);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(d));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      console.error("Storage error:", err);
    }
  };

  const toggleScope = (i) => {
    const statuses = ["not-started", "pending", "in-progress", "done"];
    const scope = [...data.scope];
    const cur = statuses.indexOf(scope[i].status);
    scope[i] = { ...scope[i], status: statuses[(cur + 1) % statuses.length] };
    save({ ...data, scope });
  };

  const saveNote = () => {
    save({ ...data, client: { ...data.client, notes: noteText } });
    setEditingNote(false);
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    save({ ...data, nextSteps: [...data.nextSteps, newStep.trim()] });
    setNewStep("");
  };

  const removeStep = (i) => {
    const nextSteps = data.nextSteps.filter((_, idx) => idx !== i);
    save({ ...data, nextSteps });
  };

  const addPayment = () => {
    if (!newPayment.date || !newPayment.amount) return;
    const payments = [...data.financial.payments, { ...newPayment, amount: parseFloat(newPayment.amount) }];
    save({ ...data, financial: { ...data.financial, payments } });
    setNewPayment({ date: "", amount: "", method: "", note: "" });
    setShowPaymentForm(false);
  };

  const totalPaid = data.financial.payments.reduce((s, p) => s + p.amount, 0);
  const totalQuoted = data.financial.quoted + data.financial.registration;
  const balance = totalQuoted - totalPaid;

  const tabs = ["overview", "director", "scope", "finance", "flags", "timeline"];

  if (loading) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.2em" }}>
        LOADING…
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "#e8e4dc",
      padding: "0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        input, textarea { font-family: inherit; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; transition: all 0.15s; }
        .tab-btn.active { color: #e8e4dc; border-bottom: 1px solid #e8e4dc; }
        .tab-btn:not(.active) { color: #555; }
        .tab-btn:not(.active):hover { color: #888; }
        .scope-row:hover { background: rgba(255,255,255,0.03); }
        .step-item:hover .del-btn { opacity: 1; }
        .del-btn { opacity: 0; background: none; border: none; cursor: pointer; color: #ef4444; font-size: 16px; transition: opacity 0.15s; }
        .pay-row:hover { background: rgba(255,255,255,0.02); }
        .action-btn { background: #e8e4dc; color: #0a0a0a; border: none; padding: 7px 16px; font-family: inherit; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.15s; }
        .action-btn:hover { opacity: 0.85; }
        .ghost-btn { background: none; border: 1px solid #333; color: #888; padding: 7px 16px; font-family: inherit; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.15s; }
        .ghost-btn:hover { border-color: #666; color: #ccc; }
        input[type=text], input[type=number], textarea { background: #111; border: 1px solid #222; color: #e8e4dc; padding: 7px 10px; font-size: 12px; outline: none; width: 100%; }
        input[type=text]:focus, input[type=number]:focus, textarea:focus { border-color: #444; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "28px 32px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#555", marginBottom: "6px" }}>
              Housing Hues · Client Brief
            </div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Johnz True Organics
            </div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
              John · {data.client.type} · {data.client.location}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              display: "inline-block",
              background: balance > 0 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
              border: `1px solid ${balance > 0 ? "#ef4444" : "#22c55e"}`,
              color: balance > 0 ? "#ef4444" : "#22c55e",
              padding: "4px 12px",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "6px"
            }}>
              {balance > 0 ? `R${balance} OUTSTANDING` : "SETTLED"}
            </div>
            <div style={{ fontSize: "10px", color: "#444" }}>Updated {data.lastUpdated}</div>
            {saved && <div style={{ fontSize: "10px", color: "#22c55e", marginTop: "2px" }}>Saved ✓</div>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0", marginBottom: "-1px" }}>
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ border: "1px solid #1a1a1a", padding: "20px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "14px" }}>Contact</div>
              {[
                ["Email", data.client.email],
                ["Phone", data.client.phone],
                ["Bank", `${data.client.bankName} · ${data.client.bankAccount}`],
                ["Acc Name", data.client.bankHolder],
                ["Referral", data.client.referralLink.slice(0, 40) + "…"]
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: "12px", marginBottom: "8px", fontSize: "12px" }}>
                  <span style={{ color: "#555", minWidth: "70px" }}>{k}</span>
                  <span style={{ color: "#ccc", wordBreak: "break-all" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid #1a1a1a", padding: "20px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "14px" }}>Financials</div>
              {[
                ["Quoted (site)", `R${data.financial.quoted}`],
                ["Quoted (reg)", `R${data.financial.registration}`],
                ["Domain", `R${data.financial.domain}`],
                ["Total Paid", `R${totalPaid}`],
                ["Balance", `R${balance}`]
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", borderBottom: k === "Domain" ? "1px solid #1a1a1a" : "none", paddingBottom: k === "Domain" ? "8px" : "0" }}>
                  <span style={{ color: "#555" }}>{k}</span>
                  <span style={{ color: k === "Balance" && balance > 0 ? "#ef4444" : "#e8e4dc", fontWeight: k === "Balance" ? "500" : "400" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid #1a1a1a", padding: "20px", gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase" }}>Notes</div>
                {!editingNote
                  ? <button className="ghost-btn" onClick={() => setEditingNote(true)}>Edit</button>
                  : <div style={{ display: "flex", gap: "8px" }}>
                      <button className="ghost-btn" onClick={() => { setEditingNote(false); setNoteText(data.client.notes); }}>Cancel</button>
                      <button className="action-btn" onClick={saveNote}>Save</button>
                    </div>
                }
              </div>
              {editingNote
                ? <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} style={{ resize: "vertical" }} />
                : <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.6", margin: 0 }}>{data.client.notes}</p>
              }
            </div>

            <div style={{ border: "1px solid #1a1a1a", padding: "20px", gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "14px" }}>Next Steps</div>
              {data.nextSteps.map((s, i) => (
                <div key={i} className="step-item" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ color: "#444", fontSize: "14px" }}>→</span>
                  <span style={{ fontSize: "12px", color: "#ccc", flex: 1 }}>{s}</span>
                  <button className="del-btn" onClick={() => removeStep(i)}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <input type="text" placeholder="Add next step…" value={newStep} onChange={e => setNewStep(e.target.value)} onKeyDown={e => e.key === "Enter" && addStep()} />
                <button className="action-btn" onClick={addStep} style={{ whiteSpace: "nowrap" }}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* DIRECTOR TAB */}
        {activeTab === "director" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ border: "1px solid #1a1a1a", padding: "20px", gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "4px" }}>Registered Director</div>
              <div style={{ fontSize: "10px", color: "#333", marginBottom: "18px" }}>Spouse of John — confirmed 26 May 2026</div>
              {[
                ["Full Name", data.client.bankHolder],
                ["ID Number", data.client.directorID],
                ["Date of Birth", data.client.directorDOB],
                ["Nationality", "RSA"],
                ["Status", "Citizen"],
                ["Reg. Address", data.client.registeredAddress],
                ["Physical Addr", data.client.registeredAddress],
                ["Email", data.client.email],
                ["Phone", data.client.phone],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: "16px", marginBottom: "12px", fontSize: "12px", borderBottom: "1px solid #111", paddingBottom: "12px" }}>
                  <span style={{ color: "#555", minWidth: "100px" }}>{k}</span>
                  <span style={{ color: "#e8e4dc", fontFamily: k === "ID Number" ? "Syne, sans-serif" : "inherit", fontWeight: k === "ID Number" ? "700" : "400", letterSpacing: k === "ID Number" ? "0.1em" : "normal" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ border: "1px solid #1a1a1a", padding: "20px", gridColumn: "1 / -1", borderLeft: "3px solid #f59e0b" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#f59e0b", textTransform: "uppercase", marginBottom: "10px" }}>CIPC Filing Status</div>
              {[
                ["Name Reservation", "LODGED — Ref: 9459157689"],
                ["First Choice", "Johnz True Organics and Wellness (Pty) Ltd"],
                ["Approval ETA", "2–5 business days"],
                ["Fee (Incorporation)", "R175 — due on approval"],
                ["B-BBEE", "To be applied post-registration"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: "16px", marginBottom: "10px", fontSize: "12px" }}>
                  <span style={{ color: "#555", minWidth: "160px" }}>{k}</span>
                  <span style={{ color: "#ccc" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCOPE TAB */}
        {activeTab === "scope" && (
          <div style={{ border: "1px solid #1a1a1a" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase" }}>
              Tap status to cycle → Not Started → Pending → In Progress → Done
            </div>
            {data.scope.map((item, i) => (
              <div key={i} className="scope-row" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 20px", borderBottom: i < data.scope.length - 1 ? "1px solid #111" : "none" }}>
                <button onClick={() => toggleScope(i)} style={{
                  background: statusColors[item.status] + "22",
                  border: `1px solid ${statusColors[item.status]}`,
                  color: statusColors[item.status],
                  padding: "3px 10px",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  minWidth: "96px",
                  textAlign: "center"
                }}>
                  {statusLabels[item.status]}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", color: item.status === "done" ? "#555" : "#e8e4dc", textDecoration: item.status === "done" ? "line-through" : "none" }}>{item.task}</div>
                  {item.note && <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>{item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === "finance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", padding: "20px", display: "flex", gap: "32px" }}>
              {[["Total Quoted", `R${totalQuoted}`], ["Total Paid", `R${totalPaid}`], ["Outstanding", `R${balance}`]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>{k}</div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: "22px", fontWeight: "700", color: k === "Outstanding" && balance > 0 ? "#ef4444" : "#e8e4dc" }}>{v}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min((totalPaid / totalQuoted) * 100, 100)}%`, background: "#22c55e", transition: "width 0.3s" }} />
              </div>
              <div style={{ fontSize: "10px", color: "#444", marginTop: "6px" }}>{Math.round((totalPaid / totalQuoted) * 100)}% of total quoted received</div>
            </div>

            <div style={{ border: "1px solid #1a1a1a" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#555", textTransform: "uppercase" }}>Payment Log</div>
                <button className="ghost-btn" onClick={() => setShowPaymentForm(!showPaymentForm)}>+ Add</button>
              </div>
              {showPaymentForm && (
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr auto", gap: "8px", alignItems: "end" }}>
                  <div><div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>Date</div><input type="text" placeholder="e.g. 25 May" value={newPayment.date} onChange={e => setNewPayment({ ...newPayment, date: e.target.value })} /></div>
                  <div><div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>Amount (R)</div><input type="number" placeholder="500" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} /></div>
                  <div><div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>Method</div><input type="text" placeholder="Capitec" value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value })} /></div>
                  <div><div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>Note</div><input type="text" placeholder="Optional" value={newPayment.note} onChange={e => setNewPayment({ ...newPayment, note: e.target.value })} /></div>
                  <button className="action-btn" onClick={addPayment}>Add</button>
                </div>
              )}
              {data.financial.payments.map((p, i) => (
                <div key={i} className="pay-row" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 20px", borderBottom: i < data.financial.payments.length - 1 ? "1px solid #111" : "none" }}>
                  <span style={{ fontSize: "11px", color: "#555", minWidth: "60px" }}>{p.date}</span>
                  <span style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: "700", color: "#22c55e", minWidth: "70px" }}>R{p.amount}</span>
                  <span style={{ fontSize: "11px", color: "#666", minWidth: "80px" }}>{p.method}</span>
                  <span style={{ fontSize: "11px", color: "#444" }}>{p.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLAGS TAB */}
        {activeTab === "flags" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.flags.map((f, i) => (
              <div key={i} style={{
                border: `1px solid ${severityColors[f.severity]}22`,
                borderLeft: `3px solid ${severityColors[f.severity]}`,
                padding: "14px 18px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start"
              }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: severityColors[f.severity], minWidth: "44px", marginTop: "1px" }}>{f.severity}</span>
                <span style={{ fontSize: "13px", color: "#ccc", lineHeight: "1.5" }}>{f.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            <div style={{ position: "absolute", left: "7px", top: 0, bottom: 0, width: "1px", background: "#1a1a1a" }} />
            {data.timeline.map((item, i) => (
              <div key={i} style={{ position: "relative", marginBottom: "24px" }}>
                <div style={{ position: "absolute", left: "-21px", top: "4px", width: "8px", height: "8px", borderRadius: "50%", background: i === data.timeline.length - 1 ? "#e8e4dc" : "#333", border: "1px solid #444" }} />
                <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.1em", marginBottom: "4px" }}>{item.date}</div>
                <div style={{ fontSize: "13px", color: "#ccc" }}>{item.event}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
