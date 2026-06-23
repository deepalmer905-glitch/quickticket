import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const ISSUES = [
  { icon: "📶", label: "Internet Down", value: "Internet is down or slow" },
  { icon: "🖨️", label: "Printer Broken", value: "Printer not working" },
  { icon: "🐌", label: "Slow Computer", value: "Computer is very slow" },
  { icon: "📧", label: "Email Issue", value: "Can't access email" },
  { icon: "💾", label: "Need Software", value: "Need software installed" },
  { icon: "❓", label: "Other Issue", value: "Other tech issue" },
];

const APP_URL = window.location.origin + window.location.pathname;

export default function App() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function selectIssue(issue: string) {
    setSelectedIssue(issue);
    setSent(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function sendTicket() {
    if (!name.trim()) {
      alert("Please enter your name so IT knows who to help.");
      return;
    }
    const subject = encodeURIComponent(`IT Ticket: ${selectedIssue} — ${name}`);
    const body = encodeURIComponent(
      `Issue: ${selectedIssue}\nName: ${name}\nLocation: ${location}\nDetails: ${details}\n\nSent from QuickTicket`
    );
    window.location.href = `mailto:support@palmertechsolutions.com?subject=${subject}&body=${body}`;
    setSent(true);
    setName("");
    setLocation("");
    setDetails("");
    setSelectedIssue(null);
  }

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <div className="logo">🛠️</div>
          <h1>Computer Problem?</h1>
          <p>Click what's broken — IT will be notified instantly.</p>
        </div>

        <div className="cta-wrap">
          <a
            href="#issues"
            className="cta-btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("issues")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            SUBMIT QUICK TICKET
          </a>
        </div>

        <div className="issue-grid" id="issues">
          {ISSUES.map((issue) => (
            <button
              key={issue.value}
              className={`issue-btn ${selectedIssue === issue.value ? "active" : ""}`}
              onClick={() => selectIssue(issue.value)}
            >
              <span className="issue-icon">{issue.icon}</span>
              <span className="issue-label">{issue.label}</span>
            </button>
          ))}
        </div>

        {selectedIssue && (
          <div className="form-section" ref={formRef}>
            <div className="form-header">
              <div className="form-badge">Reporting: {selectedIssue}</div>
            </div>
            <div className="form-fields">
              <input
                type="text"
                placeholder="Your Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Your Desk / Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input"
              />
              <textarea
                placeholder="Any extra details? What were you doing when it broke?"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="input textarea"
                rows={3}
              />
              <button className="send-btn" onClick={sendTicket}>
                📨 Send Ticket to IT
              </button>
            </div>
          </div>
        )}

        {sent && (
          <div className="success-banner">
            ✅ Ticket sent! IT will contact you ASAP.
          </div>
        )}

        {/* QR Code Section */}
        <div className="qr-section">
          <button className="qr-toggle" onClick={() => setShowQR(!showQR)}>
            {showQR ? "▲ Hide QR Code" : "📲 Show QR Code to Share"}
          </button>
          {showQR && (
            <div className="qr-panel">
              <div className="qr-box">
                <QRCodeSVG
                  value={APP_URL}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="qr-label">Scan to open QuickTicket</p>
              <p className="qr-sub">Print this and stick it on desks, printers, or a break room wall</p>
              <button className="qr-print-btn" onClick={() => window.print()}>
                🖨️ Print QR Code
              </button>
            </div>
          )}
        </div>

        <div className="footer">
          <strong>IT Support by Palmer Tech Solutions LLC</strong>
          <span>20 Years Fixing Philly Tech</span>
        </div>
      </div>
    </div>
  );
}
