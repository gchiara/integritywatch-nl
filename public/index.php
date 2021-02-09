<html lang="en">
<head>
    <?php include 'gtag.php' ?>
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
    <link rel="stylesheet" href="static/tab_a.css">
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
          
          <!-- TOGGLE BUTTONS FOR 4TH ROW -->
          <div class="col-md-12 toggle-btn-container">
            <button class="toggle-btn" id="charts-toggle-btn" @click="showAllCharts = !showAllCharts">Zie meer</button>
          </div>
          <!-- CHARTS - FOURTH ROW - CAN BE TOGGLED -->
          <div class="col-md-4 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tab_a_7">
              <chart-header :title="charts.gender.title" :info="charts.gender.info" ></chart-header>
              <div class="chart-inner" id="gender_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col" v-show="showAllCharts">
            <div class="boxed-container chart-container tab_a_8">
              <chart-header :title="charts.age.title" :info="charts.age.info" ></chart-header>
              <div class="chart-inner" id="age_chart"></div>
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
                      <th class="header">Aantal aangegeven nevenfuncties</th> 
                      <th class="header">Aantal huidige nevenfuncties</th> 
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
                <div class="">{{ selectedElement.fullName2 }}</div>
                <div>{{ selectedElement.partyName }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-8">
                    <div class="details-line"><span class="details-line-title">Geboren:</span> {{ selectedElement.birthDate }}, {{ selectedElement.Geboorteplaats }}</div>
                    <div class="details-line"><span class="details-line-title">Tweede kamer lid sinds:</span> TBD</div>
                    <div class="details-line"><span class="details-line-title">Profiel:</span> TBD</div>
                  </div>
                  <div class="col-md-4">
                    <img :src="selectedElement.photoUrl" />
                  </div>
                  <div class="col-md-12">
                    <!-- Divider -->
                    <div class="modal-divider"></div>
                    <div class="details-tables-buttons">
                      <button @click="modalShowTable = 'a'">Commissies Lid</button>
                      <button @click="modalShowTable = 'b'">Commissies Vervanger</button>
                      <button @click="modalShowTable = 'c'">Nevenactiviteiten en belangen</button>
                      <button @click="modalShowTable = 'd'">Reizen</button>
                      <button @click="modalShowTable = 'e'">Giften</button>
                      <button @click="modalShowTable = 'f'">Loopbaan</button>
                      <button @click="modalShowTable = 'g'">Onderwijs</button>
                    </div>
                    <!-- Commissie Lists 1 -->
                    <div v-show="modalShowTable == 'a'">
                      <div class="modal-table-title">Commissies Lid</div>
                      <table class="modal-table" v-if="selectedElement.CommissieZetelVastPersoon && selectedElement.CommissieZetelVastPersoon.length > 0">
                        <tbody>
                          <tr v-for="el in getActiveCommissies(selectedElement.CommissieZetelVastPersoon)">
                            <td>{{ el.CommissieZetel.Commissie.NaamWebNL }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
                    <!-- Commissie Lists 2 -->
                    <div v-show="modalShowTable == 'b'">
                      <div class="modal-table-title">Commissies Vervanger</div>
                      <table class="modal-table" v-if="selectedElement.CommissieZetelVervangerPersoon && selectedElement.CommissieZetelVervangerPersoon.length > 0">
                        <tbody>
                          <tr v-for="el in getActiveCommissies(selectedElement.CommissieZetelVervangerPersoon)">
                            <td>{{ el.CommissieZetel.Commissie.NaamWebNL }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen vervanger in Commissie</div>
                    </div>
                    <!-- Info table 1 -->
                    <div v-show="modalShowTable == 'c'">
                      <div class="modal-table-title">Nevenactiviteiten en belangen</div>
                      <table class="modal-table" v-if="selectedElement.PersoonNevenfunctie && selectedElement.PersoonNevenfunctie.length > 0">
                        <thead><tr><th>Omschijving</th><th>Van</th><th>Tot en met</th><th>VergoedingSoort</th><th>Inkomsten</th><th>Is actief?</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.PersoonNevenfunctie">
                            <td>{{ el.Omschrijving }}</td>
                            <td>{{ el.PeriodeVan }}</td>
                            <td v-if="el.PeriodeTotEnMet == null"></td>
                            <td v-else>{{ el.PeriodeTotEnMet }}</td>
                            <td>{{ el.VergoedingSoort }}</td>
                            <td v-html="incomesList(el)"></td>
                            <td v-if="el.IsActief">Ja</td>
                            <td v-else>Nee</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen nevenactiviteiten opgegeven</div>
                    </div>
                    <!-- Info table 2 -->
                    <div v-show="modalShowTable == 'd'">
                      <div class="modal-table-title">Reizen</div>
                      <table class="modal-table" v-if="selectedElement.PersoonReis && selectedElement.PersoonReis.length > 0">
                        <thead><tr><th>Doel</th><th>Vanaf</th><th>Tot en met</th><th>Betaald door</th><th>Bestemming</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.PersoonReis">
                            <td>{{ el.Doel }}</td>
                            <td>{{ el.Van }}</td>
                            <td v-if="el.TotEnMet == null">Heden</td>
                            <td v-else>{{ el.TotEnMet }}</td>
                            <td>{{ el.BetaaldDoor }}</td>
                            <td>{{ el.Bestemming }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen reizen opgegeven</div>
                    </div>
                    <!-- Info table 3 -->
                    <div v-show="modalShowTable == 'e'">
                      <div class="modal-table-title">Giften</div>
                      <table class="modal-table" v-if="selectedElement.PersoonGeschenk && selectedElement.PersoonGeschenk.length > 0">
                        <thead><tr><th>Omschijving</th><th>Datum</th><th>Waarde</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.PersoonGeschenk">
                            <td>{{ el.Omschrijving }}</td>
                            <td>{{ el.Datum.split('T')[0] }}</td>
                            <td v-html="getGiftValue(el.Omschrijving)"></td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>Geen giften opegegeven</div>
                    </div>
                    <!-- Info table 4 -->
                    <div v-show="modalShowTable == 'f'">
                      <div class="modal-table-title">Loopbaan</div>
                      <table class="modal-table" v-if="selectedElement.PersoonLoopbaan && selectedElement.PersoonLoopbaan.length > 0">
                        <thead><tr><th>Functie</th><th>Van</th><th>Tot en met</th><th>Werkgever</th><th>Plaats</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.PersoonLoopbaan">
                            <td>{{ el.Functie }}</td>
                            <td>{{ el.Van }}</td>
                            <td>{{ el.TotEnMet }}</td>
                            <td>{{ el.Werkgever }}</td>
                            <td v-if="el.Plaats == null">Niet aangegeven</td>
                            <td v-else>{{ el.Plaats }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
                    <!-- Info table 4 -->
                    <div v-show="modalShowTable == 'g'">
                      <div class="modal-table-title">Onderwijs</div>
                      <table class="modal-table" v-if="selectedElement.PersoonOnderwijs && selectedElement.PersoonOnderwijs.length > 0">
                        <thead><tr><th>Opleiding</th><th>Van</th><th>Tot en met</th><th>Instelling</th><th>Plaats</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.PersoonOnderwijs">
                            <td v-if="el.OpleidingNL == null">{{ el.OpleidingEn }}</td>
                            <td v-else>{{ el.OpleidingNL }}</td>
                            <td v-if="el.Van == null">Niet aangegeven</td>
                            <td v-else>{{ el.Van }}</td>
                            <td v-if="el.TotEnMet == null">Niet aangegeven</td>
                            <td v-else>{{ el.TotEnMet }}</td>
                            <td v-if="el.Instelling == null">Niet aangegeven</td>
                            <td v-else>{{ el.Instelling }}</td>
                            <td v-if="el.Plaats == null">Niet aangegeven</td>
                            <td v-else>{{ el.Plaats }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
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
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_a.js"></script>

 
</body>
</html>