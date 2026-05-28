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
  <a href="bors.html" class="${active === "bors" ? "active" : ""}">Børs</a>
  <a href="stats.html" class="${active === "stats" ? "active" : ""}">Stats</a>
  <a href="stem.html" class="${active === "stem" ? "active" : ""}">Stem</a>
</nav>

        <a href="kamper.html" class="${active === "kamper" ? "active" : ""}">
          Kamper
        </a>

        <a href="#" class="disabled">
          Børs
        </a>

        <a href="#" class="disabled">
          Fantasy
        </a>
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
