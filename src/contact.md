---
title: Contact
layout: base.njk
needsContactForm: true
---

<section class="contact-section">
  <div class="container ink">
    <div class="row gap-60">
      <div class="col">
      <p class="section-label">Contact</p>
      <h2>Get in touch.</h2>
	  <p mt-30>Have a project in mind? We would love to hear from you! Whether you have questions, want to discuss a potential collaboration, or just want to say hello, feel free to reach out.</p>
              <div class="cta-media">
            <img
              class="media"
              src="../images/thumbsup-smiley.webp"
              alt="Finger pointing"
              loading="lazy"
            />
          </div>
      </div>
      <div class="col">
      {% include "contact-form.njk" %}
      </div>
    </div>
  </div>
</section>
