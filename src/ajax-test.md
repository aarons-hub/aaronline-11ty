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
