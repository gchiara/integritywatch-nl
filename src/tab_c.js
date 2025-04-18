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
  page: 'tabC',
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  showMps: true,
  chartMargin: 40,
  travelFilter: 'all',
  charts: {
    party: {
      title: 'Totaalbedrag aan donaties per politieke partij',
      info: 'Totaalbedrag aan donaties per politieke partij. Klik op een partij om een filter aan te zetten. De resultaten op de rest van deze pagina geven dan enkel gegevens over de aangeklikte partij(en) weer. Klik op ‘reset filter’ om de selectie weer ongedaan te maken.'
    },
    years: {
      title: 'Totaalbedrag aan donaties per jaar',
      info: 'Totaalbedrag aan donaties per jaar.'
    },
    topdonors: {
      title: 'Top 10 donateurs',
      info: 'Top 10 donateurs, naar totaal gedoneerd bedrag. Sommige partijen verplichten gekozen vertegenwoordigers (Kamerleden, wethouders, etc.) om een deel van hun salaris aan de partij af te staan. Dit verklaart bijvoorbeeld het hoge bedrag aan donaties bij de SP. Als u de optie “zonder Kamerleden” selecteert, worden zittende Kamerleden niet meegenomen in de lijst van donateurs.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Donaties',
      info: ''
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    default: "#2a7aae",
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
      "Denk": "#35bfc1",
      "FVD": "#933939",
      "vKA": "#aaa",
      "Onafhankelijk": "#c0c0c0",
      "GroenLinks": "#39A935",
      "ChristenUnie": "#032963",
      "Fractie-Otten": "#FAE800",
      "OSF": "#8FD5FF",
      "Partij voor de Dieren": "#518354",
      "Forum voor Democratie": "#6F2422",
      "Fractie Den Haan": "#aaaaaa",
      "Van Haga": "#777777",
      "BBB": "#A6CB45",
      "BIJ1": "#FFFF00",
      "Volt": "#582488",
      "Groep Van Haga": "#cccccc",
      "Omtzigt": "#34b4eb",
      "Ephraim": "#333",
      "Gündoğan": "#b5a2fa",
      "Krol": "#9379f2",
      "GroenLinks-PvdA": "#BB1018",
      "JA21": "#2f4b91",
      "OPNL": "#d69f3a",
      "BVNL": "#1D2446",
      "NSC": "#F0C400"
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
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Integrity Watch Nederland kun je snel zien hoeveel donaties politieke partijen hebben ontvangen ! ' + thisPage;
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
        var shareURL = 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fintegritywatch.nl&title=Integrity+Watch+Nederland&summary=Integrity+Watch+Nederland&source=integritywatch.nl';
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
  years: {
    //chart: dc.lineChart("#years_chart"),
    chart: new dc.compositeChart("#years_chart"),
    type: 'line',
    divId: 'years_chart'
  },
  topdonors: {
    chart: dc.rowChart("#topdonors_chart"),
    type: 'row',
    divId: 'topdonors_chart'
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
    } else if(charts[c].type == 'line') {
      charts[c].chart.width(newWidth);
      charts[c].chart.legend(dc.legend().x(0).y(460).itemHeight(10).gap(10).horizontal(true).autoItemWidth(true).legendWidth(newWidth));
      charts[c].chart.rescale();
      charts[c].chart.redraw();
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
//Custom date order for dataTables and custom amount order
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
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "amt-pre": function (v) {
    var amt = v.replaceAll(",","").replaceAll("€ ","");
    var amtNum = 0;
    if(!isNaN(parseFloat(amt))) {
      amtNum = parseFloat(amt);
    }
    return amtNum;
  },
  "amt-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "amt-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

//Totals for footer counters
var totalDonationsAmt = 0;

//Load data and generate charts
csv('./data/donations/donations.csv', (err, donations) => {
csv('./data/donations/donations_2020.csv?' + randomPar, (err, donations_2020) => {
csv('./data/donations/donations_2021.csv?' + randomPar, (err, donations_2021) => {
csv('./data/donations/donations_2022.csv?' + randomPar, (err, donations_2022) => {
csv('./data/donations/donations_2023.csv?' + randomPar, (err, donations_2023) => {
csv('./data/donations/donations_2024.csv?' + randomPar, (err, donations_2024) => {
csv('./data/donations/donations_mps_names.csv', (err, mps) => {
  //Append 2020 and 2021 donations to main list
  _.each(donations_2020, function (d) {
      donations.push(d);
  });
  _.each(donations_2021, function (d) {
    donations.push(d);
  });
  _.each(donations_2022, function (d) {
    donations.push(d);
  });
  _.each(donations_2023, function (d) {
    if(isNaN(d.amount_total)) {
      //console.log(d);
    }
    if(!d.year || d.year == "") {
      d.year = "2023";
    }
    donations.push(d);
  });
  _.each(donations_2024, function (d) {
    if(isNaN(d.amount_total)) {
      //console.log(d);
    }
    donations.push(d);
  });
  
  //Loop through data to apply fixes and calculations
  var idCount = 0;
  var partiesList = [];
  //Filter out donations from ChristenUnie (these are donations from CU to their own subsidiaries)
  donations = _.filter(donations, function (x) { return x.name_donor !== "ChristenUnie" });
  _.each(donations, function (d) {
    d.id = idCount;
    idCount ++;
    d.amt = 0;
    //if(d.amount_total.indexOf(' €') > -1) {
    d.amtString = d.amount_total.replace(' €','').replace('€','');
    if(!isNaN(d.amtString)) {
      d.amt = parseFloat(d.amtString).toFixed(2);
      if(d.year == '2024') {
        if(isNaN(d.amt)) {
          /*
          console.log(d);
          console.log(d.amtString);
          console.log(d.amt);
          */
          d.amt = 0;
        }
      }
      totalDonationsAmt += parseFloat(d.amt);
    } else {
      //console.log("NaN amtstring: " +  d.amount_total);
    }
    //Check if mp
    d.mp = false;
    if(_.find(mps, function (x) { return x.name.toLowerCase().trim() == d.name_donor.toLowerCase().trim() })) {
      d.mp = true;
    }
    //Name and parties fixes
    d.political_affiliation = d.political_affiliation.trim();
    d.name_donor = d.name_donor.trim();
    d.recipient_name = d.recipient_name.trim();
    if(d.political_affiliation == 'Forum voor Democratie' || d.political_affiliation.toLowerCase() == 'fvd') {
      d.political_affiliation = 'FVD';
    }
    if(d.political_affiliation == 'Partij voor de Dieren' || d.political_affiliation.toLowerCase() == 'pvdd') {
      d.political_affiliation = 'PvdD';
    }
    if(d.political_affiliation == 'GroenLinks' || d.political_affiliation.toLowerCase() == 'gl') {
      d.political_affiliation = 'GL';
    }
    if(d.political_affiliation == 'ChristenUnie' || d.political_affiliation.toLowerCase() == 'cu') {
      d.political_affiliation = 'CU';
    }

    //Add party to list
    if(partiesList.indexOf(d.political_affiliation) == -1) {
      partiesList.push(d.political_affiliation);
    }
  });

  //Set totals for footer counters
  $('.count-box-donationsamt .total-count-donationsamt').text('€ ' + addcommas(totalDonationsAmt.toFixed(2)));

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(donations);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.name_donor + ' ' + d.political_affiliation + ' ' + d.recipient_name + ' ismp:' + d.mp;
      return entryString.toLowerCase();
  });

  //CHART 1
  var createPartyChart = function() {
    var chart = charts.party.chart;
    var dimension = ndx.dimension(function (d) {
        return d.political_affiliation;
    });
    var group = dimension.group().reduceSum(function (d) {
        return d.amt;
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
      .height(430)
      .margins({top: 0, left: 0, right: 10, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key == "SP") {
            return "SP*";
          }
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

  //CHART 2
  var createYearChart = function() {
    var chart = charts.years.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.year) {
        return d.year;
      }
    });
    var group = dimension.group().reduceSum(function (d) {
        return d.amt;
    });
    var width = recalcWidth(charts.years.divId);
    chart
      .width(width)
      .height(560)
      .margins({top: 10, left: 30, right: 0, bottom: 20})
      .group(group)
      .dimension(dimension)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .brushOn(true)
      .xAxisLabel('')
      .yAxisLabel('')
      .renderHorizontalGridLines(true)
      .elasticY(true)
      .elasticX(false)
      .yAxisPadding("10%")
      .title(function (d) {
        return d.key + ': ' + d.value.toFixed(2);
      });
      chart.render();
  }

  //CHART 3
  var createYearMultilineChart = function(){
    var chart = charts.years.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.year) {
        return d.year;
      }
    });
    var groups = [];
    var composeArray = [];
    _.each(partiesList, function (p) {
      var thisGroup = dimension.group().reduceSum(function (d) { 
        if(d.political_affiliation == p) {
          return d.amt;
        }
        return 0;
      });
      var thisCompose = dc.lineChart(chart)
      .group(thisGroup, p)
      .colors(vuedata.colors.parties[p])
      .defined(function(d){
        return d.data.value !== -1;
      })
      .renderDataPoints({
        radius: 2,
        fillOpacity: 0.5,
        strokeOpacity: 0.8
      });
      groups.push(thisGroup);
      composeArray.push(thisCompose);
    });
    var width = recalcWidth(charts.years.divId);
    
    chart
      .width(width)
      .height(460)
      .yAxisPadding(10)
      .renderHorizontalGridLines(true)
      .margins({top: 10, left: 40, right: 10, bottom: 50})
      .legend(dc.legend().x(0).y(460).itemHeight(10).gap(10).horizontal(true).autoItemWidth(true).legendWidth(width))
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .brushOn(false)
      .xAxisLabel('')
      .yAxisLabel('')
      .dimension(dimension)
      .group(groups[0], 'Amt')
      ._rangeBandPadding(1)
      .compose(composeArray);
    chart.xAxis()
      //.tickValues(d3.range(data.length))
      .tickFormat(function(d) { return d; });
    chart.filter = function() {};
    chart.render();
    
  }

  //CHART 3
  var createTopDonorsChart = function() {
    var chart = charts.topdonors.chart;
    var dimension = ndx.dimension(function (d) {
        return d.name_donor;
    });
    var group = dimension.group().reduceSum(function (d) {
      return d.amt;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topdonors.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(540)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
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
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "language": {
        "emptyTable": "Geen zoek resultaten."
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
            return d.name_donor;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.address;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.year;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.political_affiliation;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.recipient_name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "type": "amt",
          "data": function(d) {
            /*
            if(!isNaN(d.amount_total)) {
            //d.amount_total = parseFloat(d.amount_total).toFixed(2);
            } 
            */
           if(isNaN(d.amount_total.replace(",",".")) || d.amount_total == '') {
            return d.amount_total;
           }
            return "€ " + addcommas(parseFloat(d.amount_total.replace(",",".")).toFixed(2));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.mp) {
              return "ja";
            }
            return "";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.ubo) {
              return d.ubo;
            } else {
              return "";
            }
          }
        },
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 3, "desc" ]],
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

  //Filter out mps
  var excludeMps = function() {
    searchDimension.filter(function(d) { 
      return d.indexOf("ismp:true") == -1;
    });
    dc.redrawAll();
  }
  $('.toggle-mps-btn').click(function(){
    if(vuedata.showMps){
      vuedata.showMps = false;
      excludeMps();
      $('.toggle-mps-btn').html("Met Tweedekamerleden");
    } else {
      vuedata.showMps = true;
      searchDimension.filter(null);
      $('#search-input').val('');
      dc.redrawAll();
      $('.toggle-mps-btn').html("Zonder Tweedekamerleden");
    }
  })

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
  createYearChart();
  createYearMultilineChart();
  createTopDonorsChart();
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
  function drawDonationsCounter() {
    var dim = ndx.dimension (function(d) {
      if (!d.id) {
        return "";
      } else {
        return d.id;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.amt) {
          return p;
        }
        p.donationsTot = +d.amt;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.amt) {
          return p;
        }
        p.donationsTot = -d.amt;
        return p;
      },
      function(p,d) {  
        return {nb: 0, donationsTot:0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var donationsTot = 0;
    var counter = dc.dataCount(".count-box-donationsamt")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
          donationsTot += +kv.value.donationsTot;
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
      $(".donationsamt").text('€ ' + addcommas(donationsTot.toFixed(2)));
      donationsTot=0;
    });
    counter.render();
  }
  drawDonationsCounter();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
})
})
})
})
})
})