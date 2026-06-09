/* ZibCore — tiny, dependency-free interactions.
   Everything here is opacity/transform only and gated by IntersectionObserver
   so it stays smooth on low-end phones. Respects prefers-reduced-motion. */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Year in footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Nav blur on scroll (rAF-throttled, passive) ---
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    const update = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // --- Reveal on scroll ---
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => io.observe(el));
  }

  // --- Smooth anchor scroll for same-page links (offset for fixed nav) ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  // --- Dust particles for the workspace hero (random drift) ---
  const particlesEl = document.getElementById('hero-particles');
  if (particlesEl && !reduceMotion) {
    const small = window.matchMedia('(max-width: 768px)').matches;
    const count = small ? 28 : 60;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const r = Math.random();
      const size = r < 0.15 ? 3 : (r < 0.55 ? 2 : 1);
      p.style.left = (Math.random() * 100) + '%';
      p.style.top = (Math.random() * 100) + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.opacity = (0.15 + Math.random() * 0.45).toFixed(2);
      // Random drift direction — gentle dust feel
      const dx = (Math.random() - 0.5) * 80;
      const dy = -(40 + Math.random() * 120);
      p.style.setProperty('--dx', dx.toFixed(0) + 'px');
      p.style.setProperty('--dy', dy.toFixed(0) + 'px');
      p.style.animationDelay = '-' + (Math.random() * 30).toFixed(1) + 's';
      p.style.animationDuration = (18 + Math.random() * 24).toFixed(1) + 's';
      particlesEl.appendChild(p);
    }
  }

  // --- Phone 2 rotator: cycles between Bookings and Messages views ---
  const phone2Rotator = document.getElementById('phone2-rotator');
  if (phone2Rotator && !reduceMotion) {
    const sites = Array.from(phone2Rotator.querySelectorAll('.phone__site'));
    if (sites.length > 1) {
      let idx = 0;
      setInterval(() => {
        const cur = sites[idx];
        const nextIdx = (idx + 1) % sites.length;
        const next = sites[nextIdx];
        cur.classList.add('is-leaving');
        cur.classList.remove('is-active');
        next.classList.add('is-active');
        setTimeout(() => cur.classList.remove('is-leaving'), 800);
        idx = nextIdx;
      }, 5500);
    }
  }

  // --- Cursor-driven parallax across stage elements (laptop, phone, pill) ---
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const stageEls = Array.from(document.querySelectorAll('.hero__stage [data-fx]'));
    if (stageEls.length) {
      const targets = stageEls.map((el) => ({
        el,
        fx: parseFloat(el.dataset.fx) || 6,
        fy: parseFloat(el.dataset.fy) || 4
      }));
      let rafId = null;
      let tx = 0, ty = 0;
      window.addEventListener('mousemove', (e) => {
        tx = (e.clientX / window.innerWidth - 0.5);
        ty = (e.clientY / window.innerHeight - 0.5);
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          targets.forEach((t) => {
            t.el.style.setProperty('--plx', (tx * t.fx).toFixed(1) + 'px');
            t.el.style.setProperty('--ply', (ty * t.fy).toFixed(1) + 'px');
          });
          rafId = null;
        });
      }, { passive: true });
    }
  }

  // --- Infinite sliding showcase (Squarespace-style depth marquee) ---
  (function () {
    const track = document.getElementById('showcase-track');
    if (!track) return;

    const originals = Array.from(track.children);
    if (!originals.length) return;

    // Static row if the user prefers reduced motion.
    if (reduceMotion) return;

    // Duplicate the set enough times to always fill + allow seamless wrap.
    // Two copies is enough since one set is wider than the viewport here.
    originals.forEach((node) => track.appendChild(node.cloneNode(true)));

    const fine = window.matchMedia('(pointer: fine)').matches;
    const allowBlur = window.matchMedia('(min-width: 768px)').matches;

    let setWidth = 0;            // width of one original set (incl trailing gap)
    function measure() {
      // total scrollWidth covers 2 sets + gaps; one set ≈ half of it
      setWidth = track.scrollWidth / 2;
    }
    measure();
    window.addEventListener('resize', measure, { passive: true });

    const cards = Array.from(track.children);

    // Per-card hover lift state (eased each frame so it's smooth)
    cards.forEach((card) => {
      card._lift = 0;        // current px
      card._liftTarget = 0;  // where it's heading
      card._hot = 0;         // current hover emphasis 0..1
      card._hotTarget = 0;
      if (fine) {
        card.addEventListener('mouseenter', () => { card._liftTarget = -14; card._hotTarget = 1; });
        card.addEventListener('mouseleave', () => { card._liftTarget = 0;   card._hotTarget = 0; });
      }
    });

    const BASE_SPEED = 46;       // px per second — slow & premium
    const HOVER_SPEED = 11;      // slows (not stops) on hover
    let speed = BASE_SPEED;
    let targetSpeed = BASE_SPEED;

    const showcase = document.getElementById('showcase');
    if (fine && showcase) {
      showcase.addEventListener('mouseenter', () => { targetSpeed = HOVER_SPEED; });
      showcase.addEventListener('mouseleave', () => { targetSpeed = BASE_SPEED; });
    }

    let offset = 0;
    let last = performance.now();

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // ease speed toward target (smooth hover slowdown)
      speed += (targetSpeed - speed) * Math.min(dt * 6, 1);

      offset -= speed * dt;
      if (setWidth > 0 && -offset >= setWidth) offset += setWidth;
      track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px,0,0)';

      // Per-card depth: emphasize the card nearest the viewport center
      const cx = window.innerWidth / 2;
      const reach = window.innerWidth * 0.55;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        // skip cards far off-screen (cheap)
        if (r.right < -200 || r.left > window.innerWidth + 200) {
          cards[i].style.opacity = '0.35';
          continue;
        }
        const card = cards[i];
        const center = r.left + r.width / 2;
        const dist = Math.abs(center - cx);
        const prox = Math.max(0, 1 - dist / reach); // 1 at center → 0 at edges

        // ease hover lift + emphasis toward their targets
        card._lift += (card._liftTarget - card._lift) * Math.min(dt * 12, 1);
        card._hot  += (card._hotTarget  - card._hot)  * Math.min(dt * 12, 1);

        const scale = 0.82 + prox * 0.18 + card._hot * 0.05;  // hover adds a touch
        const opacity = Math.min(1, 0.45 + prox * 0.55 + card._hot * 0.4);

        card.style.transform =
          'translate3d(0,' + card._lift.toFixed(2) + 'px,0) scale(' + scale.toFixed(3) + ')';
        card.style.opacity = opacity.toFixed(3);
        if (allowBlur) {
          const blur = (1 - prox) * 3.2 * (1 - card._hot); // hover sharpens it fully
          card.style.filter = blur > 0.1 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
        }
        card.style.zIndex = String(Math.round(prox * 10) + (card._hot > 0.5 ? 20 : 0));
      }

      requestAnimationFrame(frame);
    }

    // Wait for images to have layout before measuring, then run.
    requestAnimationFrame(() => { measure(); last = performance.now(); requestAnimationFrame(frame); });
    window.addEventListener('load', measure);
  })();

  // --- Hero rotator: laptop site + phone chat + URL all swap in sync ---
  const laptopRotator = document.getElementById('laptop-rotator');
  const phoneRotator = document.getElementById('phone-rotator');
  const urlEl = document.getElementById('laptop-url');

  if (laptopRotator && !reduceMotion) {
    const labSites = Array.from(laptopRotator.querySelectorAll('.laptop__site'));
    const phnSites = phoneRotator
      ? Array.from(phoneRotator.querySelectorAll('.phone__site'))
      : [];
    if (labSites.length > 1) {
      let idx = 0;
      const interval = 6000;
      const leaveDur = 850;

      function rotate() {
        const nextIdx = (idx + 1) % labSites.length;
        const current = labSites[idx];
        const next = labSites[nextIdx];

        // Laptop site swap with leave/enter animation
        current.classList.add('is-leaving');
        current.classList.remove('is-active');
        next.classList.add('is-active');
        setTimeout(() => current.classList.remove('is-leaving'), leaveDur);

        // Phone site swap (synced)
        if (phnSites.length === labSites.length) {
          const pCur = phnSites[idx];
          const pNxt = phnSites[nextIdx];
          pCur.classList.add('is-leaving');
          pCur.classList.remove('is-active');
          pNxt.classList.add('is-active');
          setTimeout(() => pCur.classList.remove('is-leaving'), leaveDur);
        }

        // URL bar text crossfade
        if (urlEl) {
          urlEl.classList.add('is-changing');
          setTimeout(() => {
            urlEl.textContent = next.dataset.url || urlEl.textContent;
            urlEl.classList.remove('is-changing');
          }, 280);
        }

        idx = nextIdx;
      }

      setInterval(rotate, interval);
    }
  }

  /* =================================================================
     Live Assistant Demo
     Mirrors our real Business Assistant chatbot exactly:
       1. Bot greets with a welcome message
       2. Suggestion chips appear
       3. After a beat, one chip "auto-clicks" — chip highlights, chips fade
       4. User bubble (right, gradient) carries the chip text
       5. Typing bubble appears, then bot bubble (left, white)
       6. Conversation continues, then loops
     Capability steps on the left light up as the chat progresses.
     ================================================================= */
  const growthCard = document.getElementById('growth-card');
  if (growthCard && !reduceMotion) {
    const chatBody = document.getElementById('demo-chat-body');
    const stepEls = growthCard.querySelectorAll('#demo-steps .demo__step');

    const WELCOME =
      "Hi! 👋 Ask me anything — hours, services, pricing, or how to get in touch.";
    const SUGGESTIONS = ['Your hours?', 'Appointments?', 'What services?', 'Pricing'];
    const PICK_INDEX = 0; // auto-clicks "Your hours?"

    /* After the auto-click, this realistic FAQ conversation plays.
       Each line maps to a capability step (1=hours, 2=services/pricing,
       3=appointments/contact, 4=handoff). Honest — no guaranteed bookings. */
    const SCRIPT = [
      { side: 'user', text: 'What are your hours?',                                          step: 1 },
      { side: 'bot',  text: "We're open Monday through Saturday, 9 AM to 7 PM.",             step: 1 },
      { side: 'user', text: 'What services do you offer?',                                   step: 2 },
      { side: 'bot',  text: 'Haircuts, beard trims, and hot-towel shaves — starting at $25.', step: 2 },
      { side: 'user', text: 'Do you offer appointments?',                                    step: 3 },
      { side: 'bot',  text: "Yes. Leave your name and number and we'll get back to you.",    step: 3 }
    ];

    let timers = [];
    function setT(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      chatBody.innerHTML = '';
      stepEls.forEach((el) => el.classList.remove('is-active'));
    }

    function lightStep(n) {
      stepEls.forEach((el) => {
        el.classList.toggle('is-active', parseInt(el.dataset.step, 10) === n);
      });
    }

    function append(html) {
      const wrap = document.createElement('div');
      wrap.innerHTML = html.trim();
      const node = wrap.firstChild;
      chatBody.appendChild(node);
      chatBody.scrollTop = chatBody.scrollHeight;
      return node;
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
      );
    }

    function playOnce(done) {
      reset();

      /* Step 1 — bot welcome */
      setT(() => {
        append(
          '<div class="demo__bubble demo__bubble--bot">' +
            escapeHtml(WELCOME) +
          '</div>'
        );

        /* Step 2 — suggestion chips */
        setT(() => {
          const chipsHtml = SUGGESTIONS
            .map((s, i) => '<button type="button" class="demo__chip" data-i="' + i + '">' + escapeHtml(s) + '</button>')
            .join('');
          const chipsEl = append('<div class="demo__chips">' + chipsHtml + '</div>');

          /* Step 3 — "auto-click" the second chip */
          setT(() => {
            const target = chipsEl.querySelector('[data-i="' + PICK_INDEX + '"]');
            if (target) target.classList.add('is-highlight');

            setT(() => {
              chipsEl.classList.add('is-out');

              setT(() => {
                chipsEl.remove();

                /* Step 4 — play the conversation */
                let i = 0;
                function next() {
                  if (i >= SCRIPT.length) {
                    setT(() => lightStep(4), 700);
                    setT(done, 4500);
                    return;
                  }
                  const m = SCRIPT[i];
                  lightStep(m.step);

                  if (m.side === 'bot') {
                    const typing = append('<div class="demo__typing-bubble"><span></span><span></span><span></span></div>');
                    setT(() => {
                      typing.remove();
                      append('<div class="demo__bubble demo__bubble--bot">' + escapeHtml(m.text) + '</div>');
                      i++;
                      setT(next, 1500);
                    }, 1100 + Math.random() * 350);
                  } else {
                    append('<div class="demo__bubble demo__bubble--user">' + escapeHtml(m.text) + '</div>');
                    i++;
                    setT(next, 1200);
                  }
                }
                next();
              }, 380);
            }, 750);
          }, 1700);
        }, 1100);
      }, 500);
    }

    function loop() { playOnce(loop); }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        loop();
        obs.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    obs.observe(growthCard);
  }

  /* =================================================================
     Contact form — Formspree submission
     - Validates with HTML5 (reportValidity)
     - Loading state on the submit button
     - Swaps the form for a success card on 2xx response
     - Shows an inline error on network / 4xx-5xx failure
     - Quietly no-ops if the form isn't on this page
     ================================================================= */
  // --- Preferred contact methods: 2nd choice can't equal 1st; phone
  //     becomes required when Text or Phone call is chosen ---
  document.querySelectorAll('[data-contact-prefs]').forEach((root) => {
    const firsts = Array.from(root.querySelectorAll('input[name="preferred_contact"]'));
    const seconds = Array.from(root.querySelectorAll('input[name="alt_contact"]'));
    if (!firsts.length || !seconds.length) return;

    const form = root.closest('form');
    const phone = form && form.querySelector('[name="phone"]');
    const phoneField = phone && phone.closest('.contact-field');
    const phoneOpt = phoneField && phoneField.querySelector('.contact-optional');

    const selected = (nodes) => { let v = null; nodes.forEach((n) => { if (n.checked) v = n.value; }); return v; };

    const refresh = () => {
      const first = selected(firsts);
      const second = selected(seconds);

      // Disable (and clear) the 2nd-choice option that duplicates the 1st
      seconds.forEach((n) => {
        const dup = first && n.value === first;
        n.disabled = dup;
        n.closest('.contact-pill').classList.toggle('is-disabled', dup);
        if (dup && n.checked) n.checked = false;
      });

      // Phone required if any chosen method needs a number
      const needsPhone = [first, second].some((v) => v === 'Text' || v === 'Phone call');
      if (phone) {
        phone.required = needsPhone;
        if (phoneOpt) phoneOpt.textContent = needsPhone ? '(required for text/call)' : '(optional)';
      }
    };

    firsts.forEach((n) => n.addEventListener('change', refresh));
    seconds.forEach((n) => n.addEventListener('change', refresh));
    refresh();
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = document.getElementById('cf-submit');
    const successCard = document.getElementById('cf-success');
    const errorEl = document.getElementById('cf-error');

    const showError = (msg) => {
      errorEl.textContent = msg;
      errorEl.classList.add('is-visible');
    };

    const hideError = () => {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      // HTML5 validation
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // Refuse to submit if the Formspree endpoint hasn't been wired up
      if (/YOUR_FORMSPREE_ID/.test(contactForm.action)) {
        showError("This form isn't connected yet — paste your Formspree endpoint into the form's action attribute (replace YOUR_FORMSPREE_ID).");
        return;
      }

      submitBtn.classList.add('is-loading');
      submitBtn.setAttribute('aria-busy', 'true');

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          contactForm.hidden = true;
          successCard.hidden = false;
          // Scroll the success card into view if needed
          successCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        } else {
          // Try to surface Formspree's own error message if present
          let detail = 'Something went wrong sending your message.';
          try {
            const json = await response.json();
            if (json && json.errors && json.errors.length) {
              detail = json.errors.map((e) => e.message).join(' ');
            }
          } catch (_) { /* ignore parse error */ }
          showError(detail + " Please try again, or email our team directly at nazib.zibcore@gmail.com.");
        }
      } catch (err) {
        showError("Couldn't reach the server. Check your connection and try again, or email our team directly at nazib.zibcore@gmail.com.");
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.removeAttribute('aria-busy');
      }
    });
  }
})();
