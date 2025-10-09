/* =========================================================
   Skyler's Tools — Global JavaScript
   This file is loaded on every page for small interactive
   behaviors, helper functions, and shared site features.
   ========================================================= */

console.log("🔧 Skyler's Tools: main.js loaded");

/* ---------- Footer Year (fallback) ---------- */
// In case the footer partial script hasn’t run yet
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl && !yearEl.textContent) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/* ---------- Smooth Scroll for Internal Links ---------- */
// Enables smooth scrolling when clicking anchor links (#about, etc.)
document.addEventListener("click", e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute("href").slice(1);
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  e.preventDefault();
  targetEl.scrollIntoView({ behavior: "smooth" });
});

/* ---------- Active Nav Highlight (Robust) ---------- */
(function () {
  function highlight() {
    const here = location.pathname.replace(/\/+$/, "") || "/";
    const anchors = document.querySelectorAll(
      '.nav a[href], .mainNav .navLink[href]'
    );
    anchors.forEach(link => {
      const target = (link.getAttribute("href") || "").replace(/\/+$/, "") || "/";
      if (target === here) link.classList.add("active");
    });
  }

  if (document.readyState !== "loading") highlight();
  document.addEventListener("DOMContentLoaded", highlight);

  // In case header nav arrives after DOMContentLoaded (partials include)
  const mo = new MutationObserver(() => {
    // Only run when a header/nav is present and hasn't been processed
    if (document.querySelector(".siteHeader .mainNav, .site-header .nav")) {
      highlight();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

/* ---------- Header Dropdowns (Accessible) ---------- */
(function () {
  const navSelectors = [".siteHeader .mainNav", ".site-header .nav"];

  function findNav() {
    for (const sel of navSelectors) {
      const n = document.querySelector(sel);
      if (n) return n;
    }
    return null;
  }

  function initDropdowns() {
    const nav = findNav();
    if (!nav || nav.dataset.dropdownInit === "true") return;
    nav.dataset.dropdownInit = "true";

    const toggles = nav.querySelectorAll(".navToggle");
    if (!toggles.length) return; // No dropdown buttons present yet

    function closeAll(exceptId) {
      nav.querySelectorAll(".submenu").forEach(menu => {
        if (menu.id !== exceptId) {
          menu.hidden = true;
          const btn = nav.querySelector(`.navToggle[aria-controls="${menu.id}"]`);
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });
    }

    function toggleMenu(button) {
      const id = button.getAttribute("aria-controls");
      const menu = id && document.getElementById(id);
      if (!menu) return;

      const willOpen = menu.hidden;
      closeAll(willOpen ? id : null);
      menu.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));

      if (willOpen) {
        const first = menu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (first) first.focus();
      } else {
        button.focus();
      }
    }

    toggles.forEach(button => {
      button.addEventListener("click", e => {
        e.preventDefault();
        toggleMenu(button);
      });

      button.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (button.getAttribute("aria-expanded") !== "true") toggleMenu(button);
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeAll();
        }
      });
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(navSelectors.join(", "))) closeAll();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeAll();
    });
  }

  // Try now, on DOM ready, and if partials inject later
  if (document.readyState !== "loading") initDropdowns();
  document.addEventListener("DOMContentLoaded", initDropdowns);

  const mo = new MutationObserver(initDropdowns);
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

/* ---------- Future Expansion Zone ---------- */
// Example: Dark mode toggle
/*
document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
*/
