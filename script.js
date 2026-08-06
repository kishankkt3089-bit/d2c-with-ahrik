// === D2C WITH AHRIK MAIN JS ===

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainLinks = document.querySelector('.main-links');

if (mobileMenuBtn && mainLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mainLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mainLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Close menu when tapping a link
    mainLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// DeepMind Mega Dropdown Toggle
const logoDropdownBtn = document.getElementById('logo-dropdown-btn');
const deepmindPanel = document.getElementById('deepmind-dropdown-panel');

if (logoDropdownBtn && deepmindPanel) {
    logoDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deepmindPanel.classList.toggle('show');
        logoDropdownBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!deepmindPanel.contains(e.target) && !logoDropdownBtn.contains(e.target)) {
            deepmindPanel.classList.remove('show');
            logoDropdownBtn.classList.remove('active');
        }
    });
}

// Force Permanent Dark Theme
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');

// Active Nav Link & Pillar Highlighter - Bulletproof for Vercel Clean URLs & Local .html
const rawPath = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '').toLowerCase() || 'index';

// 1. Main Header Nav Links (.main-links a)
const navLinks = document.querySelectorAll('.main-links a');
navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().replace('.html', '').toLowerCase();
    if (href === rawPath || (rawPath === '' && href === 'index')) {
        link.classList.add('active');
    }
});

// 2. Pillar Navigation Bar (.pillars-box a)
const pillarNavLinks = document.querySelectorAll('.pillars-box a');
pillarNavLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().replace('.html', '').toLowerCase();
    if (href && (rawPath === href || rawPath.startsWith(href + '-'))) {
        link.classList.add('active');
    }
});

// Modal Popup Handlers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// === SMOOTH ZOOM UP & RADIAL LIGHT SPOTLIGHT (Replaced aggressive 3D Tilt) ===
document.querySelectorAll('.prem-card, .pillar-card-home, .comp-box, .service-card, .metric-box, .visual-metric, .deliv-item, .stat-card-home, .feature-visual, .direct-info-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
    card.style.setProperty('--mx', pctX.toFixed(1) + '%');
        card.style.setProperty('--my', pctY.toFixed(1) + '%');
    });
});

// === NEWSLETTER SUBSCRIBE HANDLER (FormSubmit.co AJAX) ===
function handleNewsletterSubmit(event, formId) {
    event.preventDefault();

    const form = document.getElementById(formId);
    const msgId = formId.replace('newsletter-form', 'newsletter-msg');
    const emailId = formId.replace('newsletter-form', 'newsletter-email');

    const emailInput = document.getElementById(emailId);
    const msgEl = document.getElementById(msgId);
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (!emailInput || !emailInput.value) return;

    const email = emailInput.value.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailInput.style.borderColor = '#f87171';
        emailInput.placeholder = 'Please enter a valid email!';
        emailInput.value = '';
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    }

    // POST to FormSubmit.co AJAX endpoint
    fetch('https://formsubmit.co/ajax/d2cwithahrik@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            _subject: '📩 New Newsletter Subscriber — D2C WITH AHRIK',
            _template: 'table',
            _captcha: 'false'
        })
    })
    .then(response => response.json())
    .then(data => {
        // Fire GA4 event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscribe', {
                event_category: 'engagement',
                event_label: email
            });
        }
        // Show success message
        if (form) form.style.display = 'none';
        if (msgEl) msgEl.style.display = 'block';
    })
    .catch(error => {
        // Fallback: still show success but log error
        console.error('Newsletter error:', error);
        if (form) form.style.display = 'none';
        if (msgEl) msgEl.style.display = 'block';
    });
}



