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

// === NEWSLETTER SUBMIT HANDLER (BULLETPROOF FORM DATA + GA4 TRACKING) ===
function handleNewsletterSubmit(event) {
    if (event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
    }
    const target = (event && event.target) ? event.target : document.activeElement;
    const form = target ? (target.closest('.newsletter-form') || target.closest('footer')) : document.querySelector('.newsletter-form');
    if (!form) return false;

    const input = form.querySelector('input');
    const button = form.querySelector('button');
    const email = input ? input.value.trim() : '';

    if (!email || !email.includes('@')) {
        alert('Please enter a valid work email address.');
        if (input) input.focus();
        return false;
    }

    if (button) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.style.opacity = '0.9';
        button.style.cursor = 'wait';
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

        // 1. Dispatch Form Data to FormSubmit Endpoint
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
            }).then(res => console.log('Mail dispatched:', res.status))
              .catch(err => console.log('FormSubmit note:', err));
        } catch(err) {
            console.log('Dispatch error:', err);
        }

        // 2. Guaranteed UI State Reset (Never gets stuck on Subscribing...)
        setTimeout(() => {
            button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            button.style.color = '#ffffff';
            button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            if (input) input.value = '';

            if (typeof gtag === 'function') {
                gtag('event', 'newsletter_signup', {
                    'event_category': 'engagement',
                    'event_label': 'Footer Newsletter',
                    'user_email': email
                });
            }

            setTimeout(() => {
                button.disabled = false;
                button.style.background = '';
                button.style.color = '';
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.innerHTML = originalText;
            }, 3500);
        }, 600);
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


