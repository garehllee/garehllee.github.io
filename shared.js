// Custom Coded by Garrett Lee, Style Adjustments By Claude (Garrett coded this before he knew what styling code meant)
/* =============================================================
   shared.js — consolidated JavaScript for all pages
   Replaces: cursor.js, jv.js, jv2.js, jvLG.js, jvmomath.js
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────────────────────────────── */
(function () {
  const cursor = document.getElementById('cursor-site-wide');
  if (!cursor) return;

  let mouseX = parseFloat(sessionStorage.getItem('cursorX')) || 0;
  let mouseY = parseFloat(sessionStorage.getItem('cursorY')) || 0;
  let hasMouseMoved = sessionStorage.getItem('hasMouseMoved') === 'true';
  let isHoveringLink = false;

  function isSmallScreen() { return window.innerWidth < 539; }

  function showCursor() {
    if (!isSmallScreen() && !isHoveringLink) {
      cursor.style.display = 'block';
      document.body.style.cursor = 'none';
    }
  }

  function hideCursor() {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  function updatePosition() {
    const w = cursor.clientWidth;
    const h = cursor.clientHeight;
    cursor.style.transform = `translate(${mouseX - w / 3}px, ${mouseY - h / 1.4}px)`;
  }

  document.addEventListener('mouseenter', () => {
    if (!hasMouseMoved) return;
    isSmallScreen() ? hideCursor() : (showCursor(), updatePosition());
  });

  document.addEventListener('mouseleave', () => { cursor.style.display = 'none'; });

  document.addEventListener('mousemove', (e) => {
    hasMouseMoved = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    sessionStorage.setItem('cursorX', mouseX);
    sessionStorage.setItem('cursorY', mouseY);
    sessionStorage.setItem('hasMouseMoved', 'true');
    isSmallScreen() ? hideCursor() : (showCursor(), updatePosition());
  });

  window.addEventListener('resize', () => {
    isSmallScreen() ? hideCursor() : hasMouseMoved && !isHoveringLink && showCursor();
  });

  function setupHoverListeners() {
    const els = document.querySelectorAll('.linkhover, .miscimages, .button, nav img, .next, .prev, video, iframe');
    els.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHoveringLink = true;
        cursor.style.display = 'none';
        if (!isSmallScreen()) document.body.style.cursor = 'auto';
      });
      el.addEventListener('mouseleave', () => {
        isHoveringLink = false;
        isSmallScreen() ? hideCursor() : showCursor();
      });
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (hasMouseMoved) {
      isSmallScreen() ? hideCursor() : (showCursor(), updatePosition());
    }
    setupHoverListeners();
    initLightbox();
  });
})();


/* ─────────────────────────────────────────────────────────────
   LIGHTBOX — clickable images / videos in .photosflex / .photosflex2
   ───────────────────────────────────────────────────────────── */
function initLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'media-overlay';
  Object.assign(overlay.style, {
    display: 'none', position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: '9999', cursor: 'pointer', justifyContent: 'center', alignItems: 'center'
  });

  const lbImg = document.createElement('img');
  Object.assign(lbImg.style, { maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', cursor: 'default', display: 'none' });

  const lbVid = document.createElement('video');
  lbVid.setAttribute('autoplay', '');
  lbVid.setAttribute('loop', '');
  Object.assign(lbVid.style, { maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', cursor: 'default', display: 'none' });

  overlay.append(lbImg, lbVid);
  document.body.appendChild(overlay);

  function closeOverlay() {
    overlay.style.display = 'none';
    lbVid.pause();
    lbVid.src = '';
  }

  document.querySelectorAll('.photosflex, .photosflex2').forEach(container => {
    container.querySelectorAll('img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        lbImg.src = img.src;
        lbImg.style.display = 'block';
        lbVid.style.display = 'none';
        lbVid.pause(); lbVid.src = '';
        overlay.style.display = 'flex';
      });
    });
    container.querySelectorAll('video').forEach(vid => {
      vid.style.cursor = 'pointer';
      vid.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = vid.querySelector('source');
        lbVid.src = src ? src.src : vid.src;
        lbVid.style.display = 'block';
        lbImg.style.display = 'none';
        overlay.style.display = 'flex';
      });
    });
  });

  overlay.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeOverlay();
  });
}


/* ─────────────────────────────────────────────────────────────
   NAVIGATION — logo gif swap, mobile menu, back-to-top
   These are called via inline onpointerenter/leave / onclick in HTML.
   ───────────────────────────────────────────────────────────── */
function gbnav1() {
  document.getElementById('animation').style.display = 'block';
  document.getElementById('bear').style.display = 'none';
}
function gbnav2() {
  document.getElementById('animation').style.display = 'none';
  document.getElementById('bear').style.display = 'block';
}

function showMenu() {
  document.getElementById('navLinks').style.right = '0';
  document.getElementById('wholepage').classList.add('fixed-position');
}
function hideMenu() {
  document.getElementById('navLinks').style.right = '-100vw';
  document.getElementById('wholepage').classList.remove('fixed-position');
}

function totop() {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
}


/* ─────────────────────────────────────────────────────────────
   HOVER SWAP — generic still/moving image pair
   Usage: <div onpointerenter="hoverSwap('ID')" onpointerleave="hoverSwapOut('ID')">
     <img id="still-ID" ...>  <img id="moving-ID" ...>
   ───────────────────────────────────────────────────────────── */
function hoverSwap(id) {
  document.getElementById('moving-' + id).style.display = 'block';
  document.getElementById('still-' + id).style.display = 'none';
}
function hoverSwapOut(id) {
  document.getElementById('moving-' + id).style.display = 'none';
  document.getElementById('still-' + id).style.display = 'block';
}


/* ─────────────────────────────────────────────────────────────
   SCROLL-BASED DARK MODE
   Each page that wants dark mode sets data attributes on <body>:
     data-dark-start="0.05"   (scroll ratio to go dark)
     data-dark-end="0.9"      (scroll ratio to return to light; omit for one-way)
   ───────────────────────────────────────────────────────────── */
(function () {
  function getScrollRatio() {
    return window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
  }

  function checkScroll() {
    const body = document.body;
    const start = parseFloat(body.dataset.darkStart);
    if (isNaN(start)) return; // page opted out

    const end   = parseFloat(body.dataset.darkEnd);
    const ratio = getScrollRatio();
    const page  = document.getElementById('wholepage');
    const isDark = getComputedStyle(body).getPropertyValue('--reg').trim() === '#141414';
    const isLight = !isDark;

    const shouldBeDark = ratio > start && (isNaN(end) || ratio < end);

    if (shouldBeDark && isDark) {
      page.classList.remove('wholepagelight');
      page.classList.add('wholepagedark');
    } else if (!shouldBeDark && isLight) {
      page.classList.remove('wholepagedark');
      page.classList.add('wholepagelight');
    }
  }

  window.addEventListener('scroll', checkScroll);
})();


/* ─────────────────────────────────────────────────────────────
   DRAGGABLE ELEMENTS (index3 misc section)
   Usage: dragElement(document.getElementById('image1'))
   Only initialised on desktop (> 840px) by the HTML.
   ───────────────────────────────────────────────────────────── */
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const handle = document.getElementById(elmnt.id + 'header') || elmnt;
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = stopDrag;
    document.onmousemove = onDrag;
  }

  function onDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top  = (elmnt.offsetTop  - pos2) + 'px';
    elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
  }

  function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


/* ─────────────────────────────────────────────────────────────
   GENERIC SLIDESHOW
   Each slideshow uses a unique suffix, e.g. "9" → class "mySlides9",
   index var slideIndex9, buttons call plusSlides('9', ±1).
   ───────────────────────────────────────────────────────────── */
const _slideIndexes = {};

function initSlideshow(suffix, startIndex) {
  _slideIndexes[suffix] = startIndex || 1;
  _showSlides(suffix, _slideIndexes[suffix]);
}

function plusSlides(suffix, n) {
  _showSlides(suffix, _slideIndexes[suffix] += n);
}

function currentSlide(suffix, n) {
  _showSlides(suffix, _slideIndexes[suffix] = n);
}

function _showSlides(suffix, n) {
  const slides = document.getElementsByClassName('mySlides' + suffix);
  if (!slides.length) return;
  if (n > slides.length) _slideIndexes[suffix] = 1;
  if (n < 1) _slideIndexes[suffix] = slides.length;
  for (let i = 0; i < slides.length; i++) slides[i].style.display = 'none';
  slides[_slideIndexes[suffix] - 1].style.display = 'block';
}


/* ─────────────────────────────────────────────────────────────
   ELYSIUM — section scroll-to anchors
   Called from inline onclick in elysium.html
   ───────────────────────────────────────────────────────────── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' });
}

/* ─────────────────────────────────────────────────────────────
   AUTO-SCROLL — slowly scrolls .portfolio-image-flex on hover
   ───────────────────────────────────────────────────────────── */
(function () {
  const SPEED = 1; // pixels per frame

  function initAutoScroll() {
    document.querySelectorAll('.portfolio-image-flex').forEach((strip) => {
      let rafId = null;
      let direction = 1;

      function step() {
        const maxScroll = strip.scrollWidth - strip.clientWidth;

        if (maxScroll <= 0) return; // nothing to scroll

        if (strip.scrollLeft >= maxScroll) direction = -1;
        if (strip.scrollLeft <= 0) direction = 1;

        strip.scrollLeft += SPEED * direction;
        rafId = requestAnimationFrame(step);
      }

      strip.addEventListener('mouseenter', () => {
        if (!rafId) rafId = requestAnimationFrame(step);
      });

      strip.addEventListener('mouseleave', () => {
        cancelAnimationFrame(rafId);
        rafId = null;
      });
    });
  }

  window.addEventListener('DOMContentLoaded', initAutoScroll);
})();


/* ==========================================================
coded by claude, inspired by https://codepen.io/Andrea-Catanzaro/pen/bNgyqbp
Home hover: groups of letters within a target phrase swap to
images on hover. Only the configured phrases react; everything
else in the h2 is left completely alone. A phrase may itself be
split across a <br> (e.g. "...motion <br>designer...") and still
works as a single hoverable unit.
   Paste this at the bottom of shared.js.
   Targets: <h2 class="home-hover">
   ========================================================== */
(function () {
  // ---- SETTINGS ------------------------------------------
  const IMAGE_SIZE_PX = 100;         // <-- width of each image (square)
  const OVERLAP_PX    = 40;          // how much neighboring images may overlap (0 = none)
  const RIPPLE_MS_PER_100PX = 75;    // ripple speed away from the cursor (lower = faster)
  const PUSH_DOWN     = 0.5;         // how much images push following lines down:
                                     // 0 = not at all (images overlap the lines below),
                                     // 1 = lines below move down to fully make room
  const PLACEHOLDER_COLOR = "#d9d9d9"; // gray box shown if an image hasn't loaded yet
  const MIN_GROUP     = 4;           // fewest letters replaced by one image
  const MAX_GROUP     = 6;           // most letters replaced by one image
  const HOLD_MS       = 800;         // how long a group shows its image
  const SNAP_MS       = 100;         // speed of the pop-in / line-widening
  // One entry per target phrase, found anywhere in the h2's text (can span a <br>).
  // Everything in the h2 that isn't one of these phrases is left as plain text.
  // Files are loaded as `${folder}/${prefix}-${LETTER}.png`
  const PHRASES = [
    { folder: "images/about/homehover/gd", prefix: "gd", lastLetter: "R", match: "brand & motion designer" },
    { folder: "images/about/homehover/f",  prefix: "f",  lastLetter: "I", match: "good friends" },
    { folder: "images/about/homehover/c",  prefix: "c",  lastLetter: "I", match: "chocolate chip cookie" }
  ];
  // --------------------------------------------------------

  function init() {
    const h2 = document.querySelector("h2.home-hover");
    if (!h2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Minimal CSS (does not touch the h2's type styling)
    const style = document.createElement("style");
    style.textContent = `
      .hh-phrase { cursor: pointer; }
      .hh-group {
        position: relative; display: inline-block; text-align: center;
        vertical-align: baseline; white-space: pre;
        transition: width ${SNAP_MS}ms ease-out, height ${SNAP_MS}ms ease-out;
      }
      .hh-group.is-img { color: transparent; }
      .hh-img {
        position: absolute; left: 50%; top: 50%;
        width: var(--hh-img-size, 30px); height: auto; aspect-ratio: 1 / 1; max-width: none; margin: 0;
        transform: translate(-50%, -50%) scale(0.85);
        opacity: 0; pointer-events: none;
        transition: opacity ${SNAP_MS}ms ease-out, transform ${SNAP_MS}ms ease-out;
      }
      .hh-img.is-loading { background-color: var(--hh-ph, #d9d9d9); }
      .hh-group.is-img .hh-img { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    `;
    document.head.appendChild(style);
    h2.style.setProperty("--hh-img-size", IMAGE_SIZE_PX + "px");
    h2.style.setProperty("--hh-ph", PLACEHOLDER_COLOR);

    // Build image pools + preload (remember which URLs have finished loading)
    const loadedUrls = new Set();
    const pools = PHRASES.map(({ folder, prefix, lastLetter }) => {
      const urls = [];
      for (let c = 65; c <= lastLetter.charCodeAt(0); c++) {
        urls.push(`${folder}/${prefix}-${String.fromCharCode(c)}.png`);
      }
      urls.forEach((u) => {
        const im = new Image();
        im.onload = () => loadedUrls.add(u);
        im.src = u;
      });
      return urls;
    });

    // Split a word into groups of MIN_GROUP–MAX_GROUP letters, spread evenly.
    // Words shorter than MIN_GROUP stay as one group.
    function chunk(word) {
      const n = word.length;
      if (n <= MAX_GROUP) return [word];
      let k = Math.ceil(n / MAX_GROUP);                        // fewest groups that fit MAX
      k = Math.max(1, Math.min(k, Math.floor(n / MIN_GROUP))); // but keep each >= MIN
      const base = Math.floor(n / k), extra = n % k;
      const out = []; let i = 0;
      for (let j = 0; j < k; j++) {
        const size = base + (j < extra ? 1 : 0);
        out.push(word.slice(i, i + size)); i += size;
      }
      return out;
    }

    const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

    // ---- Flatten the h2 into a single token stream ----------
    // Each token is { type: 'word'|'space'|'br', text? }.
    // This lets a target phrase span across a <br> element.
    const originalNodes = Array.from(h2.childNodes);
    const tokens = [];
    originalNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((piece) => {
          if (!piece) return;
          tokens.push({ type: /^\s+$/.test(piece) ? "space" : "word", text: piece });
        });
      } else if (node.nodeName === "BR") {
        tokens.push({ type: "br" });
      }
      // other element types are not expected inside this h2; ignored if present
    });

    // Find the contiguous token range (inclusive, start/end indices into
    // `tokens`) whose word-tokens match matchWords in order. Non-word
    // tokens (spaces, <br>) inside that span are irrelevant to matching
    // but ARE included in the returned range.
    function findPhraseRange(matchWords, usedRanges) {
      const wordPositions = [];
      tokens.forEach((t, i) => { if (t.type === "word") wordPositions.push(i); });
      const overlaps = (s, e) => usedRanges.some(([us, ue]) => s <= ue && e >= us);

      for (let start = 0; start <= wordPositions.length - matchWords.length; start++) {
        let ok = true;
        for (let j = 0; j < matchWords.length; j++) {
          if (norm(tokens[wordPositions[start + j]].text) !== norm(matchWords[j])) { ok = false; break; }
        }
        if (ok) {
          const range = [wordPositions[start], wordPositions[start + matchWords.length - 1]];
          if (!overlaps(range[0], range[1])) return range;
        }
      }
      return null;
    }

    // Figure out which phrase (if any) owns each token.
    const phraseForToken = new Array(tokens.length).fill(null);
    const usedRanges = [];
    const phraseRanges = PHRASES.map((p) => {
      const words = p.match.split(/\s+/);
      const range = findPhraseRange(words, usedRanges);
      if (range) {
        usedRanges.push(range);
        for (let i = range[0]; i <= range[1]; i++) phraseForToken[i] = PHRASES.indexOf(p);
      }
      return range;
    });

    // ---- Rebuild the h2 content from the token stream --------
    h2.setAttribute("aria-label", h2.textContent.replace(/\s+/g, " ").trim());
    h2.textContent = "";
    const content = document.createElement("span");
    content.setAttribute("aria-hidden", "true");

    const phraseData = PHRASES.map(() => ({ el: null, groups: [] }));
    let openPhraseIdx = null;

    function closeOpenPhrase() {
      if (openPhraseIdx !== null) {
        content.appendChild(phraseData[openPhraseIdx].el);
        openPhraseIdx = null;
      }
    }

    tokens.forEach((tok, i) => {
      const phraseIdx = phraseForToken[i];

      if (phraseIdx !== openPhraseIdx) {
        closeOpenPhrase();
        if (phraseIdx !== null) {
          const el = document.createElement("span");
          el.className = "hh-phrase";
          phraseData[phraseIdx].el = el;
          openPhraseIdx = phraseIdx;
        }
      }

      const target = openPhraseIdx !== null ? phraseData[openPhraseIdx].el : content;

      if (tok.type === "br") {
        target.appendChild(document.createElement("br"));
      } else if (tok.type === "space") {
        target.appendChild(document.createTextNode(tok.text));
      } else if (phraseIdx !== null) {
        chunk(tok.text).forEach((piece) => {
          const g = document.createElement("span");
          g.className = "hh-group";
          g.textContent = piece;
          const img = document.createElement("img");
          img.className = "hh-img";
          img.alt = "";
          img.addEventListener("load", () => {
            loadedUrls.add(img.dataset.url);
            img.classList.remove("is-loading");
          });
          g.appendChild(img);
          target.appendChild(g);
          phraseData[phraseIdx].groups.push(g);
        });
      } else {
        target.appendChild(document.createTextNode(tok.text));
      }
    });
    closeOpenPhrase();

    h2.appendChild(content);

    // Pick just enough images to cover the groups (no repeats until pool runs out)
    function pickImages(pool, count) {
      const picks = [];
      let bag = [];
      while (picks.length < count) {
        if (!bag.length) {
          bag = pool.slice().sort(() => Math.random() - 0.5);
          if (bag[bag.length - 1] === picks[picks.length - 1] && bag.length > 1) bag.reverse();
        }
        picks.push(bag.pop());
      }
      return picks;
    }

    PHRASES.forEach((config, idx) => {
      const range = phraseRanges[idx];
      const data = phraseData[idx];
      const pool = pools[idx];
      if (!range || !data.el || !pool || !data.groups.length) return;

      const state = { busy: false };
      data.el.addEventListener("mouseenter", (e) => {
        if (state.busy) return;
        state.busy = true;

        const groups = data.groups;
        const total = groups.length;
        const imgs = pickImages(pool, total);
        let finished = 0;

        // Measure natural widths + centers (page coordinates, so this works
        // correctly even if the phrase's groups sit on two different lines).
        const rects = groups.map((g) => g.getBoundingClientRect());
        const natural = rects.map((r) => r.width);
        const naturalH = rects.map((r) => r.height);
        const push = Math.min(1, Math.max(0, PUSH_DOWN));
        const centers = rects.map((r) => r.left + r.width / 2);
        const minBox = Math.max(0, IMAGE_SIZE_PX - Math.max(0, OVERLAP_PX));
        groups.forEach((g, i) => {
          g.style.width = natural[i] + "px";
          g.style.height = naturalH[i] + "px";
        });

        groups.forEach((g, i) => {
          // ripple outward from where the cursor entered
          const delay = (Math.abs(centers[i] - e.clientX) / 100) * RIPPLE_MS_PER_100PX;
          const img = g.querySelector(".hh-img");
          const url = imgs[i];
          img.dataset.url = url;
          if (loadedUrls.has(url)) {
            img.classList.remove("is-loading");
            img.src = url;
          } else {
            // not loaded yet: show a gray box, swap in the image when it arrives
            img.classList.add("is-loading");
            img.removeAttribute("src"); // drop the previous image so it can't linger
            img.src = url;
          }
          // extra height so following lines get pushed down (0 to 1 of the image overhang)
          const extra = Math.max(0, IMAGE_SIZE_PX - naturalH[i]) * push;
          setTimeout(() => {
            g.style.width = Math.max(natural[i], minBox) + "px";
            g.style.height = (naturalH[i] + extra) + "px";
            g.classList.add("is-img");
          }, delay);
          setTimeout(() => {
            g.style.width = natural[i] + "px";
            g.style.height = naturalH[i] + "px";
            g.classList.remove("is-img");
            if (++finished === total) {
              // release the locked widths once the last group has shrunk back
              setTimeout(() => {
                groups.forEach((gr) => { gr.style.width = ""; gr.style.height = ""; });
                state.busy = false;
              }, SNAP_MS);
            }
          }, delay + HOLD_MS);
        });
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
