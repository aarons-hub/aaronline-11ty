(function () {
  var page = document.querySelector(".ajax-projects-page");
  if (!page) {
    return;
  }

  var partnerGrid = page.querySelector("[data-partner-grid]");
  var thumbStrip = page.querySelector("[data-thumb-strip]");
  var status = page.querySelector("[data-status]");
  var thumbPrev = page.querySelector("[data-thumb-prev]");
  var thumbNext = page.querySelector("[data-thumb-next]");

  var metaGroup = page.querySelector("[data-project-group]");
  var metaDescription = page.querySelector("[data-project-description]");
  var metaTags = page.querySelector("[data-project-tags]");

  var heroBase = page.querySelector("[data-hero-base]");
  var heroFrame = page.querySelector(".hero-frame");
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

  var dataUrl = page.getAttribute("data-projects-url") || "/data/projects.json";
  var assetPrefix = page.getAttribute("data-asset-prefix") || "/";

  var partnerButtons = [];
  var thumbs = [];

  function resolveAssetPath(value) {
    if (!value) {
      return "";
    }

    if (
      value.indexOf("http://") === 0 ||
      value.indexOf("https://") === 0 ||
      value.indexOf("//") === 0 ||
      value.indexOf("data:") === 0
    ) {
      return value;
    }

    if (value.charAt(0) !== "/") {
      return value;
    }

    if (assetPrefix !== "/" && value.indexOf(assetPrefix) !== 0) {
      return assetPrefix.replace(/\/$/, "") + value;
    }

    return value;
  }

  function normalize(value) {
    return (value || "").toLowerCase().trim();
  }

  function trackMediaLoading(container, images) {
    if (!container) {
      return;
    }

    var pending = images.filter(function (image) {
      return image && !(image.complete && image.naturalWidth > 0);
    }).length;

    container.classList.toggle("is-loading", pending > 0);

    if (!pending) {
      return;
    }

    images.forEach(function (image) {
      if (!image || (image.complete && image.naturalWidth > 0)) {
        return;
      }

      var settle = function () {
        pending -= 1;
        if (pending <= 0) {
          container.classList.remove("is-loading");
        }
      };

      image.addEventListener("load", settle, { once: true });
      image.addEventListener("error", settle, { once: true });
    });
  }

  function getActiveGroupDescription() {
    var activeButton = partnerButtons.find(function (button) {
      return button.dataset.group === state.group;
    });

    return activeButton ? activeButton.dataset.description || "" : "";
  }

  var state = {
    group: "",
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
      if (heroFrame) {
        heroFrame.classList.remove("is-loading");
      }
      return;
    }

    var title = thumb.dataset.title || "Untitled project";
    var group = thumb.dataset.group || "";
    var category = thumb.dataset.category || "Unknown";
    var tags = parseTags(thumb.dataset.tags);

    heroBase.src = resolveAssetPath(thumb.dataset.base);
    heroBase.alt = title;
    heroBase.dataset.id = thumb.dataset.id || "";

    setLayer(
      heroWrapOne,
      heroImageOne,
      resolveAssetPath(thumb.dataset.imageOne),
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
      resolveAssetPath(thumb.dataset.imageTwo),
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
    setImage(heroMask, resolveAssetPath(thumb.dataset.mask), title + " mask");

    if (thumb.dataset.videoThumb) {
      heroVideoLayer.classList.remove("is-hidden");
      setImage(
        heroVideoThumb,
        resolveAssetPath(thumb.dataset.videoThumb),
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

    var heroImages = [heroBase].concat(
      [heroImageOne, heroImageTwo, heroMask, heroVideoThumb].filter(
        function (image) {
          return image.getAttribute("src");
        },
      ),
    );
    trackMediaLoading(heroFrame, heroImages);

    if (thumb.dataset.videoSrc) {
      heroVideoWrap.classList.remove("is-hidden");
      heroVideoLink.href = "#";
      heroVideoLink.textContent = "Play video";
      state.activeVideoSrc = resolveAssetPath(thumb.dataset.videoSrc);
      state.activeVideoTitle = title + " video";
    } else {
      heroVideoWrap.classList.add("is-hidden");
      heroVideoLink.removeAttribute("href");
      heroVideoLink.textContent = "Open video source";
      state.activeVideoSrc = "";
      state.activeVideoTitle = "Project video";
    }

    metaGroup.textContent = group;
    metaDescription.textContent = getActiveGroupDescription() || " ";

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
      visible = getVisibleThumbs();
    }

    updatePartnerButtons();
    updateActiveThumb(visible);
  }

  function selectPartner(group) {
    state.group = group;
    state.activeKey = "";
    syncView();
  }

  function selectThumb(thumb) {
    if (thumb.classList.contains("is-hidden")) {
      return;
    }
    state.activeKey = thumb.dataset.key;
    syncView();
  }

  function buildPartnerButton(group) {
    var button = document.createElement("button");
    var image = document.createElement("img");
    var loader = document.createElement("span");

    button.type = "button";
    button.className = "partner-button";
    button.dataset.group = group.name;
    button.dataset.description = group.description || "";
    button.setAttribute("aria-label", "Select " + group.name);

    loader.className = "shimmer-loader";
    loader.setAttribute("aria-hidden", "true");

    image.src = resolveAssetPath(group.thumbnail);
    image.alt = group.name;
    image.loading = "lazy";

    button.appendChild(loader);
    button.appendChild(image);
    button.addEventListener("click", function () {
      selectPartner(button.dataset.group);
    });

    trackMediaLoading(button, [image]);

    return button;
  }

  function appendOverlayLayer(media, layer) {
    if (!layer || !layer.src) {
      return;
    }

    var parent = layer.parentWrapper || {};
    var transform = layer.imageTransform || {};
    var wrapper = document.createElement("div");
    var image = document.createElement("img");

    wrapper.className = "thumb-parent-wrapper";
    applyWrapperStyle(
      wrapper,
      parent.top,
      parent.left,
      parent.width,
      parent.height,
      parent.transform,
    );

    image.className = "thumb-overlay";
    image.src = resolveAssetPath(layer.src);
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.loading = "lazy";
    applyImageTransform(image, transform.width, transform.transform);

    wrapper.appendChild(image);
    media.appendChild(wrapper);
  }

  function appendVideoThumb(media, movieFile) {
    if (!movieFile || !movieFile.thumbnail) {
      return;
    }

    var wrapper = movieFile.videoWrapper || {};
    var videoWrapper = document.createElement("div");
    var videoThumb = document.createElement("img");

    videoWrapper.className = "thumb-video-wrapper";
    applyWrapperStyle(
      videoWrapper,
      wrapper.top,
      wrapper.left,
      wrapper.width,
      wrapper.height,
      "none",
    );

    videoThumb.className = "thumb-video-thumb";
    videoThumb.src = resolveAssetPath(movieFile.thumbnail);
    videoThumb.alt = "";
    videoThumb.setAttribute("aria-hidden", "true");
    videoThumb.loading = "lazy";

    videoWrapper.appendChild(videoThumb);
    media.appendChild(videoWrapper);
  }

  function buildThumbButton(group, groupIndex, project, itemIndex) {
    var button = document.createElement("button");
    var media = document.createElement("div");
    var baseImage = document.createElement("img");
    var imageOne = project["image-one"] || {};
    var imageTwo = project["image-two"] || {};
    var movieFile = project.movieFile || {};

    button.type = "button";
    button.className = "project-thumb";
    button.dataset.key = "g" + groupIndex + "-i" + itemIndex;
    button.dataset.id = project.id || "";
    button.dataset.group = group.name;
    button.dataset.title = project.title || "";
    button.dataset.category = project.category || "";
    button.dataset.description = project.description || "";
    button.dataset.tags = (project.tags || []).join("||");
    button.dataset.base = project["base-img"] || "";
    button.dataset.mask = project["mask-img"] || "";

    button.dataset.imageOne = imageOne.src || "";
    button.dataset.imageOneParentTop = (imageOne.parentWrapper || {}).top || "";
    button.dataset.imageOneParentLeft =
      (imageOne.parentWrapper || {}).left || "";
    button.dataset.imageOneParentWidth =
      (imageOne.parentWrapper || {}).width || "";
    button.dataset.imageOneParentHeight =
      (imageOne.parentWrapper || {}).height || "";
    button.dataset.imageOneParentTransform =
      (imageOne.parentWrapper || {}).transform || "";
    button.dataset.imageOneTransformWidth =
      (imageOne.imageTransform || {}).width || "";
    button.dataset.imageOneTransform =
      (imageOne.imageTransform || {}).transform || "";

    button.dataset.imageTwo = imageTwo.src || "";
    button.dataset.imageTwoParentTop = (imageTwo.parentWrapper || {}).top || "";
    button.dataset.imageTwoParentLeft =
      (imageTwo.parentWrapper || {}).left || "";
    button.dataset.imageTwoParentWidth =
      (imageTwo.parentWrapper || {}).width || "";
    button.dataset.imageTwoParentHeight =
      (imageTwo.parentWrapper || {}).height || "";
    button.dataset.imageTwoParentTransform =
      (imageTwo.parentWrapper || {}).transform || "";
    button.dataset.imageTwoTransformWidth =
      (imageTwo.imageTransform || {}).width || "";
    button.dataset.imageTwoTransform =
      (imageTwo.imageTransform || {}).transform || "";

    button.dataset.videoThumb = movieFile.thumbnail || "";
    button.dataset.videoSrc = movieFile.src || "";
    button.dataset.videoWrapTop = (movieFile.videoWrapper || {}).top || "";
    button.dataset.videoWrapLeft = (movieFile.videoWrapper || {}).left || "";
    button.dataset.videoWrapWidth = (movieFile.videoWrapper || {}).width || "";
    button.dataset.videoWrapHeight =
      (movieFile.videoWrapper || {}).height || "";

    button.setAttribute("aria-label", "Open " + (project.title || "project"));

    media.className = "thumb-media";

    var loader = document.createElement("div");
    loader.className = "shimmer-loader";
    loader.setAttribute("aria-hidden", "true");
    media.appendChild(loader);

    if (project["base-img"]) {
      baseImage.className = "thumb-base";
      baseImage.src = resolveAssetPath(project["base-img"]);
      baseImage.alt = (project.title || "Project") + " thumbnail";
      baseImage.loading = "lazy";
      baseImage.dataset.id = project.id || "";
      media.appendChild(baseImage);
    }

    appendOverlayLayer(media, imageOne);
    appendOverlayLayer(media, imageTwo);
    appendVideoThumb(media, movieFile);

    if (project["mask-img"]) {
      var mask = document.createElement("img");
      mask.className = "thumb-mask";
      mask.src = resolveAssetPath(project["mask-img"]);
      mask.alt = "";
      mask.setAttribute("aria-hidden", "true");
      mask.loading = "lazy";
      media.appendChild(mask);
    }

    button.appendChild(media);
    button.addEventListener("click", function () {
      selectThumb(button);
    });

    trackMediaLoading(
      media,
      Array.prototype.slice.call(media.querySelectorAll("img")),
    );

    return button;
  }

  function renderProjects(payload) {
    var groups = payload.groups || [];

    partnerGrid.innerHTML = "";
    thumbStrip.innerHTML = "";

    groups.forEach(function (group, groupIndex) {
      partnerGrid.appendChild(buildPartnerButton(group));

      (group.items || []).forEach(function (project, itemIndex) {
        thumbStrip.appendChild(
          buildThumbButton(group, groupIndex, project, itemIndex),
        );
      });
    });

    partnerButtons = Array.prototype.slice.call(
      partnerGrid.querySelectorAll(".partner-button"),
    );
    thumbs = Array.prototype.slice.call(
      thumbStrip.querySelectorAll(".project-thumb"),
    );

    state.group = payload.defaultGroup || (groups[0] ? groups[0].name : "");
    state.category = "All";
    state.activeKey = "";

    if (status) {
      status.textContent = groups.length
        ? "Loaded " + groups.length + " project groups."
        : "No projects found.";
    }

    syncView();
    initThumbStripNav();
  }

  function loadProjects() {
    if (status) {
      status.textContent = "Loading projects\u2026";
    }

    fetch(dataUrl, {
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }

        return response.json();
      })
      .then(function (payload) {
        renderProjects(payload);
      })
      .catch(function (error) {
        if (status) {
          status.textContent = "Error loading projects.json: " + error.message;
        }
      });
  }

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
    if (!thumbStrip) {
      return;
    }

    var wrapper =
      thumbStrip.closest(".projects-stage") || thumbStrip.parentElement;
    if (!wrapper) {
      return;
    }

    var prevBtn = thumbPrev || wrapper.querySelector("[data-thumb-prev]");
    var nextBtn = thumbNext || wrapper.querySelector("[data-thumb-next]");

    if (!prevBtn || !nextBtn) {
      return;
    }

    var scrollAmount = function () {
      return thumbStrip.clientWidth * 0.8;
    };

    var updateButtonStates = function () {
      var maxScroll = thumbStrip.scrollWidth - thumbStrip.clientWidth;
      var atStart = thumbStrip.scrollLeft <= 1;
      var atEnd = thumbStrip.scrollLeft >= maxScroll - 1;

      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
    };

    prevBtn.onclick = function () {
      thumbStrip.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    };

    nextBtn.onclick = function () {
      thumbStrip.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    };

    thumbStrip.removeEventListener("scroll", updateButtonStates);
    thumbStrip.addEventListener("scroll", updateButtonStates);
    window.addEventListener("resize", updateButtonStates);

    updateButtonStates();
  }

  loadProjects();
})();
