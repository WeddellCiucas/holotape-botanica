/* =========================
   SCREEN REFERENCES
========================= */
const screens = {
  cover: document.getElementById("cover"),
  toc: document.getElementById("toc"),
  entry: document.getElementById("entry")
};

function column(screen) {
  return screens[screen].querySelector(".terminal-column");
}

/* =========================
   SCREEN SWITCHING
========================= */
function show(screen) {
  Object.values(screens).forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });

  const next = screens[screen];
  next.style.display = "block";
  next.classList.add("active");

  /* reset scroll for consistency */
  next.scrollTop = 0;
}

/* =========================
   COVER
========================= */
function bindCover() {
  const play = document.getElementById("playHolotape");
  if (!play) return;

  play.addEventListener("click", () => {
    buildTOC();
    show("toc");
  });
}

/* =========================
   TABLE OF CONTENTS
========================= */
function buildTOC() {
  let text = "DIRECTORY\n────────────\n\n";

  const grouped = {};
  INDEX.forEach(e => {
    if (!grouped[e.letter]) grouped[e.letter] = [];
    grouped[e.letter].push(e);
  });

  Object.keys(grouped).sort().forEach(letter => {
    text += `[${letter}]\n`;
    grouped[letter].forEach(e => {
      text += `  > <span class="toc-link" data-file="${e.file}">${e.title}</span>\n`;
    });
    text += "\n";
  });

  text += "────────────\n[FUNGI]\n";
  FUNGI.forEach(a => {
    text += `  > <span class="toc-link" data-file="${a.file}">${a.title}</span>\n`;
  });
text += "\n";
  text += "────────────\n[APPENDIX]\n";
  APPENDIX.forEach(a => {
    text += `  > <span class="toc-link" data-file="${a.file}">${a.title}</span>\n`;
  });

  text += `\n\n<span class="nav" data-nav="cover">[◂] EJECT HOLOTAPE</span>`;

  column("toc").innerHTML = `<pre>${text}</pre>`;
}

/* =========================
   ENTRY LOADING
========================= */
function loadEntry(file) {
  if (!file) return;

  column("entry").innerHTML = "<pre>LOADING FILE…</pre>";
  show("entry");

  fetch(file)
    .then(res => {
      if (!res.ok) throw new Error("Load failed");
      return res.text();
    })
    .then(html => {
      column("entry").innerHTML = html + `
        <div class="nav" data-nav="toc">[◂] RETURN TO DIRECTORY</div>
        <div class="nav" data-nav="cover">[◂] EJECT HOLOTAPE</div>
      `;
    })
    .catch(() => {
      column("entry").innerHTML = "<pre>ERROR LOADING FILE</pre>";
    });
}

/* =========================
   EVENT DELEGATION
========================= */
document.addEventListener("click", e => {
  const tocLink = e.target.closest(".toc-link[data-file]");
  if (tocLink) {
    loadEntry(tocLink.dataset.file);
    return;
  }

  const nav = e.target.closest("[data-nav]");
  if (nav) {
    show(nav.dataset.nav);
  }
});

/* =========================
   ENTRY COUNT
========================= */
function animateEntryCount() {
  const el = document.getElementById("entryCount");
  if (!el) return;

  const target = INDEX.length;
  let current = 0;

  const interval = setInterval(() => {
    current++;
    el.textContent = String(current).padStart(3, "0");
    if (current >= target) clearInterval(interval);
  }, 60);
}

/* =========================
   INIT
========================= */
bindCover();
animateEntryCount();
