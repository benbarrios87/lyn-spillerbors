export function renderNavbar(active = "") {
  return `
    <header class="topbar">
      <a href="index.html" class="brand">
        <img src="../lblogoen.png" alt="Lynbørs">
        <span>Lynbørs 2.0</span>
      </a>

     <nav class="nav">
  <a href="index.html" class="${active === "home" ? "active" : ""}">Hjem</a>
  <a href="kamper.html" class="${active === "kamper" ? "active" : ""}">Kamper</a>
  <a href="stem.html" class="${active === "stem" ? "active" : ""}">Stem</a>
  <a href="bors.html" class="${active === "bors" ? "active" : ""}">Børs</a>
  <a href="fantasy.html" class="${active === "fantasy" ? "active" : ""}">Fantasy</a>
  <a href="tips.html" class="${active === "tips" ? "active" : ""}">Tips</a>
  <a href="lynligaen.html" class="${active === "lynligaen" ? "active" : ""}">Lynligaen</a>
  <a href="stats.html" class="${active === "stats" ? "active" : ""}">Stats</a>
</nav>

    </header>
  `;
}

export function renderFooter() {
  return `
    <footer class="footer">
      <p>
        Lynbørs 2.0 rebuild • bygget med kjærlighet, frustrasjon og altfor mye kaffe ☕
      </p>
    </footer>
  `;
}
