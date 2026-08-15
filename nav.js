// Delt navbar/footer for hele Lynbørs-prosjektet.
//
// Alle sider skal bruke denne i stedet for å hardkode sin egen meny, slik at
// det bare finnes ett sted å oppdatere lenker/utseende. `basePath` sier hvor
// mye vi må gå "opp" for å nå rotmappen fra siden som kaller funksjonen:
//   - Sider i rotmappen (index.html, games.html, wordle.html osv.): basePath = ""
//   - Sider i v2/-mappen (v2/bors.html osv.):                       basePath = "../"
//
// v2/js/layout.js re-eksporterer denne med basePath="../" ferdig satt, slik
// at v2-sidene ikke trenger å bry seg om det selv.

export function renderNavbar(active = "", basePath = "") {
  return `
    <header class="topbar">
      <a href="${basePath}index.html" class="brand">
        <img src="${basePath}lblogoen.png" alt="Lynbørs">
        <span>Lynbørs</span>
      </a>

      <nav class="nav">
        <a href="${basePath}index.html" class="${active === "home" ? "active" : ""}">Forside</a>
        <a href="${basePath}v2/kamper.html" class="${active === "kamper" ? "active" : ""}">Kamper</a>
        <a href="${basePath}v2/stem.html" class="${active === "stem" ? "active" : ""}">Stem</a>
        <a href="${basePath}v2/bors.html" class="${active === "bors" ? "active" : ""}">Børs</a>
        <a href="${basePath}v2/fantasy.html" class="${active === "fantasy" ? "active" : ""}">Fantasy</a>
        <a href="${basePath}v2/tips.html" class="${active === "tips" ? "active" : ""}">Tips</a>
        <a href="${basePath}v2/lynligaen.html" class="${active === "lynligaen" ? "active" : ""}">Lynligaen</a>
        <a href="${basePath}games.html" class="${active === "games" ? "active" : ""}">Games</a>
      </nav>
    </header>
  `;
}

export function renderFooter() {
  return `
    <footer class="site-footer">
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
