(function () {
  const homeView = document.getElementById("home-view");
  const dashboardView = document.getElementById("dashboard-view");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const heroSearch = document.getElementById("hero-search");
  const heroSearchForm = document.getElementById("hero-search-form");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const templateSlugOverrides = {
    "partnership-agreement": "business-partnership",
    "llc-operating": "llc-operating-agreement",
    "loan-agreement": "personal-loan-agreement",
    "car-sale-contract": "vehicle-sale-agreement"
  };

  function openTemplatePage(templateId) {
    const slug = templateSlugOverrides[templateId] || templateId;
    window.location.href = `templates/${slug}/`;
  }

  function closeMenu() {
    mobileMenu?.classList.remove("open");
    mobileMenu?.setAttribute("aria-hidden", "true");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  function applyDashboardOptions(categoryFilter = null, templateId = null, query = null) {
    const dashboard = window.contractDashboard;
    if (!dashboard) return;
    if (categoryFilter) dashboard.showCategory(categoryFilter);
    if (query !== null) dashboard.search(query);
    if (templateId) dashboard.selectTemplate(templateId);
  }

  function showDashboard(categoryFilter = null, templateId = null, query = null) {
    closeMenu();
    homeView.style.opacity = "0";
    homeView.style.transform = "translateY(-10px)";
    window.setTimeout(() => {
      homeView.style.display = "none";
      dashboardView.style.display = "flex";
      applyDashboardOptions(categoryFilter, templateId, query);
      requestAnimationFrame(() => {
        dashboardView.style.opacity = "1";
        dashboardView.style.transform = "translateY(0)";
      });
    }, 250);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showHome(targetHash = null) {
    dashboardView.style.opacity = "0";
    dashboardView.style.transform = "translateY(10px)";
    window.setTimeout(() => {
      dashboardView.style.display = "none";
      homeView.style.display = "block";
      requestAnimationFrame(() => {
        homeView.style.opacity = "1";
        homeView.style.transform = "translateY(0)";
      });
      if (targetHash && targetHash !== "#home-view") {
        document.querySelector(targetHash)?.scrollIntoView({ behavior: "smooth" });
      }
    }, 250);
    if (!targetHash || targetHash === "#home-view") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal, .featured-home-grid > *, .home-category-grid > *, .why-grid > *, .blog-grid > *");
    items.forEach((item, index) => item.style.setProperty("--i", String((index % 6) + 1)));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  document.querySelectorAll("[data-open-dashboard]").forEach((button) => {
    button.addEventListener("click", () => showDashboard());
  });

  document.querySelectorAll(".featured-template-card, .quick-start [data-template-id]").forEach((card) => {
    card.addEventListener("click", () => openTemplatePage(card.dataset.templateId));
  });

  document.querySelectorAll(".home-category-card").forEach((card) => {
    card.addEventListener("click", () => showDashboard(card.dataset.category));
  });

  document.querySelectorAll(".search-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      if (pill.dataset.templateId) {
        openTemplatePage(pill.dataset.templateId);
        return;
      }
      showDashboard(pill.dataset.category || null);
    });
  });

  heroSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showDashboard(null, null, heroSearch.value.trim());
  });

  heroSearch?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      showDashboard(null, null, heroSearch.value.trim());
    }
  });

  backHomeBtn?.addEventListener("click", showHome);
  document.querySelectorAll("[data-home-link]").forEach((link) => link.addEventListener("click", () => showHome()));
  document.querySelectorAll("[data-home-anchor]").forEach((link) => {
    link.addEventListener("click", (event) => {
      closeMenu();
      if (dashboardView.style.display === "flex") {
        event.preventDefault();
        showHome(link.getAttribute("href"));
      }
    });
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.querySelectorAll("[data-mobile-close]").forEach((link) => link.addEventListener("click", closeMenu));

  if (window.location.hash === "#dashboard") showDashboard();
  if (window.location.hash.includes("#template=")) {
    openTemplatePage(window.location.hash.split("=")[1]);
  }

  initReveal();
  window.showDashboard = showDashboard;
  window.showHome = showHome;
})();
