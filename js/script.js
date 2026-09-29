const CONFIG = {
  password: '21926',

  music: 'assets/mylove.mp3',

  photos: [
    { src: 'assets/foto-1.jpg', cap: 'Otw sekolah.' },
    { src: 'assets/foto-2.jpg', cap: 'Kamu bersama bunga.' },
    { src: 'assets/foto-3.jpg', cap: 'Kamu di moseum.' },
    { src: 'assets/foto-4.jpg', cap: 'Kamu lagi cemberut.' },
    { src: 'assets/foto-5.jpg', cap: 'Kamu bersama bokena' },
  ],

  notes: [
    { t: 'Hal pertama',   p: 'Aku masih ingat pertama kali kita bicara — dunia seperti melambat sedikit, dan aku tahu seseorang yang penting baru saja masuk.', from: 'dari aku' },
    { t: 'Tentang tawa',  p: 'Tawamu adalah suara favoritku. Kalau hari terasa berat, mengingat itu saja sudah cukup untuk menegakkan semuanya.', from: 'dari aku' },
    { t: 'Jarak & waktu', p: 'Di mana pun, kapan pun — kamu selalu jadi alasan kenapa aku ingin pulang lebih cepat.', from: 'dari aku' },
    { t: 'Janji kecil',   p: 'Aku janji akan tetap memilihmu, di hari yang mudah maupun yang sulit, pelan-pelan tapi terus-menerus.', from: 'dari aku' },
    { t: 'Terima kasih',  p: 'Terima kasih sudah jadi rumah. Buku ini sengaja kubuat supaya kalau kamu lupa betapa berharganya kamu, kamu bisa membacanya lagi.', from: 'dari aku' },
  ],

  signer: 'Aku, yang selalu memilihmu',
};

/* ═══════════════ UTIL ═══════════════ */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ═══════════════ 1 · HATI BETERBANGAN ═══════════════ */
const cvs = $('#heartsCanvas'), ctx = cvs.getContext('2d');
let W = 0, H = 0, parts = [];
const HEART_COLORS = [[223, 176, 116], [231, 208, 160], [221, 143, 159], [205, 155, 150]];

function sizeCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cvs.width = W * dpr; cvs.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeHeart(fromBottom = true) {
  const col = HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0];
  return {
    baseX: Math.random() * W,
    y: fromBottom ? H + 24 : Math.random() * H,
    size: 6 + Math.random() * 12,
    vy: .28 + Math.random() * .62,
    dx: (Math.random() - .5) * .16,
    amp: 10 + Math.random() * 26,
    t: Math.random() * Math.PI * 2,
    tSpeed: .008 + Math.random() * .014,
    a: .18 + Math.random() * .4,
    rot: (Math.random() - .5) * .5,
    vr: (Math.random() - .5) * .004,
    col, burst: false, life: 1,
  };
}

function heartTarget() {
  return REDUCED ? 8 : Math.max(12, Math.min(42, Math.round(W * H / 26000)));
}

function initHearts() {
  sizeCanvas();
  parts = Array.from({ length: heartTarget() }, () => makeHeart(false));
}

function drawHeart(h) {
  const alpha = h.burst ? h.a * h.life : h.a;
  const r = h.size * .55;
  ctx.save();
  ctx.translate(h.baseX + Math.sin(h.t) * h.amp, h.y);
  ctx.rotate(h.rot);
  ctx.globalAlpha = Math.max(alpha, 0);
  ctx.fillStyle = `rgb(${h.col[0]},${h.col[1]},${h.col[2]})`;
  ctx.beginPath();
  ctx.moveTo(0, r * .38);
  ctx.bezierCurveTo(-r, -r * .55, -r * .55, -r * 1.32, 0, -r * .45);
  ctx.bezierCurveTo(r * .55, -r * 1.32, r, -r * .55, 0, r * .38);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tickHearts() {
  ctx.clearRect(0, 0, W, H);
  for (const h of parts) {
    h.t += h.tSpeed; h.rot += h.vr;
    if (h.burst) {
      h.life -= .011;
      h.y -= h.vy * 1.6;
    } else {
      h.y -= h.vy;
      h.baseX += h.dx;
    }
    drawHeart(h);
  }
  parts = parts.filter(h => h.life > 0 && h.y > -40);
  const ambient = parts.filter(p => !p.burst).length;
  const target = heartTarget();
  if (ambient < target) parts.push(makeHeart(true));   // isi ulang yang sampai puncak
  requestAnimationFrame(tickHearts);
}

function burstHearts() {
  if (REDUCED) return;
  const cx = W / 2, cy = H * .42;
  for (let i = 0; i < 26; i++) {
    const h = makeHeart(false);
    const ang = Math.random() * Math.PI * 2, dist = 20 + Math.random() * 90;
    h.baseX = cx + Math.cos(ang) * dist;
    h.y = cy + Math.sin(ang) * dist;
    h.size = 9 + Math.random() * 15;
    h.vy = .9 + Math.random() * 1.4;
    h.a = .5 + Math.random() * .45;
    h.burst = true;
    parts.push(h);
  }
}

addEventListener('resize', sizeCanvas);

/* ═══════════════ 2 · SANDI 21926 ═══════════════ */
const state = { digits: [], checking: false, wrongIdx: 0, timer: null };
const WRONG_MSGS = [
  'Hmm, bukan itu. Coba ingat-ingat lagi ya.',
  'Masih salah. Petunjuknya: lima angka yang hanya kita berdua tahu.',
  'Belum tepat. Tenang, coba pelan-pelan lagi.',
];

function buildSlots() {
  const slots = $('#slots');
  slots.innerHTML = '';
  for (let i = 0; i < CONFIG.password.length; i++) {
    const s = document.createElement('span');
    s.className = 'slot';
    slots.appendChild(s);
  }
}

function buildKeypad() {
  const pad = $('#keypad');
  const keys = [
    ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
    ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
    ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
    ['del', ''], ['0', ''], ['heart', ''],
  ];
  keys.forEach(([k, sub]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'key';
    if (k === 'del') {
      b.setAttribute('aria-label', 'Hapus angka');
      b.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5h10a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H9l-6-7 6-7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
    } else if (k === 'heart') {
      b.setAttribute('aria-label', 'Periksa sandi');
      b.innerHTML = `<svg viewBox="0 0 24 24" width="19" height="19"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>`;
    } else {
      b.innerHTML = `<b>${k}</b><small>${sub || '&nbsp;'}</small>`;
    }
    b.addEventListener('click', () => onKey(k));
    pad.appendChild(b);
  });
}

function renderSlots() {
  const slots = $$('#slots .slot');
  slots.forEach((s, i) => {
    s.classList.toggle('filled', i < state.digits.length);
    s.textContent = i < state.digits.length ? state.digits[i] : '';
    s.classList.toggle('caret', i === state.digits.length);
  });
}

function onKey(k) {
  if (state.checking) return;
  const len = CONFIG.password.length;
  const msg = $('#passMsg');

  if (k === 'del') {
    clearTimeout(state.timer);
    state.digits.pop();
    msg.classList.remove('good');
    msg.textContent = 'Lima angka yang hanya kita berdua yang tahu.';
  } else if (k === 'heart') {
    if (state.digits.length < len) {
      shakePass();
      msg.classList.remove('good');
      msg.textContent = 'Lengkap dulu lima angkanya ya.';
    } else checkPass();
    return;
  } else if (state.digits.length < len) {
    state.digits.push(k);
    if (state.digits.length === len) {
      state.timer = setTimeout(checkPass, 320); // cek otomatis saat penuh
    }
  }
  renderSlots();
}

function checkPass() {
  if (state.checking) return;
  if (state.digits.join('') === CONFIG.password) return unlock();
  // salah
  state.checking = true;
  shakePass();
  const msg = $('#passMsg');
  msg.classList.remove('good');
  msg.textContent = WRONG_MSGS[state.wrongIdx++ % WRONG_MSGS.length];
  setTimeout(() => {
    state.digits = [];
    renderSlots();
    state.checking = false;
  }, 480);
}

function shakePass() {
  const card = $('#passCard');
  card.classList.remove('shake');
  void card.offsetWidth; // paksa reflow agar animasi bisa diulang
  card.classList.add('shake');
}

function unlock() {
  state.checking = true;
  $('#slots').classList.add('ok');
  const msg = $('#passMsg');
  msg.classList.add('good');
  msg.textContent = 'Ketemu. Membukakan pintunya…';

  // ♪ Musik langsung autoplay — dipicu dari sentuhan/tekan tombol,
  //   jadi diizinkan oleh kebijakan autoplay HP & browser.
  tryStartMusic();

  const doors = $('#doors');
  doors.classList.add('show');                        // pintu menutup layar
  setTimeout(() => doors.classList.add('open'), 620); // lalu membuka
  setTimeout(() => {
    showScreen('screen-main');
    burstHearts();
  }, 700);
  setTimeout(() => doors.classList.remove('show', 'open'), 2150);
}

/* ═══════════════ 3 · MUSIK (mylove.mp3) ═══════════════ */
const bgm = $('#bgm');
let fadeTimer = null;

bgm.addEventListener('error', () =>
  musicHint('File musik belum ada — taruh lagunya di assets/mylove.mp3'));

function musicHint(text) {
  const h = $('#musicHint');
  h.textContent = text;
  h.hidden = false;
}

function fadeVolume(target) {
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => {
    const d = target - bgm.volume;
    if (Math.abs(d) < .04) { bgm.volume = target; clearInterval(fadeTimer); return; }
    bgm.volume += Math.sign(d) * .04;
  }, 60);
}

function tryStartMusic() {
  bgm.volume = 0;
  const p = bgm.play();
  if (p) p.then(() => {
    $('#musicBtn').classList.add('playing');
    $('#musicLabel').textContent = 'Jeda melodi';
    fadeVolume(.75);                       // naik pelan-pelan, tidak mengagetkan
  }).catch(() =>
    musicHint('Sentuh tombol “Putar melodi” untuk menyalakan lagunya'));
}

 $('#musicBtn').addEventListener('click', () => {
  const btn = $('#musicBtn');
  if (bgm.paused) {
    tryStartMusic();
  } else {
    bgm.pause();
    btn.classList.remove('playing');
    $('#musicLabel').textContent = 'Putar melodi';
  }
});

/* ═══════════════ 4 · STRIP FOTO BERJALAN + LIGHTBOX ═══════════════ */
function photoFallback(img, i) {
  img.onerror = null;
  img.src = `https://picsum.photos/seed/princss-${i + 1}/800/1000.jpg`; // placeholder elegan
}

function buildStrip() {
  const track = $('#stripTrack');
  const set = document.createElement('div');
  set.className = 'strip-set';

  CONFIG.photos.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'ph';
    fig.dataset.index = i;
    const img = document.createElement('img');
    img.alt = p.cap;
    img.loading = 'lazy';
    img.onerror = () => photoFallback(img, i);
    img.src = p.src;
    const cap = document.createElement('figcaption');
    cap.textContent = p.cap;
    fig.append(img, cap);
    set.appendChild(fig);
  });

  track.appendChild(set);
  const clone = set.cloneNode(true);           // salinan untuk loop mulus tanpa jeda
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  // satu listener untuk semua foto (termasuk salinannya)
  track.addEventListener('click', e => {
    const fig = e.target.closest('.ph');
    if (fig) openLightbox(+fig.dataset.index);
  });
}

function openLightbox(i) {
  const p = CONFIG.photos[i];
  const img = $('#lbImg');
  img.onerror = () => photoFallback(img, i);
  img.src = p.src;
  $('#lbCap').textContent = p.cap;
  $('#lightbox').classList.add('open');
}

function closeLightbox() { $('#lightbox').classList.remove('open'); }

 $('#lbClose').addEventListener('click', closeLightbox);
 $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ═══════════════ 5 · BUKU CINTA (flip halaman 3D) ═══════════════ */
const book = { leaves: [], flipped: 0, animating: false };
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function makeLeaf() {
  const l = document.createElement('div');
  l.className = 'leaf';
  return l;
}
function makeFace(side, html, extra = '') {
  const f = document.createElement('div');
  f.className = 'face ' + side + (extra ? ' ' + extra : '');
  f.innerHTML = html;
  return f;
}
const HEART_SVG = `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>`;

function noteFace(note, idx, side) {
  return makeFace(side, `
    <span class="note-no">${ROMAN[idx] || idx + 1}</span>
    <h4>${note.t}</h4>
    <p class="note-p">${note.p}</p>
    <span class="note-from">— ${note.from || 'dariku'}</span>
    <span class="page-no">${idx + 1}</span>
  `);
}

function buildBook() {
  const el = $('#book');
  const notes = CONFIG.notes;

  // Sampul (ikut membalik) + halaman persembahan di baliknya
  const cover = makeLeaf();
  cover.append(
    makeFace('front', `
      <span class="cov-tag">Buku Cinta</span>
      <h3 class="cov-title">Princss</h3>
      ${HEART_SVG}
      <span class="cov-sub">ketuk panah kanan untuk membuka</span>
    `, 'cover-face'),
    makeFace('back', `<p class="dedic">Untuk seseorang yang istimewa —<br>balik terus, setiap halaman kutulis untukmu.</p>`, 'dedic')
  );
  book.leaves.push(cover);

  // Lembar isi: 2 catatan per lembar (depan + belakang)
  for (let i = 0; i < notes.length; i += 2) {
    const leaf = makeLeaf();
    leaf.append(noteFace(notes[i], i, 'front'));
    leaf.append(notes[i + 1]
      ? noteFace(notes[i + 1], i + 1, 'back')
      : makeFace('back', `<span class="blank-mark">${HEART_SVG}</span>`));
    book.leaves.push(leaf);
  }

  // Halaman "tamat" (statis, terlihat setelah semua halaman terbalik)
  const tail = document.createElement('div');
  tail.className = 'leaf';
  tail.style.zIndex = 0;
  tail.innerHTML = `<div class="face front tamat">
      ${HEART_SVG.replace('width="22" height="22"', 'width="26" height="26" class="tamat-heart"')}
      <span class="tamat-word">Tamat</span>
      <p class="tamat-sub">— ${CONFIG.signer}</p>
    </div>`;
  el.append(...book.leaves, tail);

  // z-index awal: sampul paling atas
  const TL = book.leaves.length;
  book.leaves.forEach((l, i) => l.style.zIndex = TL - i);

  // finalisasi z-index setelah animasi selesai
  book.leaves.forEach((l, i) => {
    l.addEventListener('transitionend', ev => {
      if (ev.propertyName !== 'transform') return;
      l.style.zIndex = l.classList.contains('flipped') ? i + 1 : TL - i;
      book.animating = false;
      updateBookNav();
    });
  });

  $('#bookNext').addEventListener('click', bookNext);
  $('#bookPrev').addEventListener('click', bookPrev);
  addEventListener('keydown', e => {
    if (!$('#screen-main').classList.contains('active')) return;
    if (e.key === 'ArrowRight') bookNext();
    if (e.key === 'ArrowLeft') bookPrev();
  });
  updateBookNav();
}

function updateBookNav() {
  const TL = book.leaves.length, f = book.flipped;
  $('#bookPrev').disabled = f === 0;
  $('#bookNext').disabled = f === TL;
  $('#bookInfo').textContent =
    f === 0 ? 'Sampul' :
    f === TL ? 'Tamat' :
    `Catatan ${f * 2 - 1}–${Math.min(f * 2, CONFIG.notes.length)}`;
}

function bookNext() {
  const TL = book.leaves.length;
  if (book.flipped >= TL || book.animating) return;
  const leaf = book.leaves[book.flipped];
  book.animating = true;
  leaf.style.zIndex = TL + 2;               // berada di atas selama berputar
  leaf.classList.add('flipped');
  book.flipped++;
  updateBookNav();
}

function bookPrev() {
  const TL = book.leaves.length;
  if (book.flipped <= 0 || book.animating) return;
  book.flipped--;
  const leaf = book.leaves[book.flipped];
  book.animating = true;
  leaf.style.zIndex = TL + 2;
  leaf.classList.remove('flipped');
  updateBookNav();
}

/* ═══════════════ 6 · JUDUL HERO — huruf naik berurutan ═══════════════ */
function initHeroTitle() {
  const el = $('#heroTitle');
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.setProperty('--i', i);
    el.appendChild(s);
  });
}

/* ═══════════════ MULAI ═══════════════ */
initHearts();
requestAnimationFrame(tickHearts);
buildSlots();
buildKeypad();
buildStrip();
buildBook();
initHeroTitle();