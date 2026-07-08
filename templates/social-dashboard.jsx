import { useState } from "react";

const ACCOUNTS = [
  { id: "college", name: "College", emoji: "🎓", color: "#5B8DEF", platforms: ["Facebook", "Instagram", "TikTok", "YouTube"] },
  { id: "cleaning", name: "Cleaning Co.", emoji: "🧹", color: "#27C97A", platforms: ["Facebook", "Instagram", "TikTok"] },
  { id: "culture", name: "Culture & Art", emoji: "🎨", color: "#E8585A", platforms: ["Instagram", "TikTok", "YouTube"] },
  { id: "media", name: "Media Production", emoji: "🎬", color: "#B06EE8", platforms: ["Facebook", "Instagram", "TikTok", "YouTube"] },
  { id: "agency", name: "Housing Hues", emoji: "◈", color: "#F0A500", platforms: ["Facebook", "Instagram", "TikTok", "YouTube"] }
];

const CONTENT_TYPES = ["Caption", "Reel Script", "Hook", "Story Sequence", "YouTube Description", "Thread"];

const PLATFORM_TIPS = {
  TikTok: "Short hooks. Trending audio cues. Gen Z tone.",
  Instagram: "Visual-first. Punchy caption. Strong CTA.",
  Facebook: "Community tone. Longer copy works here.",
  YouTube: "SEO-optimised. Search-friendly title + description."
};

export default function SocialDashboard() {
  const [activeAccount, setActiveAccount] = useState("college");
  const [activeTab, setActiveTab] = useState("generate");
  const [profiles, setProfiles] = useState({
    college:  { audience: "", goal: "", tone: "", driveFolder: "" },
    cleaning: { audience: "", goal: "", tone: "", driveFolder: "" },
    culture:  { audience: "", goal: "", tone: "", driveFolder: "" },
    media:    { audience: "", goal: "", tone: "", driveFolder: "" },
    agency:   { audience: "", goal: "", tone: "", driveFolder: "" }
  });
  const [queues, setQueues] = useState({
    college: [], cleaning: [], culture: [], media: [], agency: []
  });
  const [contentType, setContentType] = useState("Caption");
  const [brief, setBrief] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const account = ACCOUNTS.find(a => a.id === activeAccount);
  const profile = profiles[activeAccount];
  const queue = queues[activeAccount];
  const profileReady = profile.audience.trim() && profile.tone.trim();

  const updateProfile = (field, val) =>
    setProfiles(p => ({ ...p, [activeAccount]: { ...p[activeAccount], [field]: val } }));

  const saveProfile = () => {
    setSavedMsg("Saved");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const generate = async () => {
    if (!profileReady) { setActiveTab("profile"); return; }
    setGenerating(true);
    setResult("");
    try {
      const sys = `You are a social media content specialist for ${account.name}.
Audience: ${profile.audience}
Goal: ${profile.goal || "Build engagement and awareness"}
Tone: ${profile.tone}
Platform: ${platform}
Write content that fits this profile exactly. Be specific and compelling. No filler.`;

      const usr = `Write a ${contentType} for ${platform}.${brief ? ` Topic/brief: ${brief}` : ""}
Output ONLY the content — no preamble, no explanation. Add relevant hashtags at the end if it's a caption.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: sys + "\n\n" + usr }]
        })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "Generation failed — check API.");
    } catch (e) {
      setResult("Error: " + e.message);
    }
    setGenerating(false);
  };

  const addToQueue = () => {
    if (!result) return;
    setQueues(q => ({
      ...q,
      [activeAccount]: [
        { id: Date.now(), type: contentType, platform, content: result, time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) },
        ...q[activeAccount]
      ]
    }));
    setResult("");
    setBrief("");
    setActiveTab("queue");
  };

  const removePost = id =>
    setQueues(q => ({ ...q, [activeAccount]: q[activeAccount].filter(p => p.id !== id) }));

  const copy = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalQueued = Object.values(queues).reduce((s, q) => s + q.length, 0);

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#080808", color: "#F0F0F0", minHeight: "100vh", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
        textarea, input, select { font-family: 'Syne', sans-serif !important; }
        button { cursor: pointer; font-family: 'Syne', sans-serif; }
        select option { background: #111; }
        input::placeholder, textarea::placeholder { color: #333; }
        input:focus, textarea:focus, select:focus { outline: none !important; border-color: #333 !important; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 200, background: "#0C0C0C", borderRight: "1px solid #181818", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #181818" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#3A3A3A", textTransform: "uppercase", marginBottom: 4 }}>Housing Hues</div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" }}>Socials</div>
        </div>

        <div style={{ padding: "14px 10px", flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#2E2E2E", textTransform: "uppercase", marginBottom: 10, paddingLeft: 8 }}>Accounts</div>
          {ACCOUNTS.map(acc => {
            const active = activeAccount === acc.id;
            const count = queues[acc.id].length;
            return (
              <button key={acc.id} onClick={() => { setActiveAccount(acc.id); setResult(""); setPlatform(acc.platforms[0]); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 7, border: "none",
                  background: active ? "#161616" : "transparent", color: active ? "#F0F0F0" : "#4A4A4A",
                  fontSize: 12, fontWeight: active ? 700 : 400, marginBottom: 2, textAlign: "left", transition: "all 0.12s" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? acc.color : "#222", flexShrink: 0, transition: "all 0.12s", boxShadow: active ? `0 0 8px ${acc.color}88` : "none" }} />
                <span style={{ fontSize: 13 }}>{acc.emoji}</span>
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.name}</span>
                {count > 0 && <span style={{ background: acc.color, color: "#000", fontSize: 8, fontWeight: 800, borderRadius: 10, padding: "1px 5px", flexShrink: 0 }}>{count}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "14px 18px", borderTop: "1px solid #181818" }}>
          <div style={{ fontSize: 9, color: "#2A2A2A", letterSpacing: "0.08em" }}>QUEUED TOTAL</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: totalQueued > 0 ? "#F0F0F0" : "#222", marginTop: 2 }}>{totalQueued}</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* HEADER */}
        <div style={{ padding: "18px 28px", borderBottom: "1px solid #181818", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#090909", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{account.emoji}</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em" }}>{account.name}</div>
              <div style={{ fontSize: 10, color: "#3A3A3A", marginTop: 2, letterSpacing: "0.06em" }}>{account.platforms.join(" · ")}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {profileReady && <span style={{ fontSize: 10, color: "#3A3A3A", letterSpacing: "0.08em" }}>PROFILE ✓</span>}
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: account.color, boxShadow: `0 0 14px ${account.color}77` }} />
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: "1px solid #181818", background: "#090909", padding: "0 28px", flexShrink: 0 }}>
          {["generate", "queue", "profile"].map(tab => {
            const label = tab === "queue" ? `Queue (${queue.length})` : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "12px 18px", border: "none", background: "transparent",
                  color: activeTab === tab ? "#F0F0F0" : "#3A3A3A", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  borderBottom: activeTab === tab ? `2px solid ${account.color}` : "2px solid transparent",
                  marginBottom: -1, transition: "all 0.12s" }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 28px 40px" }}>

          {/* ── GENERATE ── */}
          {activeTab === "generate" && (
            <div style={{ maxWidth: 680 }}>
              {!profileReady && (
                <div onClick={() => setActiveTab("profile")} style={{ background: "#130E00", border: "1px solid #2E2000", borderRadius: 8, padding: "11px 16px", marginBottom: 22, fontSize: 12, color: "#886600", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>⚠ Set up this account's Profile before generating</span>
                  <span style={{ fontSize: 11, color: "#665500" }}>Go →</span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>Content Type</div>
                  <select value={contentType} onChange={e => setContentType(e.target.value)}
                    style={{ width: "100%", background: "#0F0F0F", border: "1px solid #1E1E1E", borderRadius: 7, color: "#F0F0F0", padding: "10px 12px", fontSize: 13 }}>
                    {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>Platform</div>
                  <select value={platform} onChange={e => setPlatform(e.target.value)}
                    style={{ width: "100%", background: "#0F0F0F", border: "1px solid #1E1E1E", borderRadius: 7, color: "#F0F0F0", padding: "10px 12px", fontSize: 13 }}>
                    {account.platforms.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {PLATFORM_TIPS[platform] && (
                <div style={{ fontSize: 11, color: "#383838", marginBottom: 16, paddingLeft: 2, fontStyle: "italic" }}>
                  {platform}: {PLATFORM_TIPS[platform]}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>
                  Brief <span style={{ color: "#282828", fontWeight: 400 }}>— optional topic or context</span>
                </div>
                <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={3}
                  placeholder={`e.g. "End of term results" or "Office deep clean before/after"`}
                  style={{ width: "100%", background: "#0F0F0F", border: "1px solid #1E1E1E", borderRadius: 7, color: "#F0F0F0", padding: "11px 13px", fontSize: 13, resize: "vertical", lineHeight: 1.6 }} />
              </div>

              <button onClick={generate} disabled={generating}
                style={{ background: generating ? "#151515" : account.color, color: generating ? "#3A3A3A" : "#000",
                  border: "none", borderRadius: 7, padding: "11px 26px", fontSize: 12, fontWeight: 800,
                  letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.15s",
                  boxShadow: generating ? "none" : `0 4px 20px ${account.color}44` }}>
                {generating ? "Generating..." : `Generate ${contentType}`}
              </button>

              {result && (
                <div style={{ marginTop: 26, background: "#0C0C0C", border: `1px solid ${account.color}28`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #181818", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: "#3A3A3A", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      {contentType} · {platform}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={addToQueue}
                        style={{ background: account.color, color: "#000", border: "none", borderRadius: 5, padding: "6px 14px", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>
                        + Queue
                      </button>
                      <button onClick={() => copy(result)}
                        style={{ background: "transparent", color: copied ? "#27C97A" : "#555", border: "1px solid #1E1E1E", borderRadius: 5, padding: "6px 14px", fontSize: 11, fontWeight: 600 }}>
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => { setResult(""); setBrief(""); }}
                        style={{ background: "transparent", color: "#333", border: "none", padding: "6px 10px", fontSize: 11 }}>
                        ✕
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "20px", fontSize: 13, lineHeight: 1.8, color: "#D0D0D0", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>
                    {result}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── QUEUE ── */}
          {activeTab === "queue" && (
            <div style={{ maxWidth: 680 }}>
              {queue.length === 0 ? (
                <div style={{ textAlign: "center", padding: "70px 20px", color: "#252525" }}>
                  <div style={{ fontSize: 40, marginBottom: 14 }}>⬡</div>
                  <div style={{ fontSize: 13 }}>Queue is empty. Generate content and add it here.</div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 11, color: "#3A3A3A" }}>{queue.length} post{queue.length !== 1 ? "s" : ""} queued</span>
                    <button onClick={() => copy(queue.map(p => `[${p.platform} — ${p.type}]\n${p.content}`).join("\n\n---\n\n"))}
                      style={{ background: "transparent", color: "#555", border: "1px solid #1E1E1E", borderRadius: 6, padding: "6px 14px", fontSize: 11, fontWeight: 600 }}>
                      Export All
                    </button>
                  </div>
                  {queue.map(post => (
                    <div key={post.id} style={{ background: "#0C0C0C", border: "1px solid #181818", borderRadius: 10, padding: "18px 20px", marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ display: "flex", gap: 7 }}>
                          <span style={{ background: account.color + "1A", color: account.color, fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{post.platform}</span>
                          <span style={{ background: "#161616", color: "#4A4A4A", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{post.type}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 10, color: "#282828" }}>{post.time}</span>
                          <button onClick={() => copy(post.content)} style={{ background: "transparent", border: "none", color: "#3A3A3A", fontSize: 11, padding: "2px 6px" }}>Copy</button>
                          <button onClick={() => removePost(post.id)} style={{ background: "transparent", border: "none", color: "#2A2A2A", fontSize: 11, padding: "2px 6px" }}>Remove</button>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.75, color: "#BABABA", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>
                        {post.content}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div style={{ maxWidth: 520 }}>
              <div style={{ fontSize: 12, color: "#3A3A3A", lineHeight: 1.7, marginBottom: 26 }}>
                Every piece of content generated for <strong style={{ color: "#666" }}>{account.name}</strong> is shaped by this profile.
              </div>

              {[
                { field: "audience", label: "Target Audience", placeholder: "e.g. Students aged 18–25, parents considering enrollment", multi: false },
                { field: "goal", label: "Account Goal", placeholder: "e.g. Drive enrollment inquiries, build community trust", multi: false },
                { field: "tone", label: "Tone & Voice", placeholder: "e.g. Formal but warm, inspiring, confident", multi: false },
                { field: "driveFolder", label: "Google Drive Folder ID", placeholder: "Paste folder ID from Drive URL — configure on desktop", multi: false }
              ].map(({ field, label, placeholder }) => (
                <div key={field} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>{label}</div>
                  <input value={profile[field]} onChange={e => updateProfile(field, e.target.value)} placeholder={placeholder}
                    style={{ width: "100%", background: "#0F0F0F", border: "1px solid #1E1E1E", borderRadius: 7, color: "#F0F0F0", padding: "11px 13px", fontSize: 13 }} />
                </div>
              ))}

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                <button onClick={saveProfile}
                  style={{ background: account.color, color: "#000", border: "none", borderRadius: 7, padding: "10px 22px", fontSize: 12, fontWeight: 800, letterSpacing: "0.06em" }}>
                  Save Profile
                </button>
                {savedMsg && <span style={{ fontSize: 12, color: "#27C97A" }}>✓ Saved</span>}
              </div>

              {profileReady && (
                <div style={{ marginTop: 20, background: "#091209", border: "1px solid #1A2E1A", borderRadius: 8, padding: "12px 16px", fontSize: 12, color: "#4A8A4A" }}>
                  ✓ Profile complete — ready to generate for {account.name}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
