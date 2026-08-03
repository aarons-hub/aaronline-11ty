---
title: Contact
layout: base.njk
---

<section class="contact-page">
	<aside class="contact-copy">
		<h2>Get in touch.</h2>
		<p>
			Have a project in mind? We would love to hear from you! Whether you have questions,
			want to discuss a potential collaboration, or just want to say hello, feel free to reach out.
		</p>
	</aside>
    <div class="contact-form-shell">
    	<form id="contact-form" data-emailjs-form>
    		<div class="formgroup">
    			<label for="inputName" class="form-label">
    				Name <span class="req-symbol">*</span>
    			</label>
    			<input
    				placeholder="Your full name"
    				type="text"
    				name="from_name"
    				class="form-control"
    				id="inputName"
    				required
    			>
    			<label for="inputEmail" class="form-label">
    				Email <span class="req-symbol">*</span>
    			</label>
    			<input
    				placeholder="Your email address"
    				type="email"
    				name="from_email"
    				class="form-control"
    				id="inputEmail"
    				required
    			>
    			<label for="inputPhone" class="form-label">
    				Phone <span class="req-symbol">*</span>
    			</label>
    			<input
    				placeholder="Your phone number"
    				type="tel"
    				name="from_phone"
    				class="form-control"
    				id="inputPhone"
    				required
    			>
    			<label for="inputSubject" class="form-label">Subject</label>
    			<input
    				placeholder="Subject"
    				type="text"
    				name="subject"
    				class="form-control"
    				id="inputSubject"
    			>
    			<label for="inputMessage" class="form-label">
    				Message <span class="req-symbol">*</span>
    			</label>
    			<textarea
    				placeholder="Type your message..."
    				name="message"
    				class="form-control message align-self-stretch"
    				id="inputMessage"
    				rows="6"
    				required
    			></textarea>
    			<button type="submit" class="btn contact-btn">Submit</button>
    			<p data-emailjs-status class="contact-status" aria-live="polite"></p>
    		</div>
    	</form>
    </div>

</section>
