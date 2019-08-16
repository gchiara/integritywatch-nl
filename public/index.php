<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Meetings</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/meps.css">
</head>
<body>
    <div id="app" class="meetings-page">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Dashboard title</h1>
                  <p>Dashboard description
                  <a href="./about.php?section=1">Read more</a></p> 
                  <p>By simply clicking on the graphs or the list below users can rank, sort and filter the data.</p>
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
              <!-- SHARE -->
              <div class="col-md-4 chart-col" v-if="showShare">
                <div class="boxed-container share-container">
                  <button class="twitter-btn" @click="share('twitter')">Share on Twitter</button>
                  <button class="facebook-btn" @click="share('facebook')">Share on Facebook</button>
                  <i class="material-icons close-btn" @click="showShare = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.positions.title" :info="charts.positions.info" ></chart-header>
              <div class="chart-inner" id="positions_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.positionsIncome.title" :info="charts.positionsIncome.info" ></chart-header>
              <div class="chart-inner" id="positionsincome_chart"></div>
            </div>
          </div>
          <!-- CHARTS - THIRD ROW -->
          <div class="col-md-8 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.gifts.title" :info="charts.gifts.info" ></chart-header>
              <div class="chart-inner" id="gifts_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.giftsValue.title" :info="charts.giftsValue.info" ></chart-header>
              <div class="chart-inner" id="giftsvalue_chart"></div>
            </div>
          </div>
          <!-- CHARTS - FOURTH ROW - CAN BE TOGGLED -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container meetings_1">
              <chart-header :title="charts.gender.title" :info="charts.gender.info" ></chart-header>
              <div class="chart-inner" id="gender_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container meetings_1">
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
                      <th class="header">Aantal aangegeven Nevenfuncties</th> 
                      <th class="header">Aantal huidige Nevenfuncties</th> 
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
                <div class="">{{ selectedElement }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-title details-title-left">SUBTITLE</div>
                    <div class="details-line"><span class="details-line-title">Party:</span> lorem ipsum</div>
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
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter by Lobbyist, Host, Subject…">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>out of <strong class="total-count">0</strong> meetings
            </div>
            <div class="org-count count-box">
              <div class="filter-count">0</div>out of <strong class="total-count">0</strong> organisations
            </div>
            <div class="count-box count-box-lobbyists">
              <div class="filter-count nbfte">0</div> out of <strong class="total-count">0</strong> Lobbyists
            </div>
            <div class="count-box count-box-accred">
              <div class="filter-count nbaccredited">0</div> out of <strong class="total-count">0</strong> EP passes
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Reset filters</span></button>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/meps.js"></script>

 
</body>
</html>