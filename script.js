// Utility Functions
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// DOM Elements
const loader        = $('#loader');
const loaderText    = $('#loader .loader-text');
const progressFill  = $('#loader .progress-fill');
const navbar        = $('#navbar');
const hamburger     = $('#hamburger');
const navMenu       = $('#nav-menu');
const navLinks      = $$('.nav-link');
const backToTopBtn  = $('#backToTop');
const contactForm   = $('#contactForm');
const skillBars     = $$('.skill-progress');
const projectCards  = $$('.project-card');
const filterBtns    = $$('.filter-btn');
const typingText    = $('#typing-text');

// Loading Screen Animation
function initLoader() {
  setTimeout(() => {
    loaderText.style.opacity = '1';
    loaderText.style.transform = 'translateY(0)';
  }, 500);

  setTimeout(() => {
    progressFill.style.width = '100%';
  }, 1000);

  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      navbar.classList.add('visible');
      initAnimations();
    }, 500);
  }, 3000);
}

// Navigation Functions
function toggleMobileMenu() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}

// Smooth Scrolling and Active Link
function handleNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = $(link.getAttribute('href'));
      if (target) {
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}

// Typing Animation
function typeWriter() {
  const texts = [
    'Salesforce Developer',
    'Apex Programmer',
    'Lightning Developer',
    'CRM Specialist',
    'Salesforce Admin'
  ];
  let textIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const full = texts[textIndex];
    typingText.textContent = isDeleting
      ? full.substring(0, charIndex - 1)
      : full.substring(0, charIndex + 1);

    charIndex += isDeleting ? -1 : 1;
    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === full.length) {
      isDeleting = true; speed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }
  type();
}

// Tab Functionality
function openTab(tabName, event) {
  const tabContents = $$('.tab-contents');
  const tabLinks    = $$('.tab-links');

  tabContents.forEach(tab => tab.classList.remove('active-tab'));
  tabLinks.forEach(link => link.classList.remove('active-link'));

  $(`#${tabName}`).classList.add('active-tab');
  event.currentTarget.classList.add('active-link');
}

// Skills Animation
function animateSkills() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        bar.style.width = bar.dataset.skill + '%';
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  skillBars.forEach(bar => observer.observe(bar));
}

// Project Filtering
function initProjectFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.display = 'block';
        } else {
          card.classList.add('hidden');
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

// Contact Form Handling
function initContactForm() {
  const fields = ['firstName','lastName','email','phone','subject','message'];
  const elems = {};
  const errs  = {};

  fields.forEach(f => {
    elems[f] = $(`#${f}`);
    errs[f]  = $(`#${f}Error`);
  });

  const status    = $('#formStatus');
  const submitBtn = $('.submit-btn');

  const rules = {
    firstName: { required: true, minLength: 2, pattern: /^[A-Za-z\s]+$/, message: 'First name must be at least 2 letters' },
    lastName:  { required: true, minLength: 2, pattern: /^[A-Za-z\s]+$/, message: 'Last name must be at least 2 letters' },
    email:     { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' },
    phone:     { required: false, pattern: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, message: 'Valid phone number' },
    subject:   { required: true, message: 'Please select a subject' },
    message:   { required: true, minLength: 10, message: 'Message at least 10 chars' }
  };

  function validate(name, value) {
    const r = rules[name];
    if (r.required && !value.trim())       return r.message;
    if (r.minLength && value.length<r.minLength) return r.message;
    if (r.pattern && !r.pattern.test(value))     return r.message;
    return '';
  }

  function showError(name, msg) {
    errs[name].textContent = msg;
    errs[name].style.display = 'block';
    elems[name].style.borderColor = '#ef4444';
  }

  function hideError(name) {
    errs[name].style.display = 'none';
    elems[name].style.borderColor = '';
  }

  fields.forEach(name => {
    elems[name].addEventListener('blur', () => {
      const msg = validate(name, elems[name].value);
      msg ? showError(name, msg) : hideError(name);
    });
    elems[name].addEventListener('input', () => hideError(name));
  });

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    const data = {};
    fields.forEach(name => {
      const msg = validate(name, elems[name].value);
      if (msg) { showError(name, msg); valid = false; }
      else    { hideError(name); data[name] = elems[name].value; }
    });
    if (!valid) {
      status.textContent = 'Please correct the errors';
      status.className = 'form-status error';
      status.style.display = 'block';
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    try {
      // Replace with actual API call
      await new Promise(res => setTimeout(res, 2000));
      status.textContent = 'Message sent successfully!';
      status.className = 'form-status success';
      contactForm.reset();
    } catch {
      status.textContent = 'Submission failed. Try again.';
      status.className = 'form-status error';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      setTimeout(() => status.style.display = 'none', 5000);
    }
  });
}

// Scroll Animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.section-title, .project-card, .timeline-item, .skill-item')
    .forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
}

// Back to Top Button
function initBackToTop() {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active Navigation Link on Scroll
function updateActiveNavLink() {
  const sections = $$('section[id]');
  const pos      = window.pageYOffset + 100;
  sections.forEach(sec => {
    const top  = sec.offsetTop;
    const end  = top + sec.offsetHeight;
    const id   = sec.id;
    if (pos >= top && pos < end) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}

// Hero & Particle Animations
function initAnimations() {
  $$('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .social-links, .hero-image')
    .forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translate(0, 0)';
      }, i * 200);
    });
}

function createParticles() {
  const heroCount = 50, hero = $('.hero');
  for (let i = 0; i < heroCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    Object.assign(p.style, {
      position: 'absolute',
      width: '2px', height: '2px',
      background: 'rgba(255,255,255,0.5)',
      borderRadius: '50%',
      pointerEvents: 'none',
      left: `${Math.random()*100}%`,
      top: `${Math.random()*100}%`,
      animation: `float ${3+Math.random()*4}s ease-in-out infinite`,
      animationDelay: `${Math.random()*2}s`
    });
    hero.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%,100% { transform: translateY(0) rotate(0); opacity: 0.5; }
      50%     { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Utility Methods
const Utils = {
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Focus Management & Accessibility
function manageFocus() {
  $$('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').forEach(el => {
    el.addEventListener('focus', () => {
      el.style.outline = '2px solid #6366f1';
      el.style.outlineOffset = '2px';
    });
    el.addEventListener('blur', () => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  });
}

// Initialization
function init() {
  hamburger.addEventListener('click', toggleMobileMenu);
  window.addEventListener('scroll', Utils.throttle(updateActiveNavLink, 100));

  handleNavigation();
  typeWriter();
  animateSkills();
  initProjectFilters();
  initContactForm();
  initScrollAnimations();
  initBackToTop();
  createParticles();

  window.openTab = openTab;
  manageFocus();
}

window.addEventListener('load', () => {
  initLoader();
  init();
});

window.addEventListener('error', e => console.error('Portfolio Error:', e.error));
window.addEventListener('resize', Utils.debounce(() => {
  if (window.innerWidth > 768) closeMobileMenu();
}, 250));
