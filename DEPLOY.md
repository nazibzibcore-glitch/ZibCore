# Launching ZibCore (zibcore.com)

Your whole site is the `zibcore` folder. To put it online and connect your
domain, follow these once-only steps. ~15 minutes total.

---

## Step 1 — Test your forms first (2 min)
Before going live, make sure leads reach you.
1. Open the site (locally or after deploy).
2. Submit the contact form once with your own email.
3. Check your inbox. **Formspree's free plan asks you to confirm the form the
   first time** — click the confirmation link in that email. After that,
   submissions arrive automatically.
4. Do the same on the checkout page (add a plan → Proceed to Payment) to
   confirm order emails arrive.

---

## Step 2 — Put the site online (Netlify, free)
The easiest no-account-headache option:
1. Go to **https://app.netlify.com/drop**
2. Drag your entire **`zibcore` folder** onto the page.
3. Wait ~20 seconds. You get a live URL like `random-name.netlify.app`.
4. Create a free account when prompted so the site stays up.

(Alternatives: Vercel, Cloudflare Pages — all free, same idea.)

---

## Step 3 — Connect zibcore.com (10 min)
In Netlify:
1. Site → **Domain management** → **Add a domain** → type `zibcore.com`.
2. Netlify shows you DNS records (either nameservers, or an A record +
   CNAME).
3. Log in where you bought the domain → find **DNS settings** → either:
   - point the **nameservers** to the ones Netlify gives you (easiest), **or**
   - add the **A record** and **CNAME** Netlify lists.
4. Wait for it to verify (minutes to a few hours). Netlify adds a free
   **HTTPS certificate** automatically — your site will be `https://zibcore.com`.

---

## Step 4 — Make updates later
Any time you change a file, just drag the `zibcore` folder onto Netlify again
(or connect it to a GitHub repo for auto-updates). Done.

---

## Before / after launch checklist
- [ ] Confirmed Formspree form (Step 1)
- [ ] Site live on Netlify (Step 2)
- [ ] zibcore.com connected with HTTPS (Step 3)
- [ ] Opened the live site on your phone to check it looks right
- [ ] (Optional) Set up `hello@zibcore.com` email with your domain provider
- [ ] (Optional) Add a Google Business Profile for ZibCore
- [ ] (Later) Connect Stripe in `checkout.js → startPayment()` to take cards

## Notes
- `robots.txt` and `sitemap.xml` are already set up for Google — they assume
  the domain is `zibcore.com`. If you use a different domain, update the URLs
  inside those two files and the `canonical`/`og:url` tags in the HTML heads.
- The cart + checkout currently **email you the order** (no card charged yet).
  That's fine to launch with — reply to arrange payment until Stripe is on.
