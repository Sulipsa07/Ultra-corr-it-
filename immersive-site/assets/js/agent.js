/* UltraCorr IT - AI Agent, Live Chat & Video Consultation Widget
   Self-contained, no backend required. Loads on every page. */
(function () {
  if (window.__ucAgentLoaded) return;
  window.__ucAgentLoaded = true;

  // ---------- Knowledge Base ----------
  const KB = {
    company: "UltraCorr IT is a healthcare technology company transforming hospitals and clinics through innovative IT solutions, secure data management, HIPAA-compliant infrastructure, and cutting-edge medical software.",
    services: [
      "Healthcare IT Consulting",
      "HIPAA-Compliant Cloud Infrastructure",
      "Electronic Health Records (EHR) Integration",
      "Telemedicine & Video Consultation Platforms",
      "Medical Data Security & Cybersecurity",
      "Hospital Management Systems",
      "AI & Analytics for Clinical Workflows",
      "24/7 Managed IT Support"
    ],
    phone: "+91 94588 88499",
    email: "info@ultracorrit.com",
    hours: "Mon–Fri 8AM–6PM (24/7 emergency support)",
    pages: {
      "home": "index.html", "about": "about.html", "services": "services.html",
      "solutions": "solutions.html", "portfolio": "portfolio.html",
      "contact": "contact.html", "privacy": "privacy.html", "terms": "terms.html"
    }
  };

  // ---------- Rule-based agent ----------
  function agentReply(text) {
    const q = text.toLowerCase().trim();
    // Match at the start of a word, so "hi" doesn't fire on "which" or "this"
    const has = (...w) => w.some(x => new RegExp("\\b" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(q));

    if (has("hi", "hello", "hey", "hola")) {
      return `Hi there! 👋 I'm Ultra, the UltraCorr IT virtual assistant. I can tell you about our services, pricing, book a consultation, or connect you to a human. What would you like to know?`;
    }
    if (has("who", "about", "company", "what do you do", "what is ultracorr")) {
      return KB.company + " Want me to list our main services?";
    }
    if (has("service", "offer", "solution", "product")) {
      return "We offer:\n• " + KB.services.join("\n• ") + "\n\nAsk me about any of these in detail.";
    }
    if (has("ehr", "electronic health", "records")) {
      return "Our EHR integration connects hospitals with Epic, Cerner, Allscripts and custom systems — HL7/FHIR compliant, with zero-downtime migration. Want to schedule a demo?";
    }
    if (has("hipaa", "security", "secure", "compliance", "compliant")) {
      return "Security is our core: end-to-end encryption, HIPAA/HITECH compliance, SOC 2 Type II, 24/7 SOC monitoring, and penetration testing. I can send a compliance brief to your email.";
    }
    if (has("telemedicine", "telehealth", "video platform")) {
      return "We build telemedicine platforms with secure video, e-prescriptions, and EHR sync. You can even try a live video consultation right now — click the 📹 Video tab above.";
    }
    if (has("price", "cost", "quote", "pricing", "how much")) {
      return "Pricing depends on scope — typical projects start around ₹2L for consulting engagements and scale for enterprise deployments. Share your requirements and I'll arrange a free quote.";
    }
    if (has("contact", "reach", "phone", "call", "number", "email")) {
      return `📞 ${KB.phone}\n✉️ ${KB.email}\n🕐 ${KB.hours}\nOr tap the 📹 Video tab for an instant consultation.`;
    }
    if (has("book", "appointment", "schedule", "consult", "meeting", "demo")) {
      return "Sure! Click the 📹 Video Consultation tab above to start a free 30-min video call instantly, or share your email and preferred time and our team will confirm.";
    }
    if (has("location", "office", "where", "address")) {
      return "Our head office is in India, with delivery teams serving clients globally. Full addresses are on the Contact page.";
    }
    if (has("human", "agent", "person", "representative", "live")) {
      return `Connecting you to live support… Meanwhile call ${KB.phone} or use the 📹 Video tab for an instant face-to-face consultation.`;
    }
    if (has("thank")) return "You're welcome! Anything else I can help with?";
    if (has("bye", "goodbye")) return "Goodbye! 👋 Feel free to come back anytime.";
    if (has("portfolio", "case stud", "client", "work")) {
      return "See our Portfolio page for case studies across hospitals, diagnostic labs and telehealth startups. Want me to open it?";
    }
    if (has("open ", "go to ", "navigate", "show me ")) {
      for (const k in KB.pages) if (q.includes(k)) { location.href = KB.pages[k]; return "Opening " + k + "…"; }
    }
    return "I can help with services, pricing, security/HIPAA, EHR, telemedicine, booking a consultation, or connecting to a human. What would you like to explore?";
  }

  // ---------- Styles ----------
  const css = `
  .uc-fab{position:fixed;bottom:24px;right:24px;z-index:9998;display:flex;flex-direction:column;gap:12px;align-items:flex-end}
  .uc-fab button{border:none;cursor:pointer;width:60px;height:60px;border-radius:50%;color:#fff;font-size:22px;box-shadow:0 10px 25px rgba(0,0,0,.25);transition:transform .2s}
  .uc-fab button:hover{transform:scale(1.08)}
  .uc-fab .uc-main{background:linear-gradient(135deg,#f59e0b,#ea580c);width:66px;height:66px;font-size:26px;animation:ucPulse 2s infinite}
  @keyframes ucPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.6)}50%{box-shadow:0 0 0 18px rgba(245,158,11,0)}}
  .uc-panel{position:fixed;bottom:100px;right:24px;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 120px);background:#fff;border-radius:18px;box-shadow:0 25px 60px rgba(0,0,0,.3);z-index:9999;display:none;flex-direction:column;overflow:hidden;font-family:inherit}
  .uc-panel.open{display:flex;animation:ucIn .3s ease}
  @keyframes ucIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  .uc-head{background:linear-gradient(135deg,#0ea5e9,#f59e0b);color:#fff;padding:16px;display:flex;align-items:center;gap:12px}
  .uc-head .uc-av{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:20px}
  .uc-head h4{margin:0;font-size:16px;font-weight:700}
  .uc-head p{margin:0;font-size:12px;opacity:.9}
  .uc-head .uc-close{margin-left:auto;background:none;border:none;color:#fff;font-size:22px;cursor:pointer}
  .uc-tabs{display:flex;background:#f1f5f9;border-bottom:1px solid #e2e8f0}
  .uc-tabs button{flex:1;padding:12px;border:none;background:none;cursor:pointer;font-size:13px;font-weight:600;color:#64748b}
  .uc-tabs button.active{background:#fff;color:#0ea5e9;border-bottom:2px solid #f59e0b}
  .uc-body{flex:1;overflow:hidden;display:flex;flex-direction:column}
  .uc-view{display:none;flex:1;flex-direction:column;overflow:hidden}
  .uc-view.active{display:flex}
  .uc-msgs{flex:1;overflow-y:auto;padding:14px;background:#f8fafc}
  .uc-msg{margin-bottom:10px;display:flex}
  .uc-msg .bub{max-width:80%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.4;white-space:pre-wrap}
  .uc-msg.bot .bub{background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-bottom-left-radius:4px}
  .uc-msg.user{justify-content:flex-end}
  .uc-msg.user .bub{background:linear-gradient(135deg,#0ea5e9,#0ea5e9);color:#fff;border-bottom-right-radius:4px}
  .uc-quick{padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;background:#f8fafc;border-top:1px solid #e2e8f0}
  .uc-quick button{background:#fff;border:1px solid #cbd5e1;color:#0ea5e9;padding:6px 12px;border-radius:16px;font-size:12px;cursor:pointer}
  .uc-quick button:hover{background:#0ea5e9;color:#fff}
  .uc-input{display:flex;padding:10px;border-top:1px solid #e2e8f0;background:#fff;gap:8px}
  .uc-input input{flex:1;border:1px solid #e2e8f0;border-radius:20px;padding:10px 14px;font-size:14px;outline:none}
  .uc-input input:focus{border-color:#0ea5e9}
  .uc-input button{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border:none;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:16px}
  .uc-video{flex:1;display:flex;flex-direction:column;padding:14px;gap:10px;overflow-y:auto}
  .uc-video h5{margin:0;font-size:15px;color:#1e293b}
  .uc-video p{margin:0;font-size:13px;color:#64748b;line-height:1.5}
  .uc-video input{border:1px solid #e2e8f0;border-radius:10px;padding:10px;font-size:14px;outline:none}
  .uc-video .start-btn{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border:none;padding:12px;border-radius:10px;font-weight:600;cursor:pointer;font-size:14px}
  .uc-video iframe{flex:1;min-height:260px;border:none;border-radius:10px}
  .uc-typing .bub{font-style:italic;opacity:.7}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- DOM ----------
  const fab = document.createElement("div");
  fab.className = "uc-fab";
  fab.innerHTML = `<button class="uc-main" title="Chat with Ultra"><i class="fas fa-comment-dots">💬</i></button>`;
  document.body.appendChild(fab);

  const panel = document.createElement("div");
  panel.className = "uc-panel";
  panel.innerHTML = `
    <div class="uc-head">
      <div class="uc-av">🤖</div>
      <div><h4>Ultra — AI Assistant</h4><p>Online • Replies instantly</p></div>
      <button class="uc-close" aria-label="close">×</button>
    </div>
    <div class="uc-body">
      <div class="uc-view active" data-view="chat">
        <div class="uc-msgs" id="uc-msgs"></div>
        <div class="uc-quick">
          <button>Our services</button>
          <button>Pricing</button>
          <button>HIPAA security</button>
          <button>Book a demo</button>
          <button>Talk to human</button>
        </div>
        <div class="uc-input">
          <input type="text" id="uc-in" placeholder="Type your message..." autocomplete="off"/>
          <button id="uc-send">➤</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(panel);

  // ---------- Behavior ----------
  const $ = s => panel.querySelector(s);
  const msgs = $("#uc-msgs");

  function addMsg(container, who, text) {
    const d = document.createElement("div");
    d.className = "uc-msg " + who;
    d.innerHTML = `<div class="bub"></div>`;
    d.querySelector(".bub").textContent = text;
    container.appendChild(d);
    container.scrollTop = container.scrollHeight;
    return d;
  }

  function botTyping(container) {
    const d = addMsg(container, "bot", "typing…");
    d.classList.add("uc-typing");
    return d;
  }

  function sendToAgent(text) {
    addMsg(msgs, "user", text);
    const t = botTyping(msgs);
    setTimeout(() => {
      t.remove();
      addMsg(msgs, "bot", agentReply(text));
    }, 500 + Math.random() * 500);
  }

  // Open/close
  const openPanel = () => { panel.classList.add("open"); setTimeout(() => $("#uc-in")?.focus(), 100); };
  const closePanel = () => panel.classList.remove("open");
  fab.querySelector(".uc-main").addEventListener("click", () => panel.classList.contains("open") ? closePanel() : openPanel());
  $(".uc-close").addEventListener("click", closePanel);

  // Chat send
  const chatSend = () => {
    const i = $("#uc-in"); const v = i.value.trim(); if (!v) return;
    i.value = ""; sendToAgent(v);
  };
  $("#uc-send").addEventListener("click", chatSend);
  $("#uc-in").addEventListener("keydown", e => { if (e.key === "Enter") chatSend(); });

  // Quick buttons
  panel.querySelectorAll(".uc-quick button").forEach(b => {
    b.addEventListener("click", () => sendToAgent(b.textContent));
  });

  // Greeting
  setTimeout(() => {
    addMsg(msgs, "bot", "👋 Hi! I'm Ultra, the UltraCorr IT AI assistant. Ask me about our healthcare IT services, pricing, security, or how we can help your organization!");
  }, 300);

  // Expose API + wire any existing buttons on the page
  window.UltraAgent = { open: openPanel, close: closePanel };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach(b => {
      const t = (b.textContent || "").trim().toLowerCase();
      if (t === "start chat" || t === "schedule call" || t === "schedule consultation")
        b.addEventListener("click", e => { e.preventDefault(); openPanel(); });
    });
    // Replace the old sticky phone FAB so we don't have two
    document.querySelectorAll(".fixed.bottom-6.right-6").forEach(el => { if (!el.classList.contains("uc-fab")) el.style.display = "none"; });
  });
})();
