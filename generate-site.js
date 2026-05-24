const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE_URL = "https://contract-template-generator-lake.vercel.app";
const source = fs.readFileSync("templates.js", "utf8") + "\nthis.TEMPLATES = TEMPLATES; this.CATEGORY_LABELS = CATEGORY_LABELS;";
const context = {};
vm.createContext(context);
vm.runInContext(source, context);

const TEMPLATES = context.TEMPLATES;
const CATEGORY_LABELS = context.CATEGORY_LABELS;

const topSlugMap = {
  "freelance-contract": "freelance-contract",
  "nda-agreement": "nda-agreement",
  "employment-contract": "employment-contract",
  "residential-lease": "residential-lease",
  "independent-contractor": "independent-contractor",
  "partnership-agreement": "business-partnership",
  "llc-operating": "llc-operating-agreement",
  "loan-agreement": "personal-loan-agreement",
  "photography-contract": "photography-contract",
  "car-sale-contract": "vehicle-sale-agreement"
};

const topTemplateIds = Object.keys(topSlugMap);

const blogPosts = [
  {
    slug: "how-to-write-freelance-contract",
    category: "Freelance",
    title: "How to Write a Freelance Contract That Protects You (2026 Guide)",
    keyword: "how to write a freelance contract",
    description: "Learn how to write a freelance contract with scope, payment, revisions, IP rights and client protections. Free template included.",
    readTime: "7 min read",
    relatedTemplate: "freelance-contract",
    sections: [
      "Why Every Freelancer Needs a Contract",
      "The 8 Essential Clauses of a Freelance Contract",
      "Scope of Work — Be Specific",
      "Payment Terms That Protect You",
      "How to Handle Revisions and Changes",
      "Intellectual Property and Ownership",
      "What to Do When a Client Won't Sign",
      "Download Our Free Freelance Contract Template"
    ]
  },
  {
    slug: "nda-vs-non-compete",
    category: "Business",
    title: "NDA vs Non-Compete Agreement: Key Differences Explained (2026)",
    keyword: "nda vs non compete",
    description: "Understand NDA vs non-compete agreements, when to use each document, enforceability risks and how to protect business information.",
    readTime: "6 min read",
    relatedTemplate: "nda-agreement",
    sections: [
      "What Is an NDA (Non-Disclosure Agreement)?",
      "What Is a Non-Compete Agreement?",
      "Key Differences at a Glance",
      "When to Use an NDA",
      "When to Use a Non-Compete",
      "Can You Use Both Together?",
      "Are Non-Competes Enforceable?",
      "Download Free NDA and Non-Compete Templates"
    ]
  },
  {
    slug: "what-makes-contract-legally-binding",
    category: "Contracts",
    title: "What Makes a Contract Legally Binding? 6 Essential Elements",
    keyword: "what makes a contract legally binding",
    description: "Discover what makes a contract legally binding, including offer, acceptance, consideration, capacity, consent and lawful purpose.",
    readTime: "8 min read",
    relatedTemplate: "service-agreement",
    sections: [
      "The 6 Elements of a Legally Binding Contract",
      "1. Offer — One Party Makes a Clear Proposal",
      "2. Acceptance — The Other Party Agrees",
      "3. Consideration — Something of Value Exchanged",
      "4. Capacity — Both Parties Must Be Competent",
      "5. Mutual Consent — No Force or Fraud",
      "6. Legality — The Purpose Must Be Legal",
      "Common Reasons Contracts Are Not Enforceable",
      "Does a Contract Need to Be in Writing?"
    ]
  },
  {
    slug: "independent-contractor-vs-employee",
    category: "Employment",
    title: "Independent Contractor vs Employee: Legal Differences (2026)",
    keyword: "independent contractor vs employee",
    description: "Compare independent contractor vs employee rules, IRS factors, tax treatment, control tests and worker misclassification risks.",
    readTime: "7 min read",
    relatedTemplate: "independent-contractor",
    sections: [
      "The Core Legal Difference",
      "How the IRS Defines Independent Contractors",
      "Behavioral Control — Who Directs the Work?",
      "Financial Control — How Is Payment Structured?",
      "Type of Relationship",
      "Tax Implications for Each Classification",
      "Risks of Misclassifying Workers",
      "When to Use an Independent Contractor Agreement"
    ]
  },
  {
    slug: "free-rental-agreement-guide",
    category: "Real Estate",
    title: "Free Rental Agreement Template: Complete Landlord Guide (2026)",
    keyword: "free rental agreement",
    description: "Use this free rental agreement guide to understand lease terms, deposits, tenant rules, late fees, pet policies and landlord protections.",
    readTime: "9 min read",
    relatedTemplate: "residential-lease",
    sections: [
      "What Is a Rental Agreement?",
      "Lease Agreement vs Rental Agreement — The Difference",
      "What Every Rental Agreement Must Include",
      "Security Deposit Rules and Limits",
      "Tenant Rights You Must Include",
      "How to Handle Late Payments in Your Agreement",
      "Pet Policies and Additional Clauses",
      "Month-to-Month vs Fixed Term Lease",
      "Download Our Free Rental Agreement Template"
    ]
  }
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function write(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content);
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugFor(template) {
  return topSlugMap[template.id] || template.id;
}

function rootPrefix(depth) {
  return "../".repeat(depth);
}

function analyticsPlaceholders() {
  return `<!-- Google Analytics — Replace GA_MEASUREMENT_ID with your actual ID -->
<!-- Get your ID from: analytics.google.com -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
-->
<!-- Uncomment above and replace GA_MEASUREMENT_ID after creating Analytics account -->

<!-- Google AdSense — Replace with your publisher ID after approval -->
<!-- Get approved at: google.com/adsense -->
<!--
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
  crossorigin="anonymous"></script>
-->
<!-- Uncomment after AdSense approval and replace ca-pub-XXXXXXXXXX -->`;
}

function head({ title, description, canonical, depth = 0, robots = "index, follow", schema = "" }) {
  const prefix = rootPrefix(depth);
  return `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Contract Generator" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords" content="free contract template, contract generator, PDF contract, freelance contract, NDA template, employment contract, lease agreement" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta property="og:site_name" content="Contract Generator" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />
    <link rel="icon" type="image/png" href="${prefix}favicon.io.png" />
    <link rel="apple-touch-icon" href="${prefix}favicon.io.png" />
    ${analyticsPlaceholders()}
    ${schema}
    <link rel="stylesheet" href="${prefix}styles.css" />
  </head>`;
}

function topbar(depth = 0) {
  const prefix = rootPrefix(depth);
  return `<header class="site-topbar">
      <a class="brand" href="${prefix}index.html"><img class="brand-logo" src="${prefix}contract_generator_logo_transparent.png" alt="Contract Generator" /></a>
      <nav class="top-nav" aria-label="Main navigation">
        <a href="${prefix}templates/">Templates</a>
        <a href="${prefix}blog/">Blog</a>
        <a href="${prefix}about.html">About</a>
        <a href="${prefix}privacy-policy.html">Privacy</a>
      </nav>
    </header>`;
}

function ad(id) {
  return "";
}

function templateSchema(template) {
  const name = template.name;
  const url = `${SITE_URL}/templates/${slugFor(template)}/`;
  const faqs = faqFor(template);
  return `<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  description: `Free ${name} generator with PDF download`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Templates", item: `${SITE_URL}/templates` },
      { "@type": "ListItem", position: 3, name }
    ]
  }
}, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((question) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: "This depends on your facts, location, and final terms. Use the generator as a starting point and consult a qualified attorney before signing complex or high-value agreements."
    }
  }))
}, null, 2)}
</script>`;
}

function templateDescription(template) {
  return `A ${template.name} is a written agreement that records the practical terms, responsibilities, dates, payment details, and expectations between the people or businesses involved. People use a ${template.name} when they want a clear record before money changes hands, services begin, property is transferred, confidential information is shared, or important duties are accepted. This free ${template.name} generator helps you organize the details that usually matter most, including party names, scope, pricing, timing, rights, and signatures. A clear document reduces confusion because each side can see what has been promised and what happens if plans change. The template is designed as a professional starting point, not a substitute for legal advice. Before signing, review the language carefully and ask a qualified attorney to confirm that the agreement fits your state, industry, and specific situation.`;
}

function situations(template) {
  const noun = template.name.toLowerCase();
  return [
    [`Starting a new arrangement`, `Use a ${noun} before work, rent, services, or payment obligations begin.`],
    ["Clarifying payment", "Record amounts, deposits, due dates, late fees, and payment schedules in writing."],
    ["Defining scope", "Describe the work, property, service, rights, or responsibilities so expectations are concrete."],
    ["Preventing disputes", "A signed document gives both sides a shared reference if questions come up later."],
    ["Sharing sensitive information", "Add confidentiality, ownership, access, and permitted-use terms where needed."],
    ["Changing an existing deal", "Use a fresh agreement when the original terms no longer match reality."]
  ];
}

function includesList(template) {
  return [
    ["Party information", "Identify every person or company bound by the agreement."],
    ["Purpose and scope", "Explain what the contract covers and what is outside the arrangement."],
    ["Payment terms", "List rates, deposits, due dates, invoices, late fees, and accepted payment methods."],
    ["Timeline", "Include start dates, end dates, milestones, delivery windows, or renewal terms."],
    ["Responsibilities", "State what each party must do, provide, approve, maintain, or avoid."],
    ["Ownership and usage rights", "Clarify who owns work product, property, data, materials, or intellectual property."],
    ["Cancellation and termination", "Explain how either party may end the agreement and what happens afterward."],
    ["Confidentiality", "Protect private business, personal, financial, or project information."],
    ["Dispute process", "Name the governing law, notice requirements, and preferred resolution process."],
    ["Signatures", "Leave room for all required parties to sign and date the document."]
  ].slice(0, Math.min(10, Math.max(8, template.fields.length)));
}

function faqFor(template) {
  if (template.id === "freelance-contract") {
    return [
      "Is a freelance contract legally required?",
      "What happens if a client refuses to sign?",
      "Can I use this contract internationally?",
      "Should I include intellectual property clauses?",
      "What is a kill fee in a freelance contract?",
      "How do I handle late payment in a contract?",
      "Can I modify this template for my needs?",
      "Is this template free to use commercially?"
    ];
  }
  return [
    `Do I need a ${template.name}?`,
    `Is this ${template.name} free?`,
    `Can I customize this ${template.name}?`,
    `Should a lawyer review my ${template.name}?`,
    "What information should I prepare first?",
    "Can both parties sign electronically?",
    "What happens if a term changes later?",
    "Can I use this template for business purposes?"
  ];
}

function relatedTemplates(template) {
  return TEMPLATES.filter((item) => item.id !== template.id && item.category === template.category).slice(0, 4);
}

function templatePage(template) {
  const slug = slugFor(template);
  const url = `${SITE_URL}/templates/${slug}/`;
  const title = `Free ${template.name} — Download PDF | Contract Generator`;
  const description = `Generate a free ${template.name} and download as PDF instantly. Fill in details and create a professional contract with no signup.`;
  const related = relatedTemplates(template).length ? relatedTemplates(template) : TEMPLATES.filter((item) => item.id !== template.id).slice(0, 4);
  const cat = CATEGORY_LABELS[template.category];
  return `<!doctype html>
<html lang="en">
${head({ title, description, canonical: url, depth: 2, schema: templateSchema(template) })}
  <body>
    ${topbar(2)}
    ${ad("ad-top")}
    <main class="page-wrap" data-template-page="${template.id}">
      <header class="page-header">
        <nav class="breadcrumb"><a href="../../index.html">Home</a><span>&gt;</span><a href="../">Templates</a><span>&gt;</span><span>${esc(cat)}</span><span>&gt;</span><span>${esc(template.name)}</span></nav>
        <span class="category-badge">${esc(cat)}</span>
        <h1>Free ${esc(template.name)} — Download PDF Instantly</h1>
        <p class="page-subtitle">${esc(template.description)}</p>
        <div class="trust-row"><span>Free Forever</span><span>Instant PDF</span><span>No Signup</span><span>${template.fields.length} Fields</span></div>
      </header>

      <section class="tool-embed" aria-label="${esc(template.name)} generator">
        <div class="tool-card">
          <h2>Build Your Contract</h2>
          <form id="templateFieldForm" class="field-form"></form>
          <button id="downloadPdfBtn" class="download-pdf" type="button">Download PDF</button>
        </div>
        <div class="tool-card tool-preview">
          <div class="preview-wrap">
            <header><h3>Live Preview</h3><span id="templateStatus">Complete the required fields</span></header>
            <div id="templatePreview" class="contract-preview"></div>
          </div>
        </div>
      </section>

      <section class="content-section">
        <h2>What is a ${esc(template.name)}?</h2>
        <p>${esc(templateDescription(template))}</p>
      </section>

      <section class="content-section">
        <h2>When Do You Need a ${esc(template.name)}?</h2>
        <ul>${situations(template).map(([label, text]) => `<li><strong>${esc(label)}:</strong> ${esc(text)}</li>`).join("")}</ul>
      </section>

      <section class="content-section">
        <h2>What to Include in a ${esc(template.name)}</h2>
        <ol>${includesList(template).map(([label, text]) => `<li><strong>${esc(label)}:</strong> ${esc(text)}</li>`).join("")}</ol>
      </section>

      <section class="content-section">
        <h2>How to Use Our Free ${esc(template.name)} Generator</h2>
        <ol>
          <li><strong>Fill in the form fields with your details.</strong></li>
          <li><strong>Preview your contract updating live on screen.</strong></li>
          <li><strong>Click Download PDF — your contract is ready instantly.</strong></li>
        </ol>
      </section>

      <section class="content-section">
        <h2>Frequently Asked Questions</h2>
        ${faqFor(template).map((question) => `<details class="faq-item"><summary>${esc(question)}</summary><p>This answer depends on your facts, location, and the final terms you choose. Use the generator as a starting point, read every clause carefully, and speak with a qualified attorney before signing high-value or complex agreements.</p></details>`).join("")}
      </section>

      <section class="content-section">
        <h2>Related Contract Templates</h2>
        <div class="related-grid">${related.map((item) => `<a class="content-card" href="../${slugFor(item)}/"><span class="template-icon">${item.icon}</span><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p></a>`).join("")}</div>
      </section>

    </main>
    <div data-site-footer></div>
    <script src="../../templates.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="../../pdf-download.js"></script>
    <script src="../../template-page.js"></script>
    <script src="../../site.js"></script>
  </body>
</html>`;
}

function templatesIndex() {
  return `<!doctype html>
<html lang="en">
${head({
  title: "All Contract Templates — 500+ Free & Premium Legal Templates | Contract Generator",
  description: "Browse 500+ free and premium contract templates. Freelance contracts, NDA, employment agreements, lease agreements, business contracts and more. Download as PDF instantly.",
  canonical: `${SITE_URL}/templates/`,
  depth: 1
})}
  <body>
    ${topbar(1)}
    ${ad("ad-top")}
    <main class="page-wrap">
      <header class="page-header">
        <nav class="breadcrumb"><a href="../index.html">Home</a><span>&gt;</span><span>Templates</span></nav>
        <span class="category-badge">500+ Free & Premium Templates</span>
        <h1>All Contract Templates</h1>
        <p class="page-subtitle">Browse professional contract templates by category, then open a dedicated generator page with live preview and instant PDF download.</p>
      </header>
      <div class="related-grid">${TEMPLATES.map((item) => `<a class="content-card" href="${slugFor(item)}/"><span class="template-icon">${item.icon}</span><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><span class="badge">${esc(CATEGORY_LABELS[item.category])}</span></a>`).join("")}</div>
      ${ad("ad-mid")}
      ${ad("ad-bottom")}
    </main>
    <div data-site-footer></div>
    <script src="../site.js"></script>
  </body>
</html>`;
}

function blogIndex() {
  return `<!doctype html>
<html lang="en">
${head({
  title: "Legal Guides & Contract Resources | Contract Generator",
  description: "Free expert guides on contracts, legal agreements, business law, employment documents, real estate forms and freelance agreements.",
  canonical: `${SITE_URL}/blog/`,
  depth: 1
})}
  <body>
    ${topbar(1)}
    ${ad("ad-top")}
    <main class="page-wrap">
      <header class="page-header">
        <nav class="breadcrumb"><a href="../index.html">Home</a><span>&gt;</span><span>Blog</span></nav>
        <h1>Legal Guides & Contract Resources</h1>
        <p class="page-subtitle">Free expert guides on contracts, legal agreements and business law.</p>
      </header>
      <div class="filter-tabs"><button>All</button><button>Contracts</button><button>Employment</button><button>Real Estate</button><button>Business</button><button>Freelance</button></div>
      <div class="blog-grid">
        ${blogPosts.slice(0, 3).map(blogCard).join("")}
      </div>
      ${ad("ad-mid")}
      <div class="blog-grid">
        ${blogPosts.slice(3).map(blogCard).join("")}
      </div>
      ${ad("ad-bottom")}
    </main>
    <div data-site-footer></div>
    <script src="../site.js"></script>
  </body>
</html>`;
}

function blogCard(post) {
  return `<a class="blog-card" href="${post.slug}.html"><span class="category-badge">${esc(post.category)}</span><h2>${esc(post.title)}</h2><p>${esc(post.description)}</p><div class="blog-meta"><span>Contract Generator Team</span><span>May 1, 2026</span><span>${post.readTime}</span></div><strong>Read Article →</strong></a>`;
}

function sectionParagraph(post, section) {
  return `<p>${esc(post.keyword)} is easiest to understand when you connect the legal idea to a real decision. ${esc(section)} matters because contracts are practical documents: they allocate risk, set expectations, and create a record that both sides can read later. Strong agreements use plain language, identify the parties, define the work or obligation, and explain what happens when payment, timing, performance, or confidentiality becomes a problem.</p>
  <p>For most small businesses, freelancers, landlords, and individuals, the goal is not to write complicated legal language. The goal is to remove uncertainty before a dispute begins. Use specific dates, exact dollar amounts, approval steps, notice periods, and signature blocks. If the transaction is complex, high value, regulated, or connected to state-specific law, ask a licensed attorney to review the final document.</p>`;
}

function blogPost(post) {
  const related = TEMPLATES.find((item) => item.id === post.relatedTemplate) || TEMPLATES[0];
  const schema = `<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  datePublished: "2026-05-01",
  author: { "@type": "Organization", name: "Contract Generator" },
  publisher: { "@type": "Organization", name: "Contract Generator" }
}, null, 2)}
</script>`;
  const toc = post.sections.map((section, index) => `<a href="#section-${index + 1}">${esc(section)}</a>`).join("");
  return `<!doctype html>
<html lang="en">
${head({ title: `${post.title} | Contract Generator`, description: post.description, canonical: `${SITE_URL}/blog/${post.slug}`, depth: 1, schema })}
  <body>
    ${topbar(1)}
    <main class="page-wrap article-layout">
      <article class="article-body">
        <nav class="breadcrumb"><a href="../index.html">Home</a><span>&gt;</span><a href="index.html">Blog</a><span>&gt;</span><span>${esc(post.category)}</span><span>&gt;</span><span>${esc(post.title)}</span></nav>
        <span class="category-badge">${esc(post.category)}</span>
        <h1>${esc(post.title)}</h1>
        <div class="article-meta"><span>May 1, 2026</span><span>${post.readTime}</span><span>${esc(post.category)}</span></div>
        ${ad("ad-top")}
        <p>${esc(post.keyword)} is a high-intent topic because people searching for it usually need to make a decision before signing, hiring, renting, sharing information, or getting paid. This guide explains the legal ideas in plain English, then turns them into practical contract steps you can actually use. You will learn what to include, which clauses deserve extra attention, and when a free template is enough versus when professional legal review is the smarter move.</p>
        <div class="toc-box"><h2>Table of Contents</h2>${toc}</div>
        ${post.sections.map((section, index) => `
          <section id="section-${index + 1}">
            <h2>${esc(section)}</h2>
            ${sectionParagraph(post, section)}
          </section>
          ${index === 2 ? ad("ad-mid") : ""}
        `).join("")}
        <div class="takeaways"><h2>Key Takeaways</h2><ul><li>Use clear written terms before performance begins.</li><li>Identify the parties, scope, payment, timing, and signatures.</li><li>State what happens if plans change or someone defaults.</li><li>Keep confidentiality, ownership, and dispute terms practical.</li><li>Ask an attorney to review complex or high-value agreements.</li></ul></div>
        <div class="cta-box"><h2>Use Our Free ${esc(related.name)} Template →</h2><p>Open the generator, fill in your details, preview the document live, and download a PDF-ready contract.</p><a class="content-button" href="../templates/${slugFor(related)}/">Open Template</a></div>
        <section><h2>Related Articles</h2><div class="blog-grid">${blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3).map(blogCard).join("")}</div></section>
        ${ad("ad-bottom")}
      </article>
      <aside class="article-sidebar">
        <div class="toc-box"><h3>Table of Contents</h3>${toc}</div>
        <div class="toc-box quick-tools"><h3>Quick Tools</h3>${TEMPLATES.slice(0, 5).map((item) => `<a href="../templates/${slugFor(item)}/">${esc(item.name)}</a>`).join("")}</div>
        <div class="newsletter"><h3>Contract tips</h3><p>Get practical legal template updates.</p><input type="email" placeholder="Email address" /><button class="content-button" type="button">Subscribe</button></div>
      </aside>
    </main>
    <div data-site-footer></div>
    <script src="../site.js"></script>
  </body>
</html>`;
}

function aboutPage() {
  return `<!doctype html>
<html lang="en">
${head({
  title: "About Us — Contract Generator | Free Legal Templates",
  description: "Learn about Contract Generator — our mission to make free professional contract templates accessible to freelancers, businesses and individuals everywhere.",
  canonical: `${SITE_URL}/about.html`
})}
  <body>${topbar()}${ad("ad-top")}<main class="page-wrap content-body">
    <header class="page-header"><h1>About Contract Generator</h1><p class="page-subtitle">Making professional legal templates accessible to everyone.</p></header>
    <section class="content-section"><h2>Our Mission</h2><p>We believe everyone deserves access to professional legal documents without expensive lawyer fees. Contract Generator provides free, professionally-structured contract templates that anyone can use.</p></section>
    <section class="content-section"><h2>What We Offer</h2><div class="feature-grid"><div class="about-card"><h3>500+ Templates</h3><p>Free and premium agreements for work, rentals, business, loans, IP, vehicles, events, and personal needs.</p></div><div class="about-card"><h3>Instant PDF</h3><p>Fill in the form, preview your contract, and print or save as PDF instantly.</p></div><div class="about-card"><h3>Privacy First</h3><p>Your contract details stay in your browser and are never sent to our servers.</p></div><div class="about-card"><h3>Always Free</h3><p>No signup, no payment, and no hidden watermarks.</p></div></div></section>
    <section class="content-section"><h2>How It Works</h2><ol><li><strong>Choose a template</strong> from the full library.</li><li><strong>Fill in your details</strong> using guided fields.</li><li><strong>Download your draft</strong> and review it before signing.</li></ol></section>
    <section class="content-section cta-box"><h2>Important Disclaimer</h2><p>Contract Generator is not a law firm and does not provide legal advice. Our templates are starting points based on common legal practices. We strongly recommend consulting a licensed attorney for your specific legal needs, especially for complex transactions or high-value agreements.</p></section>
    ${ad("ad-mid")}
    <section class="content-section"><h2>Have questions? We're here to help.</h2><a class="content-button" href="contact.html">Contact Us</a></section>
    ${ad("ad-bottom")}
  </main><div data-site-footer></div><script src="site.js"></script></body>
</html>`;
}

function privacyPage() {
  const sections = [
    ["Information We Collect", "We do NOT collect any personal information you enter in contract forms. Form data is processed entirely in your browser and never sent to our servers. We collect anonymous analytics data such as page views and browser type. We use Google Analytics and Google AdSense."],
    ["How We Use Information", "Analytics data is used to improve the website. AdSense uses cookies to show relevant advertisements. We do not sell any data to third parties."],
    ["Cookies", "We may use Google Analytics cookies for analytics and Google AdSense cookies for advertising. You can disable cookies in your browser settings at any time."],
    ["Google AdSense", "We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your interests. You can opt out via Google's ad settings."],
    ["Your Rights", "You have the right to know what data is collected, opt out of analytics where available, and contact us with privacy requests."],
    ["Data Security", "All contract data is processed locally in your browser. We use SSL encryption on all pages. We do not store any contract content you create."],
    ["Third Party Links", "Our website may link to external sites. We are not responsible for the privacy practices or content of third party websites."],
    ["Changes to This Policy", "We may update this policy and will post changes here with a revised date."],
    ["Contact Us", "Email: hello@contractgenerator.example"]
  ];
  return `<!doctype html>
<html lang="en">
${head({
  title: "Privacy Policy | Contract Generator",
  description: "Privacy Policy for Contract Generator. Learn how we handle your data. Your contract information never leaves your browser — we process everything locally for your privacy.",
  canonical: `${SITE_URL}/privacy-policy.html`,
  robots: "noindex, follow"
})}
  <body>${topbar()}${ad("ad-top")}<main class="page-wrap legal-page content-body"><header class="page-header"><h1>Privacy Policy</h1><p class="page-subtitle">Last updated: May 2026</p></header>${sections.slice(0, 4).map(([title, text]) => `<section class="content-section"><h2>${esc(title)}</h2><p>${esc(text)}</p></section>`).join("")}${ad("ad-mid")}${sections.slice(4).map(([title, text]) => `<section class="content-section"><h2>${esc(title)}</h2><p>${esc(text)}</p></section>`).join("")}${ad("ad-bottom")}</main><div data-site-footer></div><script src="site.js"></script></body>
</html>`;
}

function simplePage(title, description, file) {
  return `<!doctype html><html lang="en">${head({ title: `${title} | Contract Generator`, description, canonical: `${SITE_URL}/${file}` })}<body>${topbar()}${ad("ad-top")}<main class="page-wrap content-body"><header class="page-header"><h1>${esc(title)}</h1><p class="page-subtitle">${esc(description)}</p></header><section class="content-section"><p>Thanks for visiting Contract Generator. This page is intentionally simple while we expand the public site content.</p></section>${ad("ad-mid")}${ad("ad-bottom")}</main><div data-site-footer></div><script src="site.js"></script></body></html>`;
}

function sitemap() {
  const urls = [
    ["", "weekly", "1.0"],
    ["templates/", "weekly", "0.9"],
    ...TEMPLATES.map((item) => [`templates/${slugFor(item)}/`, "monthly", "0.9"]),
    ["blog/", "weekly", "0.8"],
    ...blogPosts.map((post) => [`blog/${post.slug}`, "monthly", "0.8"]),
    ["about.html", "", "0.5"],
    ["contact.html", "", "0.5"],
    ["privacy-policy.html", "", "0.3"],
    ["terms.html", "", "0.3"]
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, changefreq, priority]) => `  <url><loc>${SITE_URL}/${loc}</loc>${changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ""}<priority>${priority}</priority></url>`).join("\n")}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

write("templates/index.html", templatesIndex());
for (const template of TEMPLATES) {
  write(`templates/${slugFor(template)}/index.html`, templatePage(template));
}
write("blog/index.html", blogIndex());
for (const post of blogPosts) {
  const postHtml = blogPost(post);
  write(`blog/${post.slug}.html`, postHtml);
  write(`blog/${post.slug}/index.html`, postHtml);
}
write("about.html", aboutPage());
write("privacy-policy.html", privacyPage());
write("contact.html", simplePage("Contact", "Have questions? Contact the Contract Generator team for support and feedback.", "contact.html"));
write("terms.html", simplePage("Terms of Service", "Review the terms for using Contract Generator and our free legal template tools.", "terms.html"));
write("sitemap.xml", sitemap());
write("robots.txt", robots());

console.log(`Generated ${TEMPLATES.length} template pages, ${blogPosts.length} blog posts, sitemap, robots, about, privacy, contact and terms.`);
