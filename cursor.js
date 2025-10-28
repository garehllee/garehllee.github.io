//site wide cursor
const site_wide_cursor = document.getElementById('cursor-site-wide');

// Get stored values from sessionStorage
let mouseX = parseFloat(sessionStorage.getItem('cursorX')) || 0;
let mouseY = parseFloat(sessionStorage.getItem('cursorY')) || 0;
let hasMouseMoved = sessionStorage.getItem('hasMouseMoved') === 'true';
let isHoveringLink = false; // Track if hovering a .linkhover element

// Check if screen width is less than 539px
function isSmallScreen() {
    return window.innerWidth < 539;
}

// Show cursor only if not on small screen
function showCursor() {
    if (!isSmallScreen() && !isHoveringLink) {
        site_wide_cursor.style.display = 'block';
        document.body.style.cursor = 'none'; // Hide default cursor
    }
}

// Hide custom cursor and show default
function hideCustomCursor() {
    site_wide_cursor.style.display = 'none';
    document.body.style.cursor = 'auto'; // Show default cursor
}

// Track if mouse is currently on the page
document.addEventListener('mouseenter', () => {
    if (hasMouseMoved) {
        if (isSmallScreen()) {
            hideCustomCursor();
        } else {
            showCursor();
            updateCursorPosition();
        }
    }
});

document.addEventListener('mouseleave', () => {
    site_wide_cursor.style.display = 'none';
});

document.addEventListener('mousemove', TrackCursor);

// Update cursor position using stored coordinates
function updateCursorPosition() {
    const w = site_wide_cursor.clientWidth;
    const h = site_wide_cursor.clientHeight;
    site_wide_cursor.style.transform = `translate(${mouseX - w/3}px, ${mouseY - h/1.4}px)`;
}

// On DOMContentLoaded, show cursor if we have previous position
window.addEventListener('DOMContentLoaded', () => {
    // If we have stored coordinates, show the cursor immediately
    if (hasMouseMoved) {
        if (isSmallScreen()) {
            hideCustomCursor();
        } else {
            showCursor();
            updateCursorPosition();
        }
    }
    
    // Add hover listeners for .linkhover elements
    setupHoverListeners();
});

// Toggle cursor on resize
window.addEventListener('resize', () => {
    if (isSmallScreen()) {
        hideCustomCursor();
    } else if (hasMouseMoved && !isHoveringLink) {
        showCursor();
    }
});

function setupHoverListeners() {
    const elements = document.querySelectorAll('.linkhover, .miscimages, .button, nav img, .next, .prev, video, iframe');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            isHoveringLink = true;
            site_wide_cursor.style.display = 'none';
            if (!isSmallScreen()) {
                document.body.style.cursor = 'auto'; // Show default cursor on hover
            }
        });
        
        element.addEventListener('mouseleave', () => {
            isHoveringLink = false;
            if (isSmallScreen()) {
                hideCustomCursor();
            } else {
                showCursor();
            }
        });
    });
}

function TrackCursor(evt) {
    hasMouseMoved = true;
    
    // Store mouse coordinates
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    
    // Save to sessionStorage so it persists across page navigations
    sessionStorage.setItem('cursorX', mouseX);
    sessionStorage.setItem('cursorY', mouseY);
    sessionStorage.setItem('hasMouseMoved', 'true');
    
    // Show cursor only if not hovering a link and not on small screen
    if (isSmallScreen()) {
        hideCustomCursor();
    } else {
        showCursor();
        updateCursorPosition();
    }
}