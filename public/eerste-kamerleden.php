<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch NL – Eerste kamerleden</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.nl/eerste-kamerleden" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch NL – Eerste kamerleden" />
    <meta property="og:description" content="Dit gebruiksvriendelijke interactieve database geeft een overzicht op nevenfuncties, giften en reizen van Eerste en Tweede kamerleden." />
    <meta property="og:image" content="https://www.integritywatch.nl/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_b.css">
</head>
<body>
    <div id="app" class="tabB">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Nederland – Eerste Kamerleden</h1>
                  <p>Door op de onderstaande lijst of grafieken te klikken, worden de 75 Eerste Kamerleden en hun partijen gesorteerd op hun neveninkomsten, ontvangen geschenken en het aantal reizen dat zij hebben gemaakt. Integrity Watch NL maakt het gemakkelijker voor burgers en journalisten om toezicht te houden op potentiële belangenverstrengeling in de Nederlandse politiek.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container meetings_2">
              <chart-header :title="charts.positions.title" :info="charts.positions.info" ></chart-header>
              <div class="chart-inner" id="positions_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container meetings_3">
              <chart-header :title="charts.positionsIncome.title" :info="charts.positionsIncome.info" ></chart-header>
              <div class="chart-inner" id="positionsincome_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container meetings_4">
              <chart-header :title="charts.positionsWithConsultancy.title" :info="charts.positionsWithConsultancy.info" ></chart-header>
              <div class="chart-inner" id="positionswithconsultancy_chart"></div>
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
                      <th class="header">Aantal huidinge nevenfuncties </th> 
                      <th class="header">Functies met advieswerk</th> 
                      <th class="header">Functies met bezoldiging </th> 
                      <th class="header">Kamerlid sinds</th> 
                      <th class="header">Reizen</th>
                      <th class="header">Gifts</th>
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
                <div class="">{{ selectedElement.name}}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-8">
                    <div class="details-line"><span class="details-line-title">Eerste kamer lid sinds:</span> {{selectedElement.memberSinceDate}}</div>
                    <div class="details-line"><span class="details-line-title">Profiel:</span> <a :href="selectedElement.url" target="_blank">{{selectedElement.url}}</a></div>
                  </div>
                  <div class="col-md-4">
                    <img :src="selectedElement.photoUrl" />
                  </div>
                  <div class="col-md-12">
                    <!-- Divider -->
                    <div class="modal-divider"></div>
                    <div class="details-tables-buttons">
                      <button @click="modalShowTable = 'a'">Commissies Lid</button>
                      <button @click="modalShowTable = 'b'">Nevenactiviteiten</button>
                      <button @click="modalShowTable = 'c'">Reizen</button>
                      <button @click="modalShowTable = 'd'">Giften</button>
                    </div>
                    <!-- Commissie Lists 1 -->
                    <div v-show="modalShowTable == 'a'">
                      <div class="modal-table-title">Commissies Lid</div>
                      <table class="modal-table" v-if="selectedElement.committees && selectedElement.committees.length > 0">
                        <tbody>
                          <tr v-for="el in selectedElement.committees">
                            <td>{{ el }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
                    <!-- Info table 1 -->
                    <div v-show="modalShowTable == 'b'">
                      <div class="modal-table-title">Nevenactiviteiten</div>
                      <table class="modal-table" v-if="selectedElement.Functies_naast_het_Eerste_Kamerlidmaatschap && selectedElement.Functies_naast_het_Eerste_Kamerlidmaatschap.actueel && selectedElement.Functies_naast_het_Eerste_Kamerlidmaatschap.actueel.content.length > 0">
                        <thead><tr><th>Titel</th><th>Beschijving</th><th>VergoedingSoort</th><th>Advies werk?</th><th>Vanaf</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.Functies_naast_het_Eerste_Kamerlidmaatschap.actueel.content">
                            <td>
                              {{getActivityTitleAndDate(el)['title']}}
                            </td>
                            <td>
                              <span v-if="el.beschrijving">{{el.beschrijving}}</span>
                            </td>
                            <td>
                              <span v-if="el.bezoldigd">{{getBezoldigdString(el.bezoldigd)}}</span>
                            </td>
                            <td>
                              <span v-if="el.advieswerk">{{el.advieswerk}}</span>
                            </td>
                            <td>
                              {{getActivityTitleAndDate(el)['date']}}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else>/</div>
                    </div>
                    <!-- Info table 2 -->
                    <div v-show="modalShowTable == 'c'">
                      <div class="modal-table-title">Reizen</div>
                      <table class="modal-table" v-if="selectedElement.Reizen && selectedElement.Reizen.Reizen && typeof selectedElement.Reizen.Reizen.content != 'string' && selectedElement.Reizen.Reizen.content.length > 0">
                        <thead><tr><th>Bestemming</th><th>Doel</th><th>Bekostiger</th><th>Datum</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.Reizen.Reizen.content">
                            <td>
                              {{getActivityTitleAndDate(el)['title']}}
                            </td>
                            <td>
                              <span v-if="el.doel">{{el.doel}}</span>
                            </td>
                            <td>
                              <span v-if="el.bekostiger">{{el.bekostiger}}</span>
                            </td>
                            <td>
                              {{getActivityTitleAndDate(el)['date']}}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else-if="selectedElement.Reizen && selectedElement.Reizen.Reizen && typeof selectedElement.Reizen.Reizen.content == 'string'">{{selectedElement.Reizen.Reizen.content}}</div>
                      <div class="modal-table-else" v-else>/</div>
                    </div> 
                    <!-- Info table 3 -->
                    <div v-show="modalShowTable == 'd'">
                      <div class="modal-table-title">Geschenken</div>
                      <table class="modal-table" v-if="selectedElement.Geschenken && selectedElement.Geschenken.Geschenken && typeof selectedElement.Geschenken.Geschenken.content != 'string' && selectedElement.Geschenken.Geschenken.content.length > 0">
                        <thead><tr><th>Beschijving</th><th>Betaald door</th><th>Waarde</th><th>Datum</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedElement.Geschenken.Geschenken.content">
                            <td>
                              {{getGiftTitleAndDate(el)['title']}}
                            </td>
                            <td>
                              <span v-if="el['betaald door']">{{el['betaald door']}}</span>
                            </td>
                            <td>
                              <span v-if="el.waarde">{{el.waarde}}</span>
                            </td>
                            <td>
                              {{getGiftTitleAndDate(el)['date']}}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else-if="selectedElement.Geschenken && selectedElement.Geschenken.Geschenken && typeof selectedElement.Geschenken.Geschenken.content == 'string'">{{selectedElement.Geschenken.Geschenken.content}}</div>
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
          <div class="footer-col col-8 col-sm-3">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter per lid of partij">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-9 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>van de <strong class="total-count">0</strong> Kamerleden
            </div>
            <div class="count-box count-box-activities">
              <div class="filter-count nbactivities">0</div>van de <strong class="total-count-act">0</strong> nevenactivteiten
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
    <script src="static/tab_b.js"></script>

 
</body>
</html>