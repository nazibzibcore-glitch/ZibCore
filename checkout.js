/* =====================================================================
   ZibCore — Checkout page logic
   Reads the cart from window.ZibCart (cart.js) and renders the summary.
   ---------------------------------------------------------------------
   👉 STRIPE GOES HERE: see startPayment() near the bottom. That's the
   only function you need to change to take real payments.
   ===================================================================== */
(function () {
  'use strict';

  /* Same Formspree endpoint as the contact form — orders email you here
     until Stripe is connected. Replace the ID to point somewhere else. */
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvjorje';

  function money(n) { return '$' + Number(n).toLocaleString('en-US'); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function init() {
    if (!window.ZibCart) return;

    const view    = document.getElementById('checkout-view');
    const done    = document.getElementById('checkout-done');
    const itemsEl = document.getElementById('summary-items');
    const totalsEl= document.getElementById('summary-totals');
    const form    = document.getElementById('checkout-form');
    const payBtn  = document.getElementById('checkout-pay');
    const errEl   = document.getElementById('checkout-error');

    function render() {
      const list = window.ZibCart.items();
      const t = window.ZibCart.totals();

      if (!list.length) {
        itemsEl.innerHTML = '<p class="summary__empty">Your cart is empty.</p>';
        totalsEl.innerHTML = '<a href="plans.html" class="btn btn--ghost btn--full">Browse plans</a>';
        if (payBtn) payBtn.disabled = true;
        return;
      }
      if (payBtn) payBtn.disabled = false;

      itemsEl.innerHTML = list.map(function (row) {
        const p = row.plan;
        const qty = row.qty > 1 ? ' <span class="summary__qty">× ' + row.qty + '</span>' : '';
        return (
          '<div class="summary__item">' +
            '<div>' +
              '<span class="summary__item-name">' + esc(p.name) + qty + '</span>' +
              '<span class="summary__item-sub">' + money(p.monthly) + '/mo hosting &amp; care</span>' +
            '</div>' +
            '<span class="summary__item-price">' + money(p.setup * row.qty) + '</span>' +
          '</div>'
        );
      }).join('');

      totalsEl.innerHTML =
        '<div class="summary__total-row"><span>Setup (one-time)</span><strong>' + money(t.setup) + '</strong></div>' +
        '<div class="summary__total-row"><span>Monthly</span><strong>' + money(t.monthly) + '/mo</strong></div>' +
        '<div class="summary__total-row summary__total-row--due"><span>Due today</span><strong>' + money(t.setup) + '</strong></div>' +
        '<p class="summary__monthly-note">Then <strong>' + money(t.monthly) + '/month</strong> starting after launch.</p>';
    }

    render();
    window.ZibCart.on(render);

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errEl.classList.remove('is-visible');
      errEl.textContent = '';

      if (!form.checkValidity()) { form.reportValidity(); return; }

      const list = window.ZibCart.items();
      if (!list.length) {
        errEl.textContent = 'Your cart is empty — add a plan first.';
        errEl.classList.add('is-visible');
        return;
      }

      const order = {
        customer: {
          name: form.name.value.trim(),
          business: form.business.value.trim(),
          email: form.email.value.trim(),
          phone: form.phone.value.trim(),
          notes: form.notes.value.trim()
        },
        items: list.map(function (r) {
          return { id: r.plan.id, name: r.plan.name, qty: r.qty, setup: r.plan.setup, monthly: r.plan.monthly };
        }),
        totals: window.ZibCart.totals()
      };

      payBtn.classList.add('is-loading');
      payBtn.setAttribute('aria-busy', 'true');
      startPayment(order)
        .then(function () {
          window.ZibCart.clear();
          view.hidden = true;
          done.hidden = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(function (err) {
          errEl.textContent = (err && err.message) || 'Something went wrong. Please try again.';
          errEl.classList.add('is-visible');
        })
        .finally(function () {
          payBtn.classList.remove('is-loading');
          payBtn.removeAttribute('aria-busy');
        });
    });
  }

  /* Build a readable order summary line for the email. */
  function orderToText(order) {
    const lines = order.items.map(function (i) {
      return '• ' + i.name + ' ×' + i.qty +
             ' — ' + money(i.setup * i.qty) + ' setup, ' + money(i.monthly * i.qty) + '/mo';
    });
    lines.push('');
    lines.push('Due today (setup): ' + money(order.totals.setup));
    lines.push('Then monthly: ' + money(order.totals.monthly) + '/mo');
    return lines.join('\n');
  }

  /* ===================================================================
     ORDER SUBMISSION
     -------------------------------------------------------------------
     Right now: emails the full order to your Formspree inbox, so you
     actually receive every order while payment isn't live yet.

     💳 STRIPE LATER — to take real card payments, swap the Formspree
     fetch below for a Stripe Checkout redirect:
       1. In Stripe, create Prices: a one-time Price per setup fee and a
          recurring monthly Price per plan.
       2. Stand up a tiny endpoint (Vercel/Cloudflare/Netlify function)
          that builds a Checkout Session from `order.items` and returns
          its URL.  NEVER put your Stripe secret key in this file.
       3. Replace the fetch below with:
            const res = await fetch('/api/create-checkout-session', {
              method: 'POST', headers: {'Content-Type':'application/json'},
              body: JSON.stringify(order)
            });
            const { url } = await res.json();
            window.location.href = url;   // Stripe-hosted payment page
       (You can keep the Formspree call too, as an order notification.)
     =================================================================== */
  function startPayment(order) {
    const payload = {
      _subject: 'New order — ' + order.customer.business + ' (' + money(order.totals.setup) + ' setup)',
      name: order.customer.name,
      business: order.customer.business,
      email: order.customer.email,
      phone: order.customer.phone || '—',
      notes: order.customer.notes || '—',
      order: orderToText(order),
      setup_total: money(order.totals.setup),
      monthly_total: money(order.totals.monthly) + '/mo'
    };

    return fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.ok) {
        console.log('[ZibCore] Order emailed via Formspree:', order);
        return true;
      }
      return res.json().then(function (j) {
        const msg = (j && j.errors && j.errors.length) ? j.errors.map(function (e) { return e.message; }).join(' ')
          : "Couldn't send your order. Please email us at nazib.zibcore@gmail.com.";
        throw new Error(msg);
      });
    }).catch(function (err) {
      if (err instanceof Error) throw err;
      throw new Error("Couldn't reach the server. Check your connection, or email nazib.zibcore@gmail.com.");
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
