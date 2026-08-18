---
title: Services
layout: base.njk
templateEngineOverride: njk
---

<section class="services-page" data-default-group="Lime Recruiting">
	<aside class="services-sidebar services-sidebar">
		<h2 class="services-title">Services</h2>
		<h3 class="services-subtitle">Web services</h3>
		<p class="services-intro">
			We build and manage WordPress websites that are fast, secure, and easy to update.
		</p>
		<p class="services-intro">
			Whether you need a simple refresh or ongoing care, we keep your site running smoothly so
			you do not have to worry about technical overhead.
		</p>
    	<div class="category-filters services-filters" aria-label="Service category filters">
    		<button type="button" class="category-button is-active" data-category="Website">Web services</button>
    		<button type="button" class="category-button" data-category="Logo design">Brand design</button>
    		<button type="button" class="category-button" data-category="Photography">Photography</button>
    	</div>
    	<div class="project-meta services-meta">
    		<h4 class="meta-group" data-project-group>Lime Recruiting</h4>
    		<p class="meta-title" data-project-title>Landing page</p>
    		<p class="meta-description" data-project-description></p>
    		<div class="meta-tags" data-project-tags></div>
    	</div>
    </aside>
    <section class="services-stage" aria-live="polite">
    	<div class="thumb-strip" data-thumb-strip>
    		{% for group in projects.groups %}
    			{% set groupIndex = loop.index0 %}
    			{% for project in group.items %}
    		<button
    			type="button"
    			class="project-thumb"
    			data-key="g{{ groupIndex }}-i{{ loop.index0 }}"
    			data-group="{{ group.name }}"
    			data-title="{{ project.title | escape }}"
    			data-category="{{ project.category | escape }}"
    			data-featured-web="{{ project.featuredWebItem | default('') | escape }}"
    			data-featured-logo="{{ project.featuredLogoItem | default('') | escape }}"
    			data-featured-photo="{{ project.featuredPhotoItem | default('') | escape }}"
    			data-description="{{ project.description | default('') | escape }}"
    			data-tags="{{ project.tags | join('||') | escape }}"
    			data-base="{{ project['base-img'] | escape }}"
    			data-mask="{{ project['mask-img'] | escape }}"
    			data-image-one="{{ project['image-one']['src'] | escape }}"
    			data-image-one-parent-top="{{ project['image-one']['parentWrapper']['top'] | escape }}"
    			data-image-one-parent-left="{{ project['image-one']['parentWrapper']['left'] | escape }}"
    			data-image-one-parent-width="{{ project['image-one']['parentWrapper']['width'] | escape }}"
    			data-image-one-parent-height="{{ project['image-one']['parentWrapper']['height'] | escape }}"
    			data-image-one-parent-transform="{{ project['image-one']['parentWrapper']['transform'] | escape }}"
    			data-image-one-transform-width="{{ project['image-one']['imageTransform']['width'] | escape }}"
    			data-image-one-transform="{{ project['image-one']['imageTransform']['transform'] | escape }}"
    			data-image-two="{{ project['image-two']['src'] | escape }}"
    			data-image-two-parent-top="{{ project['image-two']['parentWrapper']['top'] | escape }}"
    			data-image-two-parent-left="{{ project['image-two']['parentWrapper']['left'] | escape }}"
    			data-image-two-parent-width="{{ project['image-two']['parentWrapper']['width'] | escape }}"
    			data-image-two-parent-height="{{ project['image-two']['parentWrapper']['height'] | escape }}"
    			data-image-two-parent-transform="{{ project['image-two']['parentWrapper']['transform'] | escape }}"
    			data-image-two-transform-width="{{ project['image-two']['imageTransform']['width'] | escape }}"
    			data-image-two-transform="{{ project['image-two']['imageTransform']['transform'] | escape }}"
    			data-video-thumb="{{ project['movieFile']['thumbnail'] | escape }}"
    			data-video-src="{{ project['movieFile']['src'] | escape }}"
    			data-video-wrap-top="{{ project['movieFile']['videoWrapper']['top'] | escape }}"
    			data-video-wrap-left="{{ project['movieFile']['videoWrapper']['left'] | escape }}"
    			data-video-wrap-width="{{ project['movieFile']['videoWrapper']['width'] | escape }}"
    			data-video-wrap-height="{{ project['movieFile']['videoWrapper']['height'] | escape }}"
    			aria-label="Open {{ project.title }}"
    		>
    			<div class="thumb-media">
    				<img class="thumb-base" src="{{ project['base-img'] | url }}" alt="{{ project.title }} thumbnail" loading="lazy">

    				{% if project['image-one']['src'] != "" %}
    				<div
    					class="thumb-parent-wrapper"
    					style="top: {{ project['image-one']['parentWrapper']['top'] }}; left: {{ project['image-one']['parentWrapper']['left'] }}; width: {{ project['image-one']['parentWrapper']['width'] }}; height: {{ project['image-one']['parentWrapper']['height'] }}; transform: {{ project['image-one']['parentWrapper']['transform'] }};"
    				>
    					<img
    						class="thumb-overlay"
    						src="{{ project['image-one']['src'] | url }}"
    						alt=""
    						aria-hidden="true"
    						loading="lazy"
    						style="width: {{ project['image-one']['imageTransform']['width'] }}; transform: {{ project['image-one']['imageTransform']['transform'] }};"
    					>
    				</div>
    				{% endif %}

    				{% if project['image-two']['src'] != "" %}
    				<div
    					class="thumb-parent-wrapper"
    					style="top: {{ project['image-two']['parentWrapper']['top'] }}; left: {{ project['image-two']['parentWrapper']['left'] }}; width: {{ project['image-two']['parentWrapper']['width'] }}; height: {{ project['image-two']['parentWrapper']['height'] }}; transform: {{ project['image-two']['parentWrapper']['transform'] }};"
    				>
    					<img
    						class="thumb-overlay"
    						src="{{ project['image-two']['src'] | url }}"
    						alt=""
    						aria-hidden="true"
    						loading="lazy"
    						style="width: {{ project['image-two']['imageTransform']['width'] }}; transform: {{ project['image-two']['imageTransform']['transform'] }};"
    					>
    				</div>
    				{% endif %}

    				{% if project['movieFile']['thumbnail'] != "" %}
    				<div
    					class="thumb-video-wrapper"
    					style="top: {{ project['movieFile']['videoWrapper']['top'] }}; left: {{ project['movieFile']['videoWrapper']['left'] }}; width: {{ project['movieFile']['videoWrapper']['width'] }}; height: {{ project['movieFile']['videoWrapper']['height'] }};"
    				>
    					<img
    						class="thumb-video-thumb"
    						src="{{ project['movieFile']['thumbnail'] | url }}"
    						alt=""
    						aria-hidden="true"
    						loading="lazy"
    					>
    				</div>
    				{% endif %}

    				{% if project['mask-img'] != "" %}
    				<img class="thumb-mask" src="{{ project['mask-img'] | url }}" alt="" aria-hidden="true" loading="lazy">
    				{% endif %}
    			</div>
    		</button>
    			{% endfor %}
    		{% endfor %}
    	</div>
       	<div class="hero-frame">
    		<img class="hero-base" data-hero-base src="" alt="Active service showcase">
    		<div class="parent-wrapper is-hidden" data-hero-wrap-one>
    			<img class="hero-overlay" data-hero-image-one src="" alt="Active service image one">
    		</div>
    		<div class="parent-wrapper is-hidden" data-hero-wrap-two>
    			<img class="hero-overlay" data-hero-image-two src="" alt="Active service image two">
    		</div>
    		<a class="video-wrapper is-hidden" data-hero-video-layer href="#" target="_blank" rel="noopener" aria-label="Open video preview">
    			<img class="hero-video-thumb" data-hero-video-thumb src="" alt="Video preview">
    		</a>
    		<img class="hero-mask is-hidden" data-hero-mask src="" alt="Active service mask overlay">
    	</div>
    	<div class="hero-video is-hidden" data-hero-video-wrap>
    		<a class="hero-video-link" data-hero-video-link href="#" target="_blank" rel="noopener">Open video source</a>
    	</div>
    	<div class="thumb-toolbar">
    		<button type="button" class="thumb-nav" data-thumb-prev aria-label="Previous examples">&#10094;</button>
    		<button type="button" class="thumb-nav" data-thumb-next aria-label="Next examples">&#10095;</button>
    	</div>
    </section>
    <div class="video-modal is-hidden" data-video-modal aria-hidden="true">
    	<div class="video-modal-backdrop" data-video-close></div>
    	<div class="video-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">
    		<button type="button" class="video-modal-close" data-video-close aria-label="Close video">&times;</button>
    		<h3 class="video-modal-title" id="video-modal-title" data-video-modal-title>Service video</h3>
    		<video class="video-modal-player" data-video-player controls playsinline preload="metadata"></video>
    	</div>
    </div>

</section>
