const state = {
  category: "all",
  search: "",
  selectedId: null,
  values: {}
};

const els = {
  categoryList: document.querySelector("#categoryList"),
  templateGrid: document.querySelector("#templateGrid"),
  templateCount: document.querySelector("#templateCount"),
  searchInput: document.querySelector("#searchInput"),
  categoryTitle: document.querySelector("#categoryTitle"),
  categorySubtitle: document.querySelector("#categorySubtitle"),
  emptyState: document.querySelector("#emptyState"),
  builder: document.querySelector("#builder"),
  selectedMeta: document.querySelector("#selectedMeta"),
  selectedName: document.querySelector("#selectedName"),
  selectedDescription: document.querySelector("#selectedDescription"),
  fieldForm: document.querySelector("#fieldForm"),
  contractPreview: document.querySelector("#contractPreview"),
  validationStatus: document.querySelector("#validationStatus"),
  clearBtn: document.querySelector("#clearBtn"),
  generateBtn: document.querySelector("#generateBtn"),
  copyBtn: document.querySelector("#copyBtn"),
  downloadBtn: document.querySelector("#downloadBtn"),
  printBtn: document.querySelector("#printBtn"),
  exportJsonBtn: document.querySelector("#exportJsonBtn")
};

const multilineHints = ["description", "scope", "deliverables", "policy", "rights", "terms", "clause", "responsibilities", "objectives", "schedule", "warranties", "rules", "requirements", "restrictions", "duties", "assets", "property", "services"];
const dateHints = ["date", "start", "end", "deadline", "last_day", "repayment_start", "payment_due_date"];
const moneyHints = ["amount", "cost", "fee", "salary", "rate", "rent", "deposit", "price", "payment", "stipend", "consideration", "collateral"];
const templateSlugOverrides = {
  "partnership-agreement": "business-partnership",
  "llc-operating": "llc-operating-agreement",
  "loan-agreement": "personal-loan-agreement",
  "car-sale-contract": "vehicle-sale-agreement"
};

function titleize(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function selectedTemplate() {
  return TEMPLATES.find((template) => template.id === state.selectedId) || null;
}

function templateSlug(template) {
  return templateSlugOverrides[template.id] || template.id;
}

function categoryCounts() {
  const counts = { all: TEMPLATES.length, featured: TEMPLATES.filter((template) => template.featured).length };
  for (const template of TEMPLATES) {
    counts[template.category] = (counts[template.category] || 0) + 1;
  }
  return counts;
}

function filteredTemplates() {
  const query = state.search.trim().toLowerCase();
  return TEMPLATES.filter((template) => {
    const matchesCategory = state.category === "all" || (state.category === "featured" ? template.featured : template.category === state.category);
    const haystack = [template.name, template.description, template.category, ...template.fields].join(" ").toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function validateTemplates() {
  const ids = new Set();
  const issues = [];
  for (const template of TEMPLATES) {
    if (ids.has(template.id)) issues.push(`Duplicate template id: ${template.id}`);
    ids.add(template.id);
    if (!template.fields.length) issues.push(`${template.name} has no fields`);
    if (!CATEGORY_LABELS[template.category]) issues.push(`${template.name} has unknown category: ${template.category}`);
  }
  if (issues.length) {
    console.warn("Template validation issues:", issues);
  }
  return issues;
}

function renderCategories() {
  const counts = categoryCounts();
  const categories = ["all", "featured", ...Object.keys(CATEGORY_LABELS).filter((category) => !["all", "featured"].includes(category))];
  els.categoryList.innerHTML = categories.map((category) => `
    <button class="category-button ${state.category === category ? "active" : ""}" type="button" data-category="${category}">
      <span>${escapeHtml(CATEGORY_LABELS[category])}</span>
      <span>${counts[category] || 0}</span>
    </button>
  `).join("");
}

function renderTemplates() {
  const templates = filteredTemplates();
  els.templateCount.textContent = TEMPLATES.length;
  els.categoryTitle.textContent = CATEGORY_LABELS[state.category];
  els.categorySubtitle.textContent = `${templates.length} matching template${templates.length === 1 ? "" : "s"}`;

  if (!templates.length) {
    els.templateGrid.innerHTML = `<div class="empty-state"><h2>No matches</h2><p>Try another search or category.</p></div>`;
    return;
  }

  els.templateGrid.innerHTML = templates.map((template) => `
    <a class="template-card ${state.selectedId === template.id ? "active" : ""}" href="templates/${templateSlug(template)}/" data-template-id="${template.id}">
      <div class="card-top">
        <span class="template-icon">${escapeHtml(template.icon)}</span>
        <span class="badge">${escapeHtml(template.searches)}</span>
      </div>
      <div class="badge-row">
        ${template.featured ? `<span class="badge">Featured</span>` : ""}
        ${template.popular ? `<span class="badge">Popular</span>` : ""}
        ${template.premium ? `<span class="badge premium-badge">Premium</span>` : ""}
        <span class="badge">${escapeHtml(CATEGORY_LABELS[template.category])}</span>
      </div>
      <h3>${escapeHtml(template.name)}</h3>
      <p>${escapeHtml(template.description)}</p>
      <footer>
        <span>${template.fields.length} fields</span>
        <span>Open Page →</span>
      </footer>
    </a>
  `).join("");
}

function inputType(field) {
  if (dateHints.some((hint) => field.includes(hint))) return "date";
  if (moneyHints.some((hint) => field.includes(hint))) return "text";
  if (field.includes("email")) return "email";
  return "text";
}

function renderBuilder() {
  const template = selectedTemplate();
  if (!els.emptyState || !els.builder) return;
  els.emptyState.classList.toggle("hidden", Boolean(template));
  els.builder.classList.toggle("hidden", !template);
  if (!template) return;
  updatePageSeo(template);

  state.values[template.id] ||= {};
  els.selectedMeta.innerHTML = `
    <span class="badge">${escapeHtml(template.icon)} ${escapeHtml(CATEGORY_LABELS[template.category])}</span>
    <span class="badge">${escapeHtml(template.searches)}</span>
    ${template.featured ? `<span class="badge">Featured</span>` : ""}
    ${template.premium ? `<span class="badge premium-badge">Premium</span>` : ""}
  `;
  els.selectedName.textContent = template.name;
  els.selectedDescription.textContent = template.description;
  els.fieldForm.innerHTML = template.fields.map((field) => {
    const value = state.values[template.id][field] || "";
    const isWide = multilineHints.some((hint) => field.includes(hint));
    if (isWide) {
      return `
        <div class="field wide">
          <label for="${field}">${escapeHtml(titleize(field))}</label>
          <textarea id="${field}" name="${field}" data-field="${field}" required>${escapeHtml(value)}</textarea>
        </div>
      `;
    }
    return `
      <div class="field">
        <label for="${field}">${escapeHtml(titleize(field))}</label>
        <input id="${field}" name="${field}" data-field="${field}" type="${inputType(field)}" value="${escapeHtml(value)}" required />
      </div>
    `;
  }).join("");
  updatePreview();
}

function selectTemplateById(templateId) {
  if (!TEMPLATES.some((template) => template.id === templateId)) return;
  state.selectedId = templateId;
  renderTemplates();
  renderBuilder();
}

function setDashboardCategory(category) {
  if (!CATEGORY_LABELS[category]) return;
  state.category = category;
  renderCategories();
  renderTemplates();
}

function setDashboardSearch(query) {
  state.search = query || "";
  els.searchInput.value = state.search;
  renderTemplates();
}

function updatePageSeo(template) {
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

function fieldValue(field) {
  const template = selectedTemplate();
  return state.values[template.id]?.[field]?.trim() || "";
}

function partiesLine(template) {
  const partyFields = template.fields.filter((field) => field.includes("name") || field.includes("party") || field.includes("client") || field.includes("tenant") || field.includes("borrower") || field.includes("lender") || field.includes("employer") || field.includes("employee"));
  const values = partyFields.map((field) => `${titleize(field)}: ${fieldValue(field)}`);
  return values.length ? values.join("\n") : "The parties are identified by the completed fields below.";
}

function partyRows(template) {
  const partyFields = template.fields.filter((field) => field.includes("name") || field.includes("address") || field.includes("company") || field.includes("party") || field.includes("client") || field.includes("tenant") || field.includes("borrower") || field.includes("lender") || field.includes("employer") || field.includes("employee") || field.includes("contractor") || field.includes("seller") || field.includes("buyer") || field.includes("owner") || field.includes("renter") || field.includes("vendor"));
  return partyFields.map((field) => ({
    label: titleize(field),
    value: fieldValue(field)
  }));
}

function categoryClauses(template) {
  const clauses = {
    freelance: "The service provider will perform the services described in this agreement in a professional manner and will deliver the agreed work according to the stated schedule.",
    employment: "The parties acknowledge that this agreement describes the work relationship, compensation, confidentiality expectations, and separation procedures applicable to the role.",
    rental: "The tenant will use the property only for the permitted purpose and will comply with the rent, deposit, maintenance, and notice terms stated in this agreement.",
    business: "The parties will cooperate in good faith, keep accurate records where required, and perform their business obligations according to the commercial terms below.",
    ip: "All ownership, license, assignment, permitted use, restriction, royalty, and confidentiality terms are limited to the rights expressly described in this agreement.",
    personal: "The parties intend this document to record their personal arrangement clearly, including payment, custody, property, household, or support terms as applicable.",
    construction: "The contractor will complete the described work using suitable materials, coordinate change orders in writing, and follow applicable site and insurance requirements.",
    events: "The vendor will provide the agreed event services at the stated time and location, subject to the payment, deposit, cancellation, and logistics terms below.",
    vehicle: "The parties agree to the vehicle terms below, including condition, payment, dates, insurance, mileage, and any as-is or rental obligations."
  };
  return clauses[template.category] || "The parties agree to the terms described below.";
}

function agreementSections(template) {
  return [
    {
      heading: "4. Scope, Performance, and Cooperation",
      paragraphs: [
        categoryClauses(template),
        "Each party will cooperate in good faith, provide information reasonably required to complete the arrangement, and perform its obligations in a timely, professional, and commercially reasonable manner."
      ]
    },
    {
      heading: "5. Payment, Fees, and Timing",
      paragraphs: [
        "Any payment, fee, deposit, rent, salary, rate, schedule, milestone, deadline, start date, end date, or delivery date listed in the Key Terms section is incorporated into this agreement. Unless otherwise stated, payments should be made in cleared funds by the due date and disputed amounts should be raised promptly in writing."
      ]
    },
    {
      heading: "6. Confidentiality, Records, and Ownership",
      paragraphs: [
        "The parties will protect confidential information received under this agreement and use it only for the agreed purpose. Ownership, license, access, usage, transfer, and recordkeeping terms are limited to the rights expressly stated in this document or any written amendment."
      ]
    },
    {
      heading: "7. Changes, Cancellation, and Termination",
      paragraphs: [
        "Any material change to scope, price, timing, rights, responsibilities, cancellation terms, or termination rights should be made in writing and accepted by all required parties. Termination does not affect payment obligations, confidentiality duties, accrued rights, or provisions intended to survive."
      ]
    },
    {
      heading: "8. Representations and Compliance",
      paragraphs: [
        "Each party represents that it has authority to enter into this agreement and will comply with applicable laws, permits, policies, and professional standards. Any warranties, limitations of liability, indemnities, dispute terms, or governing law requirements should be reviewed before signing."
      ]
    }
  ];
}

function generateContractData() {
  const template = selectedTemplate();
  if (!template) return null;
  return {
    title: template.name,
    subtitle: "",
    notice: "This document is a professionally structured template for informational purposes. It should be reviewed and adapted for the governing jurisdiction, transaction value, regulatory requirements, and the parties' specific circumstances before signature.",
    parties: partyRows(template),
    background: [
      `The parties intend to enter into this ${template.name} to document their respective rights, duties, commercial expectations, approval requirements, payment obligations, risk allocation, and signature-ready terms. This agreement concerns ${template.description.toLowerCase()}`
    ],
    keyTerms: template.fields.map((field) => ({
      label: titleize(field),
      value: fieldValue(field)
    })),
    sections: agreementSections(template),
    signatures: ["Party Signature", "Party Signature"]
  };
}

function generateContract() {
  const template = selectedTemplate();
  if (!template) return "";
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
    </div>

    <section>
      <h2>Important Notice</h2>
      <p>${escapeHtml(data.notice)}</p>
    </section>

    <section>
      <h2>1. Parties</h2>
      <div class="contract-field-list">${parties}</div>
    </section>

    <section>
      <h2>2. Background and Purpose</h2>
      ${data.background.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </section>

    <section>
      <h2>3. Key Terms</h2>
      <div class="contract-term-list">${terms}</div>
    </section>

    ${sections}

    <section>
      <h2>Signatures</h2>
      <div class="signature-grid">
        <div><span>Party Signature</span><strong>Date</strong></div>
        <div><span>Party Signature</span><strong>Date</strong></div>
      </div>
    </section>
  </article>`;
}

function missingFields() {
  const template = selectedTemplate();
  if (!template) return [];
  return template.fields.filter((field) => !state.values[template.id]?.[field]?.trim());
}

function updatePreview() {
  const missing = missingFields();
  els.contractPreview.innerHTML = generateContract();
  els.contractPreview.setAttribute("contenteditable", "true");
  els.contractPreview.setAttribute("aria-label", "Editable contract preview");
  els.validationStatus.textContent = missing.length ? `${missing.length} field${missing.length === 1 ? "" : "s"} missing` : "Ready to export";
  els.validationStatus.classList.toggle("ready", missing.length === 0);
}

async function printContract() {
  const template = selectedTemplate();
  const missing = missingFields();
  if (missing.length) {
    els.fieldForm?.reportValidity?.();
    els.validationStatus.textContent = `Complete all ${missing.length} required field${missing.length === 1 ? "" : "s"} before downloading`;
    els.validationStatus.classList.remove("ready");
    return;
  }
  await window.downloadContractPdfFromElement?.(els.contractPreview, template?.name || "contract");
}

function downloadText(filename, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function init() {
  validateTemplates();
  renderCategories();
  renderTemplates();

  els.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderTemplates();
  });

  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderTemplates();
  });

  els.fieldForm?.addEventListener("input", (event) => {
    const field = event.target.dataset.field;
    const template = selectedTemplate();
    if (!field || !template) return;
    state.values[template.id][field] = event.target.value;
    updatePreview();
  });

  els.clearBtn?.addEventListener("click", () => {
    const template = selectedTemplate();
    if (!template) return;
    state.values[template.id] = {};
    renderBuilder();
  });

  els.generateBtn?.addEventListener("click", updatePreview);
  els.copyBtn?.addEventListener("click", async () => {
    await copyText(els.contractPreview.textContent);
    els.copyBtn.textContent = "Copied";
    window.setTimeout(() => (els.copyBtn.textContent = "Copy"), 1200);
  });
  els.downloadBtn?.addEventListener("click", () => {
    updatePreview();
    printContract();
  });
  els.printBtn?.addEventListener("click", printContract);
  els.exportJsonBtn?.addEventListener("click", () => {
    downloadText("contract-templates.json", JSON.stringify(TEMPLATES, null, 2), "application/json");
  });

  window.contractDashboard = {
    showCategory: setDashboardCategory,
    search: setDashboardSearch,
    selectTemplate: selectTemplateById
  };
}

init();
