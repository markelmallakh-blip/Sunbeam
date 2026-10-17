/* =========================================================
   Sunbeam Design Studio — Homepage interactions
   Calm, minimal motion. Respects prefers-reduced-motion.
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Page load ---------- */
  const heroImg = $('.hero__media img');
  const markLoaded = () => requestAnimationFrame(() => {
    document.documentElement.classList.add('is-loaded');
    $$('.hero [data-split]').forEach((el) => el.classList.add('is-in'));
  });
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener('load', markLoaded, { once: true });
    heroImg.addEventListener('error', markLoaded, { once: true });
    setTimeout(markLoaded, 1500); // never wait too long
  } else {
    markLoaded();
  }

  /* ---------- Header: solid on scroll, hide on scroll down ---------- */
  const header = $('[data-header]');
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    const y = window.scrollY;
    const heroH = $('.hero')?.offsetHeight ?? 0;
    header.classList.toggle('is-scrolled', y > 40);
    const goingDown = y > lastY && y > heroH * 0.6;
    header.classList.toggle('is-hidden', goingDown && !document.body.classList.contains('menu-open'));
    lastY = y;
  };

  /* ---------- Parallax (subtle) ---------- */
  const parallaxEls = reduceMotion ? [] : $$('[data-parallax]');
  const onScrollParallax = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
      el.style.translate = `0 ${offset.toFixed(1)}px`;
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollHeader();
      onScrollParallax();
      ticking = false;
    });
  }, { passive: true });
  onScrollHeader();
  onScrollParallax();

  /* ---------- Mobile menu ---------- */
  const menu = $('[data-mobile-menu]');
  const toggle = $('[data-menu-toggle]');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Scroll reveals ---------- */
  // Stagger siblings that reveal together
  $$('.stats, .services__list, .awards__list, .accordion').forEach((group) => {
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
  });

  const revealTargets = $$('[data-reveal], [data-reveal-img], [data-split]').filter((el) => !el.closest('.hero'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      countIO.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => countIO.observe(el));

  /* ---------- Services: hover/focus swaps preview image ---------- */
  const services = $$('.service');
  const frame = $('[data-services-preview] .services__preview-frame');
  let currentSrc = frame?.querySelector('img')?.src;
  const activateService = (item) => {
    services.forEach((s) => s.classList.toggle('is-active', s === item));
    const src = item.dataset.img;
    if (!frame || !src || src === currentSrc) return;
    currentSrc = src;
    const old = frame.querySelector('img:last-child');
    const img = new Image();
    img.alt = '';
    img.src = src;
    img.className = 'is-entering';
    frame.appendChild(img);
    const show = () => requestAnimationFrame(() => {
      img.classList.remove('is-entering');
      old?.classList.add('is-leaving');
      setTimeout(() => {
        // keep only the newest image in the frame
        $$('img', frame).slice(0, -1).forEach((n) => n.remove());
      }, 1000);
    });
    img.decode ? img.decode().then(show, show) : img.addEventListener('load', show);
  };
  services.forEach((item) => {
    item.addEventListener('mouseenter', () => activateService(item));
    item.addEventListener('focusin', () => activateService(item));
    // preload
    const pre = new Image(); pre.src = item.dataset.img;
  });
  if (services[0]) services[0].classList.add('is-active');

  /* ---------- Testimonials slider ---------- */
  const slider = $('[data-slider]');
  if (slider) {
    const slides = $$('[data-slide]', slider);
    const current = $('[data-slide-current]', slider);
    const progress = $('[data-slide-progress]', slider);
    const INTERVAL = 7000;
    let index = 0;
    let timer;
    let startTime;
    let rafId;

    const pad = (n) => String(n).padStart(2, '0');
    $('[data-slide-total]', slider).textContent = pad(slides.length);

    const tickProgress = (now) => {
      const p = Math.min((now - startTime) / INTERVAL, 1);
      progress.style.transform = `scaleX(${p})`;
      if (p < 1) rafId = requestAnimationFrame(tickProgress);
    };
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
      current.textContent = pad(index + 1);
      restart();
    };
    const restart = () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      if (reduceMotion) return;
      startTime = performance.now();
      rafId = requestAnimationFrame(tickProgress);
      timer = setTimeout(() => go(index + 1), INTERVAL);
    };

    $('[data-slide-prev]', slider).addEventListener('click', () => go(index - 1));
    $('[data-slide-next]', slider).addEventListener('click', () => go(index + 1));

    // only autoplay while visible
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) restart();
      else { clearTimeout(timer); cancelAnimationFrame(rafId); }
    }, { threshold: 0.3 }).observe(slider);
  }

  /* ---------- FAQ accordion ---------- */
  $$('[data-accordion] .accordion__item').forEach((item, _, all) => {
    const trigger = $('.accordion__trigger', item);
    trigger.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      all.forEach((other) => {
        other.classList.remove('is-open');
        $('.accordion__trigger', other).setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Contact tabs ---------- */
  const tabs = $('[data-tabs]');
  const success = $('[data-success]');
  const setTab = (name) => {
    tabs.dataset.active = name;
    $$('[data-tab]', tabs).forEach((btn) => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    $$('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name || !success.hidden;
    });
  };
  $$('[data-tab]', tabs).forEach((btn) => btn.addEventListener('click', () => setTab(btn.dataset.tab)));
  tabs.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const next = tabs.dataset.active === 'schedule' ? 'enquiry' : 'schedule';
    setTab(next);
    $(`[data-tab="${next}"]`, tabs).focus();
  });
  // Any CTA can preselect a tab
  $$('[data-open-tab]').forEach((link) => link.addEventListener('click', () => { success.hidden = true; setTab(link.dataset.openTab); }));
  setTab('schedule');

  /* ---------- Date picker: next 10 working days (Sun–Thu) ---------- */
  const datesEl = $('[data-dates]');
  if (datesEl) {
    const days = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (days.length < 10) {
      const wd = d.getDay();
      if (wd !== 5 && wd !== 6) days.push(new Date(d)); // skip Fri & Sat
      d.setDate(d.getDate() + 1);
    }
    const wdFmt = new Intl.DateTimeFormat('en', { weekday: 'short' });
    const monFmt = new Intl.DateTimeFormat('en', { month: 'short' });
    datesEl.innerHTML = days.map((day, i) => `
      <label class="date">
        <input type="radio" name="date" value="${day.toISOString().slice(0, 10)}" ${i === 0 ? 'required' : ''} />
        <span><small>${wdFmt.format(day)}</small><strong>${day.getDate()}</strong><small>${monFmt.format(day)}</small></span>
      </label>`).join('');
  }

  /* ---------- Forms (front-end only for now) ---------- */
  const successText = $('[data-success-text]');
  $$('[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      $$('.field', form).forEach((field) => {
        const input = $('input, textarea', field);
        if (!input) return;
        const bad = !input.checkValidity();
        field.classList.toggle('is-invalid', bad);
        if (bad) valid = false;
      });
      $$('.field-group', form).forEach((group) => {
        const required = $('input[required]', group);
        if (!required) return;
        const bad = !$(`input[name="${required.name}"]:checked`, group);
        group.classList.toggle('is-invalid', bad);
        if (bad) valid = false;
      });

      if (!valid) {
        $('.is-invalid input, .is-invalid textarea, .field-group.is-invalid input', form)?.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      if (data.date && data.time) {
        const when = new Date(`${data.date}T00:00`).toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' });
        successText.textContent = `Your meeting request for ${when} at ${data.time} has been received. We’ll confirm by email within one working day.`;
      } else {
        successText.textContent = 'We’ve received your enquiry and a member of our design team will be in touch within one working day.';
      }
      // TODO: connect to backend / CRM / calendar booking service
      console.info('[Sunbeam] form submission', data);

      form.reset();
      $$('[data-panel]').forEach((p) => (p.hidden = true));
      success.hidden = false;
    });

    form.addEventListener('input', (e) => {
      e.target.closest('.field, .field-group')?.classList.remove('is-invalid');
    });
  });

  $('[data-success-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    setTab(tabs.dataset.active || 'schedule');
  });

  /* ---------- Misc ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
