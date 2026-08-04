(function () {
  var page = document.querySelector(".ajax-test-page");
  if (!page) {
    return;
  }

  var buttons = Array.prototype.slice.call(
    page.querySelectorAll("[data-load-featured]"),
  );
  var status = page.querySelector("[data-status]");
  var results = page.querySelector("[data-results]");
  var cardTemplate = page.querySelector("#ajax-test-card-template");
  var heroInfo = page.querySelector("[data-hero-info]");
  var heroBase = page.querySelector("[data-hero-base]");
  var heroFrame = page.querySelector(".hero-frame");
  var heroWrapOne = page.querySelector("[data-hero-wrap-one]");
  var heroWrapTwo = page.querySelector("[data-hero-wrap-two]");
  var heroImageOne = page.querySelector("[data-hero-image-one]");
  var heroImageTwo = page.querySelector("[data-hero-image-two]");
  var heroMask = page.querySelector("[data-hero-mask]");
  var heroVideoLayer = page.querySelector("[data-hero-video-layer]");
  var heroVideoThumb = page.querySelector("[data-hero-video-thumb]");
  var heroVideoWrap = page.querySelector("[data-hero-video-wrap]");
  var heroVideoLink = page.querySelector("[data-hero-video-link]");
  var dataUrl = page.getAttribute("data-projects-url") || "/data/projects.json";
  var assetPrefix = page.getAttribute("data-asset-prefix") || "/";

  if (!cardTemplate) {
    return;
  }

  var state = {
    activeKey: "",
    activeFeatureField: "",
  };

  function isTruthy(value) {
    return String(value).toLowerCase().trim() === "true";
  }

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

  function setLayerStyle(element, styles) {
    Object.keys(styles).forEach(function (key) {
      if (styles[key]) {
        element.style[key] = styles[key];
      }
    });
  }

  function configureDecorativeImage(image) {
    if (!image) {
      return;
    }

    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.setAttribute("role", "presentation");
    image.addEventListener(
      "error",
      function () {
        image.style.display = "none";
      },
      { once: true },
    );
  }

  function trackMediaLoading(media, images) {
    if (!media) {
      return;
    }

    var pending = images.filter(function (image) {
      return image && !(image.complete && image.naturalWidth > 0);
    }).length;

    media.classList.toggle("is-loading", pending > 0);

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
          media.classList.remove("is-loading");
        }
      };

      image.addEventListener("load", settle, { once: true });
      image.addEventListener("error", settle, { once: true });
    });
  }

  function createOverlayLayer(layer) {
    if (!layer || !layer.src) {
      return null;
    }

    var parent = layer.parentWrapper || {};
    var transform = layer.imageTransform || {};
    var wrapper = document.createElement("div");
    var image = document.createElement("img");

    wrapper.className = "thumb-parent-wrapper";
    image.className = "thumb-overlay";
    image.src = resolveAssetPath(layer.src);
    image.loading = "lazy";
    configureDecorativeImage(image);

    setLayerStyle(wrapper, {
      top: parent.top || "0%",
      left: parent.left || "0%",
      width: parent.width || "100%",
      height: parent.height || "100%",
      transform: parent.transform || "none",
    });

    setLayerStyle(image, {
      width: transform.width || "100%",
      transform: transform.transform || "none",
    });

    wrapper.appendChild(image);
    return wrapper;
  }

  function createVideoThumb(movieFile) {
    if (!movieFile || !movieFile.thumbnail) {
      return null;
    }

    var wrapper = movieFile.videoWrapper || {};
    var videoWrapper = document.createElement("div");
    var videoThumb = document.createElement("img");

    videoWrapper.className = "thumb-video-wrapper";
    videoThumb.className = "thumb-video-thumb";
    videoThumb.src = resolveAssetPath(movieFile.thumbnail);
    videoThumb.loading = "lazy";
    configureDecorativeImage(videoThumb);

    setLayerStyle(videoWrapper, {
      top: wrapper.top || "0%",
      left: wrapper.left || "0%",
      width: wrapper.width || "100%",
      height: wrapper.height || "100%",
    });

    videoWrapper.appendChild(videoThumb);
    return videoWrapper;
  }

  function setImage(target, src, alt) {
    if (!target) {
      return;
    }

    if (!src) {
      target.removeAttribute("src");
      target.classList.add("is-hidden");
      return;
    }

    target.classList.remove("is-hidden");
    target.src = src;
    target.alt = alt || "";
  }

  function setHeroLayer(wrapper, image, layer, title, label) {
    if (!wrapper || !image) {
      return;
    }

    if (!layer || !layer.src) {
      wrapper.classList.add("is-hidden");
      image.removeAttribute("src");
      return;
    }

    var parent = layer.parentWrapper || {};
    var transform = layer.imageTransform || {};

    wrapper.classList.remove("is-hidden");
    setLayerStyle(wrapper, {
      top: parent.top || "0%",
      left: parent.left || "0%",
      width: parent.width || "100%",
      height: parent.height || "100%",
      transform: parent.transform || "none",
    });

    image.src = resolveAssetPath(layer.src);
    image.alt = (title || "Project") + " " + label;
    setLayerStyle(image, {
      width: transform.width || "100%",
      transform: transform.transform || "none",
    });
  }

  function setHeroVideo(movieFile, title) {
    if (
      !heroVideoLayer ||
      !heroVideoThumb ||
      !heroVideoWrap ||
      !heroVideoLink
    ) {
      return;
    }

    var wrapper = (movieFile && movieFile.videoWrapper) || {};
    var thumbnail = movieFile && movieFile.thumbnail;
    var source = movieFile && movieFile.src;

    if (!thumbnail) {
      heroVideoLayer.classList.add("is-hidden");
      heroVideoLayer.removeAttribute("href");
      heroVideoThumb.removeAttribute("src");
    } else {
      heroVideoLayer.classList.remove("is-hidden");
      heroVideoThumb.src = resolveAssetPath(thumbnail);
      heroVideoThumb.alt = (title || "Project") + " video preview";
      setLayerStyle(heroVideoLayer, {
        top: wrapper.top || "0%",
        left: wrapper.left || "0%",
        width: wrapper.width || "100%",
        height: wrapper.height || "100%",
      });

      if (source) {
        heroVideoLayer.href = resolveAssetPath(source);
        heroVideoLayer.setAttribute(
          "aria-label",
          "Open " + (title || "project") + " video",
        );
      } else {
        heroVideoLayer.href = "#";
      }
    }

    if (source) {
      heroVideoWrap.classList.remove("is-hidden");
      heroVideoLink.href = resolveAssetPath(source);
      heroVideoLink.textContent = "Open video source";
    } else {
      heroVideoWrap.classList.add("is-hidden");
      heroVideoLink.removeAttribute("href");
      heroVideoLink.textContent = "No video source";
    }
  }

  function renderHeroInfo(title, group, category) {
    if (!heroInfo) {
      return;
    }

    var heading = title || "Untitled";
    var meta = (group || "") + (category ? " | " + category : "");
    var headingNode = document.createElement("h3");
    var metaNode = document.createElement("p");

    headingNode.textContent = heading;
    metaNode.textContent = meta;

    heroInfo.innerHTML = "";
    heroInfo.appendChild(headingNode);
    heroInfo.appendChild(metaNode);
  }

  function renderHero(itemData, title, group, category) {
    var imageOne = itemData["image-one"] || {};
    var imageTwo = itemData["image-two"] || {};
    var movieFile = itemData.movieFile || {};
    var heroImages = [];

    renderHeroInfo(title, group, category);

    setImage(
      heroBase,
      resolveAssetPath(itemData["base-img"] || ""),
      (title || "Project") + " showcase",
    );
    if (heroBase && heroBase.getAttribute("src")) {
      heroImages.push(heroBase);
    }

    setHeroLayer(heroWrapOne, heroImageOne, imageOne, title, "image one");
    setHeroLayer(heroWrapTwo, heroImageTwo, imageTwo, title, "image two");
    setHeroVideo(movieFile, title);

    if (heroImageOne && heroImageOne.getAttribute("src")) {
      heroImages.push(heroImageOne);
    }

    if (heroImageTwo && heroImageTwo.getAttribute("src")) {
      heroImages.push(heroImageTwo);
    }

    if (heroVideoThumb && heroVideoThumb.getAttribute("src")) {
      heroImages.push(heroVideoThumb);
    }

    if (itemData["mask-img"]) {
      setImage(
        heroMask,
        resolveAssetPath(itemData["mask-img"]),
        (title || "Project") + " mask overlay",
      );
      if (heroMask && heroMask.getAttribute("src")) {
        heroImages.push(heroMask);
      }
    } else if (heroMask) {
      heroMask.classList.add("is-hidden");
      heroMask.removeAttribute("src");
    }

    trackMediaLoading(heroFrame, heroImages);
  }

  function updateActiveCard() {
    var cards = page.querySelectorAll(".ajax-test-card[data-item-key]");
    cards.forEach(function (card) {
      card.classList.toggle(
        "is-active",
        card.dataset.itemKey === state.activeKey,
      );
    });
  }

  function renderThumbMedia(media, item, title) {
    var baseImage = resolveAssetPath(item["base-img"] || "");
    var maskImage = resolveAssetPath(item["mask-img"] || "");
    var imageOne = item["image-one"] || {};
    var imageTwo = item["image-two"] || {};
    var movieFile = item.movieFile || {};
    var mediaImages = [];

    var baseImageNode = media.querySelector("[data-thumb-base]");

    if (!baseImage) {
      media.remove();
      return;
    }

    if (baseImageNode) {
      baseImageNode.src = baseImage;
      configureDecorativeImage(baseImageNode);
      mediaImages.push(baseImageNode);
    }

    var layerOne = createOverlayLayer(imageOne);
    var layerTwo = createOverlayLayer(imageTwo);
    var video = createVideoThumb(movieFile);

    if (layerOne) {
      media.appendChild(layerOne);
      mediaImages.push(layerOne.querySelector("img"));
    }

    if (layerTwo) {
      media.appendChild(layerTwo);
      mediaImages.push(layerTwo.querySelector("img"));
    }

    if (video) {
      media.appendChild(video);
      mediaImages.push(video.querySelector("img"));
    }

    if (maskImage) {
      var mask = document.createElement("img");
      mask.className = "thumb-mask";
      mask.src = maskImage;
      mask.loading = "lazy";
      configureDecorativeImage(mask);
      media.appendChild(mask);
      mediaImages.push(mask);
    }

    trackMediaLoading(media, mediaImages);
  }

  function getFieldLabel(featureField) {
    if (featureField === "featuredLogoItem") {
      return "featured logo";
    }

    if (featureField === "featuredPhotoItem") {
      return "featured photo";
    }

    return "featured web";
  }

  function renderItems(items, featureField) {
    if (!items.length) {
      results.innerHTML = "<p>No matching items were found.</p>";
      return;
    }

    var list = document.createElement("ul");
    list.className = "ajax-test-list";
    var firstItem = null;

    items.forEach(function (item, index) {
      var cardFragment = cardTemplate.content.cloneNode(true);
      var card = cardFragment.querySelector(".ajax-test-card");
      var media = cardFragment.querySelector("[data-thumb-media]");
      var itemKey = featureField + "-" + index;

      if (card) {
        card.dataset.itemKey = itemKey;
      }

      if (media) {
        renderThumbMedia(media, item.source, item.title);
      }

      if (card) {
        card.addEventListener("click", function () {
          state.activeKey = itemKey;
          state.activeFeatureField = featureField;
          updateActiveCard();
          renderHero(item.source, item.title, item.group, item.category);
        });
      }

      if (!firstItem) {
        firstItem = {
          key: itemKey,
          source: item.source,
          title: item.title,
          group: item.group,
          category: item.category,
        };
      }

      list.appendChild(cardFragment);
    });

    results.innerHTML = "";
    results.appendChild(list);

    if (firstItem) {
      state.activeKey = firstItem.key;
      state.activeFeatureField = featureField;
      updateActiveCard();
      renderHero(
        firstItem.source,
        firstItem.title,
        firstItem.group,
        firstItem.category,
      );
    }

    status.textContent =
      "Loaded " + items.length + " " + getFieldLabel(featureField) + " items.";
  }

  function loadFeatured(featureField, triggerButton) {
    status.textContent = "Loading...";
    triggerButton.disabled = true;
    results.innerHTML = "";

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
        var featured = [];

        (payload.groups || []).forEach(function (group) {
          (group.items || []).forEach(function (item) {
            if (isTruthy(item[featureField])) {
              featured.push({
                group: group.name,
                title: item.title,
                category: item.category,
                source: item,
              });
            }
          });
        });

        renderItems(featured, featureField);
      })
      .catch(function (error) {
        status.textContent = "Error loading projects.json: " + error.message;
        results.innerHTML = "";
      })
      .finally(function () {
        buttons.forEach(function (candidate) {
          candidate.disabled = false;
        });
      });
  }

  function updateSelectedButton(activeButton) {
    buttons.forEach(function (button) {
      button.classList.toggle("selected", button === activeButton);
    });
  }

  buttons.forEach(function (currentButton) {
    currentButton.addEventListener("click", function () {
      updateSelectedButton(currentButton);
      loadFeatured(currentButton.dataset.featureField, currentButton);
    });
  });

  var initialButton = buttons.find(function (button) {
    return button.dataset.featureField === "featuredWebItem";
  });

  if (!initialButton && buttons.length) {
    initialButton = buttons[0];
  }

  if (initialButton) {
    updateSelectedButton(initialButton);
    loadFeatured(initialButton.dataset.featureField, initialButton);
  }
})();
