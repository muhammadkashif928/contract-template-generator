(function () {
  const page = document.querySelector("[data-template-page]");
  if (!page || typeof TEMPLATES === "undefined") return;

  const templateId = page.dataset.templatePage;
  const template = TEMPLATES.find((item) => item.id === templateId);
  if (!template) return;

  const values = {};
  const multilineHints = ["description", "scope", "deliverables", "policy", "rights", "terms", "clause", "responsibilities", "objectives", "schedule", "warranties", "rules", "requirements", "restrictions", "duties", "assets", "property", "services"];
  const dateHints = ["date", "start", "end", "deadline", "last_day", "repayment_start", "payment_due_date"];

  function titleize(value) {
    return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function fieldValue(field) {
    return values[field]?.trim() || `[${titleize(field)}]`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function inputType(field) {
    return dateHints.some((hint) => field.includes(hint)) ? "date" : "text";
  }

  function generateContract() {
    const partyFields = template.fields.filter((field) => field.includes("name") || field.includes("party") || field.includes("client") || field.includes("tenant") || field.includes("borrower") || field.includes("lender") || field.includes("employer") || field.includes("employee")).slice(0, 4);
    const parties = partyFields.length ? partyFields.map((field) => `<tr><th>${escapeHtml(titleize(field))}</th><td>${escapeHtml(fieldValue(field))}</td></tr>`).join("") : `<tr><td colspan="2">The parties are identified by the completed fields in this agreement.</td></tr>`;
    const terms = template.fields.map((field, index) => `<tr><td>${index + 1}</td><th>${escapeHtml(titleize(field))}</th><td>${escapeHtml(fieldValue(field))}</td></tr>`).join("");
    return `<article class="contract-document">
      <div class="contract-title">
        <h1>${escapeHtml(template.name)}</h1>
        <p>Professional Agreement Template</p>
      </div>
      <section><h2>Important Notice</h2><p>This document is a professionally structured template for informational purposes. It should be reviewed and adapted for the governing jurisdiction, transaction value, industry requirements, and the parties' specific facts before signature.</p></section>
      <section><h2>1. Parties</h2><table class="contract-table"><tbody>${parties}</tbody></table></section>
      <section><h2>2. Key Terms</h2><table class="contract-table key-terms"><thead><tr><th>No.</th><th>Term</th><th>Details</th></tr></thead><tbody>${terms}</tbody></table></section>
      <section><h2>3. Scope and Performance</h2><p>Each party will perform its responsibilities in good faith and within the timing, payment, ownership, confidentiality, approval, delivery, and cancellation terms stated above.</p></section>
      <section><h2>4. Payment, Records, and Cooperation</h2><p>Payment obligations, deposits, schedules, rates, reimbursements, and recordkeeping duties should be handled according to the completed terms. The parties will cooperate reasonably and provide information needed to perform the agreement.</p></section>
      <section><h2>5. Confidentiality and Ownership</h2><p>Confidential information should be protected and used only for the purpose of this agreement. Ownership, license, access, transfer, and usage rights are limited to the rights expressly stated in the completed terms.</p></section>
      <section><h2>6. Changes and Termination</h2><p>Changes to scope, price, deadlines, rights, obligations, cancellation terms, or termination rights should be documented in writing and accepted by the parties.</p></section>
      <section><h2>7. Signatures</h2><div class="signature-grid"><div><span>Party Signature</span><strong>Date</strong></div><div><span>Party Signature</span><strong>Date</strong></div></div></section>
    </article>`;
  }

  function renderForm() {
    const form = document.querySelector("#templateFieldForm");
    if (!form) return;
    form.innerHTML = template.fields.map((field) => {
      const wide = multilineHints.some((hint) => field.includes(hint));
      if (wide) {
        return `<div class="field wide"><label for="${field}">${titleize(field)}</label><textarea id="${field}" data-field="${field}" required></textarea></div>`;
      }
      return `<div class="field"><label for="${field}">${titleize(field)}</label><input id="${field}" data-field="${field}" type="${inputType(field)}" required /></div>`;
    }).join("");
  }

  function updatePreview() {
    const preview = document.querySelector("#templatePreview");
    const status = document.querySelector("#templateStatus");
    if (!preview || !status) return;
    const missing = template.fields.filter((field) => !values[field]?.trim()).length;
    preview.innerHTML = generateContract();
    status.textContent = missing ? `${missing} fields remaining` : "Ready to download";
    status.classList.toggle("ready", missing === 0);
  }

  function printPdf() {
    const originalTitle = document.title;
    document.title = template.name;
    updatePreview();
    window.print();
    window.setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  }

  function updateDynamicSeo() {
    const title = `Free ${template.name} — Download PDF | Contract Generator`;
    const description = `Generate a free ${template.name} and download as PDF instantly. Fill in your details and get a professional ${template.name} in seconds. No signup required.`;
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      const node = document.querySelector(selector);
      if (node) node.setAttribute("content", title);
    }
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      const node = document.querySelector(selector);
      if (node) node.setAttribute("content", description);
    }
  }

  renderForm();
  updateDynamicSeo();
  updatePreview();

  document.querySelector("#templateFieldForm")?.addEventListener("input", (event) => {
    const field = event.target.dataset.field;
    if (!field) return;
    values[field] = event.target.value;
    updatePreview();
  });
  document.querySelector("#downloadPdfBtn")?.addEventListener("click", printPdf);
})();
