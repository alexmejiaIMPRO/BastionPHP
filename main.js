// main.js - Enhanced documentation site functionality
// Features: Search, mobile navigation, copy buttons, scroll tracking, theme toggle

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSearch();
  initCopyButtons();
  initSectionHighlight();
  initScrollToTop();
  initThemeToggle();
  initPageTOC();
});

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================
function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.getElementById("sidebar-nav");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // Close on nav link click (mobile)
  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });
}

// ============================================================================
// SEARCH FUNCTIONALITY
// ============================================================================
function initSearch() {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchResultsContent = document.getElementById("search-results-content");

  if (!searchInput || !searchResults || !searchResultsContent) return;

  // Build search index from page content
  const searchIndex = buildSearchIndex();

  let searchTimeout;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);

    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      searchResults.classList.add("hidden");
      return;
    }

    searchTimeout = setTimeout(() => {
      performSearch(query, searchIndex, searchResultsContent, searchResults);
    }, 200);
  });

  // Close search on outside click
  document.addEventListener("click", (e) => {
    if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
      searchResults.classList.add("hidden");
    }
  });

  // Close search on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchResults.classList.add("hidden");
      searchInput.blur();
    }
  });
}

function buildSearchIndex() {
  const sections = document.querySelectorAll(".doc-section");
  const index = [];

  sections.forEach(section => {
    const id = section.id;
    if (!id) return;

    const title = section.querySelector("h2")?.textContent || "";
    const content = section.textContent || "";

    // Get all headings in this section
    const headings = Array.from(section.querySelectorAll("h2, h3, h4")).map(h => h.textContent);

    index.push({
      id,
      title,
      content: content.toLowerCase(),
      headings,
      element: section
    });
  });

  return index;
}

function performSearch(query, index, resultsContainer, resultsElement) {
  const results = [];

  index.forEach(item => {
    let score = 0;

    // Title match (highest priority)
    if (item.title.toLowerCase().includes(query)) {
      score += 10;
    }

    // Heading match
    if (item.headings.some(h => h.toLowerCase().includes(query))) {
      score += 5;
    }

    // Content match
    if (item.content.includes(query)) {
      score += 1;
    }

    if (score > 0) {
      results.push({ ...item, score });
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Render results
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="p-4 text-center text-slate-400 text-sm">
        No results found for "${escapeHtml(query)}"
      </div>
    `;
  } else {
    resultsContainer.innerHTML = results.slice(0, 8).map(result => `
      <a href="#${result.id}" class="block p-3 rounded-lg hover:bg-slate-800 transition">
        <div class="font-medium text-sm text-slate-200">${highlightMatch(result.title, query)}</div>
        <div class="text-xs text-slate-400 mt-1">${getSnippet(result.content, query)}</div>
      </a>
    `).join("");
  }

  resultsElement.classList.remove("hidden");
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
}

function getSnippet(content, query) {
  const index = content.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return "";

  const start = Math.max(0, index - 40);
  const end = Math.min(content.length, index + query.length + 40);
  let snippet = content.slice(start, end).trim();

  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return highlightMatch(snippet, query);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================================================
// COPY TO CLIPBOARD BUTTONS
// ============================================================================
function initCopyButtons() {
  const codeBlocks = document.querySelectorAll("[data-code-block]");

  codeBlocks.forEach(block => {
    const btn = block.querySelector(".copy-btn");
    const pre = block.querySelector("pre");

    if (!btn || !pre) return;

    btn.addEventListener("click", async () => {
      const text = pre.textContent;

      try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        const originalText = btn.textContent;
        const originalClasses = btn.className;

        btn.textContent = "Copied!";
        btn.className = originalClasses + " !bg-emerald-500 !text-slate-950 !border-emerald-400";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.className = originalClasses;
        }, 2000);
      } catch (error) {
        console.error("Copy failed", error);
        btn.textContent = "Error";
        setTimeout(() => (btn.textContent = "Copy"), 2000);
      }
    });
  });
}

// ============================================================================
// SECTION HIGHLIGHT (Active Navigation)
// ============================================================================
function initSectionHighlight() {
  const sections = document.querySelectorAll(".doc-section[id]");
  const navLinks = document.querySelectorAll(".doc-nav-link");

  if (!("IntersectionObserver" in window)) return;

  // Build map of section IDs to nav links
  const idToLink = {};
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      idToLink[href.substring(1)] = link;
    }
  });

  // Track which sections are visible
  const visibleSections = new Set();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          visibleSections.add(id);
        } else {
          visibleSections.delete(id);
        }
      });

      // Highlight the first visible section
      if (visibleSections.size > 0) {
        const firstVisible = Array.from(visibleSections)[0];
        highlightNav(firstVisible, navLinks, idToLink);
      }
    },
    {
      rootMargin: "-100px 0px -66%",
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
}

function highlightNav(id, navLinks, idToLink) {
  // Remove active class from all links
  navLinks.forEach(link => {
    link.classList.remove("nav-link-active", "bg-slate-800", "text-cyan-300");
  });

  // Add active class to current link
  const activeLink = idToLink[id];
  if (activeLink) {
    activeLink.classList.add("nav-link-active");
  }
}

// ============================================================================
// SCROLL TO TOP BUTTON
// ============================================================================
function initScrollToTop() {
  const scrollBtn = document.getElementById("scroll-top");
  if (!scrollBtn) return;

  // Show/hide based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.remove("hidden");
    } else {
      scrollBtn.classList.add("hidden");
    }
  });

  // Scroll to top on click
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ============================================================================
// THEME TOGGLE (Dark Mode - currently always dark, prepared for future)
// ============================================================================
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  // Currently the docs are always in dark mode
  // This is prepared for future light mode implementation
  themeToggle.addEventListener("click", () => {
    // Future: Toggle between light and dark mode
    console.log("Theme toggle clicked - light mode coming soon!");
  });
}

// ============================================================================
// PAGE TABLE OF CONTENTS (Right sidebar)
// ============================================================================
function initPageTOC() {
  const tocContainer = document.getElementById("page-toc");
  if (!tocContainer) return;

  // Find all h3 headings in the current viewport/sections
  const headings = document.querySelectorAll("main h3");

  if (headings.length === 0) return;

  const tocHTML = Array.from(headings).slice(0, 10).map(heading => {
    const text = heading.textContent;
    const id = heading.id || heading.closest("[id]")?.id;

    if (!id) return "";

    return `
      <a href="#${id}" class="block py-1.5 text-slate-400 hover:text-cyan-400 transition text-xs border-l-2 border-slate-800 pl-3 hover:border-cyan-400">
        ${escapeHtml(text)}
      </a>
    `;
  }).join("");

  tocContainer.innerHTML = tocHTML;
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================
document.addEventListener("keydown", (e) => {
  // Cmd/Ctrl + K for search focus
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.focus();
    }
  }
});

// ============================================================================
// PROGRESSIVE ENHANCEMENT
// ============================================================================
// Add loading state indicators
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Update URL without jumping
      history.pushState(null, null, href);
    }
  });
});
