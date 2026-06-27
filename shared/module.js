(function () {
  const root = document.getElementById("worship-module");
  let config = null;
  let slides = [];
  let activeIndex = 0;
  let canvas = null;
  let ctx = null;
  let particles = [];
  let width = 0;
  let height = 0;
  let raf = 0;

  function visualMarkup(type) {
    if (type === "water") {
      return '<div class="water-symbol"><span class="peace-light"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span></div>';
    }
    if (type === "book") {
      return '<div class="book-symbol"><span class="book-glow"></span><span class="book-page left"></span><span class="book-page right"></span></div>';
    }
    if (type === "jar") {
      return '<div class="jar-symbol"><span class="scent"></span><span class="jar-neck"></span><span class="jar-body"></span><span class="jar-crack"></span></div>';
    }
    return "";
  }

  function renderSlide(slide, index) {
    if (slide.image) {
      return `
        <article class="module-slide hero-slide${index === 0 ? " active" : ""}">
          <div class="module-inner">
            <img class="hero-image" src="${slide.image}" alt="">
            <div class="hero-shade"></div>
            <div class="hero-copy">
              <div class="eyebrow">${slide.eyebrow || ""}</div>
              <h1>${slide.title || ""}</h1>
              <p>${slide.subtitle || ""}</p>
            </div>
          </div>
        </article>`;
    }

    const scripture = slide.mode === "scripture";
    const lineMarkup = (slide.lines || []).map((line, lineIndex) => {
      if (scripture) {
        return `<p style="transition-delay:${lineIndex * 120 + 150}ms">${line}</p>`;
      }
      return `<p style="--line:${lineIndex}">${line}</p>`;
    }).join("");

    return `
      <article class="module-slide${index === 0 ? " active" : ""}${slide.center ? " center" : ""}${scripture ? " scripture" : ""}">
        <div class="module-inner">
          <div class="copy">
            <div class="eyebrow">${slide.eyebrow || config.eyebrow || ""}</div>
            ${slide.title ? `<h2 class="section-title">${slide.title}</h2>` : ""}
            <div class="${scripture ? "scripture-copy" : "lyrics"}">${lineMarkup}</div>
          </div>
          ${scripture ? "" : `<div class="visual">${visualMarkup(slide.visual || config.visual)}</div>`}
        </div>
      </article>`;
  }

  function mount(nextConfig) {
    config = nextConfig;
    document.title = config.title;
    document.documentElement.style.setProperty("--accent", config.accent || "#e8bd68");
    document.documentElement.style.setProperty("--accent-soft", config.accentSoft || "rgba(232, 189, 104, 0.2)");
    root.innerHTML = `
      <main class="module-stage${config.slides.some((slide) => slide.image) ? " hero-stage" : ""}" data-theme="${config.theme || "water"}">
        <canvas id="module-canvas" aria-hidden="true"></canvas>
        <section class="module-slides">${config.slides.map(renderSlide).join("")}</section>
      </main>`;

    slides = Array.from(root.querySelectorAll(".module-slide"));
    canvas = document.getElementById("module-canvas");
    ctx = canvas.getContext("2d");
    activeIndex = 0;
    fitCanvas();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
    requestAnimationFrame(fitActiveLyrics);
    announce("ready");
  }

  function announce(type) {
    window.parent.postMessage({
      type: `worship:${type}`,
      title: config.title,
      sectionLabel: config.sectionLabel || config.title,
      current: activeIndex,
      count: slides.length
    }, "*");
  }

  function navigate(delta) {
    const target = activeIndex + delta;
    if (target < 0 || target >= slides.length) {
      window.parent.postMessage({
        type: "worship:boundary",
        direction: delta > 0 ? 1 : -1,
        title: config.title
      }, "*");
      return;
    }
    goTo(target);
  }

  function goTo(index) {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
      slide.classList.toggle("before", slideIndex < activeIndex);
    });
    createParticles();
    requestAnimationFrame(fitActiveLyrics);
    announce("state");
  }

  function fitActiveLyrics() {
    const lyrics = slides[activeIndex] && slides[activeIndex].querySelector(".lyrics");
    if (!lyrics) return;
    lyrics.style.removeProperty("--lyrics-size");
    const lines = Array.from(lyrics.querySelectorAll("p"));
    if (!lines.length) return;
    const available = Math.max(140, lyrics.clientWidth - 4);
    const base = parseFloat(getComputedStyle(lyrics).fontSize);
    const widest = Math.max(...lines.map((line) => line.scrollWidth));
    if (widest > available) {
      const fitted = Math.max(13, Math.floor(base * available / widest * 98) / 100);
      lyrics.style.setProperty("--lyrics-size", `${fitted}px`);
    }
  }

  function fitCanvas() {
    if (!canvas || !ctx) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticles();
    requestAnimationFrame(fitActiveLyrics);
  }

  function createParticles() {
    if (!width || !height) return;
    const count = Math.min(110, Math.max(52, Math.floor(width * height / 15000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.5,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -(Math.random() * 0.24 + 0.04),
      a: Math.random() * 0.45 + 0.12,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(time) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.phase += 0.012;
      particle.x += particle.vx + Math.sin(particle.phase) * 0.08;
      particle.y += particle.vy;
      if (particle.y < -10) {
        particle.y = height + 10;
        particle.x = Math.random() * width;
      }
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      ctx.globalAlpha = particle.a * (0.78 + Math.sin(time * 0.001 + particle.phase) * 0.22);
      ctx.fillStyle = config.particle || "#f2d69a";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    if (data.type === "worship:navigate") navigate(Number(data.delta) || 0);
    if (data.type === "worship:go") {
      const index = data.position === "last" ? slides.length - 1 : Number(data.index) || 0;
      goTo(index);
    }
    if (data.type === "worship:ping") announce("ready");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") navigate(1);
    if (event.key === "ArrowLeft" || event.key === "PageUp") navigate(-1);
  });

  document.addEventListener("click", (event) => {
    navigate(event.clientX > innerWidth / 2 ? 1 : -1);
  });

  window.addEventListener("resize", fitCanvas);
  window.WorshipModule = { mount };
})();
