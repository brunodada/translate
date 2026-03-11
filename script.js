/**
 * Tradução Juramentada - Site Institucional
 * Interatividade: menu mobile, ano no footer, contador animado
 */

(function () {
  'use strict';

  // ----- Menu mobile -----
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    // Fechar ao clicar em um link (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          navToggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ----- Ano no footer -----
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----- Contador animado (hero stats) -----
  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end;
      }
    }

    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let observed = false;

  function observeStats() {
    if (observed) return;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const end = parseInt(el.getAttribute('data-count'), 10);
            if (!isNaN(end)) {
              animateValue(el, end, 1500);
              observer.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
    observed = true;
  }

  if (statNumbers.length) {
    if ('IntersectionObserver' in window) {
      observeStats();
    } else {
      statNumbers.forEach(function (el) {
        const end = parseInt(el.getAttribute('data-count'), 10);
        if (!isNaN(end)) el.textContent = end;
      });
    }
  }

  // ----- Destacar link ativo na navegação -----
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(function (link) {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop() || 'index.html';
    if (linkPage === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ----- Formulário de contato (evita submit para #; em WordPress substituir por envio real) -----
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
      }
      // Simula envio; em produção, enviar para API/WordPress
      setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
        alert('Obrigado pela mensagem! Em um ambiente com servidor, seus dados seriam enviados. Entre em contato por e-mail ou telefone se preferir.');
      }, 800);
    });
  }
})();
