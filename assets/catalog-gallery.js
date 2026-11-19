(() => {
  const catalog = document.querySelector("#catalog");
  const categories = [...catalog.querySelectorAll("[data-album]")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reducedMotion.matches;
  const galleries = [];

  for (const category of categories) {
    const image = category.querySelector("img");
    const name = category.querySelector("figcaption p").textContent;
    const slides = [
      { src: image.getAttribute("src"), alt: image.alt },
      ...[2, 3, 4, 5].map((number) => ({
        src: "/assets/catalog/" + category.dataset.album + "-" + number + ".jpg",
        alt: name + " — фото " + number,
      })),
    ];
    let current = 0;

    const controls = document.createElement("div");
    controls.className = "catalog-gallery-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Фотографии: " + name);

    const announcement = document.createElement("span");
    announcement.className = "sr-only";
    announcement.setAttribute("aria-live", "polite");

    function show(offset, announce = false) {
      current = (current + offset + slides.length) % slides.length;
      image.src = slides[current].src;
      image.alt = slides[current].alt;
      if (announce) announcement.textContent = "Фото " + (current + 1) + " из " + slides.length;
    }

    function button(label, icon, offset) {
      const control = document.createElement("button");
      control.type = "button";
      control.textContent = icon;
      control.setAttribute("aria-label", label + " — " + name);
      control.addEventListener("click", () => show(offset, true));
      return control;
    }

    controls.append(button("Предыдущее фото", "‹", -1), button("Следующее фото", "›", 1), announcement);
    category.append(controls);
    galleries.push({ category, show });
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "catalog-gallery-toggle";
  function updateToggle() {
    toggle.textContent = paused ? "Включить смену фото" : "Остановить смену фото";
  }
  toggle.addEventListener("click", () => {
    paused = !paused;
    updateToggle();
  });
  reducedMotion.addEventListener("change", (event) => {
    paused = event.matches;
    updateToggle();
  });
  updateToggle();
  catalog.firstElementChild.append(toggle);

  setInterval(() => {
    if (paused || document.hidden) return;
    for (const { category, show } of galleries) {
      const bounds = category.getBoundingClientRect();
      const visible = bounds.top < innerHeight && bounds.bottom > 0;
      if (visible && !category.matches(":hover, :focus-within")) show(1);
    }
  }, 5500);
})();
