const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector(".navbar");
const accordionButtons = document.querySelectorAll(".accordion-item button");
const inspectionVideo = document.querySelector(".inspection-video-media");
const videoPlay = document.querySelector(".video-play");
const anomalyTabs = document.querySelectorAll(".anomaly-tab");
const tabPanels = document.querySelectorAll(".tab-panel");
const logoRows = document.querySelectorAll(".logo-row");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navbar?.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".nav-menu a, .nav-cta").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("is-open");
    navbar?.classList.remove("is-menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    if (!item || !item.querySelector("p")) return;

    const accordion = item.closest(".accordion");
    const shouldOpen = !item.classList.contains("is-open");

    accordion?.querySelectorAll(".accordion-item").forEach((otherItem) => {
      otherItem.classList.remove("is-open");
      otherItem.querySelector("button")?.setAttribute("aria-expanded", "false");
    });

    item.classList.toggle("is-open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
  });
});

if (inspectionVideo && videoPlay) {
  videoPlay.hidden = true;

  const playInspectionVideo = () => {
    inspectionVideo.play().catch(showManualPlay);
  };

  const pauseInspectionVideo = () => {
    inspectionVideo.pause();
  };

  const showManualPlay = () => {
    if (inspectionVideo.paused) videoPlay.hidden = false;
  };

  inspectionVideo.play().catch(showManualPlay);

  videoPlay.addEventListener("click", () => {
    playInspectionVideo();
  });

  inspectionVideo.addEventListener("click", () => {
    if (!inspectionVideo.paused) pauseInspectionVideo();
  });

  inspectionVideo.addEventListener("play", () => {
    videoPlay.hidden = true;
  });

  inspectionVideo.addEventListener("pause", () => {
    videoPlay.hidden = false;
  });

  inspectionVideo.addEventListener("ended", () => {
    videoPlay.hidden = false;
  });
}

anomalyTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelId = tab.dataset.panel;

    anomalyTabs.forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

logoRows.forEach((row) => {
  const logos = Array.from(row.children);
  Array.from({ length: 2 }).forEach(() => {
    logos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      row.appendChild(clone);
    });
  });
});

const methodSlider = document.querySelector(".method-slider");
if (methodSlider) {
  const track = methodSlider.querySelector(".method-track");
  const cards = Array.from(track.children);
  const dotWraps = Array.from(document.querySelectorAll(".visual-dots, .method-dots"));
  const featureImg = document.querySelector(".feature-img");
  let index = 0;

  const dots = dotWraps.map((wrap) =>
    cards.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show inspection method ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      wrap.appendChild(dot);
      return dot;
    })
  );

  function go(i) {
    index = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((group) => {
      group.forEach((dot, d) => {
        const isActive = d === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    });

    const src = cards[index].dataset.image;
    if (featureImg && src && !featureImg.src.endsWith(src)) {
      featureImg.style.opacity = "0";
      featureImg.addEventListener("load", () => (featureImg.style.opacity = "1"), { once: true });
      featureImg.src = src;
    }
  }

  go(0);

  const delay = Number(methodSlider.dataset.autoplay) || 0;
  if (delay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let timer = setInterval(() => go(index + 1), delay);
    const reset = () => {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), delay);
    };
    methodSlider.addEventListener("mouseenter", () => clearInterval(timer));
    methodSlider.addEventListener("mouseleave", reset);
    dotWraps.forEach((wrap) => wrap.addEventListener("click", reset));
  }
}

const payloadSlider = document.querySelector(".payload-slider");
if (payloadSlider && Array.isArray(window.PAYLOADS)) {
  const track = payloadSlider.querySelector(".payload-track");
  const dotsWrap = payloadSlider.querySelector(".payload-dots");
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  track.innerHTML = window.PAYLOADS.map(
    (p) => `
    <article class="payload-card">
      <div class="payload-media"><img src="${p.img}" alt="${esc(p.title)}" loading="lazy" /></div>
      <h3>${esc(p.title)}</h3>
      <ul>${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </article>`
  ).join("");

  const cards = Array.from(track.children);
  const perView = () =>
    window.matchMedia("(max-width: 720px)").matches
      ? 1
      : window.matchMedia("(max-width: 1060px)").matches
        ? 2
        : 3;

  let dots = [];
  function buildDots() {
    const pages = Math.ceil(cards.length / perView());
    dotsWrap.innerHTML = "";
    dots = Array.from({ length: pages }, (_, i) => {
      const d = document.createElement("span");
      d.setAttribute("role", "tab");
      d.addEventListener("click", () => {
        const card = cards[Math.min(i * perView(), cards.length - 1)];
        track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      });
      dotsWrap.appendChild(d);
      return d;
    });
  }

  function syncDots() {
    let nearest = 0;
    let best = Infinity;
    cards.forEach((c, ci) => {
      const d = Math.abs(c.offsetLeft - track.scrollLeft);
      if (d < best) {
        best = d;
        nearest = ci;
      }
    });
    const page = Math.floor(nearest / perView());
    dots.forEach((d, di) => d.classList.toggle("is-active", di === page));
  }

  let raf;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(syncDots);
  });
  window.addEventListener("resize", () => {
    buildDots();
    syncDots();
  });
  buildDots();
  syncDots();
}

const indTabsWrap = document.querySelector(".ind-tabs");
const indMount = document.querySelector(".ind-panel-mount");
if (indTabsWrap && indMount && Array.isArray(window.INDUSTRIES)) {
  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const renderPanel = (data) => {
    const paras = data.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
    const apps = data.apps
      .map(
        ([label, desc]) =>
          `<li><h4>${escapeHtml(label)}</h4><p>${escapeHtml(desc)}</p></li>`
      )
      .join("");
    indMount.innerHTML = `
      <div class="ind-row">
        <div class="ind-copy">
          <h2>${escapeHtml(data.title)}</h2>
          ${paras}
        </div>
        <figure class="ind-media"><img src="${data.img1}" alt="${escapeHtml(data.tab)} inspection" /></figure>
      </div>
      <div class="ind-row ind-row-reverse">
        <figure class="ind-media"><img src="${data.img2}" alt="${escapeHtml(data.tab)} operations" /></figure>
        <div class="ind-apps">
          <h3>KEY APPLICATIONS:</h3>
          <ul>${apps}</ul>
        </div>
      </div>`;
  };

  const tabs = window.INDUSTRIES.map((data, i) => {
    const tab = document.createElement("button");
    tab.className = "ind-tab";
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.textContent = data.tab;
    tab.addEventListener("click", () => select(i));
    indTabsWrap.appendChild(tab);
    return tab;
  });

  function select(i) {
    tabs.forEach((tab, t) => {
      const on = t === i;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", String(on));
    });
    renderPanel(window.INDUSTRIES[i]);
  }

  const indexFromHash = () => {
    const slug = location.hash.replace("#", "");
    const i = window.INDUSTRIES.findIndex((d) => d.slug === slug);
    return i >= 0 ? i : 0;
  };

  select(indexFromHash());
  window.addEventListener("hashchange", () => select(indexFromHash()));
}
