(function () {
  var footer = document.querySelector(".site-footer");
  var backToTop = footer && footer.querySelector(".back-to-top");

  if (!footer || !backToTop || !window.gsap) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  function hasVerticalScroll() {
    return document.documentElement.scrollHeight > window.innerHeight;
  }

  var hasEstablishedInitialState = false;
  var reveal = gsap.fromTo(
    backToTop,
    { autoAlpha: 0, x: 60 },
    {
      autoAlpha: 1,
      x: -60,
      duration: 1.0,
      ease: "power2.out",
      paused: true,
    },
  );

  var observer = new IntersectionObserver(
    function (entries) {
      var entry = entries[0];

      if (!hasVerticalScroll()) {
        reveal.progress(0);
        return;
      }

      if (!hasEstablishedInitialState) {
        hasEstablishedInitialState = true;

        if (entry.isIntersecting) {
          reveal.progress(1);
        } else {
          reveal.progress(0);
        }
        return;
      }

      if (entry.isIntersecting) {
        reveal.play();
      } else {
        reveal.reverse();
      }
    },
    { threshold: 0.15 },
  );

  observer.observe(footer);

  window.addEventListener("resize", function () {
    if (!hasVerticalScroll()) {
      reveal.progress(0);
    }
  });
})();
