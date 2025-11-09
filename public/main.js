// Get current page from URL (?page=home)
function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || "home";
}

// Set page in URL without reload, preserving lang
function setPageInURL(page) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", page); // always first
  window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
}

// Update active menu class
function setActiveMenu(page) {
  document.querySelectorAll(".navigation-item").forEach(item => {
    item.classList.remove("navigation-item-active");
    if (item.querySelector(".title").dataset.i18n === page) {
      item.classList.add("navigation-item-active");
    }
  });
}

// Wire up menu click handlers
function setupMenu() {
  document.querySelectorAll(".navigation-item").forEach(item => {
    item.addEventListener("click", () => {
      const page = item.querySelector(".title").dataset.i18n;
      setActiveMenu(page);
      setPageInURL(page);
    });
  });
}

// ----- LANGUAGE LOGIC -----
// Get lang from URL query ?lang=xx
function getLangFromURL() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("lang") || "en").toLowerCase();
}

// Write lang to URL without reload
function setLangInURL(lang) {
  const params = new URLSearchParams(window.location.search);
  params.set("lang", lang);
  window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
}

// Load translations JSON and apply
async function applyLanguage(lang) {
  const jsonPath = `./lang/${encodeURIComponent(lang)}.json`;
  let translations = {};

  try {
    const res = await fetch(jsonPath, {cache: "no-store"});
    if (!res.ok) throw new Error(`Failed to fetch ${jsonPath}: ${res.status}`);
    translations = await res.json();
  } catch (err) {
    console.error("i18n load error:", err);
    // fallback: leave keys as-is so user sees something
  }

  // Replace each element's textContent by key -> translation
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    // if translation missing, fallback to key (or empty string)
    el.textContent = translations && translations[key] !== undefined ? translations[key] : key;
  });

  // mark active lang option
  document.querySelectorAll(".lang-option").forEach(option => {
    option.classList.toggle("active", option.dataset.lang === lang);
  });

  // set <html lang="..."> for accessibility/SEO
  document.documentElement.lang = lang;
}

// wire up click handlers (call after DOM loaded)
function setupLanguageSwitcher() {
  document.querySelectorAll(".lang-option").forEach(option => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang;
      setLangInURL(lang);
      applyLanguage(lang);
    });
  });
}

// ----- INIT -----
document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupLanguageSwitcher();

  const initialPage = getPageFromURL();
  const initialLang = getLangFromURL();

  setActiveMenu(initialPage);
  applyLanguage(initialLang);
});