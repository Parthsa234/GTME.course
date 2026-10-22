# GTME.School — ₹999 recorded course landing page

One static page in the GTME.School v3 style (black + orange, same motion). Deploys on Vercel like the main site:
push this folder, import it, Framework Preset "Other", no build command (vercel.json serves public/).

```
public/index.html          the page
public/assets/site.css     v3 design system + course components at the bottom
public/assets/site.js      v3 motion + testimonial video player
public/assets/video/       the three testimonials, compressed to 720p (+ poster frames)
public/assets/photos/nish.jpg   instructor photo
src/index.html + build.py  source; the curriculum and tools list live in build.py
```
Edit the curriculum or tools in `src/build.py`, then run `python3 src/build.py` to regenerate `public/index.html`.
Small text edits can go straight into `public/index.html`.

## Before launch (search the page for "[")
- `[Razorpay payment link]` on both buy buttons
- Course runtime `[x] hours`, access term `[Lifetime]`, update policy, refund promise
- WhatsApp, LinkedIn, YouTube links; legal entity + GSTIN in the footer
- Typical monthly tool cost (FAQ) and whether international cards are enabled
