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
        <button type="button" class="ajax-test-button" data-load-featured data-feature-field="featuredPhotoItem">Load photo logo items</button>
	</div>
	<p class="ajax-test-status" data-status>Ready.</p>
	<div class="ajax-test-results" data-results></div>
    	<div class="ajax-test-hero">
		<div class="hero-info" data-hero-info></div>
		<div class="hero-frame">
			<div class="hero-loader" data-hero-loader aria-hidden="true"></div>
			<img class="hero-base" data-hero-base src="" alt="Active project showcase">
			<div class="parent-wrapper is-hidden" data-hero-wrap-one>
				<img class="hero-overlay" data-hero-image-one src="" alt="Active project image one">
			</div>
			<div class="parent-wrapper is-hidden" data-hero-wrap-two>
				<img class="hero-overlay" data-hero-image-two src="" alt="Active project image two">
			</div>
			<a class="video-wrapper is-hidden" data-hero-video-layer href="#" target="_blank" rel="noopener" aria-label="Open video preview">
				<img class="hero-video-thumb" data-hero-video-thumb src="" alt="Video preview">
			</a>
			<img class="hero-mask is-hidden" data-hero-mask src="" alt="Active project mask overlay">
		</div>
		<div class="hero-video is-hidden" data-hero-video-wrap>
			<a class="hero-video-link" data-hero-video-link href="#" target="_blank" rel="noopener">Open video source</a>
		</div>
	</div>
    <template id="ajax-test-card-template">
    	<li class="ajax-test-card">
    		<div class="ajax-test-thumb">
    			<div class="thumb-media" data-thumb-media>
	    			<div class="thumb-loader" data-thumb-loader aria-hidden="true"></div>
    				<img class="thumb-base" data-thumb-base src="" alt="" loading="lazy">
    			</div>
    		</div>
    	</li>
    </template>
</section>
