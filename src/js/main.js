(function () {
  var submenuItems = Array.prototype.slice.call(
    document.querySelectorAll(".nav-link-item.has-submenu"),
  );

  if (!submenuItems.length) {
    return;
  }

  function closeAllSubmenus() {
    submenuItems.forEach(function (item) {
      item.classList.remove("is-open");
      var trigger = item.querySelector(":scope > a");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  submenuItems.forEach(function (item) {
    var trigger = item.querySelector(":scope > a");
    if (!trigger) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();

      var shouldOpen = !item.classList.contains("is-open");
      closeAllSubmenus();

      if (shouldOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (event) {
    var clickedInsideSubmenu = submenuItems.some(function (item) {
      return item.contains(event.target);
    });

    if (!clickedInsideSubmenu) {
      closeAllSubmenus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllSubmenus();
    }
  });
})();
