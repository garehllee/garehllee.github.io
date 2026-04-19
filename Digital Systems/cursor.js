const site_wide_cursor = document.getElementById('cursor-site-wide');

let mouseX = parseFloat(sessionStorage.getItem('cursorX')) || 0;
let mouseY = parseFloat(sessionStorage.getItem('cursorY')) || 0;
let hasMouseMoved = sessionStorage.getItem('hasMouseMoved') === 'true';
let isHoveringLink = false;

function isSmallScreen() {
    return window.innerWidth < 539;
}

function showCursor() {
    if (!isSmallScreen() && !isHoveringLink) {
        site_wide_cursor.style.display = 'block';
        document.body.style.cursor = 'none';
    }
}

function hideCustomCursor() {
    site_wide_cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
}

function updateCursorPosition() {
    site_wide_cursor.style.transform =
        `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
}

document.addEventListener('mouseenter', () => {
    if (hasMouseMoved) {
        isSmallScreen() ? hideCustomCursor() : showCursor();
        updateCursorPosition();
    }
});

document.addEventListener('mouseleave', () => {
    site_wide_cursor.style.display = 'none';
});

document.addEventListener('mousemove', TrackCursor);

window.addEventListener('DOMContentLoaded', () => {
    if (hasMouseMoved) {
        isSmallScreen() ? hideCustomCursor() : showCursor();
        updateCursorPosition();
    }
});

window.addEventListener('resize', () => {
    if (isSmallScreen()) {
        hideCustomCursor();
    } else if (hasMouseMoved && !isHoveringLink) {
        showCursor();
    }
});

function TrackCursor(evt) {
    hasMouseMoved = true;

    mouseX = evt.clientX;
    mouseY = evt.clientY;

    sessionStorage.setItem('cursorX', mouseX);
    sessionStorage.setItem('cursorY', mouseY);
    sessionStorage.setItem('hasMouseMoved', 'true');

    if (isSmallScreen()) {
        hideCustomCursor();
    } else {
        showCursor();
        updateCursorPosition();
    }
}