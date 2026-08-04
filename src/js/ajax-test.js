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
  var dataUrl = page.getAttribute("data-projects-url") || "/data/projects.json";
  var assetPrefix = page.getAttribute("data-asset-prefix") || "/";

  if (!cardTemplate) {
    return;
  }

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
    image.alt = "";
    image.loading = "lazy";
    image.setAttribute("aria-hidden", "true");

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
    videoThumb.alt = "";
    videoThumb.loading = "lazy";
    videoThumb.setAttribute("aria-hidden", "true");

    setLayerStyle(videoWrapper, {
      top: wrapper.top || "0%",
      left: wrapper.left || "0%",
      width: wrapper.width || "100%",
      height: wrapper.height || "100%",
    });

    videoWrapper.appendChild(videoThumb);
    return videoWrapper;
  }

  function renderThumbMedia(media, item, title) {
    var baseImage = resolveAssetPath(item["base-img"] || "");
    var maskImage = resolveAssetPath(item["mask-img"] || "");
    var imageOne = item["image-one"] || {};
    var imageTwo = item["image-two"] || {};
    var movieFile = item.movieFile || {};

    var baseImageNode = media.querySelector("[data-thumb-base]");

    if (!baseImage) {
      media.remove();
      return;
    }

    if (baseImageNode) {
      baseImageNode.src = baseImage;
      baseImageNode.alt = (title || "Project") + " thumbnail";
    }

    var layerOne = createOverlayLayer(imageOne);
    var layerTwo = createOverlayLayer(imageTwo);
    var video = createVideoThumb(movieFile);

    if (layerOne) {
      media.appendChild(layerOne);
    }

    if (layerTwo) {
      media.appendChild(layerTwo);
    }

    if (video) {
      media.appendChild(video);
    }

    if (maskImage) {
      var mask = document.createElement("img");
      mask.className = "thumb-mask";
      mask.src = maskImage;
      mask.alt = "";
      mask.loading = "lazy";
      mask.setAttribute("aria-hidden", "true");
      media.appendChild(mask);
    }
  }

  function getFieldLabel(featureField) {
    if (featureField === "featuredLogoItem") {
      return "featured logo";
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

    items.forEach(function (item) {
      var cardFragment = cardTemplate.content.cloneNode(true);
      var title = cardFragment.querySelector("[data-card-title]");
      var meta = cardFragment.querySelector("[data-card-meta]");
      var media = cardFragment.querySelector("[data-thumb-media]");

      title.textContent = item.title || "Untitled";
      meta.textContent =
        (item.group || "") + (item.category ? " | " + item.category : "");

      if (media) {
        renderThumbMedia(media, item.source, item.title);
      }

      list.appendChild(cardFragment);
    });

    results.innerHTML = "";
    results.appendChild(list);

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

  buttons.forEach(function (currentButton) {
    currentButton.addEventListener("click", function () {
      loadFeatured(currentButton.dataset.featureField, currentButton);
    });
  });
})();
