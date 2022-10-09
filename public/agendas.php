<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch NL – Agendas</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.nl/eerste-kamerleden" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch NL – Agenda's" />
    <meta property="og:description" content="Dit gebruiksvriendelijke interactieve database geeft een overzicht op nevenfuncties, giften en reizen van Eerste en Tweede kamerleden." />
    <meta property="og:image" content="https://www.integritywatch.nl/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_d.css">
</head>
<body>
    <div id="app" class="tabD">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Nederland – Agenda's</h1>
                  <p>Integrity Watch NL maakt het mogelijk om door de agenda’s van bewindspersonen te zoeken. Het platform bevat alle afspraken die de ministeries registreren. U kunt filteren op ministerie, het type gesprek of een zoekopdracht uitvoeren, bijvoorbeeld: “VNO-NCW” of “FNV”. Op de horizontale assen kunt u zien om hoeveel afspraken het gaat. Klik op een afspraak in de lijst onder de grafieken om alle informatie over de betreffende afspraken te zien.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- MANDATE SELECTOR -->
          <div class="col-md-12 chart-col mandate-select-container">
            <a href="./agendas.php?cabinet=rutteIII" class="link-button" :class="{active: cabinet == 'rutteIII'}">Rutte III</a>
            <a href="./agendas.php" class="link-button" :class="{active: cabinet == 'rutteIV'}">Rutte IV</a>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container tab_a_1">
              <chart-header :title="charts.ministries.title" :info="charts.ministries.info" ></chart-header>
              <div class="chart-inner" id="ministries_chart"></div>
            </div>
          </div>
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.eventtype.title" :info="charts.eventtype.info" ></chart-header>
              <div class="chart-inner" id="eventtype_chart"></div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" :info="charts.mainTable.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Activiteitnaam</th> 
                      <th class="header">Type</th> 
                      <th class="header">Bewindspersoon</th> 
                      <th class="header">Subtitel</th> 
                      <th class="header">Datum</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div>{{selectedElement.datum}}</div>
                <div class="">{{selectedElement.activiteitnaam}}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Event type:</span> {{selectedElement.type}}</div>
                    <div class="details-line"><span class="details-line-title">Locatie:</span> {{selectedElement.locatie}}</div>
                    <div class="details-line"><span class="details-line-title">Bewindspersoon:</span> {{selectedElement.peopleString}}</div>
                    <div class="details-line" v-if="selectedElement.subtitel_full && selectedElement.subtitel_full.length > 1"><span class="details-line-title">Subtitel:</span> <div v-html="selectedElement.subtitel_full"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-3">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-9 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>van de <strong class="total-count">0</strong> Events
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Reset filters</span></button>
        <!-- Share buttons -->
        <div class="footer-buttons-right">
          <button class="btn-twitter" @click="share('twitter')"><img src="./images/twitter.png" /></button>
          <button class="btn-fb" @click="share('facebook')"><img src="./images/facebook.png" /></button>
          <button class="btn-linkedin" @click="share('linkedin')"><img src="./images/linkedin.png" /></button>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_d.js"></script>

 
</body>
</html>