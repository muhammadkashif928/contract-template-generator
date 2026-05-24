(function () {
  const currentYear = "2026";

  function prefix() {
    const script = document.querySelector('script[src$="site.js"]');
    if (!script) return "";
    const src = script.getAttribute("src") || "";
    return src.endsWith("site.js") ? src.slice(0, -"site.js".length) : "";
  }

  function footerLinks(base) {
    return `
      <div class="legal-disclaimer-bar">
        ⚠️ Legal Disclaimer: The contract templates provided on this website are for general informational purposes only and do not constitute legal advice. Always consult a qualified attorney before signing any legal agreement.
      </div>
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-column">
            <div class="footer-brand-row">
              <img class="brand-icon" src="${base}favicon.io.png" alt="" aria-hidden="true" />
              <span class="brand-copy"><strong>Contract Generator</strong><small>Free Legal Templates</small></span>
            </div>
            <p class="footer-tagline">Free professional contract templates. Download as PDF instantly.</p>
            <p class="footer-small">Not a law firm. Templates are for informational purposes only.</p>
          </div>
          <div class="footer-column">
            <h2>Popular Templates</h2>
            <a href="${base}templates/freelance-contract/">Freelance Service Contract</a>
            <a href="${base}templates/employment-contract/">Employment Contract</a>
            <a href="${base}templates/nda-agreement/">NDA Agreement</a>
            <a href="${base}templates/residential-lease/">Residential Lease Agreement</a>
            <a href="${base}templates/business-partnership/">Business Partnership Agreement</a>
            <a href="${base}templates/independent-contractor/">Independent Contractor Agreement</a>
            <a href="${base}templates/">View All Templates →</a>
          </div>
          <div class="footer-column">
            <h2>Browse By Type</h2>
            <a href="${base}templates/">Freelance & Service</a>
            <a href="${base}templates/">Employment</a>
            <a href="${base}templates/">Real Estate & Rental</a>
            <a href="${base}templates/">Business</a>
            <a href="${base}templates/">Intellectual Property</a>
            <a href="${base}templates/">Personal & Loans</a>
            <a href="${base}templates/">Construction & Trades</a>
            <a href="${base}templates/">Events</a>
          </div>
          <div class="footer-column">
            <h2>Company</h2>
            <a href="${base}about.html">About Us</a>
            <a href="${base}blog/">Blog</a>
            <a href="${base}contact.html">Contact</a>
            <a href="${base}privacy-policy.html">Privacy Policy</a>
            <a href="${base}terms.html">Terms of Service</a>
            <a href="${base}sitemap.xml">Sitemap</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© ${currentYear} Contract Generator. All Rights Reserved.</div>
          <div class="footer-center">🔒 SSL Secured | ⚡ Free Forever | 📄 500+ Templates</div>
          <div class="footer-social footer-legal-links" aria-label="Legal links">
            <a href="${base}terms.html#disclaimer">Disclaimer</a>
            <a href="${base}terms.html">Terms & Conditions</a>
          </div>
        </div>
      </footer>`;
  }

  function initLoader() {
    const loader = document.querySelector("#site-loader");
    if (!loader) return;

    const hide = () => {
      loader.classList.add("loaded");
      window.setTimeout(() => loader.remove(), 520);
    };

    if (document.readyState === "complete") {
      window.setTimeout(hide, 280);
    } else {
      window.addEventListener("load", () => window.setTimeout(hide, 280), { once: true });
      window.setTimeout(hide, 3500);
    }
  }

  function cookieBanner() {
    return `
      <div id="cookie-consent" class="cookie-banner" style="display:none" role="dialog" aria-live="polite" aria-label="Cookie preferences">
        <div class="cookie-panel">
          <div class="cookie-copy">
            <span class="cookie-label">Privacy Preferences</span>
            <h2>We respect your privacy.</h2>
            <p>We use cookies to keep the site reliable, understand anonymous traffic, and support advertising. Your contract form data is processed in your browser and is never stored by us.</p>
          </div>
          <div class="cookie-options" aria-label="Cookie categories">
            <label class="cookie-option disabled">
              <span><strong>Strictly Necessary</strong><small>Required for site security, preferences, and core functionality.</small></span>
              <input type="checkbox" checked disabled />
            </label>
            <label class="cookie-option">
              <span><strong>Analytics</strong><small>Helps us measure page views and improve template pages.</small></span>
              <input type="checkbox" data-cookie-toggle="analytics" />
            </label>
            <label class="cookie-option">
              <span><strong>Advertising</strong><small>Allows relevant ads and measurement when AdSense is enabled.</small></span>
              <input type="checkbox" data-cookie-toggle="advertising" />
            </label>
          </div>
          <div class="cookie-actions">
            <button class="cookie-essential" type="button" data-cookie-action="reject">Reject Optional</button>
            <button class="cookie-save" type="button" data-cookie-action="save">Save Preferences</button>
            <button class="cookie-accept" type="button" data-cookie-action="accept">Accept All</button>
          </div>
          <p class="cookie-note">You can update browser cookie settings anytime. See our <a href="${prefix()}privacy-policy.html">Privacy Policy</a>.</p>
        </div>
      </div>`;
  }

  function initCookieBanner() {
    const banner = document.querySelector("#cookie-consent");
    if (!banner || localStorage.getItem("cookieConsentV2")) return;
    window.setTimeout(() => {
      banner.style.display = "block";
      requestAnimationFrame(() => banner.classList.add("visible"));
    }, 1500);

    const save = (settings) => {
      localStorage.setItem("cookieConsentV2", JSON.stringify({
        necessary: true,
        analytics: Boolean(settings.analytics),
        advertising: Boolean(settings.advertising),
        savedAt: new Date().toISOString()
      }));
      localStorage.setItem("cookieConsent", settings.analytics && settings.advertising ? "all" : "custom");
      banner.classList.remove("visible");
      window.setTimeout(() => {
        banner.style.display = "none";
      }, 420);
    };

    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cookie-action]");
      if (!button) return;
      const action = button.dataset.cookieAction;
      const analytics = banner.querySelector('[data-cookie-toggle="analytics"]')?.checked;
      const advertising = banner.querySelector('[data-cookie-toggle="advertising"]')?.checked;
      if (action === "accept") save({ analytics: true, advertising: true });
      if (action === "reject") save({ analytics: false, advertising: false });
      if (action === "save") save({ analytics, advertising });
    });
  }

  function initFooter() {
    initLoader();
    const base = prefix();
    const mount = document.querySelector("[data-site-footer]");
    if (mount) mount.innerHTML = footerLinks(base);
    document.body.insertAdjacentHTML("beforeend", cookieBanner());
    initCookieBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooter);
  } else {
    initFooter();
  }
})();
