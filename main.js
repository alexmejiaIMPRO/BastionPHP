// main.js
// Small helper script for docs:
// - Smooth-like scroll behaviour is handled by CSS scroll-behavior.
// - Highlight current section in sidebar.
// - Copy-to-clipboard buttons for code blocks.

document.addEventListener("DOMContentLoaded", () => {
  setupCopyButtons();
  setupSectionHighlight();
});

function setupCopyButtons() {
  const blocks = document.querySelectorAll("[data-code-block]");

  blocks.forEach(block => {
    const btn = block.querySelector(".copy-btn");
    const pre = block.querySelector("pre");

    if (!btn || !pre) return;

    btn.addEventListener("click", async () => {
      const text = pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("bg-emerald-500", "text-slate-950", "border-emerald-400");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("bg-emerald-500", "text-slate-950", "border-emerald-400");
        }, 1200);
      } catch (error) {
        console.error("Copy failed", error);
        btn.textContent = "Error";
        setTimeout(() => (btn.textContent = "Copy"), 1200);
      }
    });
  });
}

function setupSectionHighlight() {
  const sections = document.querySelectorAll(".doc-section[id]");
  const navLinks = document.querySelectorAll(".doc-nav-link");

  if (!("IntersectionObserver" in window)) return;

  const idToLink = {};
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      idToLink[href.substring(1)] = link;
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        highlightNav(id, navLinks, idToLink);
      });
    },
    {
      threshold: 0.3
    }
  );

  sections.forEach(section => observer.observe(section));
}

function highlightNav(id, navLinks, idToLink) {
  navLinks.forEach(link => {
    link.classList.remove("bg-slate-800", "text-cyan-300");
  });

  const active = idToLink[id];
  if (active) {
    active.classList.add("bg-slate-800", "text-cyan-300");
  }
}