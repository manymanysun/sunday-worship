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
    if (type === "heaven") {
      return '<div class="heaven-symbol"><span class="heaven-gate left"></span><span class="heaven-gate right"></span><span class="heaven-road"></span><span class="heaven-star s1"></span><span class="heaven-star s2"></span><span class="heaven-star s3"></span></div>';
    }
    if (type === "heart-cross") {
      return '<div class="heart-cross-symbol"><span class="heart-orbit one"></span><span class="heart-orbit two"></span><span class="heart-shape"></span><span class="inner-cross"></span></div>';
    }
    if (type === "night-lamp") {
      return '<div class="night-symbol"><span class="night-moon"></span><span class="mountain far"></span><span class="mountain near"></span><span class="lamp-glow"></span><span class="lamp-body"></span></div>';
    }
    if (type === "shepherd") {
      return '<div class="shepherd-symbol"><span class="valley-path"></span><span class="staff"></span><span class="guiding-light"></span></div>';
    }
    if (type === "tomb") {
      return '<div class="tomb-symbol"><span class="dawn"></span><span class="tomb-cave"></span><span class="tomb-stone"></span><span class="risen-cross"></span></div>';
    }
    if (type === "chains") {
      return '<div class="chains-symbol"><span class="chain left"><i></i><i></i><i></i></span><span class="chain right"><i></i><i></i><i></i></span><span class="freedom-cross"></span><span class="freedom-ray"></span></div>';
    }
    if (type === "home") {
      return '<div class="home-symbol"><span class="home-sun"></span><span class="home-road"></span><span class="home-arch"></span><span class="home-figure"></span></div>';
    }
    if (type === "praise") {
      return '<div class="praise-symbol"><span class="praise-crown"></span><span class="praise-note n1">♪</span><span class="praise-note n2">♫</span><span class="praise-note n3">♩</span><span class="praise-line l1"></span><span class="praise-line l2"></span><span class="praise-line l3"></span></div>';
    }
    if (type === "altar-search") {
      return '<div class="altar-symbol"><span class="search-beam beam-one"></span><span class="search-beam beam-two"></span><span class="altar-flame"></span><span class="altar-table"></span><span class="altar-shadow"></span></div>';
    }
    if (type === "kneeling-worship") {
      return '<div class="worship-symbol"><span class="presence-ray r1"></span><span class="presence-ray r2"></span><span class="presence-ray r3"></span><span class="worship-head"></span><span class="worship-body"></span><span class="worship-arm"></span><span class="holy-ground"></span></div>';
    }
    if (type === "eagle") {
      return '<div class="eagle-symbol"><span class="desert-sun"></span><span class="eagle-wing left"></span><span class="eagle-wing right"></span><span class="eagle-body"></span><span class="wind-line w1"></span><span class="wind-line w2"></span><span class="wind-line w3"></span></div>';
    }
    if (type === "vine-life") {
      return '<div class="vine-life-symbol"><span class="living-water"></span><span class="vine-branch"></span><span class="vine-leaf v1"></span><span class="vine-leaf v2"></span><span class="vine-leaf v3"></span><span class="vine-grape g1"></span><span class="vine-grape g2"></span><span class="vine-grape g3"></span><span class="vine-grape g4"></span><span class="vine-ring"></span></div>';
    }
    if (type === "praying-hands") {
      return '<div class="prayer-hands-symbol"><span class="prayer-halo"></span><span class="prayer-wrist left"></span><span class="prayer-wrist right"></span><span class="prayer-palm left"><i class="finger f1"></i><i class="finger f2"></i><i class="finger f3"></i><i class="finger f4"></i></span><span class="prayer-palm right"><i class="finger f1"></i><i class="finger f2"></i><i class="finger f3"></i><i class="finger f4"></i></span><span class="prayer-fold-line"></span><span class="prayer-spark p1"></span><span class="prayer-spark p2"></span><span class="prayer-spark p3"></span></div>';
    }
    if (type === "prayer-canvas") {
      return '<canvas class="prayer-visual-canvas" width="520" height="520" aria-label="双手合十祷告意象"></canvas>';
    }
    if (type === "notice-board") {
      return '<div class="notice-symbol"><span class="notice-pin pin1"></span><span class="notice-pin pin2"></span><span class="notice-paper"><i></i><i></i><i></i></span><span class="notice-glow"></span></div>';
    }
    if (type === "welcome-friends") {
      return '<div class="welcome-symbol"><span class="welcome-door"><i></i></span><span class="friend friend-a"><i></i><b class="arm left"></b><b class="arm right"></b></span><span class="friend friend-b"><i></i><b class="arm left"></b><b class="arm right"></b></span><span class="friend friend-c"><i></i><b class="arm left"></b><b class="arm right"></b></span><span class="welcome-heart h1">♥</span><span class="welcome-heart h2">♥</span><span class="welcome-heart h3">♥</span><span class="confetti c1"></span><span class="confetti c2"></span><span class="confetti c3"></span><span class="confetti c4"></span><span class="confetti c5"></span></div>';
    }
    if (type === "blessing-light") {
      return '<div class="blessing-symbol"><span class="blessing-arc"></span><span class="blessing-ray br1"></span><span class="blessing-ray br2"></span><span class="blessing-ray br3"></span><span class="blessing-figure bf1"></span><span class="blessing-figure bf2"></span><span class="blessing-figure bf3"></span><span class="blessing-dove">✦</span></div>';
    }
    return "";
  }

  function renderSlide(slide, index) {
    if (slide.image) {
      return `
        <article class="module-slide hero-slide${index === 0 ? " active" : ""}${slide.variant ? ` ${slide.variant}` : ""}">
          <div class="module-inner">
            <img class="hero-image" src="${slide.image}" alt="">
            <div class="hero-shade"></div>
            <div class="hero-copy${slide.variant ? ` ${slide.variant}-copy` : ""}">
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
      <article class="module-slide${index === 0 ? " active" : ""}${slide.center ? " center" : ""}${scripture ? " scripture" : ""}" data-theme="${slide.theme || config.theme || "water"}">
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
    root.querySelector(".module-stage").dataset.theme = slides[0] ? slides[0].dataset.theme : (config.theme || "water");
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
    const stage = root.querySelector(".module-stage");
    if (stage && slides[activeIndex]) stage.dataset.theme = slides[activeIndex].dataset.theme || config.theme || "water";
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

  function drawPrayerVisuals(time) {
    const prayerCanvases = root.querySelectorAll(".module-slide.active .prayer-visual-canvas");
    prayerCanvases.forEach((prayerCanvas) => {
      const prayerCtx = prayerCanvas.getContext("2d");
      const size = 520;
      const pulse = 1 + Math.sin(time * 0.0016) * 0.018;
      prayerCtx.clearRect(0, 0, size, size);

      const halo = prayerCtx.createRadialGradient(260, 235, 20, 260, 250, 230);
      halo.addColorStop(0, "rgba(255, 245, 205, 0.42)");
      halo.addColorStop(0.48, "rgba(232, 207, 145, 0.11)");
      halo.addColorStop(1, "rgba(126, 164, 191, 0)");
      prayerCtx.fillStyle = halo;
      prayerCtx.beginPath();
      prayerCtx.arc(260, 250, 230, 0, Math.PI * 2);
      prayerCtx.fill();

      prayerCtx.save();
      prayerCtx.translate(260, 260);
      prayerCtx.scale(pulse, pulse);
      prayerCtx.translate(-260, -260);

      function handPath(mirror) {
        prayerCtx.save();
        if (mirror) {
          prayerCtx.translate(size, 0);
          prayerCtx.scale(-1, 1);
        }
        const skin = prayerCtx.createLinearGradient(145, 85, 270, 450);
        skin.addColorStop(0, "#f4c49d");
        skin.addColorStop(0.52, "#c88b68");
        skin.addColorStop(1, "#774936");
        prayerCtx.fillStyle = skin;
        prayerCtx.strokeStyle = "rgba(255, 228, 190, 0.5)";
        prayerCtx.lineWidth = 2.4;
        prayerCtx.shadowColor = "rgba(0, 0, 0, 0.34)";
        prayerCtx.shadowBlur = 22;
        prayerCtx.shadowOffsetY = 16;
        prayerCtx.beginPath();
        prayerCtx.moveTo(258, 72);
        prayerCtx.bezierCurveTo(244, 64, 232, 73, 228, 91);
        prayerCtx.lineTo(207, 194);
        prayerCtx.bezierCurveTo(201, 170, 190, 151, 177, 155);
        prayerCtx.bezierCurveTo(163, 160, 164, 182, 170, 214);
        prayerCtx.lineTo(187, 303);
        prayerCtx.bezierCurveTo(180, 326, 161, 360, 142, 414);
        prayerCtx.bezierCurveTo(171, 449, 209, 465, 245, 444);
        prayerCtx.bezierCurveTo(250, 376, 254, 301, 260, 221);
        prayerCtx.closePath();
        prayerCtx.fill();
        prayerCtx.stroke();
        prayerCtx.shadowColor = "transparent";

        prayerCtx.strokeStyle = "rgba(108, 61, 44, 0.36)";
        prayerCtx.lineWidth = 2;
        [0, 1, 2, 3].forEach((finger) => {
          const shift = finger * 12;
          prayerCtx.beginPath();
          prayerCtx.moveTo(244 - shift, 91 + finger * 17);
          prayerCtx.bezierCurveTo(232 - shift, 155, 226 - shift, 221, 218 - shift, 286);
          prayerCtx.stroke();
        });
        prayerCtx.restore();
      }

      handPath(false);
      handPath(true);
      prayerCtx.restore();

      const fold = prayerCtx.createLinearGradient(260, 64, 260, 430);
      fold.addColorStop(0, "rgba(255, 246, 215, 0.92)");
      fold.addColorStop(0.45, "rgba(255, 231, 178, 0.36)");
      fold.addColorStop(1, "rgba(255, 231, 178, 0)");
      prayerCtx.strokeStyle = fold;
      prayerCtx.lineWidth = 3;
      prayerCtx.beginPath();
      prayerCtx.moveTo(260, 70);
      prayerCtx.lineTo(260, 426);
      prayerCtx.stroke();

      for (let sparkle = 0; sparkle < 9; sparkle += 1) {
        const phase = time * 0.001 + sparkle * 1.73;
        const x = 75 + ((sparkle * 61) % 370);
        const y = 90 + ((sparkle * 47) % 310) - Math.sin(phase) * 14;
        const alpha = 0.2 + (Math.sin(phase * 1.6) + 1) * 0.28;
        prayerCtx.fillStyle = `rgba(255, 242, 195, ${alpha})`;
        prayerCtx.beginPath();
        prayerCtx.arc(x, y, 2.5 + (sparkle % 3), 0, Math.PI * 2);
        prayerCtx.fill();
      }
    });
  }

  function draw(time) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    drawPrayerVisuals(time);
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
