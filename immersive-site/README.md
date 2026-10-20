# UltraCorr IT — immersive website

A single-page, animated version of the UltraCorr IT website. It's plain HTML,
CSS and JavaScript, with no frameworks, no build step and no npm packages. Every
effect (the 3D network, particles, tilt, reveals) is drawn with the browser's
own Canvas 2D and CSS 3D, so the site loads only its own local files.

**What comes from where** (all 8 pages)

- **Design (layout):** the "Technology That Brings Better Care" reference
  image. That covers the light hero with a 3D object in the centre and stacked
  service cards on the right, the dark stats bar, the image-topped service
  cards and the dark "Why us" band with a glowing portal. Only the layout was
  taken from it.
- **Colours:** the original ultracorrit.com palette: amber `#f59e0b`, orange
  `#ea580c`, sky blue `#0ea5e9` and white, with gray-900 `#111827` for text and
  dark sections. They're defined once at the top of `assets/css/styles.css`.
- **Content:** the original ultracorrit.com site. That covers the headlines,
  about text, mission, the 9 services, industry solutions, the 4-step process,
  the impact numbers, case studies, testimonials and FAQs. The contact form has
  the same fields and options as the original, and the contact details and
  social links are the original ones too.

## Project structure

```
immersive-site/
├── index.html              Home (one long page: hero, services, why us, about, solutions,
│                           process, case studies, FAQ, contact form)
├── about.html              Mission & vision, impact numbers, journey 2015–2023, leadership
│                           team, certifications & awards
├── services.html           All 9 services with full feature lists, process, pricing
│                           packages, success stories
├── solutions.html          Industry solutions, technology stack, 4-phase implementation
│                           (tabs), return on investment
├── portfolio.html          6 projects with category filters, client testimonials
├── contact.html            Contact methods (call, email, live chat, video consultation),
│                           message form, map & headquarters, locations, FAQ
├── privacy.html            Privacy Policy (original text, with an "On this page" list)
├── terms.html              Terms & Conditions (original text, with an "On this page" list)
├── README.md
└── assets/
    ├── css/styles.css      All styles, animations, responsive and reduced-motion rules
    ├── js/config.js        Settings you may change (contact form endpoint, email, subject)
    ├── js/intro.js         Loading screen: door frame draws 00→100, then opens into the site
    ├── js/stage.js         Canvas visuals: 3D network sphere (home hero), contact particles
    ├── js/main.js          Menu, reveals, tilt, timeline, counters, tabs, filters, cursor,
    │                       pop-up and contact forms
    ├── js/agent.js         "Ultra" chat assistant button (all pages, as on the original site)
    ├── js/contact-experience.js  Live chat and video consultation pop-ups (contact page)
    └── img/
        ├── logo.png, favicon.svg
        └── team/           Leadership photos, resized to 640 px JPEGs
```

Every page shares the same header, footer, loading screen, "Get a Quote" pop-up
and scripts. The Privacy and Terms wording is word-for-word the original.

The loading screen plays once per browser session (the first page a visitor
opens). Add `?intro` to any URL to see it again, for example
`http://localhost:5600/?intro`.

## Run it locally

There's nothing to install. Serve the folder with any static web server, then
open the address it prints.

With Python (already installed on most machines):

```bash
cd immersive-site
python -m http.server 5600
```

Then open http://localhost:5600

With Node.js instead:

```bash
npx serve immersive-site -l 5600
```

You can also double-click `index.html`. The page and all animations work, but
the contact form will refuse to send, because the mail service won't accept
messages from a `file://` page. Use a server when testing the form.

## Updating files

`index.html` loads the CSS and JS with a version tag (for example
`styles.css?v=10`). After you change a CSS or JS file, raise that number in
`index.html` so visitors' browsers fetch the new file instead of a cached copy.

## Deploy it online

Upload the **contents** of `immersive-site/` (index.html and the `assets`
folder) to any static host:

- **Your current hosting (cPanel / Hostinger etc.):** open File Manager, go to
  `public_html` (or a subfolder such as `public_html/new` to try it first) and
  upload the files, keeping the `assets` folder structure.
- **Netlify:** drag the `immersive-site` folder onto https://app.netlify.com/drop
- **Vercel:** `npx vercel immersive-site` and follow the prompts.
- **GitHub Pages:** push the folder to a repository and enable Pages for it.

Serve it over HTTPS (all of the hosts above do this by default).

## Contact form: what's configured and what still needs doing

Both forms (the Contact section and the "Let's talk" pop-up) check the fields
in the browser:

- First name and last name: required
- Email: required, must be a valid address
- Phone: optional, must look like a phone number if filled in
- Message: required, 10+ characters
- Organization, service interest and the newsletter box are optional, as on
  the original site

Errors appear under each field. A hidden honeypot field filters simple spam bots.

Valid enquiries are sent with FormSubmit (https://formsubmit.co), a free
service that the current ultracorrit.com contact form already uses. The address
is set in `assets/js/config.js`:

```js
formEndpoint: 'https://formsubmit.co/ajax/info@ultracorrit.com'
```

The site only says "sent" when FormSubmit confirms delivery. If FormSubmit
reports a problem, or can't be reached, the visitor sees an honest error
message plus a pre-filled "email us directly" link and the phone number.

**Required one-time step:** the first enquiry sent from the live website makes
FormSubmit email an activation link to info@ultracorrit.com. Until someone
clicks that link, enquiries are not delivered, and visitors see "This form
needs Activation". Send one test enquiry after deploying and confirm it.

Optional:

- To hide the real inbox address, FormSubmit sends a random alias with the
  activation email. Use it in `formEndpoint` instead of the email address.
- To use a different service (Formspree, Web3Forms, your own backend), change
  `formEndpoint` to its JSON endpoint. It must accept a JSON POST and reply
  with `{ "success": true }`. Otherwise adjust the check in `assets/js/main.js`
  (search for `success`).
- To switch online sending off, set `formEndpoint: ''`. Visitors are then told
  nothing was sent and are offered the email link instead.

## Animations and interactions

- **Loading screen:** the same door intro as ultracorrit.com. A wide
  rectangle draws itself in the amber-orange-sky gradient while a counter runs
  00→100, following the real page load. Then the doors open and the site
  appears. It plays on every visit, has a "Skip intro" button, and is skipped
  automatically for visitors who prefer reduced motion. To turn it off, delete
  the `#intro` block and the `intro.js` script tag in `index.html`.
- **Hero entrance** (starts once the doors open): "Leading Healthcare
  Solutions" rises in word by word and sizes itself to fit the screen. The
  text, buttons and service cards slide in one after another.
- **3D hero object:** a real six-sided glass cube in CSS 3D with a glowing
  medical cross. It spins slowly, floats, and is circled by two orbit rings in
  the brand colours. It stands on a glowing platform with floating orbs, over a
  canvas network sphere of nodes, links and travelling data packets. The whole
  scene tilts and parallaxes with the mouse.
- **Hero background:** soft drifting waves and dashed flow lines in sky, amber
  and orange, plus a "Scroll" cue with a moving dot.
- **Stats bar:** the dark bar overlapping the hero. Its counters (8+ years,
  500+ clients, 2.5M+ records coded, 99% accuracy) count up when they appear.
- **Service cards:** 3D tilt following the pointer, a light sweep across the
  artwork, a scaling icon and a sliding arrow. Clicking a card jumps to the
  form with that service pre-selected. "View All Services" reveals the other
  five services.
- **Why UltraCorr IT (dark band):** a glowing portal with an animated
  heartbeat line, a floating glass chart panel and a bobbing logo. Feature
  icons fill with the warm gradient on hover.
- **Process timeline:** a gradient line fills as you scroll and each numbered
  step lights up when the line reaches it. It runs horizontally on desktop and
  vertically on mobile.
- **Scroll reveals:** headings rise line by line from a mask, and paragraphs
  and cards fade up with small staggers.
- **Cards** (solutions, case studies, testimonials) lift on hover. Case
  studies grow a gradient bar, and FAQ answers open with a rotating icon.
- **Contact section:** a slow particle network that drifts towards the pointer.
- **Also:** a scroll progress bar, the current section highlighted in the nav,
  pill buttons with gradient fills and arrow nudges, a hamburger menu panel
  listing every section, and a custom cursor ring (mouse only).

Performance: the canvases cap pixel density and pause when off-screen or when
the tab is hidden. Animations use transforms and opacity.

## Accessibility

- Semantic landmarks (header, nav, main, section, footer), a skip link, and
  labelled form fields with `aria-invalid` and linked error messages.
- Keyboard: all links, buttons and cards are reachable, with clear focus rings.
  The pop-up traps focus, closes on Escape and returns focus to the button
  that opened it. The mobile menu has `aria-expanded` and closes on Escape.
- `prefers-reduced-motion`: animations, the cursor, the curtain and the
  reveals are turned off. Content shows immediately and the canvases draw one
  still frame.
- Body text is gray-900 or gray-600 on white. As on the original site,
  primary buttons use white text on the amber-to-orange gradient, and a few
  small labels use the brand orange.

## Links to the existing site

Privacy Policy and Terms of Service link to the existing pages on
ultracorrit.com.
