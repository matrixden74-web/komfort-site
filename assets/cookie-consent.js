(function () {
  var KEY = "cookieConsent";

  try {
    if (window.localStorage.getItem(KEY) === "true") return;
  } catch (e) {}

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "/assets/cookie-consent.css";
  document.body.appendChild(css);

  function show() {
    if (document.querySelector(".cookie-banner")) return;

    var root = document.createElement("div");
    root.className = "cookie-banner";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Уведомление об использовании файлов cookie");
    root.innerHTML =
      '<div class="cookie-banner__panel">' +
      '<p class="cookie-banner__text">Мы используем файлы cookie и сервисы сбора технических данных для корректной работы сайта и аналитики. Продолжая использовать сайт, вы соглашаетесь с <a class="cookie-banner__link" href="/privacy.html">Политикой конфиденциальности</a>.</p>' +
      '<button type="button" class="cookie-banner__btn">Принять</button>' +
      "</div>";
    document.body.appendChild(root);

    var panel = root.querySelector(".cookie-banner__panel");
    var button = root.querySelector("button");
    var removed = false;

    function removeBanner() {
      if (removed) return;
      removed = true;
      if (root.parentNode) root.parentNode.removeChild(root);
    }

    button.addEventListener("click", function () {
      try {
        window.localStorage.setItem(KEY, "true");
      } catch (e) {}
      root.classList.remove("is-visible");
      root.classList.add("is-hiding");
      panel.addEventListener("transitionend", function (event) {
        if (event.propertyName === "opacity") removeBanner();
      });
      window.setTimeout(removeBanner, 500);
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.add("is-visible");
      });
    });
  }

  function whenCssReady(done) {
    if (css.sheet) {
      done();
      return;
    }
    css.addEventListener("load", done, { once: true });
    css.addEventListener("error", done, { once: true });
  }

  function schedule() {
    window.setTimeout(function () {
      whenCssReady(show);
    }, 1000);
  }

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
})();
