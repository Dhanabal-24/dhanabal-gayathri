/* ============================================================
   Dhanabal & Gayathri — Personal Portal
   script.js
   ============================================================ */

/* ── Key dates ───────────────────────────────────────────── */
const RELATIONSHIP_START = new Date('2020-10-19T00:00:00');
const ANNIVERSARY_MONTH_DAY = { month: 9, day: 19 }; // month is 0-indexed (9 = October)

/* ── Firebase Firestore (Guestbook) ──────────────────────── */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiwgIxMRewq5jqMMmdELqdXt8GM7GKEtk",
  authDomain: "dg-portal-294fa.firebaseapp.com",
  projectId: "dg-portal-294fa",
  storageBucket: "dg-portal-294fa.firebasestorage.app",
  messagingSenderId: "853142910392",
  appId: "1:853142910392:web:50e8af3db3defd15de8b4d",
  measurementId: "G-G8JZYTSSFH"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ── Navbar scroll shadow ────────────────────────────────── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ── Mobile menu toggle ──────────────────────────────────── */
const toggle  = document.getElementById('navToggle');
const menu    = document.getElementById('mobileMenu');
const navIcon = document.getElementById('navIcon');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  navIcon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
});

function closeMenu() {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', false);
  navIcon.className = 'bi bi-list';
}

/* ── Scroll reveal ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── Hero parallax ───────────────────────────────────────── */
const heroVisual = document.getElementById('heroVisual');
if (heroVisual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight) {
      heroVisual.style.transform = `translateY(${offset * 0.08}px)`;
    }
  }, { passive: true });
}

/* ── Live "together for" counter ─────────────────────────── */
const liveCounterEl = document.getElementById('liveCounter');

function updateLiveCounter() {
  const now = new Date();
  const diffMs = now - RELATIONSHIP_START;
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  liveCounterEl.textContent = `${days.toLocaleString()} days, ${hours}h ${mins}m`;
}
updateLiveCounter();
setInterval(updateLiveCounter, 30000);

/* ── Anniversary countdown ───────────────────────────────── */
const cdDays  = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins  = document.getElementById('cdMins');
const cdSecs  = document.getElementById('cdSecs');

function nextAnniversary() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, ANNIVERSARY_MONTH_DAY.month, ANNIVERSARY_MONTH_DAY.day, 0, 0, 0);
  if (target <= now) {
    target = new Date(year + 1, ANNIVERSARY_MONTH_DAY.month, ANNIVERSARY_MONTH_DAY.day, 0, 0, 0);
  }
  return target;
}

function updateCountdown() {
  const now = new Date();
  const target = nextAnniversary();
  const diff = target - now;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  cdDays.textContent  = String(d).padStart(2, '0');
  cdHours.textContent = String(h).padStart(2, '0');
  cdMins.textContent  = String(m).padStart(2, '0');
  cdSecs.textContent  = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── Lightbox gallery ─────────────────────────────────────── */
const galleryItems = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));
const lightbox  = document.getElementById('lightbox');
const lbImage   = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[currentIndex];
  const img  = item.querySelector('img');
  lbImage.src = img.src;
  lbImage.alt = img.alt;
  lbCaption.textContent = item.dataset.caption || img.alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showRelative(delta) {
  currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showRelative(-1));
lbNext.addEventListener('click', () => showRelative(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showRelative(-1);
  if (e.key === 'ArrowRight') showRelative(1);
});

/* ── Memory jar ───────────────────────────────────────────── */
const memories = [
  'October 19, 2020 — it all began with a simple "H" on Instagram.',
  '"Kavala padadhinga, Naan iruken" — a line that turned out to be a hint all along.',
  'A week of overthinking ended with: "Yes, I too love you."',
  'Our first call lasted barely a minute, after months of chatting.',
  'A hushed 7:30 PM evening, an empty house, and our very first selfie together.',
  'A terrace, a sunset, shared noodles, and a memory that never faded.',
  'A Pongal car ride from Anjac College that turned into our favourite drive.',
  'A fifteen-minute bike ride with no destination that we still talk about.',
  'A surprise birthday plan that took eight whole months to pull off.',
  'An unreserved train compartment, just to ride with you until Erode.',
  'A quiet house tour, room by room, that made home feel a little more special.',
  'A random nignt, us in "Mysuru Express".. Longing to see each other in same compartment.',
  'A full day in Chennai — metro rides, temple blessings, and Marina Beach waves.',
  'October 19, 2020 — a single letter crossed a screen and quietly rewrote our future.',
  'omewhere between "Hi" and "I love you," we became home to each other.',
  'That one-minute call carried months of unsaid excitement.',
  'Two strangers typing messages, unaware they were creating memories.',
'A terrace sunset that stayed long after the sun had disappeared.',
'Noodles for dinner, laughter for dessert.',
'An empty house, a racing heartbeat, and a selfie that still feels alive.',
'Every room in the house became part of our story that evening.',
'A bike ride so short in distance, yet so long in memory.',
'The road had no destination; we had no complaints.',
'A car ride where the conversations were better than the scenery.',
'We started the journey as passengers and returned as memories.',
'A train compartment full of strangers and one familiar smile.',
'The Mysuru Express carried us forward while time seemed to stand still.',
'Marina waves came and went, but that day never did.',
'Temple bells echoed softly while my prayers stood beside me.',
'A birthday surprise measured in months of planning and seconds of happiness.',
'We mastered the art of turning ordinary days into favourite memories.',
'Every "Reached?" was another way of saying "I care."',
'Some photographs capture faces; this one captured a feeling.',
'A random evening became a permanent bookmark in my heart.',
'We never needed grand adventures; we were the adventure.',
'The best part of every journey was never the place—it was the company.',
'Some memories fade with time. Ours learned how to stay.',
'If happiness had a location, it would be the seat next to you.',
'We spent years creating the kind of memories people write novels about.',
'One conversation changed a day. One person changed a lifetime.',
'The stars witnessed many nights, but only we know those conversations.',
'Our story is proof that fate sometimes starts with a notification.',
];

const jarButton = document.getElementById('jarButton');
const jarResult = document.getElementById('jarResult');
let lastMemoryIndex = -1;

jarButton.addEventListener('click', () => {
  let idx;
  do { idx = Math.floor(Math.random() * memories.length); } while (idx === lastMemoryIndex && memories.length > 1);
  lastMemoryIndex = idx;

  jarResult.classList.remove('show');
  void jarResult.offsetWidth;
  jarResult.textContent = memories[idx];
  jarResult.classList.add('show');
});

/* ── Bucket list: tap to toggle + floating hearts ────────── */
const bucketCards = document.querySelectorAll('#bucketGrid .bucket-card');

function spawnHeart(x, y) {
  const heart = document.createElement('i');
  heart.className = 'bi bi-heart-fill floating-heart';
  heart.style.left = `${x}px`;
  heart.style.top  = `${y}px`;
  heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
  document.body.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

bucketCards.forEach(card => {
  card.addEventListener('click', (e) => {
    card.classList.toggle('done');
    if (card.classList.contains('done')) {
      const rect = card.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        spawnHeart(
          rect.left + rect.width  / 2 + (Math.random() - 0.5) * 30,
          rect.top  + window.scrollY + rect.height / 2
        );
      }
    }
  });
});

/* ── Playlist: play / pause actual audio ─────────────────── */
const trackPlayButtons = document.querySelectorAll('.track-play');

const TRACK_START_TIMES = {
  'audio-minnalvala':  58,
  'audio-oh-oh-uyire': 172,
};

function stopAllTracks(exceptBtn) {
  trackPlayButtons.forEach(btn => {
    if (btn === exceptBtn) return;
    const audio = document.getElementById(btn.dataset.audio);
    if (audio) {
      audio.pause();
      audio.currentTime = TRACK_START_TIMES[btn.dataset.audio] ?? 0;
    }
    btn.querySelector('i').className = 'bi bi-play-fill';
    btn.closest('[data-track-row]')?.classList.remove('playing');
  });
}

trackPlayButtons.forEach(btn => {
  const audio = document.getElementById(btn.dataset.audio);
  const row   = btn.closest('[data-track-row]');
  const icon  = btn.querySelector('i');
  if (!audio) return;

  const startTime = TRACK_START_TIMES[btn.dataset.audio] ?? 0;

  audio.addEventListener('loadedmetadata', () => {
    audio.currentTime = startTime;
  });

  btn.addEventListener('click', () => {
    if (audio.paused) {
      stopAllTracks(btn);
      if (audio.currentTime < startTime) {
        audio.currentTime = startTime;
      }
      audio.play().catch(() => {
        alert("Couldn't play this track. Add the matching mp3 file to assets/audio/ to enable playback.");
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play',  () => {
    icon.className = 'bi bi-pause-fill';
    row.classList.add('playing');
  });
  audio.addEventListener('pause', () => {
    icon.className = 'bi bi-play-fill';
    row.classList.remove('playing');
  });
  audio.addEventListener('ended', () => {
    icon.className = 'bi bi-play-fill';
    row.classList.remove('playing');
    audio.currentTime = startTime;
  });
});

/* ── Our Places map ───────────────────────────────────────── */
if (document.getElementById('placesMap') && window.L) {
  const map = L.map('placesMap', { scrollWheelZoom: false }).setView([11.7, 78.6], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const heartIcon = L.divIcon({
    className: 'map-pin',
    html: '<i class="bi bi-heart-fill"></i>',
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });

  const places = [
    { name: 'Anjac College, Sivakasi',    desc: 'Where our first car ride began',                                      lat: 9.4525,  lng: 77.7948 },
    { name: 'Marina Beach, Chennai',       desc: 'End of a long, full day together',                                   lat: 13.0500, lng: 80.2824 },
    { name: 'Vadapalani Temple, Chennai',  desc: 'Seeking blessings for the road ahead',                               lat: 13.0524, lng: 80.2122 },
    { name: 'Nexus Mall, Chennai',         desc: 'An afternoon of wandering and window shopping',                      lat: 13.0518, lng: 80.2079 },
    { name: 'Erode Junction',             desc: 'An unreserved compartment, just to ride a little further with you',  lat: 11.3410, lng: 77.7172 },
    { name: 'Theni',                       desc: 'Hills, mist and quiet mornings — still on the list',                lat: 10.0104, lng: 77.4768 },
    { name: 'Bengaluru',                   desc: 'Her college IV trip, and his unplanned detour',                      lat: 12.9716, lng: 77.5946 }
  ];

  const bounds = [];
  places.forEach(p => {
    L.marker([p.lat, p.lng], { icon: heartIcon })
      .addTo(map)
      .bindPopup(`<strong>${p.name}</strong><br>${p.desc}`);
    bounds.push([p.lat, p.lng]);
  });

  map.fitBounds(bounds, { padding: [30, 30] });
  map.on('click', () => map.scrollWheelZoom.enable());
}

/* ── "Open When..." envelopes ─────────────────────────────── */
const envelopes = Array.from(document.querySelectorAll('#openwhenGrid [data-envelope]'));

function closeEnvelope(env) {
  env.classList.remove('open');
  env.setAttribute('aria-expanded', 'false');
}

function openEnvelope(env) {
  envelopes.forEach(other => {
    if (other !== env) closeEnvelope(other);
  });
  const isOpen = env.classList.contains('open');
  if (isOpen) {
    closeEnvelope(env);
  } else {
    env.classList.add('open');
    env.setAttribute('aria-expanded', 'true');
  }
}

envelopes.forEach(env => {
  env.addEventListener('click', () => openEnvelope(env));
  env.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope(env);
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#openwhenGrid')) {
    envelopes.forEach(closeEnvelope);
  }
});

/* ══════════════════════════════════════════════════════════
   CONVERSATIONS WE NEVER FORGOT — replay engine
══════════════════════════════════════════════════════════ */
const conversations = [
  [
    { who: 'd', text: 'Saaptiya?' },
    { who: 'g', text: 'Ippo than.' },
    { who: 'd', text: 'Enna sapta?' },
    { who: 'g', text: 'Dosai.' },
    { who: 'd', text: 'Good girl.' },
  ],
  [
    { who: 'd', text: 'Reached ah?' },
    { who: 'g', text: 'Reached.' },
    { who: 'd', text: 'Pathukitu po.' },
    { who: 'g', text: 'Seri.' },
  ],
  [
    { who: 'g', text: 'Enna panra?' },
    { who: 'd', text: 'Unna nenachitu iruken.' },
    { who: 'g', text: 'Poi solladha.' },
    { who: 'd', text: 'Nijam.' },
  ],
  [
    { who: 'd', text: 'Call pannalama?' },
    { who: 'g', text: '5 mins.' },
    { who: 'd', text: 'Neenga sonna 5 mins na...' },
    { who: 'g', text: 'Theriyum.' },
  ],
  [
    { who: 'd', text: 'Miss pannuren.' },
    { who: 'g', text: 'Naanum.' },
    { who: 'd', text: 'Seekiram va.' },
    { who: 'g', text: 'Kandipa.' },
  ],
];

const convoCard       = document.getElementById('convoCard');
const convoThread     = document.getElementById('convoThread');
const convoReplayLabel = document.getElementById('convoReplayLabel');

if (convoCard && convoThread) {

  const CONVO_NAMES = { d: 'Dhanabal', g: 'Gayathri' };
  const TYPING_MS        = 900;   // typing indicator duration before a message lands
  const CHAR_MS          = 28;    // ms per character while "typing" a bubble
  const BETWEEN_MSG_MS   = 350;   // pause after a message finishes before next typing indicator
  const BETWEEN_CONVO_MS = 900;   // brief breath between one conversation ending and the next starting
  const MAX_ROWS_KEPT    = 40;    // trim older rows so the DOM doesn't grow forever

  let convoIndex = 0;
  let convoRunning = false;
  let convoTimeouts = [];
  let convoActive = false; // whether the section is in view and should be animating

  function convoClearTimers() {
    convoTimeouts.forEach(clearTimeout);
    convoTimeouts = [];
  }

  function convoWait(ms) {
    return new Promise(resolve => {
      const id = setTimeout(resolve, ms);
      convoTimeouts.push(id);
    });
  }

  function convoScrollToBottom() {
    convoCard.scrollTo({ top: convoCard.scrollHeight, behavior: 'smooth' });
  }

  function convoTrimOldRows() {
    while (convoThread.children.length > MAX_ROWS_KEPT) {
      convoThread.removeChild(convoThread.firstElementChild);
    }
  }

  function buildRow(who) {
    const row = document.createElement('div');
    row.className = `convo-row from-${who}`;

    const avatar = document.createElement('div');
    avatar.className = 'convo-avatar';
    avatar.textContent = who === 'd' ? 'D' : 'G';
    avatar.setAttribute('aria-hidden', 'true');

    const bubble = document.createElement('div');
    bubble.className = 'convo-bubble';

    row.appendChild(avatar);
    row.appendChild(bubble);
    return { row, bubble };
  }

  function buildTypingRow(who) {
    const wrapRow = document.createElement('div');
    wrapRow.className = `convo-row from-${who}`;

    const avatar = document.createElement('div');
    avatar.className = 'convo-avatar';
    avatar.textContent = who === 'd' ? 'D' : 'G';
    avatar.setAttribute('aria-hidden', 'true');

    const typing = document.createElement('div');
    typing.className = 'convo-typing';
    typing.setAttribute('aria-label', `${CONVO_NAMES[who]} is typing`);
    typing.innerHTML = '<span></span><span></span><span></span>';

    wrapRow.appendChild(avatar);
    wrapRow.appendChild(typing);
    return wrapRow;
  }

  function buildDivider(label) {
    const divider = document.createElement('div');
    divider.className = 'convo-divider';
    divider.textContent = label;
    return divider;
  }

  async function typeIntoBubble(bubble, text) {
    const cursor = document.createElement('span');
    cursor.className = 'convo-cursor';
    bubble.appendChild(document.createTextNode(''));
    bubble.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      if (!convoActive) return;
      bubble.insertBefore(document.createTextNode(text[i]), cursor);
      convoScrollToBottom();
      await convoWait(CHAR_MS);
    }
    cursor.remove();
  }

  async function playConversation(convo) {
    for (let i = 0; i < convo.length; i++) {
      if (!convoActive) return;
      const { who, text } = convo[i];

      // typing indicator
      const typingRow = buildTypingRow(who);
      convoThread.appendChild(typingRow);
      convoScrollToBottom();
      await convoWait(TYPING_MS);
      if (!convoActive) return;
      typingRow.remove();

      // actual message, typed character by character
      const { row, bubble } = buildRow(who);
      convoThread.appendChild(row);
      await typeIntoBubble(bubble, text);
      if (!convoActive) return;

      convoTrimOldRows();
      await convoWait(BETWEEN_MSG_MS);
    }
  }

  async function convoLoop() {
    if (convoRunning) return;
    convoRunning = true;

    while (convoActive) {
      const cycle = convoIndex % conversations.length;
      const convo = conversations[cycle];
      convoReplayLabel.textContent = `Replay #${String(cycle + 1).padStart(2, '0')}`;

      if (convoIndex > 0) {
        convoThread.appendChild(buildDivider(`Replay #${String(cycle + 1).padStart(2, '0')}`));
        convoScrollToBottom();
      }

      await playConversation(convo);
      if (!convoActive) break;

      await convoWait(BETWEEN_CONVO_MS);
      if (!convoActive) break;

      convoIndex++;
    }

    convoRunning = false;
  }

  function startConvo() {
    if (convoActive) return;
    convoActive = true;
    convoLoop();
  }

  function stopConvo() {
    convoActive = false;
    convoClearTimers();
  }

  const convoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startConvo();
      } else {
        stopConvo();
      }
    });
  }, { threshold: 0.3 });

  convoObserver.observe(convoCard);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show the first conversation fully formed, no animation loop.
    convoObserver.disconnect();
    const convo = conversations[0];
    convoThread.innerHTML = '';
    convo.forEach(({ who, text }) => {
      const { row, bubble } = buildRow(who);
      bubble.textContent = text;
      convoThread.appendChild(row);
    });
    convoReplayLabel.textContent = 'Replay #01';
  }
}

/* ══════════════════════════════════════════════════════════
   GUESTBOOK — Firebase Firestore (shared across all devices)
══════════════════════════════════════════════════════════ */
const guestbookForm = document.getElementById('guestbookForm');
const guestbookList = document.getElementById('guestbookList');

/* ── Custom confirm dialog ────────────────────────────────── */
const confirmOverlay   = document.getElementById('confirmOverlay');
const confirmCancel    = document.getElementById('confirmCancel');
const confirmDeleteBtn = document.getElementById('confirmDelete');
let pendingDeleteId = null;
let pendingDeleteEl = null;

function openConfirmDialog(id, entryEl) {
  pendingDeleteId = id;
  pendingDeleteEl = entryEl;
  confirmOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  confirmDeleteBtn.focus();
}

function closeConfirmDialog() {
  confirmOverlay.classList.remove('open');
  document.body.style.overflow = '';
  pendingDeleteId = null;
  pendingDeleteEl = null;
}

confirmCancel.addEventListener('click', closeConfirmDialog);
confirmOverlay.addEventListener('click', (e) => {
  if (e.target === confirmOverlay) closeConfirmDialog();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && confirmOverlay.classList.contains('open')) closeConfirmDialog();
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  pendingDeleteEl?.classList.add('removing');
  const idToDelete = pendingDeleteId;
  closeConfirmDialog();
  setTimeout(async () => {
    try {
      await deleteDoc(doc(db, 'guestbook', idToDelete));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, 180);
});

/* ── Render a single entry element ───────────────────────── */
function buildEntryEl(id, data) {
  const item = document.createElement('div');
  item.className  = 'guestbook-entry';
  item.dataset.id = id;
  // Safely escape HTML but allow emojis (they are plain unicode, not HTML)
  const safeName = data.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeMsg  = data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  item.innerHTML = `
    <button class="gb-delete" data-id="${id}" aria-label="Delete this note" title="Delete this note">
      <i class="bi bi-trash3"></i>
    </button>
    <div class="gb-msg">${safeMsg}</div>
    <div class="gb-name">— ${safeName}</div>`;
  return item;
}

/* ── Real-time listener — updates on EVERY device instantly ─ */
if (guestbookForm) {
  const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));

  onSnapshot(q, (snapshot) => {
    guestbookList.innerHTML = '';
    if (snapshot.empty) {
      guestbookList.innerHTML = '<p class="guestbook-empty">No notes yet — be the first to leave one.</p>';
      return;
    }
    snapshot.forEach(docSnap => {
      guestbookList.appendChild(buildEntryEl(docSnap.id, docSnap.data()));
    });
  }, (err) => {
    console.error('Firestore listener error:', err);
    guestbookList.innerHTML = '<p class="guestbook-empty">Couldn\'t load notes. Check your connection.</p>';
  });

  /* ── Submit new note ──────────────────────────────────── */
  guestbookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('gbName').value.trim();
    const message = document.getElementById('gbMessage').value.trim();
    if (!name || !message) return;

    const submitBtn = guestbookForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving…';

    try {
      await addDoc(collection(db, 'guestbook'), {
        name,
        message,
        createdAt: serverTimestamp()
      });
      guestbookForm.reset();
    } catch (err) {
      console.error('Could not save note:', err);
      alert('Something went wrong — note not saved. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Leave a note';
    }
  });

  /* ── Delete via confirm dialog ────────────────────────── */
  guestbookList.addEventListener('click', (e) => {
    const btn = e.target.closest('.gb-delete');
    if (!btn) return;
    const entryEl = btn.closest('.guestbook-entry');
    openConfirmDialog(btn.dataset.id, entryEl);
  });
}