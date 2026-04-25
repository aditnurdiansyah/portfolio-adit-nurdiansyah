/*
  PORTFOLIO SCRIPT
  - Smooth scroll (native CSS handles it, JS for offsets)
  - Active navigation link highlighting
  - Sticky navigation bar state
  - Mobile hamburger icon menu
  - Scroll-reveal animations (IntersectionObserver)
  - Typing effect (hero section)
  - Back to top button
  - Footer year
*/

'use strict';

// DOM REFERENCES 
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const backToTop = document.getElementById('backToTop');
const yearEl = document.getElementById('year');
const typedEl = document.getElementById('typedText');

// FOOTER YEAR
if (yearEl) yearEl.textContent = new Date().getFullYear();

// NAVIGATION BAR — SCROLL STATE
function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load

// ACTIVE NAVIGATION BAR LINK — highlight on scroll
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchorLinks = document.querySelectorAll('.nav-link');
const NAVBAR_HEIGHT = 80;

function updateActiveLink() {
  let currentId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - NAVBAR_HEIGHT - 20;
    if (window.scrollY >= sectionTop) {
      currentId = section.id;
    }
  });

  navAnchorLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// SMOOTH SCROLL — navigation bar links with offset for fixed navigation bar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const offsetTop = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();
  });
});

// HAMBURGER ICON / MOBILE MENU
function openMobileMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  navOverlay.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

navOverlay.addEventListener('click', closeMobileMenu);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// SCROLL REVEAL — IntersectionObserver
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // reveal once
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  }
);

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

// BACK TO TOP BUTTON
function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleBackToTop, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// TYPING EFFECT (Hero Section)
const typedPhrases = [
  'beautiful web apps.',
  'responsive designs.',
  'pixel-perfect UIs.',
  'great user experiences.',
  'elegant solutions.',
  // Add or edit phrases here
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout = null;

function typeEffect() {
  if (!typedEl) return;

  const currentPhrase = typedPhrases[phraseIndex];

  if (!isDeleting) {
    // Typing forward
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      // Pause at end before deleting
      typingTimeout = setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 2000);
      return;
    }
  } else {
    // Deleting
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typedPhrases.length;
      typingTimeout = setTimeout(typeEffect, 400);
      return;
    }
  }

  const speed = isDeleting ? 45 : 90;
  typingTimeout = setTimeout(typeEffect, speed);
}

// Start typing effect after a short delay
setTimeout(typeEffect, 800);

// SKILL ITEMS — staggered entrance on scroll
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill-item');
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity   = '1';
            item.style.transform = 'translateY(0)';
          }, i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.skills-grid').forEach(grid => {
  // Set initial hidden state for each skill item
  grid.querySelectorAll('.skill-item').forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(16px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  skillObserver.observe(grid);
});

// NAVIGATION BAR — hide on rapid downscroll, show on upscroll (optional UX)
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  // Only auto-hide below hero (> 600px)
  if (currentY > 600 && currentY > lastScrollY + 4) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = currentY;
}, { passive: true });

navbar.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s, padding 0.35s, box-shadow 0.35s';

// PROJECT CARDS — tilt effect on mouse move
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform  = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.35s, box-shadow 0.35s';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, border-color 0.35s, box-shadow 0.35s';
  });
});