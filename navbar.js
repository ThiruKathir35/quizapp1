// navbar.js — QuizMaster Pro
// ─────────────────────────────────────────────────────────────────
// Drop this script on every page that has a .navbar element.
// It reads qm_user from sessionStorage (set by login.js / register.js)
// and toggles the correct nav-right slots automatically.
// ─────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  /* ── Storage helpers ───────────────────────────────────────────── */
  function getUser() {
    // Check sessionStorage first (tab-scoped login), fall back to localStorage
    return sessionStorage.getItem('qm_user') || localStorage.getItem('qm_user') || null;
  }

  function logout() {
    sessionStorage.removeItem('qm_user');
    localStorage.removeItem('qm_user');
    // Clear any quiz result data too
    ['qm_score','qm_total','qm_correct','qm_wrong','qm_skipped'].forEach(k => {
      sessionStorage.removeItem(k);
    });
    window.location.href = 'index.html';
  }

  /* ── Build guest slot (Sign In + Get Started) ──────────────────── */
  function buildGuestSlot() {
    const wrap = document.createElement('div');
    wrap.id = 'nav-guest';
    wrap.className = 'nav-auth-slot';
    wrap.innerHTML = `
      <a href="login.html" class="nav-link">Sign in</a>
      <a href="register.html" class="btn btn-primary nav-cta">Get Started</a>
    `;
    return wrap;
  }

  /* ── Build user slot (Avatar + Username + Logout) ──────────────── */
  function buildUserSlot(username) {
    const initial = username.charAt(0).toUpperCase();
    const wrap = document.createElement('div');
    wrap.id = 'nav-user';
    wrap.className = 'nav-auth-slot nav-user-slot';
    wrap.innerHTML = `
      <div class="nav-avatar" aria-label="${username}'s profile">${initial}</div>
      <span class="nav-username">${username}</span>
      <button class="btn-logout" onclick="window.__qmLogout()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    `;
    return wrap;
  }

  /* ── Mount into navbar ─────────────────────────────────────────── */
  function mountNavAuth() {
    // Find the nav-right container — works whether it already has children or not
    const navRight = document.querySelector('.navbar .nav-right');
    if (!navRight) return; // no navbar on this page

    // Remove any previously injected auth slots (idempotent)
    ['nav-guest', 'nav-user'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const user = getUser();

    if (user) {
      navRight.appendChild(buildUserSlot(user));
    } else {
      navRight.appendChild(buildGuestSlot());
    }
  }

  /* ── Expose logout globally so inline onclick can reach it ─────── */
  window.__qmLogout = logout;

  /* ── Run on DOM ready ──────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountNavAuth);
  } else {
    mountNavAuth();
  }

  /* ── Re-run if login state changes in another tab ──────────────── */
  window.addEventListener('storage', function (e) {
    if (e.key === 'qm_user') mountNavAuth();
  });

})();