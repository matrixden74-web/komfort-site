(() => {
  const gallery = document.querySelector(".hero-gallery");
  const slides = [...gallery.querySelectorAll("img")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reducedMotion.matches;
  let current = 0;
  let requested = 0;
  let timer;

  const controls = document.createElement("div");
  controls.className = "hero-gallery-controls";
  const announcement = document.createElement("span");
  announcement.className = "sr-only";
  announcement.setAttribute("aria-live", "polite");

  function schedule() {
    clearTimeout(timer);
    if (!paused && !document.hidden) {
      timer = setTimeout(() => show((current + 1) % slides.length), 6000);
    }
  }

  async function show(index, announce = false) {
    clearTimeout(timer);
    const request = ++requested;
    try {
      await slides[index].decode();
    } catch {
      if (request === requested) schedule();
      return;
    }
    if (request !== requested) return;
    const previous = current;
    current = index;
    slides.forEach((slide, position) => {
      const active = position === current;
      slide.toggleAttribute("data-current", active);
      slide.toggleAttribute("data-previous", !active && position === previous);
      slide.setAttribute("aria-hidden", String(!active));
      if (active) dots[position].setAttribute("aria-current", "true");
      else dots[position].removeAttribute("aria-current");
    });
    if (announce) announcement.textContent = "Фото " + (index + 1) + " из " + slides.length;
    schedule();
  }

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-gallery-dot";
    dot.setAttribute("aria-label", "Показать фото " + (index + 1));
    if (index === current) dot.setAttribute("aria-current", "true");
    dot.addEventListener("click", () => show(index, true));
    return dot;
  });

  const rotation = document.createElement("button");
  rotation.type = "button";
  rotation.className = "hero-gallery-rotation";
  function updateRotation() {
    rotation.setAttribute("aria-label", paused ? "Включить смену главного фото" : "Остановить смену главного фото");
    rotation.textContent = paused ? "▶" : "Ⅱ";
    schedule();
  }
  rotation.addEventListener("click", () => {
    paused = !paused;
    updateRotation();
  });
  reducedMotion.addEventListener("change", (event) => {
    paused = event.matches;
    updateRotation();
  });
  document.addEventListener("visibilitychange", schedule);

  controls.append(...dots, rotation, announcement);
  gallery.append(controls);
  updateRotation();
})();
