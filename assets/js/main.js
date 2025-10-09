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

/* ---------- Active Nav Highlight (Optional) ---------- */
// Add "active" class to nav links that match current URL
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav a[href]");
  const here = location.pathname.replace(/\/+$/, "") || "/";
  links.forEach(link => {
    const target = link.getAttribute("href").replace(/\/+$/, "") || "/";
    if (target === here) link.classList.add("active");
  });
});

/* ---------- Future Expansion Zone ---------- */
// Example: Dark mode toggle
/*
document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
*/
