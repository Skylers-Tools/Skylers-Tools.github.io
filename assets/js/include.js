/* =========================================================
   Skyler's Tools — include.js
   Loads HTML partials declared with: <div data-include="/partials/header.html"></div>
   Works inside <head> and <body>. Keeps things simple & fast.
   ========================================================= */

(async function injectPartials() {
  const placeholders = Array.from(document.querySelectorAll("[data-include]"));
  if (!placeholders.length) return;

  // Toggle cache busting by setting this to true when you're fighting stale content
  const CACHE_BUST = false;
  const bust = () => (CACHE_BUST ? `?_=${Date.now()}` : "");

  async function include(el) {
    const path = el.getAttribute("data-include");
    if (!path) return;

    try {
      const res = await fetch(path + bust(), { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
      const html = await res.text();

      if (el.parentElement && el.parentElement.tagName === "HEAD") {
        // When placeholder is inside <head>, insert *before* it (to avoid wrapper nodes)
        el.insertAdjacentHTML("beforebegin", html);
        el.remove();
      } else {
        // Normal body include: replace placeholder with fetched markup (no extra wrapper)
        const range = document.createRange();
        range.selectNode(el);
        const frag = range.createContextualFragment(html);
        el.replaceWith(frag);
      }
    } catch (err) {
      console.warn("Include failed:", path, err);
      // Fail gracefully with a comment so you can see where it was
      const fallback = document.createComment(` include failed: ${path} `);
      el.replaceWith(fallback);
    }
  }

  // Load all includes in parallel
  await Promise.all(placeholders.map(include));

  // After header is present, mark current nav link as active
  try {
    const here = (location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    document.querySelectorAll(".nav a[href]").forEach(a => {
      const target = (a.getAttribute("href") || "").replace(/\/+$/, "").toLowerCase() || "/";
      if (target === here) a.classList.add("active");
    });
  } catch (e) {
    // non-fatal
  }
})();
