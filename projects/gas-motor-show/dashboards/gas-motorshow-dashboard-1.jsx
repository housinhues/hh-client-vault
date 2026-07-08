import { useState } from "react";
import { Copy, ExternalLink, MessageCircle, CheckCircle2, Clock, X, ChevronDown, Zap } from "lucide-react";

// ─── INLINE DATA ──────────────────────────────────────────────────────────────
const partners = [
  {
    id: "1",
    name: "Joburg Auto Scene",
    handle: "@joburgautoscene",
    province: "Gauteng",
    followers: "48.2K",
    platform: "instagram",
    bio: "Capturing Joburg's underground car culture — meets, builds, and the streets that shape them.",
    profileUrl: "https://instagram.com/joburgautoscene",
    dmUrl: "https://ig.me/m/joburgautoscene",
    status: "pending",
    sentDate: null,
    message: `Hey @joburgautoscene 👋\n\nWe're HousinHues — a marketing agency out of Orkney, North West, and we're putting together the outreach strategy for Gas Motor Show International 2026 (13–14 June, Suncoast Durban).\n\nYour content speaks directly to the culture we're trying to amplify — real scenes, real builds, real people. We'd love to explore a collab that puts your audience in the front row of what's going down in Durban this June.\n\nWould you be open to a quick chat about partnership possibilities? 🔥\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "2",
    name: "KZN Car Meets",
    handle: "@kzncarmeets",
    province: "KwaZulu-Natal",
    followers: "31.7K",
    platform: "both",
    bio: "KZN's home for car meets, show coverage, and everything on four wheels.",
    profileUrl: "https://instagram.com/kzncarmeets",
    dmUrl: "https://ig.me/m/kzncarmeets",
    status: "pending",
    sentDate: null,
    message: `Sawubona @kzncarmeets 🤙\n\nHousinHues here — we're the agency coordinating the media amplification for Gas Motor Show International 2026 (13–14 June at Suncoast, right in your backyard).\n\nYou're literally the pulse of KZN car culture, and having you involved in the show's narrative would be massive. We want to build something authentic — not just a repost deal, but real content that your audience actually cares about.\n\nLet's link and talk. 🔧\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "3",
    name: "Cape Town Drives",
    handle: "@capetowndrives",
    province: "Western Cape",
    followers: "62.4K",
    platform: "instagram",
    bio: "Mountain passes, coastal roads, and the finest machinery the Mother City has to offer.",
    profileUrl: "https://instagram.com/capetowndrives",
    dmUrl: "https://ig.me/m/capetowndrives",
    status: "sent",
    sentDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    message: `Hey @capetowndrives 🌊\n\nWe're HousinHues — the agency behind the 9-province outreach campaign for Gas Motor Show International 2026 (13–14 June, Durban Suncoast).\n\nCapeTown to Durban — that's a journey worth documenting. We'd love to explore a travel content angle: road trip content from CT to the show, behind-the-scenes, your take on the event.\n\nYour aesthetic fits the show's energy. Let's make it work.\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "4",
    name: "PE Street Cars",
    handle: "@pestreetcars",
    province: "Eastern Cape",
    followers: "19.3K",
    platform: "facebook",
    bio: "Port Elizabeth's car community — shows, cruises, and builds from the Bay.",
    profileUrl: "https://facebook.com/pestreetcars",
    dmUrl: "https://m.me/pestreetcars",
    status: "pending",
    sentDate: null,
    message: `Hi PE Street Cars 🏁\n\nHousinHues here — we're coordinating media outreach for Gas Motor Show International 2026, happening 13–14 June at Suncoast Durban.\n\nThe Eastern Cape has some of the most passionate car people in the country, and we want them represented at this event. We're looking for community voices — not just brand accounts — to help spread the word in a way that feels real.\n\nWould love to explore what a partnership looks like for you.\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "5",
    name: "Limpopo Rev Heads",
    handle: "@limpoporevheads",
    province: "Limpopo",
    followers: "11.8K",
    platform: "both",
    bio: "Pushing the Northern limits — car culture from Polokwane to the border.",
    profileUrl: "https://instagram.com/limpoporevheads",
    dmUrl: "https://ig.me/m/limpoporevheads",
    status: "replied",
    sentDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    message: `Hey @limpoporevheads 🔥\n\nHousinHues — we're running the community outreach for Gas Motor Show International 2026 (13–14 June, Suncoast Durban).\n\nLimpopo's car scene is often underrepresented in national coverage, and we want to change that. Your platform has the reach to put Northern car culture on the map at one of SA's biggest shows.\n\nLet's build something together. ✊\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "6",
    name: "Mpumalanga Motors",
    handle: "@mpumalangamotors",
    province: "Mpumalanga",
    followers: "8.5K",
    platform: "instagram",
    bio: "Nelspruit-based car content — local builds, meets, and Lowveld road culture.",
    profileUrl: "https://instagram.com/mpumalangamotors",
    dmUrl: "https://ig.me/m/mpumalangamotors",
    status: "pending",
    sentDate: null,
    message: `Hey @mpumalangamotors 👊\n\nWe're HousinHues, coordinating outreach for Gas Motor Show International 2026 — 13–14 June, Suncoast Durban.\n\nMpumalanga's car community doesn't always get the spotlight it deserves. We want to change that by connecting local voices like yours to a national-level platform.\n\nOpen to a conversation?\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "7",
    name: "NW Auto Club",
    handle: "@nwautoclub",
    province: "North West",
    followers: "7.2K",
    platform: "facebook",
    bio: "Rustenburg & surrounding — car meets, drags, and community builds from the North West.",
    profileUrl: "https://facebook.com/nwautoclub",
    dmUrl: "https://m.me/nwautoclub",
    status: "follow-up",
    sentDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    message: `Hi NW Auto Club 🤙\n\nHousinHues here — based right here in Orkney, North West. We're running the media outreach for Gas Motor Show International 2026 (13–14 June, Suncoast Durban).\n\nAs a local agency, we're especially invested in making sure the North West is loud at this event. Your community is exactly who we want amplifying the message.\n\nLet's represent the province together. 🏁\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "8",
    name: "Free State Car Fam",
    handle: "@fscarfam",
    province: "Free State",
    followers: "6.1K",
    platform: "instagram",
    bio: "Bloem's finest — Bloemfontein car culture, meets, and everything in between.",
    profileUrl: "https://instagram.com/fscarfam",
    dmUrl: "https://ig.me/m/fscarfam",
    status: "pending",
    sentDate: null,
    message: `Hey @fscarfam 👋\n\nHousinHues — we're doing the community outreach for Gas Motor Show International 2026 (13–14 June, Durban).\n\nThe Free State is centrally located and often the overlooked middle — we want to fix that. Your audience could be a key bridge between interior SA and the show on the coast.\n\nWould love to chat about what a partnership looks like. 🔥\n\n— HousinHues (@housinHues)`,
  },
  {
    id: "9",
    name: "NC Desert Rides",
    handle: "@ncdesertrides",
    province: "Northern Cape",
    followers: "4.8K",
    platform: "instagram",
    bio: "Kimberley-based car content — big skies, long roads, and passionate builds.",
    profileUrl: "https://instagram.com/ncdesertrides",
    dmUrl: "https://ig.me/m/ncdesertrides",
    status: "pending",
    sentDate: null,
    message: `Hey @ncdesertrides 🌵\n\nHousinHues here — we're the agency behind the outreach campaign for Gas Motor Show International 2026 (13–14 June, Suncoast Durban).\n\nThe Northern Cape is the final frontier of SA car culture coverage — vast, raw, and underrepresented. We want to change that and bring your community into the national conversation.\n\nLet's make some noise from the diamond fields. 💎\n\n— HousinHues (@housinHues)`,
  },
];

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS = {
  pending:   { label: "Pending",   dot: "#f59e0b", bar: "#fef3c7", text: "#92400e" },
  sent:      { label: "Sent",      dot: "#3b82f6", bar: "#dbeafe", text: "#1e40af" },
  replied:   { label: "Replied",   dot: "#10b981", bar: "#d1fae5", text: "#065f46" },
  "follow-up": { label: "Follow-up", dot: "#8b5cf6", bar: "#ede9fe", text: "#5b21b6" },
};

const PLATFORMS = {
  instagram: "IG",
  facebook: "FB",
  both: "IG & FB",
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [list, setList] = useState(partners);
  const [province, setProvince] = useState("all");
  const [dialog, setDialog] = useState(null); // partner or null
  const [copied, setCopied] = useState(null);

  const filtered = province === "all" ? list : list.filter((p) => p.province === province);

  const stats = {
    total: list.length,
    pending: list.filter((p) => p.status === "pending").length,
    sent: list.filter((p) => p.status === "sent").length,
    replied: list.filter((p) => p.status === "replied").length,
  };

  const copyMessage = (partner) => {
    navigator.clipboard.writeText(partner.message);
    setCopied(partner.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const setStatus = (id, status) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, sentDate: new Date().toISOString() } : p))
    );
    if (dialog?.id === id) setDialog((d) => ({ ...d, status, sentDate: new Date().toISOString() }));
  };

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0b;
          --surface: #111114;
          --surface2: #18181d;
          --border: #242428;
          --accent: #e8ff47;
          --accent2: #ff3c3c;
          --text: #f0f0f0;
          --muted: #6b6b75;
          --font-head: 'Barlow Condensed', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        body { background: var(--bg); color: var(--text); }

        .dash {
          min-height: 100vh;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 60% 40% at 50% -10%, rgba(232,255,71,0.07) 0%, transparent 70%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 80px);
          padding: 32px 20px 60px;
          font-family: var(--font-mono);
        }

        .inner { max-width: 1200px; margin: 0 auto; }

        /* HEADER */
        .header { margin-bottom: 40px; }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.25em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background: var(--accent);
        }
        .title {
          font-family: var(--font-head);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 0.95;
          color: #fff;
        }
        .title span { color: var(--accent); }
        .subtitle {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--muted);
          margin-top: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          margin-bottom: 32px;
          border: 1px solid var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        @media (max-width: 600px) { .stats { grid-template-columns: repeat(2, 1fr); } }
        .stat {
          background: var(--surface);
          padding: 20px 16px;
          text-align: center;
          border-right: 1px solid var(--border);
        }
        .stat:last-child { border-right: none; }
        .stat-num {
          font-family: var(--font-head);
          font-size: 48px;
          font-weight: 900;
          line-height: 1;
          color: #fff;
        }
        .stat-num.yellow { color: var(--accent); }
        .stat-num.blue { color: #60a5fa; }
        .stat-num.green { color: #34d399; }
        .stat-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 4px;
        }

        /* FILTER */
        .filter-row { margin-bottom: 28px; display: flex; align-items: center; gap: 12px; }
        .filter-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted); }
        .filter-select-wrap { position: relative; }
        .filter-select {
          appearance: none;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 8px 36px 8px 12px;
          border-radius: 2px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
        }
        .filter-select:hover, .filter-select:focus { border-color: var(--accent); }
        .filter-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          pointer-events: none;
          width: 14px;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .grid { grid-template-columns: 1fr; } }

        /* CARD */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 20px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .card:hover { border-color: #3a3a40; background: var(--surface2); }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px;
          height: 100%;
          background: var(--status-color, var(--border));
          transition: background 0.15s;
        }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .card-name {
          font-family: var(--font-head);
          font-size: 18px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #fff;
          line-height: 1.1;
        }
        .card-handle { font-size: 11px; color: var(--muted); margin-top: 2px; }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 3px 8px;
          border-radius: 1px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--muted);
        }
        .card-followers { color: var(--text); font-weight: 500; }
        .card-platform {
          font-size: 9px;
          background: var(--bg);
          border: 1px solid var(--border);
          padding: 2px 6px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .card-bio {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
          flex: 1;
        }

        .card-actions { display: flex; gap: 6px; }
        .btn {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.05em;
          cursor: pointer;
          border-radius: 1px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          padding: 7px 12px;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .btn-ghost {
          background: transparent;
          border-color: var(--border);
          color: var(--muted);
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
        .btn-accent {
          background: var(--accent);
          color: #0a0a0b;
          font-weight: 600;
        }
        .btn-accent:hover { background: #d4eb30; }
        .btn-outline {
          background: transparent;
          border-color: var(--border);
          color: var(--text);
        }
        .btn-outline:hover { border-color: var(--text); }
        .btn-full { flex: 1; justify-content: center; }

        .card-link {
          font-size: 11px;
          color: var(--muted);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.05em;
          transition: color 0.15s;
        }
        .card-link:hover { color: var(--accent); }

        /* DIALOG */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(2px);
        }
        .modal {
          background: var(--surface);
          border: 1px solid var(--border);
          width: 100%;
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .modal-title {
          font-family: var(--font-head);
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #fff;
          line-height: 1;
        }
        .modal-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .modal-close {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          cursor: pointer;
          padding: 6px;
          display: flex;
          border-radius: 1px;
          transition: border-color 0.15s, color 0.15s;
        }
        .modal-close:hover { border-color: var(--accent2); color: var(--accent2); }

        .message-box {
          background: var(--bg);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
          padding: 16px;
          font-size: 12px;
          line-height: 1.8;
          color: #c8c8cc;
          white-space: pre-wrap;
          font-family: var(--font-mono);
        }

        .modal-actions { display: flex; gap: 8px; }

        .status-section { border-top: 1px solid var(--border); padding-top: 16px; }
        .status-section-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
        .status-btn {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          padding: 8px;
          text-align: center;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .status-btn:hover { border-color: #555; color: var(--text); }
        .status-btn.active {
          border-color: var(--accent);
          background: rgba(232,255,71,0.08);
          color: var(--accent);
        }

        .empty {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 60px 20px;
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .copied-badge {
          background: var(--accent);
          color: #0a0a0b;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 1px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="dash">
        <div className="inner">

          {/* HEADER */}
          <header className="header">
            <div className="eyebrow">
              <Zap size={11} />
              HousinHues · Campaign Ops
            </div>
            <h1 className="title">
              Gas Motor<br />
              <span>Show 2026</span>
            </h1>
            <p className="subtitle">9-Province Media Outreach · 13–14 June · Suncoast Durban</p>
          </header>

          {/* STATS */}
          <div className="stats">
            <div className="stat">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Partners</div>
            </div>
            <div className="stat">
              <div className="stat-num yellow">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat">
              <div className="stat-num blue">{stats.sent}</div>
              <div className="stat-label">Sent</div>
            </div>
            <div className="stat">
              <div className="stat-num green">{stats.replied}</div>
              <div className="stat-label">Replied</div>
            </div>
          </div>

          {/* FILTER */}
          <div className="filter-row">
            <span className="filter-label">Province</span>
            <div className="filter-select-wrap">
              <select
                className="filter-select"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="all">All Provinces</option>
                {["Gauteng","KwaZulu-Natal","Western Cape","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="filter-chevron" />
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>
              {filtered.length} / {list.length} shown
            </span>
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className="empty">No partners for selected province</div>
          ) : (
            <div className="grid">
              {filtered.map((partner) => {
                const s = STATUS[partner.status];
                return (
                  <div
                    key={partner.id}
                    className="card"
                    style={{ "--status-color": s.dot }}
                  >
                    <div className="card-top">
                      <div>
                        <div className="card-name">{partner.name}</div>
                        <div className="card-handle">{partner.handle}</div>
                      </div>
                      <div
                        className="status-pill"
                        style={{ background: s.bar + "22", color: s.dot, border: `1px solid ${s.dot}44` }}
                      >
                        <span className="status-dot" style={{ background: s.dot }} />
                        {s.label}
                      </div>
                    </div>

                    <div className="card-meta">
                      <span className="card-followers">{partner.followers}</span>
                      <span>followers</span>
                      <span className="card-platform">{PLATFORMS[partner.platform]}</span>
                    </div>

                    <p className="card-bio">{partner.bio}</p>

                    <div className="card-actions">
                      <button
                        className="btn btn-ghost btn-full"
                        onClick={() => copyMessage(partner)}
                      >
                        {copied === partner.id ? (
                          <><CheckCircle2 size={12} /> Copied</>
                        ) : (
                          <><Copy size={12} /> Copy</>
                        )}
                      </button>
                      <button
                        className="btn btn-ghost btn-full"
                        onClick={() => window.open(partner.dmUrl, "_blank")}
                      >
                        <MessageCircle size={12} /> DM
                      </button>
                      <button
                        className="btn btn-ghost btn-full"
                        onClick={() => setDialog(partner)}
                      >
                        View
                      </button>
                    </div>

                    <a href={partner.profileUrl} target="_blank" rel="noopener noreferrer" className="card-link">
                      <ExternalLink size={10} /> View Profile
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DIALOG */}
      {dialog && (
        <div className="overlay" onClick={() => setDialog(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{dialog.name}</div>
                <div className="modal-sub">{dialog.handle} · {dialog.province}</div>
              </div>
              <button className="modal-close" onClick={() => setDialog(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="message-box">{dialog.message}</div>

            <div className="modal-actions">
              <button
                className="btn btn-accent btn-full"
                onClick={() => copyMessage(dialog)}
              >
                {copied === dialog.id ? (
                  <><CheckCircle2 size={12} /> Copied!</>
                ) : (
                  <><Copy size={12} /> Copy Message</>
                )}
              </button>
              <button
                className="btn btn-outline btn-full"
                onClick={() => window.open(dialog.dmUrl, "_blank")}
              >
                <ExternalLink size={12} /> Open DM
              </button>
            </div>

            <div className="status-section">
              <div className="status-section-label">Update Status</div>
              <div className="status-grid">
                {Object.entries(STATUS).map(([key, cfg]) => (
                  <button
                    key={key}
                    className={`status-btn ${dialog.status === key ? "active" : ""}`}
                    onClick={() => setStatus(dialog.id, key)}
                  >
                    <span className="status-dot" style={{ background: cfg.dot }} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
