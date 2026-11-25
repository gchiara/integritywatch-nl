<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch NL – Tweede kamerleden</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.nl" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch NL – Tweede kamerleden" />
    <meta property="og:description" content="Dit gebruiksvriendelijke interactieve database geeft een overzicht op nevenfuncties, giften en reizen van Eerste en Tweede kamerleden." />
    <meta property="og:image" content="https://www.integritywatch.nl/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_a_2023_2025.css?v=8">
</head>
<body>
    <div id="app" class="tabA">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Nederland - Tweede Kamerleden</h1>
                  <p>Door op de onderstaande lijst of grafieken te klikken, worden de 150 Tweede Kamerleden en hun partijen gesorteerd op hun neveninkomsten, ontvangen geschenken en het aantal reizen dat zij hebben gemaakt. Integrity Watch NL maakt het gemakkelijker voor burgers en journalisten om toezicht te houden op potentiële belangenverstrengeling in de Nederlandse politiek.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- MANDATE SELECTOR -->
          <div class="col-md-12 chart-col mandate-select-container">
            <a :href="'./index.php?s='+supportModalShown" class="link-button">Kamerperiode 2025-heden</a>
            <a :href="'./tweede-kamerleden_2023-2025.php?s='+supportModalShown" class="link-button active">Kamerperiode 2023-2025</a>
            <a :href="'./index.php?previousmandate21_23=1&s='+supportModalShown" class="link-button">Kamerperiode 2021-2023</a>
            <a :href="'./index.php?previousmandate17_21=1&s='+supportModalShown" class="link-button">Kamerperiode 2017-2021</a>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_2">
              <chart-header :title="charts.positions.title" :info="charts.positions.info" ></chart-header>
              <div class="chart-inner" id="positions_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_3">
              <chart-header :title="charts.positionsIncome.title" :info="charts.positionsIncome.info" ></chart-header>
              <div class="chart-inner" id="positionsincome_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_a_4">
              <chart-header :title="charts.giftsValue.title" :info="charts.giftsValue.info" ></chart-header>
              <div class="chart-inner" id="giftsvalue_chart"></div>
            </div>
          </div>
          <!-- CHARTS - SECOND ROW -->
          <div class="col-md-5 chart-col">
            <div class="boxed-container chart-container tab_a_5">
              <chart-header :title="charts.travel.title" :info="charts.travel.info" ></chart-header>
              <div class="travel-filter-buttons">
                <button class="travel-filter-btn thirdparty" :class="{ active: travelFilter == '3rd' }">Door derden betaald</button>
                <button class="travel-filter-btn nonthirdparty" :class="{ active: travelFilter == 'non3rd' }">Niet door derden betaald</button>
                <button class="travel-filter-btn" :class="{ active: travelFilter == 'all' }">Alle reizen</button>
              </div>
              <div class="chart-inner" id="travel_chart"></div>
            </div>
          </div>
          <div class="col-md-7 chart-col">
            <div class="boxed-container chart-container tab_a_6">
              <chart-header :title="charts.gifts.title" :info="charts.gifts.info" ></chart-header>
              <div class="chart-inner" id="gifts_chart"></div>
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
                      <th class="header">Naam</th> 
                      <th class="header">Fractie</th> 
                      <th class="header">Totaal opgegeven nevenfuncties (2023)</th> 
                      <th class="header">Aantal giften</th> 
                      <th class="header">Aantal reizen</th> 
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
                <div class="">{{ selectedElement.fullName }}</div>
                <div>{{ selectedElement.party }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-tables-buttons">
                      <button @click="modalShowTable = 'a'">Nevenactiviteiten</button>
                      <button @click="modalShowTable = 'b'">Geschenken</button>
                      <button @click="modalShowTable = 'c'">Reizen</button>
                    </div>
                    <!-- Activities List -->
                    <div v-show="modalShowTable == 'a'">
                      <div class="modal-table-title">Nevenactiviteiten</div>
                      <table class="modal-table" v-if="selectedElement.activities && selectedElement.activities.length > 0">
                        <thead><tr><th>Jaar</th><th>Omschijving</th><th>Van</th><th>Tot en met</th><th>Soort</th><th>Inkomsten</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.activities">
                            <td>{{ el.year }}</td>
                            <td>{{ el.omschrijving }}</td>
                            <td>{{ el.from }}</td>
                            <td>{{ el.to }}</td>
                            <td>{{ el.soort }}</td>
                            <td>{{ el.inkomsten }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen nevenactiviteiten opgegeven</div>
                    </div>
                    <!-- Gifts List -->
                    <div v-show="modalShowTable == 'b'">
                      <div class="modal-table-title">Geschenken</div>
                      <table class="modal-table" v-if="selectedElement.gifts && selectedElement.gifts.length > 0">
                        <thead><tr><th>Geschenk</th><th>Datum</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.gifts">
                            <td>{{ el.geschenk }}</td>
                            <td>{{ el.datum }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen giften opegegeven</div>
                    </div>
                    <!-- Travel List -->
                    <div v-show="modalShowTable == 'c'">
                      <div class="modal-table-title">Reizen</div>
                      <table class="modal-table" v-if="selectedElement.travels && selectedElement.travels.length > 0">
                        <thead><tr><th>Doel</th><th>Vanaf</th><th>Tot en met</th><th>Betaald door</th><th>Bestemming</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.travels">
                            <td>{{ el.doel }}</td>
                            <td>{{ el.datum_vanaf }}</td>
                            <td>{{ el.datum_tm }}</td>
                            <td>{{ el.betaald_door }}</td>
                            <td>{{ el.bestemming }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen reizen opgegeven</div>
                    </div>
                    
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
          <div class="footer-col col-sm-3">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter per lid of partij">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-sm-9 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>van de <strong class="total-count">0</strong> Kamerleden
            </div>
            <div class="count-box count-box-activities">
              <div class="filter-count nbactivities">0</div>van de <strong class="total-count-act">0</strong> nevenactivteiten
            </div>
            <div class="count-box count-box-gifts">
              <div class="filter-count nbgifts">0</div>van de <strong class="total-count">0</strong> giften
            </div>
            <div class="count-box count-box-travels">
              <div class="filter-count nbtravels">0</div>van de <strong class="total-count">0</strong> reizen
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
      <!-- SUPPORT US MODAL -->
      <div class="modal" id="donationModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title"></div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <p class="donation-modal-title">Steun ons werk met een gift!</p>
              <p>Transparency International Nederland strijdt voor een samenleving vrij van corruptie. Met Integrity Watch vragen wij aandacht voor de transparantie en integriteit van de Tweede Kamer en de overheid. Uw gift zorgt ervoor dat wij dat werk kunnen voortzetten.</p>
              <div class="supportus-buttons">
                <a href="https://www.pifworld.com/nl/nonprofits/1UG8djhGLxU/transparency-international-neder/donate" target="_blank">Donatie</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <?php require 'consent_notice.php' ?>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_a_2023_2025.js?v=8"></script>

 
</body>
</html>