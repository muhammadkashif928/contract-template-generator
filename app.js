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
  const title = `Free ${template.name} — Download PDF or Word | Contract Generator`;
  const description = `Generate a free ${template.name} and download as PDF or Word instantly. Fill in your details and get a professional ${template.name} in seconds. No signup required.`;
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

function generateContract() {
  const template = selectedTemplate();
  if (!template) return "";
  return window.ContractEngine.renderHtml(template, (field) => state.values[template.id]?.[field]?.trim() || "");
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
