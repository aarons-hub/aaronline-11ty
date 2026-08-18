---
title: Projects
layout: base.njk
---

<section>
  <div class="container ink bkg">
    <div class="row gap-60 intro">
      <div class="col">
        <div class="cta-text-group">
          <p class="section-label">Our work</p>
          <h3 class="cta-heading">Explore some of our projects.</h3>
        </div>
      </div>
      <div class="col">
        <div class="row select">
          <div class="col sth-west-icon"></div>
          <div class="col select">
            <p>Select from the tiles at the left of this page.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section
  class="projects-page ajax-projects-page"
  data-projects-url="{{ '/data/projects.json' | url }}"
  data-asset-prefix="{{ '/' | url }}"
  aria-live="polite"
>
  <div class="content thumbs">
    <div class="project-meta">
      <h4 class="meta-group" data-project-group>Group</h4>
      <p class="meta-description" data-project-description></p>
      <div class="meta-tags" data-project-tags></div>
    </div>
    <div class="thumb-toolbar">
      <button
        type="button"
        class="thumb-nav prev"
        data-thumb-prev
        aria-label="Previous projects"
      >
        Previous
      </button>
      <button
        type="button"
        class="thumb-nav next"
        data-thumb-next
        aria-label="Next projects"
      >
        Next
      </button>
    </div>
    <div class="thumb-strip" data-thumb-strip></div>
  </div>
  <div class="content hero">
    <div class="partner-grid" data-partner-grid></div>
    <div class="hero-frame">
      <span class="shimmer-loader" aria-hidden="true"></span>
      <img
        class="hero-base"
        data-hero-base
        src=""
        alt="Active project"
        loading="eager"
      />
      <div class="parent-wrapper is-hidden" data-hero-wrap-one>
        <img
          class="hero-overlay"
          data-hero-image-one
          src=""
          alt="Active project image one"
        />
      </div>
      <div class="parent-wrapper is-hidden" data-hero-wrap-two>
        <img
          class="hero-overlay"
          data-hero-image-two
          src=""
          alt="Active project image two"
        />
      </div>
      <a
        class="video-wrapper is-hidden"
        data-hero-video-layer
        href="#"
        target="_blank"
        rel="noopener"
        aria-label="Open video preview"
      >
        <img
          class="hero-video-thumb"
          data-hero-video-thumb
          src=""
          alt="Video preview"
        />
      </a>
      <img
        class="hero-mask is-hidden"
        data-hero-mask
        src=""
        alt="Active project mask overlay"
      />
    </div>
  </div>
  <div class="hero-video is-hidden" data-hero-video-wrap>
    <a
      class="hero-video-link"
      data-hero-video-link
      href="#"
      target="_blank"
      rel="noopener"
      >Open video source</a
    >
  </div>
  <div class="video-modal is-hidden" data-video-modal aria-hidden="true">
    <div class="video-modal-backdrop" data-video-close></div>
    <div
      class="video-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <button
        type="button"
        class="video-modal-close"
        data-video-close
        aria-label="Close video"
      >
        &times;
      </button>
      <h3
        class="video-modal-title"
        id="video-modal-title"
        data-video-modal-title
      >
        Project video
      </h3>
      <video
        class="video-modal-player"
        data-video-player
        controls
        playsinline
        preload="metadata"
      ></video>
    </div>
  </div>
</section>
