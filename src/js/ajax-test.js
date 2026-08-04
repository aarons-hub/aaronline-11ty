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
  var dataUrl = page.getAttribute("data-projects-url") || "/data/projects.json";
  var assetPrefix = page.getAttribute("data-asset-prefix") || "/";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

  function buildStyleString(styleMap) {
    return Object.keys(styleMap)
      .filter(function (key) {
        return Boolean(styleMap[key]);
      })
      .map(function (key) {
        return key + ": " + styleMap[key];
      })
      .join("; ");
  }

  function renderOverlayLayer(layer) {
    if (!layer || !layer.src) {
      return "";
    }

    var parent = layer.parentWrapper || {};
    var transform = layer.imageTransform || {};
    var parentStyle = buildStyleString({
      top: parent.top || "0%",
      left: parent.left || "0%",
      width: parent.width || "100%",
      height: parent.height || "100%",
      transform: parent.transform || "none",
    });
    var imageStyle = buildStyleString({
      width: transform.width || "100%",
      transform: transform.transform || "none",
    });

    return (
      '<div class="thumb-parent-wrapper" style="' +
      escapeHtml(parentStyle) +
      '">' +
      '<img class="thumb-overlay" src="' +
      escapeHtml(resolveAssetPath(layer.src)) +
      '" alt="" aria-hidden="true" loading="lazy" style="' +
      escapeHtml(imageStyle) +
      '">' +
      "</div>"
    );
  }

  function renderVideoThumb(movieFile) {
    if (!movieFile || !movieFile.thumbnail) {
      return "";
    }

    var wrapper = movieFile.videoWrapper || {};
    var wrapperStyle = buildStyleString({
      top: wrapper.top || "0%",
      left: wrapper.left || "0%",
      width: wrapper.width || "100%",
      height: wrapper.height || "100%",
    });

    return (
      '<div class="thumb-video-wrapper" style="' +
      escapeHtml(wrapperStyle) +
      '">' +
      '<img class="thumb-video-thumb" src="' +
      escapeHtml(resolveAssetPath(movieFile.thumbnail)) +
      '" alt="" aria-hidden="true" loading="lazy">' +
      "</div>"
    );
  }

  function renderThumbMedia(item, title) {
    var baseImage = resolveAssetPath(item["base-img"] || "");
    var maskImage = resolveAssetPath(item["mask-img"] || "");
    var imageOne = item["image-one"] || {};
    var imageTwo = item["image-two"] || {};
    var movieFile = item.movieFile || {};

    if (!baseImage) {
      return "";
    }

    return (
      '<div class="thumb-media">' +
      '<img class="thumb-base" src="' +
      escapeHtml(baseImage) +
      '" alt="' +
      escapeHtml((title || "Project") + " thumbnail") +
      '" loading="lazy">' +
      renderOverlayLayer(imageOne) +
      renderOverlayLayer(imageTwo) +
      renderVideoThumb(movieFile) +
      (maskImage
        ? '<img class="thumb-mask" src="' +
          escapeHtml(maskImage) +
          '" alt="" aria-hidden="true" loading="lazy">'
        : "") +
      "</div>"
    );
  }

  function getInlineImageData(item) {
    var imageOne = item["image-one"] || {};
    var imageTwo = item["image-two"] || {};
    var movieFile = item.movieFile || {};

    return {
      baseImage: resolveAssetPath(item["base-img"] || ""),
      maskImage: resolveAssetPath(item["mask-img"] || ""),
      imageOne: {
        src: resolveAssetPath(imageOne.src || ""),
        parentWrapper: imageOne.parentWrapper || {},
        imageTransform: imageOne.imageTransform || {},
      },
      imageTwo: {
        src: resolveAssetPath(imageTwo.src || ""),
        parentWrapper: imageTwo.parentWrapper || {},
        imageTransform: imageTwo.imageTransform || {},
      },
      movieFile: {
        thumbnail: resolveAssetPath(movieFile.thumbnail || ""),
        src: resolveAssetPath(movieFile.src || ""),
        videoWrapper: movieFile.videoWrapper || {},
      },
    };
  }

  function toInlineJson(value) {
    return escapeHtml(JSON.stringify(value, null, 2));
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

    results.innerHTML = [
      '<ul class="ajax-test-list">',
      items
        .map(function (item) {
          var thumbMarkup = renderThumbMedia(item.source, item.title);
          var inlineData = getInlineImageData(item.source);

          return (
            '<li class="ajax-test-card">' +
            "<h3>" +
            escapeHtml(item.title || "Untitled") +
            "</h3>" +
            "<p>" +
            escapeHtml(item.group || "") +
            (item.category ? " | " + escapeHtml(item.category) : "") +
            "</p>" +
            '<div class="ajax-test-thumb">' +
            thumbMarkup +
            "</div>" +
            '<pre class="ajax-test-inline-data">' +
            toInlineJson(inlineData) +
            "</pre>" +
            "</li>"
          );
        })
        .join(""),
      "</ul>",
    ].join("");

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
