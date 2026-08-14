(function () {
  const items = document.querySelectorAll(".portfolio-item");
  const links = document.querySelectorAll("[data-filter-link]");

  function applyFilter() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "all";

    items.forEach((item) => {
      const match = category === "all" || item.dataset.category === category;
      item.hidden = !match;
    });

    links.forEach((link) => {
      const linkCategory = new URL(link.href).searchParams.get("category");
      link.classList.toggle("is-active", linkCategory === category);
    });
  }

  // Intercept filter link clicks so it updates the URL without a full reload
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = new URL(link.href);
      window.history.pushState({}, "", url);
      applyFilter();
    });
  });

  // Handle back/forward browser navigation
  window.addEventListener("popstate", applyFilter);

  // Initial filter on page load (handles someone landing on ?category=Website directly)
  applyFilter();
})();
