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
            <div class="footer-brand-row"><img class="brand-logo" src="${base}contract_generator_logo_transparent.png" alt="Contract Generator" /></div>
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

  function cookieBanner() {
    return `
      <div id="cookie-consent" class="cookie-banner" style="display:none">
        <div class="cookie-inner">
          <div>
            <p><strong>🍪 We use cookies for analytics and advertising.</strong></p>
            <p>Your contract data is never stored — it stays in your browser.</p>
          </div>
          <div class="cookie-actions">
            <button class="cookie-essential" type="button" data-cookie-choice="essential">Essential Only</button>
            <button class="cookie-accept" type="button" data-cookie-choice="all">Accept All</button>
          </div>
        </div>
      </div>`;
  }

  function initCookieBanner() {
    const banner = document.querySelector("#cookie-consent");
    if (!banner || localStorage.getItem("cookieConsent")) return;
    window.setTimeout(() => {
      banner.style.display = "block";
      requestAnimationFrame(() => banner.classList.add("visible"));
    }, 1500);
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cookie-choice]");
      if (!button) return;
      localStorage.setItem("cookieConsent", button.dataset.cookieChoice);
      banner.classList.remove("visible");
      window.setTimeout(() => {
        banner.style.display = "none";
      }, 420);
    });
  }

  function initFooter() {
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
