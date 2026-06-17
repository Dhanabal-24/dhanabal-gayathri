/* ============================================================
   Dhanabal & Gayathri — Personal Portal
   script.js
   ============================================================ */

/* ── Key dates ───────────────────────────────────────────── */
const RELATIONSHIP_START = new Date('2020-10-19T00:00:00');
const ANNIVERSARY_MONTH_DAY = { month: 9, day: 19 }; // month is 0-indexed (9 = October)

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
  'A full day in Chennai — metro rides, temple blessings, and Marina Beach waves.'
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

// Start times in seconds for each track (by audio element id)
const TRACK_START_TIMES = {
  'audio-minnalvala':  58,   // 0:56
  'audio-oh-oh-uyire': 172,  // 2:52
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

  // Jump to the defined start time as soon as the browser knows the duration
  audio.addEventListener('loadedmetadata', () => {
    audio.currentTime = startTime;
  });

  btn.addEventListener('click', () => {
    if (audio.paused) {
      stopAllTracks(btn);
      // Ensure correct start time is set before playing
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
    audio.currentTime = startTime; // reset to start time, not 0:00
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

/* ── Guestbook (saved locally on this device) ────────────── */
const GUESTBOOK_KEY  = 'dg-guestbook-entries';
const guestbookForm  = document.getElementById('guestbookForm');
const guestbookList  = document.getElementById('guestbookList');

function loadGuestbookEntries() {
  try {
    const raw = localStorage.getItem(GUESTBOOK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestbookEntries(entries) {
  try {
    localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable — entries simply won't persist */
  }
}

function renderGuestbook() {
  const entries = loadGuestbookEntries();
  guestbookList.innerHTML = '';
  if (entries.length === 0) {
    guestbookList.innerHTML = '<p class="guestbook-empty">No notes yet — be the first to leave one.</p>';
    return;
  }
  entries.slice().reverse().forEach(entry => {
    const item = document.createElement('div');
    item.className  = 'guestbook-entry';
    item.dataset.ts = entry.ts;
    const safeName = entry.name.replace(/</g, '&lt;');
    const safeMsg  = entry.message.replace(/</g, '&lt;');
    item.innerHTML = `
      <button class="gb-delete" data-ts="${entry.ts}" aria-label="Delete this note" title="Delete this note">
        <i class="bi bi-trash3"></i>
      </button>
      <div class="gb-msg">${safeMsg}</div>
      <div class="gb-name">— ${safeName}</div>`;
    guestbookList.appendChild(item);
  });
}

function deleteGuestbookEntry(ts) {
  const entries = loadGuestbookEntries().filter(entry => String(entry.ts) !== String(ts));
  saveGuestbookEntries(entries);
  renderGuestbook();
}

/* ── Custom confirm dialog ────────────────────────────────── */
const confirmOverlay   = document.getElementById('confirmOverlay');
const confirmCancel    = document.getElementById('confirmCancel');
const confirmDeleteBtn = document.getElementById('confirmDelete');
let pendingDeleteEl = null;
let pendingDeleteTs = null;

function openConfirmDialog(ts, entryEl) {
  pendingDeleteTs = ts;
  pendingDeleteEl = entryEl;
  confirmOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  confirmDeleteBtn.focus();
}

function closeConfirmDialog() {
  confirmOverlay.classList.remove('open');
  document.body.style.overflow = '';
  pendingDeleteTs = null;
  pendingDeleteEl = null;
}

confirmCancel.addEventListener('click', closeConfirmDialog);
confirmOverlay.addEventListener('click', (e) => {
  if (e.target === confirmOverlay) closeConfirmDialog();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && confirmOverlay.classList.contains('open')) closeConfirmDialog();
});

confirmDeleteBtn.addEventListener('click', () => {
  if (pendingDeleteTs === null) return;
  pendingDeleteEl?.classList.add('removing');
  const ts = pendingDeleteTs;
  closeConfirmDialog();
  setTimeout(() => deleteGuestbookEntry(ts), 180);
});

if (guestbookForm) {
  renderGuestbook();
  guestbookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('gbName').value.trim();
    const message = document.getElementById('gbMessage').value.trim();
    if (!name || !message) return;

    const entries = loadGuestbookEntries();
    entries.push({ name, message, ts: Date.now() });
    saveGuestbookEntries(entries);
    renderGuestbook();
    guestbookForm.reset();
  });

  guestbookList.addEventListener('click', (e) => {
    const btn = e.target.closest('.gb-delete');
    if (!btn) return;
    const entryEl = btn.closest('.guestbook-entry');
    openConfirmDialog(btn.dataset.ts, entryEl);
  });
}