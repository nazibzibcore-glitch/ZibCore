/* =====================================================================
   ZibCore — Cart + checkout engine
   Pure JS · localStorage · no backend yet.
   ---------------------------------------------------------------------
   Stripe later: see checkout.html -> startPayment(). Everything funnels
   through window.ZibCart so the checkout page reads the same data.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Catalog (edit prices here) ------------------------------------ */
  const PLANS = {
    website: { id: 'website', name: 'Website',                 setup: 199, monthly: 39 },
    chatbot: { id: 'chatbot', name: 'FAQ Chatbot',             setup: 99,  monthly: 19 },
    bundle:  { id: 'bundle',  name: 'Website + FAQ Chatbot',   setup: 249, monthly: 49, popular: true }
  };

  const KEY = 'zibcore_cart_v1';

  /* ---- Storage ------------------------------------------------------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter((i) => PLANS[i.id]) : [];
    } catch (_) { return []; }
  }
  function save(cart) {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (_) {}
    emit();
  }

  let cart = load();

  /* ---- Operations ---------------------------------------------------- */
  function add(id, qty) {
    if (!PLANS[id]) return;
    qty = qty || 1;
    const found = cart.find((i) => i.id === id);
    if (found) found.qty += qty;
    else cart.push({ id: id, qty: qty });
    save(cart);
  }
  function setQty(id, qty) {
    const found = cart.find((i) => i.id === id);
    if (!found) return;
    found.qty = Math.max(0, qty);
    if (found.qty === 0) cart = cart.filter((i) => i.id !== id);
    save(cart);
  }
  function remove(id) { cart = cart.filter((i) => i.id !== id); save(cart); }
  function clear() { cart = []; save(cart); }

  function items() {
    return cart.map((i) => ({ plan: PLANS[i.id], qty: i.qty }));
  }
  function count() { return cart.reduce((n, i) => n + i.qty, 0); }
  function totals() {
    let setup = 0, monthly = 0;
    cart.forEach((i) => {
      setup += PLANS[i.id].setup * i.qty;
      monthly += PLANS[i.id].monthly * i.qty;
    });
    return { setup: setup, monthly: monthly };
  }

  /* ---- Pub/sub so any page (drawer, nav badge, checkout) stays in sync */
  const listeners = [];
  function on(fn) { listeners.push(fn); }
  function emit() { listeners.forEach((fn) => fn()); }

  /* Cross-tab sync */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { cart = load(); emit(); renderDrawer(); renderBadge(); }
  });

  /* Public API */
  window.ZibCart = {
    PLANS: PLANS, add: add, remove: remove, setQty: setQty, clear: clear,
    items: items, count: count, totals: totals, on: on, open: openDrawer, close: closeDrawer
  };

  /* ---- Money helper -------------------------------------------------- */
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- Nav cart button ---------------------------------------------- */
  function buildNavButton() {
    const links = document.querySelector('.nav__links');
    if (!links || document.getElementById('zc-cart-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'zc-cart-btn';
    btn.type = 'button';
    btn.className = 'zc-cart-btn';
    btn.setAttribute('aria-label', 'Open cart');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' +
      '</svg>' +
      '<span class="zc-cart-btn__badge" id="zc-cart-badge" hidden>0</span>';
    // place it just before the primary CTA if present, else at the end
    const cta = links.querySelector('.nav__cta');
    if (cta) links.insertBefore(btn, cta);
    else links.appendChild(btn);
    btn.addEventListener('click', openDrawer);
  }

  function renderBadge() {
    const badge = document.getElementById('zc-cart-badge');
    if (!badge) return;
    const c = count();
    badge.textContent = c;
    badge.hidden = c === 0;
  }

  /* ---- Drawer -------------------------------------------------------- */
  function buildDrawer() {
    if (document.getElementById('zc-cart')) return;
    const root = document.createElement('div');
    root.id = 'zc-cart';
    root.className = 'zc-cart';
    root.innerHTML =
      '<div class="zc-cart__scrim" data-zc-close></div>' +
      '<aside class="zc-cart__panel" role="dialog" aria-label="Your cart" aria-modal="true">' +
        '<header class="zc-cart__head">' +
          '<h2>Your cart</h2>' +
          '<button type="button" class="zc-cart__close" data-zc-close aria-label="Close cart">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</header>' +
        '<div class="zc-cart__body" id="zc-cart-body"></div>' +
        '<footer class="zc-cart__foot" id="zc-cart-foot"></footer>' +
      '</aside>';
    document.body.appendChild(root);
    root.querySelectorAll('[data-zc-close]').forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  function renderDrawer() {
    const body = document.getElementById('zc-cart-body');
    const foot = document.getElementById('zc-cart-foot');
    if (!body || !foot) return;

    const list = items();
    if (!list.length) {
      body.innerHTML =
        '<div class="zc-cart__empty">' +
          '<div class="zc-cart__empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>' +
          '<p>Your cart is empty.</p>' +
          '<a href="plans.html" class="btn btn--ghost" data-zc-close>Browse plans</a>' +
        '</div>';
      foot.innerHTML = '';
      // rebind close on the new link
      const lnk = body.querySelector('[data-zc-close]');
      if (lnk) lnk.addEventListener('click', closeDrawer);
      return;
    }

    body.innerHTML = list.map(function (row) {
      const p = row.plan;
      return (
        '<div class="zc-cart__item">' +
          '<div class="zc-cart__item-main">' +
            '<strong>' + esc(p.name) + (p.popular ? '<span class="zc-cart__tag">Popular</span>' : '') + '</strong>' +
            '<small>' + money(p.setup) + ' setup · ' + money(p.monthly) + '/mo</small>' +
          '</div>' +
          '<div class="zc-cart__item-side">' +
            '<div class="zc-cart__qty">' +
              '<button type="button" data-zc-dec="' + p.id + '" aria-label="Decrease">−</button>' +
              '<span>' + row.qty + '</span>' +
              '<button type="button" data-zc-inc="' + p.id + '" aria-label="Increase">+</button>' +
            '</div>' +
            '<button type="button" class="zc-cart__remove" data-zc-remove="' + p.id + '">Remove</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    const t = totals();
    foot.innerHTML =
      '<div class="zc-cart__totals">' +
        '<div class="zc-cart__total-row"><span>Due today (setup)</span><strong>' + money(t.setup) + '</strong></div>' +
        '<div class="zc-cart__total-row zc-cart__total-row--sub"><span>Then monthly</span><strong>' + money(t.monthly) + '/mo</strong></div>' +
      '</div>' +
      '<a href="checkout.html" class="btn btn--primary btn--full zc-cart__checkout">Checkout →</a>' +
      '<p class="zc-cart__note">Setup billed once. Monthly covers hosting &amp; care — cancel any time.</p>';

    // wire buttons
    body.querySelectorAll('[data-zc-inc]').forEach(function (b) {
      b.addEventListener('click', function () { const id = b.dataset.zcInc; const it = cart.find(x=>x.id===id); setQty(id, (it?it.qty:0) + 1); });
    });
    body.querySelectorAll('[data-zc-dec]').forEach(function (b) {
      b.addEventListener('click', function () { const id = b.dataset.zcDec; const it = cart.find(x=>x.id===id); setQty(id, (it?it.qty:1) - 1); });
    });
    body.querySelectorAll('[data-zc-remove]').forEach(function (b) {
      b.addEventListener('click', function () { remove(b.dataset.zcRemove); });
    });
  }

  function openDrawer() {
    buildDrawer();
    renderDrawer();
    const root = document.getElementById('zc-cart');
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const root = document.getElementById('zc-cart');
    if (root) root.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }

  /* ---- Add-to-cart triggers ----------------------------------------- */
  function wireTriggers() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      if (btn.dataset.zcWired) return;
      btn.dataset.zcWired = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const id = btn.getAttribute('data-add-to-cart');
        add(id, 1);
        // micro feedback
        const original = btn.dataset.zcLabel || btn.textContent;
        btn.dataset.zcLabel = original;
        btn.textContent = 'Added ✓';
        btn.classList.add('is-added');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('is-added');
        }, 1100);
        openDrawer();
      });
    });
  }

  /* ---- Init ---------------------------------------------------------- */
  function init() {
    buildNavButton();
    buildDrawer();
    renderBadge();
    renderDrawer();
    wireTriggers();
    on(function () { renderBadge(); renderDrawer(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
