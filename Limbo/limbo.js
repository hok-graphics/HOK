/* =====================
File: script.js
Description: All JavaScript functionality for Limbo Works website.
Includes call buttons, smooth scroll, product modals, toasts, and basic analytics hooks.
===================== */

(function () {
  "use strict";

  // ------- Config (edit these) -------
  const PHONE_NUMBER = "+2348126876435"; // change to company number
  const COMPANY_NAME = "Limbo Works";

  // ------- Utilities -------
  function safeQuery(selector, parent = document) {
    return parent.querySelector(selector);
  }
  function safeQueryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  // ------- Populate year in footer -------
  const yearEl = safeQuery("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ------- Call button behavior -------
  const callBtn = safeQuery("#callBtn");
  if (callBtn) {
    callBtn.addEventListener("click", function () {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `tel:${PHONE_NUMBER}`;
      } else {
        navigator.clipboard &&
          navigator.clipboard
            .writeText(PHONE_NUMBER)
            .then(() => {
              showToast(
                `Phone number ${PHONE_NUMBER} copied to clipboard — call us!`
              );
            })
            .catch(() => {
              showToast(`Call us at ${PHONE_NUMBER}`);
            });
      }
    });
  }

  // ------- Learn more button: smooth scroll to about -------
  const learnBtn = safeQuery("#learnBtn");
  if (learnBtn) {
    learnBtn.addEventListener("click", function () {
      const about = document.getElementById("about");
      about && about.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ------- Product buttons: view details and call sales -------
  safeQueryAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const card = e.target.closest(".product-card");
      const model = card && card.dataset.model;
      openQuickView(model);
    });
  });

  safeQueryAll(".call-sales").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `tel:${PHONE_NUMBER}`;
      } else {
        navigator.clipboard &&
          navigator.clipboard.writeText(PHONE_NUMBER).then(() => {
            showToast(`Sales number ${PHONE_NUMBER}.`);
          });
      }
    });
  });

  // ------- Quick view modal -------
  function openQuickView(model) {
    if (!model) return;
    const details = `${model} — Long-lasting, automated, engineered for reliability and excitement. Call ${PHONE_NUMBER} to reserve.`;
    const modal = document.createElement("div");
    modal.className = "lw-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="lw-modal-panel" role="document">
        <button class="lw-modal-close" aria-label="Close">×</button>
        <h3>${model}</h3>
        <p>${details}</p>
        <div style="margin-top:14px;display:flex;gap:10px;">
          <button class="btn btn-primary lw-modal-call">Call Sales</button>
          <button class="btn btn-ghost lw-modal-close-2">Close</button>
        </div>
      </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
      .lw-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,10,.55);z-index:300}
      .lw-modal-panel{background:#fff;padding:22px;border-radius:12px;max-width:520px;width:90%;box-shadow:0 12px 40px rgba(0,0,0,.3);color:#2b2b2b;position:relative}
      .lw-modal-close{position:absolute;right:18px;top:18px;border:0;background:transparent;font-size:20px;cursor:pointer}
    `;
    document.body.appendChild(modal);
    document.head.appendChild(style);

    function closeModal() {
      style.remove();
      modal.remove();
    }

    modal
      .querySelectorAll(".lw-modal-close, .lw-modal-close-2")
      .forEach((b) => b.addEventListener("click", closeModal));
    const callNowBtns = modal.querySelectorAll(".lw-modal-call");
    callNowBtns.forEach((b) =>
      b.addEventListener("click", () => {
        if (/Mobi|Android/i.test(navigator.userAgent))
          window.location.href = `tel:${PHONE_NUMBER}`;
        else
          navigator.clipboard &&
            navigator.clipboard
              .writeText(PHONE_NUMBER)
              .then(() => showToast(`Phone number ${PHONE_NUMBER} copied`));
      })
    );

    modal.addEventListener("click", function (ev) {
      if (ev.target === modal) closeModal();
    });
  }

  // ------- Toast helper -------
  let toastTimer = null;
  function showToast(message, timeout = 3000) {
    let toast = document.getElementById("lw-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "lw-toast";
      toast.setAttribute("role", "status");
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.background = "#2b2b2b";
      toast.style.color = "#fff";
      toast.style.padding = "10px 16px";
      toast.style.borderRadius = "8px";
      toast.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";
      toast.style.zIndex = 400;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = "0";
    }, timeout);
  }

  // ------- Analytics hook example -------
  function trackEvent(name, payload) {
    console.log("TRACK EVENT", name, payload || {});
  }
  if (callBtn)
    callBtn.addEventListener("click", () =>
      trackEvent("click_call_cta", { source: "hero" })
    );
  safeQueryAll(".view-details").forEach((b) =>
    b.addEventListener("click", () => trackEvent("view_product_quickview"))
  );

  // Expose debug API for development
  if (!location.search.includes("no-debug")) {
    window.LimboWorks = { openQuickView, showToast, trackEvent };
  }
})();
