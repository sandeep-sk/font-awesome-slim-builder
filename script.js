(async function () {

  /**************************************
   * REAL-TIME METADATA (NO CACHE)
   **************************************/
  const META_URL =
    "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json";

  console.log("⏳ Fetching Font Awesome metadata (real-time)...");

  const faMeta = await fetch(META_URL).then(r => r.json());

  /**************************************
   * LEGACY FA4 → FA6 MAPPING
   **************************************/
  const LEGACY_MAP = {
    "fa-dot-circle-o": "dot-circle",
    "fa-check-circle": "check-circle",
    "fa-times-circle": "xmark",
    "fa-remove": "xmark",
    "fa-close": "xmark"
  };

  /**************************************
   * SCAN ICONS FROM DOM
   **************************************/
  function scanIcons() {
    const set = new Set();

    document.querySelectorAll("*").forEach(el => {
      el.classList.forEach(c => {
        if (c.startsWith("fa-")) set.add(c);
      });
    });

    return [...set].sort();
  }

  /**************************************
   * RESOLVE ICON → META KEY
   **************************************/
  function resolveKey(icon) {
    const clean = icon.replace(/^fa-/, "");
    return LEGACY_MAP[icon] || clean;
  }

  /**************************************
   * FIND METADATA SAFELY
   **************************************/
  function getMeta(icon) {
    const key = resolveKey(icon);
    return faMeta[key] || null;
  }

  /**************************************
   * DETECT FONT TYPE
   **************************************/
  function getFont(meta) {
    if (!meta) return "Font Awesome 6 Free";
    return meta.styles.includes("brands")
      ? "Font Awesome 6 Brands"
      : "Font Awesome 6 Free";
  }

  function getWeight(font) {
    return font.includes("Brands") ? 400 : 900;
  }

  /**************************************
   * SCAN DOM ICONS
   **************************************/
  const icons = scanIcons();

  console.clear();

  console.log("==================================");
  console.log(" FA REAL-TIME SLIM BUILDER");
  console.log("==================================");

  console.log("\n📌 ICONS FOUND:");
  console.log(icons.join("\n"));

  /**************************************
   * BASE CSS
   **************************************/
  let css = `
/* FONT AWESOME MINIMAL */

@font-face {
  font-family: "Font Awesome 6 Free";
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url("../webfonts/fa-solid-900.woff2") format("woff2");
}

@font-face {
  font-family: "Font Awesome 6 Brands";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../webfonts/fa-brands-400.woff2") format("woff2");
}

/* FA SLIM BUILD */
.fa, .fas, .far, .fab, .fa-solid, .fa-brands {
  display: inline-block;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  text-rendering: auto;
}
`;

  /**************************************
   * GENERATE ICON CSS
   **************************************/
  let skipped = [];

  for (const icon of icons) {

    const meta = getMeta(icon);

    if (!meta || !meta.unicode) {
      skipped.push(icon);
      continue;
    }

    const font = getFont(meta);
    const weight = getWeight(font);

    css += `
.${icon}:before {
  font-family: "${font}";
  font-weight: ${weight};
  content: "\\${meta.unicode}";
}
`;
  }

  /**************************************
   * OUTPUT
   **************************************/
  console.log("\n==================================");
  console.log(" FINAL CSS");
  console.log("==================================\n");

  console.log(css);

  if (skipped.length) {
    console.log("\n⚠️ SKIPPED ICONS (no metadata found):");
    console.log(skipped.join("\n"));
  }

})();
