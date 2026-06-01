export function renderNavbar(active = "") {
  return `
    <header class="topbar">
      <a href="index.html" class="brand">
        <img src="../lblogoen.png" alt="Lynbørs">
        <span>Lynbørs</span>
      </a>

      <nav class="nav">
        <a href="index.html" class="${active === "home" ? "active" : ""}">Hjem</a>
        <a href="kamper.html" class="${active === "kamper" ? "active" : ""}">Kamper</a>
        <a href="stem.html" class="${active === "stem" ? "active" : ""}">Stem</a>
        <a href="bors.html" class="${active === "bors" ? "active" : ""}">Børs</a>
        <a href="fantasy.html" class="${active === "fantasy" ? "active" : ""}">Fantasy</a>
        <a href="tips.html" class="${active === "tips" ? "active" : ""}">Tips</a>
        <a href="lynligaen.html" class="${active === "lynligaen" ? "active" : ""}">Lynligaen</a>
        <a href="../games.html">Games</a>
      </nav>
    </header>
  `;
}

export function renderFooter() {
  return `
    <footer class="footer">
      <p>
        Har du glede av prosjektet?
        Vipps gjerne en kaffekapsel til
        <strong>40001410</strong>.
      </p>

      <p>
        Ta kontakt på
        <a href="mailto:benbarrios87@gmail.com">
          benbarrios87@gmail.com
        </a>
        dersom du ønsker kontakt.
      </p>
    </footer>
  `;
}
