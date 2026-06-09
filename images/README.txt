DROP YOUR HERO IMAGES HERE
==========================

The hero section pulls in 3 floating "work sample" cards that look for these
filenames in this folder. The HTML is already wired up — just save your
images with these exact names (case-sensitive on most servers).

Required filenames:
  work-1.jpg   (top-right area — recommended ~520×620, portrait)
  work-2.jpg   (bottom-right area — recommended ~480×480, square)
  work-3.jpg   (top-left area — recommended ~440×550, portrait)

Notes:
- JPG, PNG, or WebP all work — change the extension in index.html if needed
- If a file is missing, the card stays visible with a clean fallback gradient
  and the niche label, so nothing breaks
- Crop or resize beforehand if you want pixel-perfect framing — otherwise
  the CSS uses object-fit: cover so they'll fill the frame automatically
- To swap to different niches, edit the figcaption text inside the
  <figure class="stage__img stage__img--N"> blocks in index.html
