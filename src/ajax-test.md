---
title: AJAX Test
layout: base.njk
---

<section class="ajax-test-page" data-projects-url="{{ '/data/projects.json' | url }}" data-asset-prefix="{{ '/' | url }}">
	<h2>AJAX test</h2>
	<p>Click a button to fetch the public copy of <strong>projects.json</strong> and render items where the chosen featured flag is true, including related images.</p>
	<div class="ajax-test-actions">
		<button type="button" class="ajax-test-button" data-load-featured data-feature-field="featuredWebItem">Load featured web items</button>
		<button type="button" class="ajax-test-button" data-load-featured data-feature-field="featuredLogoItem">Load featured logo items</button>
	</div>
	<p class="ajax-test-status" data-status>Ready.</p>
	<div class="ajax-test-results" data-results></div>
</section>

<style>
	.ajax-test-page {
		max-width: 1100px;
		margin: 0 auto;
        border: 1px solid blue;
	}

	.ajax-test-button {
		padding: 12px 18px;
		border: 0;
		border-radius: 999px;
		background: var(--near-black);
		color: var(--base-white);
		font: inherit;
		cursor: pointer;
	}

	.ajax-test-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.ajax-test-button:disabled {
		opacity: 0.65;
		cursor: wait;
	}

	.ajax-test-results {
		margin-top: 20px;
	}

	.ajax-test-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 16px;
	}

	.ajax-test-card {
		padding: 16px;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.84);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
	}

	.ajax-test-card h3 {
		margin: 0 0 6px;
		font-size: 1.05rem;
	}

	.ajax-test-card p {
		margin: 0 0 10px;
		font-size: 0.95rem;
	}

	.ajax-test-images {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
		gap: 8px;
	}

	.ajax-test-images img {
		width: 100%;
		height: 90px;
		object-fit: cover;
		border-radius: 12px;
		background: #f4f4f4;
	}
</style>

<script>
(function () {
	var page = document.querySelector(".ajax-test-page");
	if (!page) {
		return;
	}

	var button = page.querySelector("[data-load-featured]");
	var buttons = Array.prototype.slice.call(page.querySelectorAll("[data-load-featured]"));
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

	function getRelatedImages(item) {
		var images = [
			item["base-img"],
			item["mask-img"],
			item["image-one"] && item["image-one"].src,
			item["image-two"] && item["image-two"].src,
			item.movieFile && item.movieFile.thumbnail,
		];

		return images.filter(Boolean);
	}

	function renderItems(items) {
		if (!items.length) {
			results.innerHTML = "<p>No featured web items were found.</p>";
			return;
		}

		results.innerHTML = [
			"<ul class=\"ajax-test-list\">",
			items
				.map(function (item) {
					var relatedImages = getRelatedImages(item.source).map(function (image) {
						return resolveAssetPath(image);
					});

					return (
						"<li class=\"ajax-test-card\">" +
						"<h3>" +
						escapeHtml(item.title || "Untitled") +
						"</h3>" +
						"<p>" +
						escapeHtml(item.group || "") +
						(item.category ? " · " + escapeHtml(item.category) : "") +
						"</p>" +
						"<div class=\"ajax-test-images\">" +
						relatedImages
							.map(function (image) {
								return (
									"<img src=\"" +
									escapeHtml(image) +
									"\" alt=\"" +
									escapeHtml(item.title || "Featured project") +
									" related image\" loading=\"lazy\">"
								);
							})
							.join("") +
						"</div>" +
						"</li>"
					);
				})
				.join(""),
			"</ul>",
		].join("");
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

				renderItems(featured);
				status.textContent = "Loaded " + featured.length + " featured web items.";
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
</script>
