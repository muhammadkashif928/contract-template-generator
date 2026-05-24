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
    return values[field]?.trim() || "";
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
    return window.ContractEngine.renderHtml(template, fieldValue);
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
    preview.setAttribute("contenteditable", "true");
    preview.setAttribute("aria-label", "Editable contract preview");
    status.textContent = missing ? `${missing} fields remaining` : "Ready to download";
    status.classList.toggle("ready", missing === 0);
  }

  async function printPdf() {
    const missing = template.fields.filter((field) => !values[field]?.trim()).length;
    if (missing) {
      document.querySelector("#templateFieldForm")?.reportValidity?.();
      const status = document.querySelector("#templateStatus");
      if (status) {
        status.textContent = `Complete all ${missing} required field${missing === 1 ? "" : "s"} before downloading`;
        status.classList.remove("ready");
      }
      return;
    }
    await window.downloadContractPdfFromElement?.(document.querySelector("#templatePreview"), template.name);
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
