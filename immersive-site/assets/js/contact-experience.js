/* UltraCorr IT — Premium Live Chat + Video Consultation (Contact page only) */
(function () {
  if (window.__ucContactExp) return;
  window.__ucContactExp = true;

  const CSS = `
  .ux-ov{position:fixed;inset:0;background:rgba(8,15,30,.75);backdrop-filter:blur(8px);z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;animation:uxFade .3s ease}
  .ux-ov.open{display:flex}
  @keyframes uxFade{from{opacity:0}to{opacity:1}}
  @keyframes uxRise{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:none}}
  .ux-card{background:#fff;border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.5);width:100%;max-width:520px;max-height:92vh;height:auto;overflow:hidden;display:flex;flex-direction:column;animation:uxRise .4s cubic-bezier(.2,.9,.3,1.2);font-family:inherit}
  .ux-card.wide{max-width:900px}
  .ux-hero{position:relative;padding:22px 24px;color:#fff;overflow:hidden}
  .ux-hero.chat{background:linear-gradient(135deg,#f59e0b,#ea580c)}
  .ux-hero.video{background:linear-gradient(135deg,#ea580c,#0ea5e9)}
  .ux-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 0%,rgba(255,255,255,.35),transparent 40%),radial-gradient(circle at 90% 100%,rgba(255,255,255,.2),transparent 40%);pointer-events:none}
  .ux-hero h3{margin:0;font-size:22px;font-weight:800;position:relative}
  .ux-hero p{margin:4px 0 0;font-size:13px;opacity:.95;position:relative}
  .ux-hero .ux-x{position:absolute;top:16px;right:16px;background:rgba(255,255,255,.2);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .ux-hero .ux-x:hover{background:rgba(255,255,255,.35)}
  .ux-agents{display:flex;gap:8px;margin-top:14px;position:relative}
  .ux-agent{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);padding:6px 10px;border-radius:20px;font-size:12px}
  .ux-dot{width:8px;height:8px;border-radius:50%;background:#0ea5e9;box-shadow:0 0 0 0 #0ea5e9;animation:uxPing 2s infinite}
  @keyframes uxPing{0%{box-shadow:0 0 0 0 rgba(14,165,233,.7)}70%{box-shadow:0 0 0 8px rgba(14,165,233,0)}100%{box-shadow:0 0 0 0 rgba(14,165,233,0)}}

  .ux-chat-body{display:flex;flex-direction:column;flex:1;min-height:400px;max-height:65vh}
  .ux-msgs{flex:1;overflow-y:auto;padding:18px;background:linear-gradient(180deg,#f8fafc,#f1f5f9);display:flex;flex-direction:column;gap:10px}
  .ux-msg{display:flex;align-items:flex-end;gap:8px;animation:uxRise .3s ease}
  .ux-msg.user{justify-content:flex-end}
  .ux-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#ea580c);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;flex-shrink:0}
  .ux-bub{max-width:75%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.45;white-space:pre-wrap}
  .ux-msg.bot .ux-bub{background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-bottom-left-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.04)}
  .ux-msg.user .ux-bub{background:linear-gradient(135deg,#0ea5e9,#0ea5e9);color:#fff;border-bottom-right-radius:4px}
  .ux-time{font-size:10px;color:#94a3b8;margin-top:2px;text-align:right}
  .ux-typing .ux-bub{display:flex;gap:4px;padding:14px}
  .ux-typing span{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:uxBounce 1.2s infinite}
  .ux-typing span:nth-child(2){animation-delay:.15s}
  .ux-typing span:nth-child(3){animation-delay:.3s}
  @keyframes uxBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}
  .ux-quick{padding:10px 18px;background:#fff;border-top:1px solid #e2e8f0;display:flex;gap:6px;flex-wrap:wrap}
  .ux-quick button{background:#fff7ed;border:1px solid #fde68a;color:#ea580c;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}
  .ux-quick button:hover{background:#ea580c;color:#fff;transform:translateY(-1px)}
  .ux-inbar{display:flex;padding:12px 14px;border-top:1px solid #e2e8f0;background:#fff;gap:8px;align-items:center}
  .ux-inbar input{flex:1;border:1px solid #e2e8f0;border-radius:22px;padding:12px 16px;font-size:14px;outline:none;transition:border .2s}
  .ux-inbar input:focus{border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.18)}
  .ux-inbar button{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border:none;width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:18px;transition:transform .2s}
  .ux-inbar button:hover{transform:scale(1.08)}

  .ux-video-body{padding:20px;display:flex;flex-direction:column;gap:14px;background:#fafafa;overflow-y:auto;flex:1;min-height:0}
  .ux-preview{background:#0f172a;border-radius:16px;height:200px;flex-shrink:0;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
  .ux-preview video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
  .ux-preview .placeholder{color:#64748b;text-align:center;padding:20px}
  .ux-preview .placeholder i{font-size:48px;margin-bottom:10px;display:block}
  .ux-ctrls{display:flex;gap:10px;justify-content:center}
  .ux-ctrls button{width:48px;height:48px;border-radius:50%;border:none;background:#e2e8f0;cursor:pointer;font-size:18px;transition:all .2s}
  .ux-ctrls button.off{background:#ef4444;color:#fff}
  .ux-ctrls button:hover{transform:scale(1.08)}
  .ux-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .ux-form input,.ux-form select{padding:12px 14px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#fff}
  .ux-form input:focus,.ux-form select:focus{border-color:#f59e0b}
  .ux-form .full{grid-column:1/-1}
  .ux-join{background:linear-gradient(135deg,#ea580c,#0ea5e9);color:#fff;border:none;padding:14px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:transform .2s;grid-column:1/-1}
  .ux-join:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(234,88,12,.35)}
  .ux-call{display:none;flex-direction:column;flex:1;min-height:500px}
  .ux-call iframe{flex:1;border:none;border-radius:16px;min-height:480px}
  .ux-call.active{display:flex}
  .ux-video-body.calling>:not(.ux-call){display:none}
  `;
  const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);

  // ---------- LIVE CHAT MODAL ----------
  const chatOv = document.createElement("div");
  chatOv.className = "ux-ov";
  chatOv.innerHTML = `
    <div class="ux-card">
      <div class="ux-hero chat">
        <button class="ux-x" aria-label="close">×</button>
        <h3>💬 Live Chat Support</h3>
        <p>Our specialists are online and ready to help</p>
        <div class="ux-agents">
          <div class="ux-agent"><span class="ux-dot"></span> Priya · Healthcare IT</div>
          <div class="ux-agent"><span class="ux-dot"></span> Arjun · Security</div>
        </div>
      </div>
      <div class="ux-chat-body">
        <div class="ux-msgs" id="ux-msgs"></div>
        <div class="ux-quick">
          <button>I need an EHR integration</button>
          <button>HIPAA compliance audit</button>
          <button>Pricing & quote</button>
          <button>Book an expert</button>
        </div>
        <div class="ux-inbar">
          <input id="ux-in" type="text" placeholder="Type your message…" autocomplete="off"/>
          <button id="ux-send">➤</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(chatOv);

  const chatMsgs = chatOv.querySelector("#ux-msgs");
  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  function addChatMsg(who, text, agent) {
    const d = document.createElement("div");
    d.className = "ux-msg " + who;
    d.innerHTML = who === "bot"
      ? `<div class="ux-av">${agent || "P"}</div><div><div class="ux-bub"></div><div class="ux-time">${now()}</div></div>`
      : `<div><div class="ux-bub"></div><div class="ux-time">${now()}</div></div>`;
    d.querySelector(".ux-bub").textContent = text;
    chatMsgs.appendChild(d); chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }
  function typing() {
    const d = document.createElement("div");
    d.className = "ux-msg bot ux-typing";
    d.innerHTML = `<div class="ux-av">P</div><div class="ux-bub"><span></span><span></span><span></span></div>`;
    chatMsgs.appendChild(d); chatMsgs.scrollTop = chatMsgs.scrollHeight; return d;
  }

  function liveReply(q) {
    const t = q.toLowerCase();
    if (/ehr|electronic|records|epic|cerner/.test(t)) return "Great — our team has delivered 40+ EHR integrations (Epic, Cerner, Allscripts, FHIR). I can loop in our integrations lead Arjun right now. What's your current EHR?";
    if (/hipaa|secur|compliance|audit|soc/.test(t)) return "We run HIPAA & SOC 2 audits end-to-end. Typical engagement is 2–3 weeks. Would you like me to send our compliance readiness checklist to your email?";
    if (/pric|cost|quote|budget/.test(t)) return "Happy to help. Projects range from ₹2L (consulting) to enterprise deployments. Tell me your organization size and scope, and I'll share a tailored estimate.";
    if (/book|schedul|expert|meet|consult|demo/.test(t)) return "Perfect — click the 'Schedule Call' button on this page to start a free video consultation instantly, or share a preferred time and I'll confirm with the team.";
    if (/telemed|telehealth|video/.test(t)) return "Our telemedicine stack includes secure video, e-prescriptions, EHR sync, and mobile apps. Want a live demo?";
    if (/hi|hello|hey/.test(t)) return "Hi! 👋 You're chatting with Priya from UltraCorr IT. How can I help you today?";
    if (/thank/.test(t)) return "Anytime! Is there anything else I can assist with?";
    return "Thanks for sharing! Let me pull up the right specialist for this. In the meantime, could you tell me a bit more about your organization and what you're trying to achieve?";
  }

  function sendChat(text) {
    addChatMsg("user", text);
    const t = typing();
    setTimeout(() => { t.remove(); addChatMsg("bot", liveReply(text), "P"); }, 700 + Math.random() * 600);
  }

  const openChat = () => {
    chatOv.classList.add("open");
    if (!chatMsgs.children.length) {
      setTimeout(() => addChatMsg("bot", "Hi there! 👋 I'm Priya from the UltraCorr IT support team. How can we help you today?", "P"), 200);
    }
    setTimeout(() => chatOv.querySelector("#ux-in").focus(), 400);
  };
  const closeChat = () => chatOv.classList.remove("open");
  chatOv.querySelector(".ux-x").addEventListener("click", closeChat);
  chatOv.addEventListener("click", e => { if (e.target === chatOv) closeChat(); });
  const sendBtn = () => {
    const i = chatOv.querySelector("#ux-in"); const v = i.value.trim(); if (!v) return;
    i.value = ""; sendChat(v);
  };
  chatOv.querySelector("#ux-send").addEventListener("click", sendBtn);
  chatOv.querySelector("#ux-in").addEventListener("keydown", e => { if (e.key === "Enter") sendBtn(); });
  chatOv.querySelectorAll(".ux-quick button").forEach(b => b.addEventListener("click", () => sendChat(b.textContent)));

  // ---------- VIDEO CONSULTATION MODAL ----------
  const vidOv = document.createElement("div");
  vidOv.className = "ux-ov";
  vidOv.innerHTML = `
    <div class="ux-card wide">
      <div class="ux-hero video">
        <button class="ux-x" aria-label="close">×</button>
        <h3>📹 Free Video Consultation</h3>
        <p>30-minute expert session • HD Zoom meeting • Instant launch</p>
      </div>
      <div class="ux-video-body" id="ux-vbody">
        <div class="ux-preview" id="ux-prev">
          <div class="placeholder"><i style="font-style:normal">🎥</i><div>Camera preview will appear here</div><div style="font-size:12px;margin-top:6px;opacity:.7">Click "Enable Camera" below</div></div>
        </div>
        <div class="ux-ctrls">
          <button id="ux-cam" title="Toggle camera">📷</button>
          <button id="ux-mic" title="Toggle mic">🎤</button>
        </div>
        <div class="ux-form">
          <input id="ux-vname" placeholder="Your name"/>
          <input id="ux-vemail" placeholder="Email" type="email"/>
          <select id="ux-vtopic" class="full">
            <option>Topic: Healthcare IT Consulting</option>
            <option>Topic: EHR Integration</option>
            <option>Topic: HIPAA & Security</option>
            <option>Topic: Telemedicine Platform</option>
            <option>Topic: Custom Solution</option>
          </select>
          <button class="ux-join" id="ux-join">🚀 Start Secure Video Call</button>
        </div>
        <div class="ux-call" id="ux-call"></div>
      </div>
    </div>`;
  document.body.appendChild(vidOv);

  const vbody = vidOv.querySelector("#ux-vbody");
  const prev = vidOv.querySelector("#ux-prev");
  const camBtn = vidOv.querySelector("#ux-cam");
  const micBtn = vidOv.querySelector("#ux-mic");
  let stream = null, camOn = false, micOn = false;

  async function enableMedia() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const v = document.createElement("video");
      v.autoplay = true; v.playsInline = true; v.muted = true; v.srcObject = stream;
      prev.innerHTML = ""; prev.appendChild(v);
      camOn = true; micOn = true;
      camBtn.classList.remove("off"); micBtn.classList.remove("off");
    } catch (e) {
      prev.innerHTML = `<div class="placeholder" style="color:#fca5a5"><i style="font-style:normal">🚫</i><div>Camera blocked</div><div style="font-size:12px;margin-top:6px">Please allow camera access in your browser</div></div>`;
    }
  }

  camBtn.addEventListener("click", async () => {
    if (!stream) return enableMedia();
    camOn = !camOn; stream.getVideoTracks().forEach(t => t.enabled = camOn);
    camBtn.classList.toggle("off", !camOn);
  });
  micBtn.addEventListener("click", async () => {
    if (!stream) return enableMedia();
    micOn = !micOn; stream.getAudioTracks().forEach(t => t.enabled = micOn);
    micBtn.classList.toggle("off", !micOn);
  });

  vidOv.querySelector("#ux-join").addEventListener("click", () => {
    const name = (vidOv.querySelector("#ux-vname").value || "Guest").trim() || "Guest";
    const topic = vidOv.querySelector("#ux-vtopic").value;
    // stop local preview to free cam for Zoom
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    const zoomUrl = "https://zoom.us/start/videomeeting";
    const win = window.open(zoomUrl, "_blank", "noopener");
    const call = vidOv.querySelector("#ux-call");
    call.innerHTML = `
      <div style="padding:40px 24px;text-align:center;background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.06)">
        <div style="font-size:56px;margin-bottom:12px">🎥</div>
        <h4 style="margin:0 0 8px;font-size:20px;color:#1e293b">Launching Zoom…</h4>
        <p style="margin:0 0 6px;color:#64748b;font-size:14px">Hi <b>${name.replace(/[<>]/g,"")}</b> — your Zoom meeting window is opening in a new tab.</p>
        <p style="margin:0 0 20px;color:#64748b;font-size:13px">Topic: <b>${topic.replace(/[<>]/g,"")}</b></p>
        <a href="${zoomUrl}" target="_blank" rel="noopener" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#0ea5e9);color:#fff;padding:12px 24px;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px">Open Zoom Meeting</a>
        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px">If nothing opened, click the button above. Popup blocked?<br/>You can also call us at <b>+91 94588 88499</b>.</p>
      </div>`;
    call.classList.add("active");
    vbody.classList.add("calling");
    if (!win) { /* popup blocked — user can still click the link */ }
  });

  function closeVid() {
    vidOv.classList.remove("open");
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    // reset the call iframe so closing really ends the meeting
    const call = vidOv.querySelector("#ux-call");
    call.innerHTML = ""; call.classList.remove("active");
    vbody.classList.remove("calling");
    prev.innerHTML = `<div class="placeholder"><i style="font-style:normal">🎥</i><div>Camera preview will appear here</div><div style="font-size:12px;margin-top:6px;opacity:.7">Click "Enable Camera" below</div></div>`;
    camBtn.classList.remove("off"); micBtn.classList.remove("off");
  }
  vidOv.querySelector(".ux-x").addEventListener("click", closeVid);
  vidOv.addEventListener("click", e => { if (e.target === vidOv) closeVid(); });

  const openVid = () => { vidOv.classList.add("open"); setTimeout(enableMedia, 300); };

  // ---------- WIRE UP BUTTONS ----------
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach(b => {
      const t = (b.textContent || "").trim().toLowerCase();
      if (t === "start chat") b.addEventListener("click", e => { e.preventDefault(); e.stopImmediatePropagation(); openChat(); }, true);
      else if (t === "schedule call" || t === "schedule consultation") b.addEventListener("click", e => { e.preventDefault(); e.stopImmediatePropagation(); openVid(); }, true);
    });
  });

  window.UltraContact = { openChat, openVid, closeChat, closeVid };
})();
