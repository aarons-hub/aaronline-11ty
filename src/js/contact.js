(function () {
  var page = document.querySelector(".site-main");
  if (!page) {
    return;
  }

  var form = page.querySelector("[data-emailjs-form]");
  if (!form) {
    return;
  }

  if (!window.emailjs || typeof window.emailjs.sendForm !== "function") {
    console.warn("EmailJS SDK not loaded.");
    return;
  }

  function resolveConfigValue(attrName, fallbackValue) {
    var raw = (form.getAttribute(attrName) || "").trim();
    if (!raw || raw.indexOf("YOUR_") === 0) {
      return fallbackValue;
    }
    return raw;
  }

  var publicKey = resolveConfigValue(
    "data-emailjs-public-key",
    "WEnSV56Aows6oYiBB",
  );
  var serviceId = resolveConfigValue(
    "data-emailjs-service-id",
    "service_g21pr8h",
  );
  var templateId = resolveConfigValue(
    "data-emailjs-template-id",
    "template_4m4a8ys",
  );
  var statusNode = page.querySelector("[data-emailjs-status]");

  if (!publicKey || !serviceId || !templateId) {
    console.warn("EmailJS config missing on form data attributes.");
    return;
  }

  window.emailjs.init({ publicKey: publicKey });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var submitButton = form.querySelector("button[type='submit']");
    var defaultButtonText = submitButton ? submitButton.textContent : "Submit";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    if (statusNode) {
      statusNode.textContent = "Sending...";
    }

    window.emailjs
      .sendForm(serviceId, templateId, form)
      .then(
        function () {
          if (statusNode) {
            statusNode.textContent = "Message sent successfully.";
          }
          if (submitButton) {
            submitButton.textContent = "Sent";
          }
          form.reset();
        },
        function (error) {
          console.error("EmailJS send failed", error);
          if (statusNode) {
            var errorMessage =
              error && error.text
                ? "Message failed: " + error.text
                : "Message failed to send. Please try again.";
            statusNode.textContent = errorMessage;
          }
          if (submitButton) {
            submitButton.textContent = defaultButtonText;
          }
        },
      )
      .finally(function () {
        if (submitButton) {
          if (submitButton.textContent !== "Sent") {
            submitButton.disabled = false;
          }
        }
      });
  });
})();
