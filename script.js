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

// === SMOOTH ZOOM UP & RADIAL LIGHT SPOTLIGHT ===
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

// === NEWSLETTER SUBMIT HANDLER (NO POPUP ALERTS, SLEEK INLINE FEEDBACK) ===
function handleNewsletterSubmit(event) {
    if (event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
    }
    const btn = (event && event.target) ? (event.target.tagName === 'BUTTON' ? event.target : event.target.closest('button')) : document.querySelector('.newsletter-form button');
    const form = btn ? btn.closest('.newsletter-form') : document.querySelector('.newsletter-form');
    const input = form ? form.querySelector('input') : document.querySelector('.newsletter-form input');
    const email = input ? input.value.trim() : '';

    // Validation: Inline Red Border Glow (Zero intrusive browser alert popups)
    if (!email || !email.includes('@') || !email.includes('.')) {
        if (input) {
            input.focus();
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.5)';
            const oldPlaceholder = input.placeholder;
            input.placeholder = 'Please enter a valid email address!';
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
                input.placeholder = oldPlaceholder;
            }, 3000);
        }
        return false;
    }

    if (btn) {
        const originalText = 'Subscribe';

        // 1. Instant Success Visual Feedback
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.style.color = '#ffffff';
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        if (input) {
            input.value = '';
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }

        // 2. Non-blocking Background Mail Dispatch to d2cwithahrik@gmail.com
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('_subject', '🔥 New Newsletter Subscriber — D2C WITH AHRIK');
            formData.append('_captcha', 'false');
            formData.append('_template', 'table');
            formData.append('form_name', 'Footer Newsletter');
            formData.append('agency', 'D2C WITH AHRIK');

            fetch('https://formsubmit.co/ajax/d2cwithahrik@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            }).catch(err => console.log('Mail dispatch note:', err));
        } catch(err) {
            console.log('Dispatch note:', err);
        }

        // 3. Non-blocking GA4 Tracking
        try {
            if (typeof gtag === 'function') {
                gtag('event', 'newsletter_signup', {
                    'event_category': 'engagement',
                    'event_label': 'Footer Newsletter',
                    'user_email': email
                });
            }
        } catch(err) {}

        // 4. Reset Button after 3 Seconds
        setTimeout(() => {
            if (btn) {
                btn.style.background = '';
                btn.style.color = '';
                btn.innerHTML = originalText;
            }
        }, 3000);
    }
    return false;
}

// Auto-attach listeners on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        const button = form.querySelector('button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNewsletterSubmit({ preventDefault: () => {}, target: form });
            });
        }
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNewsletterSubmit(e);
        });
    });
});


