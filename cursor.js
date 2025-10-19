//site wide cursor
const site_wide_cursor = document.getElementById('cursor-site-wide');

// Get stored values from sessionStorage
let mouseX = parseFloat(sessionStorage.getItem('cursorX')) || 0;
let mouseY = parseFloat(sessionStorage.getItem('cursorY')) || 0;
let hasMouseMoved = sessionStorage.getItem('hasMouseMoved') === 'true';
let isHoveringLink = false; // Track if hovering a .linkhover element

// Track if mouse is currently on the page
document.addEventListener('mouseenter', () => {
    if (hasMouseMoved && !isHoveringLink) {
        site_wide_cursor.style.display = 'block';
        updateCursorPosition();
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
        site_wide_cursor.style.display = 'block';
        updateCursorPosition();
    }
    
    // Add hover listeners for .linkhover elements
    setupHoverListeners();
});

function setupHoverListeners() {
    const elements = document.querySelectorAll('.linkhover, .miscimages, .button, nav img, .next, .prev, video, iframe');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            isHoveringLink = true;
            site_wide_cursor.style.display = 'none';
        });
        
        element.addEventListener('mouseleave', () => {
            isHoveringLink = false;
            site_wide_cursor.style.display = 'block';
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
    
    // Show cursor only if not hovering a link
    if (!isHoveringLink) {
        site_wide_cursor.style.display = 'block';
    }
    
    updateCursorPosition();
}