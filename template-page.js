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

  function partyRows() {
    return template.fields
      .filter((field) => field.includes("name") || field.includes("address") || field.includes("company") || field.includes("party") || field.includes("client") || field.includes("tenant") || field.includes("borrower") || field.includes("lender") || field.includes("employer") || field.includes("employee") || field.includes("contractor") || field.includes("seller") || field.includes("buyer") || field.includes("owner") || field.includes("renter") || field.includes("vendor"))
      .map((field) => ({
        label: titleize(field),
        value: fieldValue(field)
      }));
  }

  function generateContractData() {
    return {
      title: template.name,
      subtitle: "Professional Agreement Template",
      notice: "This document is a professionally structured template for informational purposes. It should be reviewed and adapted for the governing jurisdiction, transaction value, industry requirements, and the parties' specific facts before signature.",
      parties: partyRows(),
      background: [
        `The parties intend to use this ${template.name} to record the essential business, legal, financial, operational, and signature-ready terms for ${template.description.toLowerCase()}.`
      ],
      keyTerms: template.fields.map((field) => ({
        label: titleize(field),
        value: fieldValue(field)
      })),
      sections: [
        {
          heading: "4. Scope, Performance, and Cooperation",
          paragraphs: [
            "Each party will perform its responsibilities in good faith and within the timing, payment, ownership, confidentiality, approval, delivery, and cancellation terms stated in this agreement."
          ]
        },
        {
          heading: "5. Payment, Records, and Cooperation",
          paragraphs: [
            "Payment obligations, deposits, schedules, rates, reimbursements, and recordkeeping duties should be handled according to the completed terms. The parties will cooperate reasonably and provide information needed to perform the agreement."
          ]
        },
        {
          heading: "6. Confidentiality and Ownership",
          paragraphs: [
            "Confidential information should be protected and used only for the purpose of this agreement. Ownership, license, access, transfer, and usage rights are limited to the rights expressly stated in the completed terms."
          ]
        },
        {
          heading: "7. Changes and Termination",
          paragraphs: [
            "Changes to scope, price, deadlines, rights, obligations, cancellation terms, or termination rights should be documented in writing and accepted by the parties."
          ]
        }
      ],
      signatures: ["Party Signature", "Party Signature"]
    };
  }

  function generateContract() {
    const data = generateContractData();
    const parties = data.parties.length
      ? data.parties.map((row) => `<p><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</p>`).join("")
      : "<p>The parties are identified by the completed fields in this agreement.</p>";
    const terms = data.keyTerms.map((row, index) => `<p><strong>${index + 1}. ${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</p>`).join("");
    const sections = data.sections.map((section) => `
      <section>
        <h2>${escapeHtml(section.heading)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </section>
    `).join("");
    return `<article class="contract-document">
      <div class="contract-title">
        <h1>${escapeHtml(data.title)}</h1>
        <p>${escapeHtml(data.subtitle)}</p>
      </div>
      <section><h2>Important Notice</h2><p>${escapeHtml(data.notice)}</p></section>
      <section><h2>1. Parties</h2><div class="contract-field-list">${parties}</div></section>
      <section><h2>2. Background and Purpose</h2>${data.background.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>
      <section><h2>3. Key Terms</h2><div class="contract-term-list">${terms}</div></section>
      ${sections}
      <section><h2>Signatures</h2><div class="signature-grid"><div><span>Party Signature</span><strong>Date</strong></div><div><span>Party Signature</span><strong>Date</strong></div></div></section>
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
