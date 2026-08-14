---
title: Work
layout: base.njk
templateEngineOverride: njk
---

<div id="portfolio-grid">
  {% for group in portfolio.groups %}
    {% for item in group.items %}
      <article
        class="portfolio-item"
        data-category="{{ item.category }}"
        data-tags="{{ item.tags | join(',') }}"
        data-group="{{ group.name }}"
      >
        <img src="{{ item['base-img'] }}" alt="{{ item.title }}">
        <h3>{{ item.title }}</h3>
        <span class="tag">{{ item.category }}</span>
      </article>
    {% endfor %}
  {% endfor %}
</div>

<nav class="filter-nav" aria-label="Filter portfolio">
  <a href="?category=all" data-filter-link>All</a>
  <a href="?category=Website" data-filter-link>Website</a>
  <a href="?category=Branding" data-filter-link>Branding</a>
  <a href="?category=Logo%20design" data-filter-link>Logo design</a>
  <a href="?category=Photography" data-filter-link>Photography</a>
</nav>
