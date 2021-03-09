<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://transparency.nl/" target="_blank"><img src="./images/it_logo_nl.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'tabA'}">Tweede Kamerleden</a>
      </li>
      <li class="nav-item">
        <a href="./eerste-kamerleden.php" class="nav-link" :class="{active: page == 'tabB'}">Eerste Kamerleden</a>
      </li>
      <li class="nav-item">
        <a href="./political-donations.php" class="nav-link" :class="{active: page == 'tabC'}">Partijfinanciering</a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Andere versies
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">EU</a>
          <a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">Europese Unie</a>
          <a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">Frankrijk</a>
          <a class="dropdown-item" href="https://www.integritywatch.gr/" target="_blank">Griekenland</a>
          <a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Italië</a>
          <a class="dropdown-item" href="https://deputatiuzdelnas.lv/" target="_blank">Letland</a>
          <a class="dropdown-item" href="https://manoseimas.lt/" target="_blank">Litouwen</a>
          <a class="dropdown-item" href="http://varuhintegritete.transparency.si/" target="_blank">Slovenië</a>
          <a class="dropdown-item" href="https://integritywatch.es/" target="_blank">Spanje</a>
          <a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">Verenigd Koninkrijk</a>
          <a class="dropdown-item" href="https://integritywatch.cl/" target="_blank">Chili</a>
        </div>
      </li>
      <li class="nav-item">
        <a href="./about" class="nav-link">Over Integrity Watch NL</a>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
    </ul>
  </div>
</nav>