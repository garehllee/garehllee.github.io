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
