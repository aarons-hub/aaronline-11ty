(function () {
  var page = document.querySelector(".projects-page");
  if (!page) {
    return;
  }

  var partnerButtons = Array.prototype.slice.call(
    page.querySelectorAll(".partner-button"),
  );
  var categoryButtons = Array.prototype.slice.call(
    page.querySelectorAll(".category-button"),
  );
  var thumbs = Array.prototype.slice.call(
    page.querySelectorAll(".project-thumb"),
  );
  var thumbStrip = page.querySelector("[data-thumb-strip]");

  var metaGroup = page.querySelector("[data-project-group]");
  var metaTitle = page.querySelector("[data-project-title]");
  var metaDescription = page.querySelector("[data-project-description]");
  var metaTags = page.querySelector("[data-project-tags]");

  var heroBase = page.querySelector("[data-hero-base]");
  var heroWrapOne = page.querySelector("[data-hero-wrap-one]");
  var heroWrapTwo = page.querySelector("[data-hero-wrap-two]");
  var heroVideoLayer = page.querySelector("[data-hero-video-layer]");
  var heroImageOne = page.querySelector("[data-hero-image-one]");
  var heroImageTwo = page.querySelector("[data-hero-image-two]");
  var heroMask = page.querySelector("[data-hero-mask]");

  var heroVideoWrap = page.querySelector("[data-hero-video-wrap]");
  var heroVideoThumb = page.querySelector("[data-hero-video-thumb]");
  var heroVideoLink = page.querySelector("[data-hero-video-link]");
  var videoModal = page.querySelector("[data-video-modal]");
  var videoPlayer = page.querySelector("[data-video-player]");
  var videoModalTitle = page.querySelector("[data-video-modal-title]");
  var videoCloseControls = Array.prototype.slice.call(
    page.querySelectorAll("[data-video-close]"),
  );

  function normalize(value) {
    return (value || "").toLowerCase().trim();
  }

  var state = {
    group:
      page.getAttribute("data-default-group") ||
      (partnerButtons[0] ? partnerButtons[0].dataset.group : ""),
    category: "All",
    activeKey: "",
    activeVideoSrc: "",
    activeVideoTitle: "Project video",
  };

  function openVideoModal() {
    if (!state.activeVideoSrc || !videoModal || !videoPlayer) {
      return;
    }

    videoModal.classList.remove("is-hidden");
    videoModal.setAttribute("aria-hidden", "false");
    videoModalTitle.textContent = state.activeVideoTitle;
    videoPlayer.src = state.activeVideoSrc;
    videoPlayer.play().catch(function () {
      return null;
    });
  }

  function closeVideoModal() {
    if (!videoModal || !videoPlayer) {
      return;
    }

    videoModal.classList.add("is-hidden");
    videoModal.setAttribute("aria-hidden", "true");
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
  }

  function updatePartnerButtons() {
    partnerButtons.forEach(function (button) {
      button.classList.toggle(
        "is-active",
        button.dataset.group === state.group,
      );
    });
  }

  function updateCategoryButtons() {
    categoryButtons.forEach(function (button) {
      button.classList.toggle(
        "is-active",
        button.dataset.category === state.category,
      );
    });
  }

  function setImage(target, src, alt) {
    if (!src) {
      target.classList.add("is-hidden");
      target.removeAttribute("src");
      return;
    }

    target.classList.remove("is-hidden");
    target.src = src;
    target.alt = alt;
  }

  function applyWrapperStyle(wrapper, top, left, width, height, transform) {
    wrapper.style.top = top || "0%";
    wrapper.style.left = left || "0%";
    wrapper.style.width = width || "100%";
    wrapper.style.height = height || "100%";
    wrapper.style.transform = transform || "none";
  }

  function applyImageTransform(image, width, transform) {
    image.style.width = width || "100%";
    image.style.transform = transform || "none";
  }

  function setLayer(wrapper, image, source, alt, config) {
    if (!source) {
      wrapper.classList.add("is-hidden");
      setImage(image, "", alt);
      return;
    }

    wrapper.classList.remove("is-hidden");
    setImage(image, source, alt);
    applyWrapperStyle(
      wrapper,
      config.parentTop,
      config.parentLeft,
      config.parentWidth,
      config.parentHeight,
      config.parentTransform,
    );
    applyImageTransform(image, config.imageWidth, config.imageTransform);
  }

  function parseTags(raw) {
    if (!raw) {
      return [];
    }
    return raw
      .split("||")
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function renderActive(thumb) {
    if (!thumb) {
      metaGroup.textContent = "No results";
      metaTitle.textContent = "No project found";
      metaDescription.textContent = "Try switching category or partner.";
      metaTags.innerHTML = "";
      heroBase.removeAttribute("src");
      heroBase.alt = "No project selected";
      heroWrapOne.classList.add("is-hidden");
      heroWrapTwo.classList.add("is-hidden");
      setImage(heroImageOne, "", "");
      setImage(heroImageTwo, "", "");
      heroVideoLayer.classList.add("is-hidden");
      heroVideoLayer.removeAttribute("href");
      heroVideoLayer.setAttribute("aria-hidden", "true");
      setImage(heroVideoThumb, "", "");
      setImage(heroMask, "", "");
      heroVideoWrap.classList.add("is-hidden");
      state.activeVideoSrc = "";
      state.activeVideoTitle = "Project video";
      return;
    }

    var title = thumb.dataset.title || "Untitled project";
    var group = thumb.dataset.group || "";
    var description = thumb.dataset.description || "";
    var category = thumb.dataset.category || "Unknown";
    var tags = parseTags(thumb.dataset.tags);

    heroBase.src = thumb.dataset.base;
    heroBase.alt = title;

    setLayer(
      heroWrapOne,
      heroImageOne,
      thumb.dataset.imageOne,
      title + " image one",
      {
        parentTop: thumb.dataset.imageOneParentTop,
        parentLeft: thumb.dataset.imageOneParentLeft,
        parentWidth: thumb.dataset.imageOneParentWidth,
        parentHeight: thumb.dataset.imageOneParentHeight,
        parentTransform: thumb.dataset.imageOneParentTransform,
        imageWidth: thumb.dataset.imageOneTransformWidth,
        imageTransform: thumb.dataset.imageOneTransform,
      },
    );
    setLayer(
      heroWrapTwo,
      heroImageTwo,
      thumb.dataset.imageTwo,
      title + " image two",
      {
        parentTop: thumb.dataset.imageTwoParentTop,
        parentLeft: thumb.dataset.imageTwoParentLeft,
        parentWidth: thumb.dataset.imageTwoParentWidth,
        parentHeight: thumb.dataset.imageTwoParentHeight,
        parentTransform: thumb.dataset.imageTwoParentTransform,
        imageWidth: thumb.dataset.imageTwoTransformWidth,
        imageTransform: thumb.dataset.imageTwoTransform,
      },
    );
    setImage(heroMask, thumb.dataset.mask, title + " mask");

    if (thumb.dataset.videoThumb) {
      heroVideoLayer.classList.remove("is-hidden");
      setImage(
        heroVideoThumb,
        thumb.dataset.videoThumb,
        title + " video preview",
      );
      applyWrapperStyle(
        heroVideoLayer,
        thumb.dataset.videoWrapTop,
        thumb.dataset.videoWrapLeft,
        thumb.dataset.videoWrapWidth,
        thumb.dataset.videoWrapHeight,
        "none",
      );
      if (thumb.dataset.videoSrc) {
        heroVideoLayer.href = "#";
        heroVideoLayer.setAttribute("aria-label", "Play " + title + " video");
        heroVideoLayer.removeAttribute("aria-hidden");
      } else {
        heroVideoLayer.removeAttribute("href");
        heroVideoLayer.setAttribute("aria-hidden", "true");
      }
    } else {
      heroVideoLayer.classList.add("is-hidden");
      heroVideoLayer.removeAttribute("href");
      heroVideoLayer.setAttribute("aria-hidden", "true");
      setImage(heroVideoThumb, "", "");
    }

    if (thumb.dataset.videoSrc) {
      heroVideoWrap.classList.remove("is-hidden");
      heroVideoLink.href = "#";
      heroVideoLink.textContent = "Play video";
      state.activeVideoSrc = thumb.dataset.videoSrc;
      state.activeVideoTitle = title + " video";
    } else {
      heroVideoWrap.classList.add("is-hidden");
      heroVideoLink.removeAttribute("href");
      heroVideoLink.textContent = "Open video source";
      state.activeVideoSrc = "";
      state.activeVideoTitle = "Project video";
    }

    metaGroup.textContent = group;
    metaTitle.textContent = title;
    metaDescription.textContent = description || " ";

    var pills = tags.slice();
    if (category) {
      pills.unshift(category);
    }
    metaTags.innerHTML = pills
      .map(function (pill) {
        return '<span class="meta-tag">' + pill + "</span>";
      })
      .join("");
  }

  function getVisibleThumbs() {
    var visible = [];

    thumbs.forEach(function (thumb) {
      var inGroup = thumb.dataset.group === state.group;
      var inCategory =
        state.category === "All" ||
        normalize(thumb.dataset.category) === normalize(state.category);
      var isVisible = inGroup && inCategory;

      thumb.classList.toggle("is-hidden", !isVisible);
      if (isVisible) {
        visible.push(thumb);
      }
    });

    return visible;
  }

  function updateActiveThumb(visible) {
    var nextActive = visible.find(function (thumb) {
      return thumb.dataset.key === state.activeKey;
    });

    if (!nextActive) {
      nextActive = visible[0] || null;
      state.activeKey = nextActive ? nextActive.dataset.key : "";
    }

    thumbs.forEach(function (thumb) {
      thumb.classList.toggle(
        "is-active",
        nextActive && thumb.dataset.key === nextActive.dataset.key,
      );
    });

    renderActive(nextActive);
  }

  function syncView() {
    var visible = getVisibleThumbs();

    if (!visible.length && state.category !== "All") {
      state.category = "All";
      updateCategoryButtons();
      visible = getVisibleThumbs();
    }

    updatePartnerButtons();
    updateActiveThumb(visible);
  }

  partnerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.group = button.dataset.group;
      state.activeKey = "";
      syncView();
    });
  });

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.category = button.dataset.category;
      state.activeKey = "";
      updateCategoryButtons();
      syncView();
    });
  });

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      if (thumb.classList.contains("is-hidden")) {
        return;
      }
      state.activeKey = thumb.dataset.key;
      syncView();
    });
  });

  if (heroVideoLayer) {
    heroVideoLayer.addEventListener("click", function (event) {
      if (!state.activeVideoSrc) {
        return;
      }
      event.preventDefault();
      openVideoModal();
    });
  }

  if (heroVideoLink) {
    heroVideoLink.addEventListener("click", function (event) {
      if (!state.activeVideoSrc) {
        return;
      }
      event.preventDefault();
      openVideoModal();
    });
  }

  videoCloseControls.forEach(function (control) {
    control.addEventListener("click", function () {
      closeVideoModal();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      videoModal &&
      !videoModal.classList.contains("is-hidden")
    ) {
      closeVideoModal();
    }
  });

  function initThumbStripNav() {
    var strips = page.querySelectorAll(".thumb-strip");

    Array.prototype.forEach.call(strips, function (strip) {
      var wrapper = strip.closest(".projects-stage") || strip.parentElement;
      if (!wrapper) {
        return;
      }

      var prevBtn =
        wrapper.querySelector(".thumb-nav-prev") ||
        wrapper.querySelector("[data-thumb-prev]");
      var nextBtn =
        wrapper.querySelector(".thumb-nav-next") ||
        wrapper.querySelector("[data-thumb-next]");

      if (!prevBtn || !nextBtn) {
        return;
      }

      var scrollAmount = function () {
        return strip.clientWidth * 0.8;
      };

      var updateButtonStates = function () {
        var maxScroll = strip.scrollWidth - strip.clientWidth;
        var atStart = strip.scrollLeft <= 1;
        var atEnd = strip.scrollLeft >= maxScroll - 1;

        prevBtn.disabled = atStart;
        nextBtn.disabled = atEnd;
      };

      prevBtn.addEventListener("click", function () {
        strip.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
      });

      nextBtn.addEventListener("click", function () {
        strip.scrollBy({ left: scrollAmount(), behavior: "smooth" });
      });

      strip.addEventListener("scroll", updateButtonStates);
      window.addEventListener("resize", updateButtonStates);

      updateButtonStates();
    });
  }

  initThumbStripNav();

  updateCategoryButtons();
  syncView();
})();
