// ===================================
// FLEET PRO SOUND — Midnight Session
// ===================================

// :::SECTION:Header Scroll Effect:::
const header = document.querySelector('.site-header');

if (header) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.pageYOffset > 80) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// :::SECTION:Smooth Scrolling:::
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// :::SECTION:Scroll Animations:::
const animatedElements = document.querySelectorAll('.animate-on-scroll');

if (animatedElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// :::SECTION:Active Nav Highlighting:::
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-header__nav a');

if (sections.length > 0 && navLinks.length > 0) {
  let navTicking = false;

  const highlightNav = () => {
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + sectionId) {
            link.style.color = 'var(--color-cream)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      window.requestAnimationFrame(() => {
        highlightNav();
        navTicking = false;
      });
      navTicking = true;
    }
  }, { passive: true });
}

// :::SECTION:Gear Card Parallax:::
const gearCards = document.querySelectorAll('.gear__card');

if (gearCards.length > 0 && window.matchMedia('(min-width: 769px)').matches) {
  gearCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      card.style.backgroundPosition = `calc(50% + ${x * 10}px) calc(50% + ${y * 10}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.backgroundPosition = 'center';
    });
  });
}



(function() {
  'use strict';

  function initStickyHeader() {
    var header = document.querySelector('.miles-sticky-top');
    if (!header) return;

    var scrollThreshold = header.offsetHeight;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyHeader);
  } else {
    initStickyHeader();
  }
})();
