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

  function inputType(field) {
    return dateHints.some((hint) => field.includes(hint)) ? "date" : "text";
  }

  function generateContract() {
    const terms = template.fields.map((field, index) => `${index + 1}. ${titleize(field)}: ${fieldValue(field)}`).join("\n");
    return `${template.name.toUpperCase()}

This draft is generated for informational purposes only and should be reviewed before signing.

1. Parties
The parties agree to enter into this ${template.name} according to the information completed below.

2. Key Terms
${terms}

3. Performance
Each party will perform its responsibilities in good faith and within the timing, payment, ownership, confidentiality, and cancellation terms stated above.

4. Changes
Changes to scope, price, deadlines, rights, or obligations should be documented in writing and accepted by the parties.

5. Legal Review
This template is not legal advice. Consult a qualified attorney before signing any legal agreement.

Signatures

Party Signature: _______________________________  Date: _______________

Party Signature: _______________________________  Date: _______________`;
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
    preview.textContent = generateContract();
    status.textContent = missing ? `${missing} fields remaining` : "Ready to download";
    status.classList.toggle("ready", missing === 0);
  }

  function printPdf() {
    updatePreview();
    window.print();
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
