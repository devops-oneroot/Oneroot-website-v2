oneroot website - upload-ready files
=====================================

Upload EVERYTHING in this folder (the .html files, site.js and the assets folder)
to the root of your web hosting (for example public_html on cPanel/Hostinger),
keeping the folder structure exactly as it is.

Pages
  index.html       Home
  store.html       Store
  fyto.html        fyto
  trade.html       Trade
  technology.html  Technology
  careers.html     Careers

No build step. Hosted on Vercel; the only server code is api/enquiry.js
(the store page enquiry form).

Before going public
  1. Fonts: Gelica, IvyPresto and Neue Haas in /assets are DEMO/TRIAL files.
     Replace them with licensed webfont files (same file names) before launch.
  2. Map on careers.html: check the India outline against the official
     Survey of India map.
  3. The brand enquiry form on store.html and the Open roles list on careers.html
     use the live OneRoot backend (site.js: https://contract-farming-backend-v2-lra6.onrender.com).
     Enquiries are emailed to procurement@oneroot.farm through Brevo (keys set on
     the backend). Roles are managed in the dashboard under Management > Jobs.
