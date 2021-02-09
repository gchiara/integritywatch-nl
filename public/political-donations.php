<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch NL – Political donations</title>
    <!-- Add twitter and og meta here -->
    <meta property="og:url" content="https://www.integritywatch.nl" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Integrity Watch NL – Political donations" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="https://www.integritywatch.nl/images/thumbnail.png" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_c.css">
</head>
<body>
    <div id="app" class="tabC">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Nederland - Political donations</h1>
                  <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae ultrices lorem. Proin pulvinar, leo in porta porttitor, sapien est sagittis tortor, vitae porta nunc mauris vel dolor.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_c_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container tab_c_2">
              <chart-header :title="charts.years.title" :info="charts.years.info" ></chart-header>
              <div class="chart-inner" id="years_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container tab_c_3">
              <chart-header :title="charts.topdonors.title" :info="charts.topdonors.info" ></chart-header>
              <div class="chart-inner" id="topdonors_chart"></div>
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
                      <th class="header">Donor</th> 
                      <th class="header">Amount</th> 
                      <th class="header">Year</th> 
                      <th class="header">Recipient</th> 
                      <th class="header">Political Affiliation</th> 
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
                <div>{{ selectedElement.name_donor }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    Lorem Ipsum
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
              <div class="filter-count">0</div>van de <strong class="total-count">0</strong> donors
            </div>
            <div class="count-box count-box-donationsamt">
              <div class="filter-count donationsamt">0</div>van de <strong class="total-count-donationsamt">0</strong> donations amount
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
    <script src="static/tab_c.js"></script>

 
</body>
</html>