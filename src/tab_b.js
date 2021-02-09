import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'tabB',
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  travelFilter: 'all',
  charts: {
    party: {
      title: 'Eerste Kamer zetels naar partij',
      info: 'Aantal zetels van de Senaat zoals onderverdeeld naar aanleiding van stemming door de leden van de twaalf Provinciale Staten. Nederlanders stemmen immers voor vertegenwoordiging in Provinciale Staten. Deze Statenleden kiezen op hun beurt leden van de Eerste Kamer (gewogen naar aanleiding van het aantal inwoners in de provincie). Nederland kent in totaal 75 Eerste Kamerleden. Zweef met je muis boven een staaf uit het diagram om de hoeveelheid zetels weer te geven.<br />Klik op een partij om een filter aan te zetten. De resultaten op de rest van deze pagina geven dan enkel gegevens over de aangeklikte partij(en) weer. Klik op ‘reset filter’ om de selectie weer ongedaan te maken.'
    },
    positions: {
      title: 'Nevenfuncties per kamerlid',
      info: 'Hoeveelheid nevenfuncties van Eerste Kamerleden. Wanneer iemand een zetel bezet in de Eerste Kamer, betreft dat een parttime positie. Vandaar dat het aantal leden van de Senaat dat daarnaast nog andere functies bekleed hoger ligt dan in de Tweede Kamer.<br />Toch kan er belangenverstrengeling optreden wanneer vertegenwoordigers moeten beslissen over een onderwerp dat één van hun nevenfuncties raakt. Zij vertegenwoordigen dan niet (volledig) de belangen van de burger, maar (ook) belangen van hun andere werkgever/ organisatie. Dit is één van de corruptierisico’s waar GRECO (de anti-corruptie organisatie van de Raad van Europa) Nederland voor waarschuwde in hun laatste evaluatierapport (2019).'
    },
    positionsIncome: {
      title: 'Nevenfuncties met inkomsten',
      info: 'Indien er sprake is van een nevenfunctie, moeten Kamerleden opgeven of die functie ook een inkomen genereert. Omdat het gaat om beloningen die meer kunnen omvatten dan alleen loon, wordt er dan van bezoldiging gesproken. In tegenstelling tot de Tweede Kamer, hoeft de waarde van de bezoldiging hier niet opgegeven te worden.'
    },
    positionsWithConsultancy: {
      title: 'Nevenfuncties met advieswerk',
      info: 'Wanneer een Eerste Kamerlid in de uitoefening van een nevenfunctie ook adviezen uitbrengt, wordt dat openbaar gemaakt. Er kan immers belangenverstrengeling optreden wanneer een organisatie kan profiteren van een bovengemiddelde kennis van politieke agenda’s.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Eerste Kamerleden',
      info: 'Klik op een Kamerlid om individueel opgegeven commissies, nevenactiviteiten, reizen en giften inzichtelijk te maken. Er is ook een link toegevoegd naar de profielpagina van het betreffende Kamerlid.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    //generic: ["#3b95d0", "#4081ae", "#406a95", "#395a75" ],
    generic: ["#3B95D0", "#1C5075", "#FF834D", "#DD3C31" ],
    parties: {
      "VVD": "#f68f1e",
      "PVV": "#153360",
      "CDA": "#009c48",
      "D66": "#3db54a",
      "GL": "#8cbe57",
      "SP": "#ee2e22",
      "PvdA": "#bb1018",
      "CU": "#00aeef",
      "PvdD": "#006535",
      "50PLUS": "#90268f",
      "SGP": "#f36421",
      "DENK": "#35bfc1",
      "FVD": "#933939",
      "vKA": "#aaa",
      "Onafhankelijk": "#c0c0c0",
      "GroenLinks": "#39A935",
      "ChristenUnie": "#032963",
      "Fractie-Otten": "#FAE800",
      "OSF": "#8FD5FF"
    }
  }
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    getActivityTitleAndDate: function (el) {
      var info = {
        title: '',
        date: ''
      }
      var fullTitle = '';
      if(typeof el == 'string') {
        fullTitle = el;
      } else {
        if(!el.title) {
          return info;
        }
        fullTitle = el.title;
      }
      var splitTitle = fullTitle.split(' vanaf ');
      info.title = splitTitle[0];
      if(splitTitle[1]) {
        info.date = 'Vanaf ' + splitTitle[1];
      }
      return info;
    },
    getGiftTitleAndDate: function (el) {
      var info = {
        title: '',
        date: ''
      }
      var fullTitle = '';
      if(typeof el == 'string') {
        fullTitle = el;
      } else {
        if(!el.title) {
          return info;
        }
        fullTitle = el.title;
      }
      var splitTitle = fullTitle.split(', ');
      info.title = splitTitle[0];
      if(splitTitle[1]) {
        info.date = splitTitle[1];
      }
      return info;
    },
    getBezoldigdString: function (b) {
      if(b.toLowerCase() == 'ja') {
        return 'Bezoldigd';
      } else if(b.toLowerCase() == 'nee') {
        return 'Onbezoldigd';
      }
      return '';
    },
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Op Integrity Watch Nederland kun je snel  zien welke giften, reizen en nevenactiviteiten Kamerleden hebben! ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        var toShareUrl = 'https://integritywatch.nl';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
      if(platform == 'linkedin'){
        var shareURL = 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fintegritywatch.nl&title=Integrity+Watch+Nederland&summary=Soldi+e+Poltica&source=integritywatch.nl';
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes');
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  party: {
    chart: dc.rowChart("#party_chart"),
    type: 'row',
    divId: 'party_chart'
  },
  positions: {
    chart: dc.pieChart("#positions_chart"),
    type: 'pie',
    divId: 'positions_chart'
  },
  positionsIncome: {
    chart: dc.pieChart("#positionsincome_chart"),
    type: 'pie',
    divId: 'positionsincome_chart'
  },
  positionsWithConsultancy: {
    chart: dc.pieChart("#positionswithconsultancy_chart"),
    type: 'pie',
    divId: 'positionswithconsultancy_chart'
  },
  mainTable: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("party_chart").offsetWidth - vuedata.chartMargin*2;
  return [width, 550];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    if((c == 'gender' || c == 'age') && vuedata.showAllCharts == false){
      
    } else {
      var sizes = calcPieSize(charts[c].divId);
      var newWidth = recalcWidth(charts[c].divId);
      var charsLength = recalcCharsLength(newWidth);
      if(charts[c].type == 'row'){
        charts[c].chart.width(newWidth);
        charts[c].chart.label(function (d) {
          var thisKey = d.key;
          if(thisKey.indexOf('###') > -1){
            thisKey = thisKey.split('###')[0];
          }
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        })
        charts[c].chart.redraw();
      } else if(charts[c].type == 'bar') {
        charts[c].chart.width(newWidth);
        charts[c].chart.rescale();
        charts[c].chart.redraw();
      } else if(charts[c].type == 'pie') {
        charts[c].chart
          .width(sizes.width)
          .height(sizes.height)
          .cy(sizes.cy)
          .innerRadius(sizes.innerRadius)
          .radius(sizes.radius)
          .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
        charts[c].chart.redraw();
      } else if(charts[c].type == 'cloud') {
        charts[c].chart.size(recalcWidthWordcloud());
        charts[c].chart.redraw();
      }
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Totals for footer counters
var totalActivities = 0;

//Load data and generate charts
json('./data/eerstekamer.json', (err, senators) => {
  //Loop through data to apply fixes and calculations
  _.each(senators, function (d) {
    //Photo URL
    d.photoUrl = './images/eerstekamer_photos/'+d.id+'.jpg';
    //Find party
    d.party = "";
    if(d.name_page.split("(").length > 1){
      d.party = d.name_page.split("(")[d.name_page.split("(").length - 1].split(")")[0];
    }
    //Activities num and paid/unpaid array for piechart
    d.activitiesNum = 0;
    d.paidActivitiesNum = 0;
    d.activitiesPaidUnpaid = [];
    d.consultancyActivitiesNum = 0;
    d.activitiesConsultancy = [];
    if(d.Functies_naast_het_Eerste_Kamerlidmaatschap && d.Functies_naast_het_Eerste_Kamerlidmaatschap.actueel) {
      d.activitiesNum = d.Functies_naast_het_Eerste_Kamerlidmaatschap.actueel.content.length;
      _.each(d.Functies_naast_het_Eerste_Kamerlidmaatschap.actueel.content, function (a) {
        if(a.bezoldigd) {
          if(a.bezoldigd == "ja") {
            d.activitiesPaidUnpaid.push("Bezoldigd");
            d.paidActivitiesNum ++;
          } else if(a.bezoldigd == "nee") {
            d.activitiesPaidUnpaid.push("Onbezoldigd");
          }
        }
        if(a.advieswerk) {
          if(a.advieswerk == "ja") {
            d.activitiesConsultancy.push("Met advieswerk");
            d.consultancyActivitiesNum ++;
          } else if(a.advieswerk == "nee") {
            d.activitiesConsultancy.push("Zonder advieswerk");
          }
        }
      });
    }
    totalActivities += d.activitiesNum;
    console.log(d.activitiesNum);
    //Activities num category
    d.activitiesNumCat = "0";
    if(d.activitiesNum >= 5) {
      d.activitiesNumCat = "5+";
    } else if(d.activitiesNum > 2) {
      d.activitiesNumCat = "3—4";
    } else if(d.activitiesNum > 0) {
      d.activitiesNumCat = "1—2";
    }
    //Date since
    d.memberSinceDate = d.Anciënniteit.extraInfo[1].replace("(","");
    d.memberSinceDate = d.memberSinceDate.replace(")",""); 
  });

  //Set totals for footer counters
  $('.count-box-activities .total-count-act').text(totalActivities);

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(senators);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.name + ' ' + d.party;
      return entryString.toLowerCase();
  });

  //CHART 1
  var createPartyChart = function() {
    var chart = charts.party.chart;
    var dimension = ndx.dimension(function (d) {
        return d.party;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(100).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.party.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(490)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 2 - Positions
  var createPositionsChart = function() {
    var chart = charts.positions.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesNumCat;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1—2','3—4','5+'];
    var sizes = calcPieSize(charts.positions.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      .ordinalColors(vuedata.colors.generic)
      .group(group);
      /*
      .colorCalculator(function(d, i) {
        return vuedata.colors.incomes[d.key];
      });
      */
    chart.render();
  }

  //CHART 3 - Positions Income
  var createPositionsIncomeChart = function() {
    var chart = charts.positionsIncome.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesPaidUnpaid;
    }, true);
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['Bezoldigd', 'Onbezoldigd'];
    var sizes = calcPieSize(charts.positionsIncome.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      .ordinalColors(vuedata.colors.generic)
      .group(group);

    chart.render();
  }

  //CHART 4 - Positions Consultancy
  var createPositionsWithConsultancyChart = function() {
    var chart = charts.positionsWithConsultancy.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesConsultancy;
    }, true);
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['Met advieswerk', 'Zonder advieswerk'];
    var sizes = calcPieSize(charts.positionsWithConsultancy.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      .ordinalColors(vuedata.colors.generic)
      .group(group);

    chart.render();
  }
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "language": {
        "emptyTable": "Geen zoek resultaten in the Eerste Kamer. Klik <a href='/'>hier</a> om naar de Tweede kamer te gaan."
      },
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.party;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.activitiesNum;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.consultancyActivitiesNum;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.paidActivitiesNum;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.memberSinceDate;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.Reizen && d.Reizen.Reizen && typeof d.Reizen.Reizen.content != 'string' && d.Reizen.Reizen.content.length > 0) {
              return d.Reizen.Reizen.content.length;
            }
            return 0;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.Geschenken && d.Geschenken.Geschenken && typeof d.Geschenken.Geschenken.content != 'string' && d.Geschenken.Geschenken.content.length > 0) {
              return d.Geschenken.Geschenken.content.length;
            }
            return 0;
          }
        } 
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "asc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.mainTable.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
      $('#detailsModal').modal();
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.mainTable.chart.fnClearTable();
      charts.mainTable.chart.fnAddData(alldata);
      charts.mainTable.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createPartyChart();
  createPositionsChart();
  createPositionsIncomeChart();
  createPositionsWithConsultancyChart();

  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Toggle last charts functionality and fix for responsiveness
  vuedata.showAllCharts = false;
  $('#charts-toggle-btn').click(function(){
    if(vuedata.showAllCharts){
      resizeGraphs();
    }
  })

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  //Update datatables
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Custom counters
  function drawActivitiesCounter() {
    var dim = ndx.dimension (function(d) {
      if (!d.name) {
        return "";
      } else {
        return d.name;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.name) {
          return p;
        }
        p.actnum = +d.activitiesNum;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.name) {
          return p;
        }
        p.actnum = +d.activitiesNum;
        return p;
      },
      function(p,d) {  
        return {nb: 0, actnum:0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var actnum = 0;
    var counter = dc.dataCount(".count-box-activities")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
          actnum += +kv.value.actnum;
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
      $(".nbactivities").text(actnum);
      actnum=0;
    });
    counter.render();
  }
  drawActivitiesCounter();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
