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
  page: 'tabD',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  cabinet: 'rutteIV',
  charts: {
    ministries: {
      title: 'Aantal items per ministerie',
      info: 'Deze grafiek geeft het aantal afspraken die een ministerie heeft geregistreerd weer. U kunt op een ministerie klikken om alleen hun afspreken te zien. Op de horizontale as ziet u de aantallen.'
    },
    eventtype: {
      title: 'Type',
      info: 'Deze grafiek geeft het type afspraak weer. U kunt hier op het gewenste gesprekstype klikken om alleen die afspraken weer te geven. Op de horizontale as ziet u de aantallen.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Agenda\'s',
      info: 'Hier vindt u alle afspraken in een lijst. Klik op de afspraak om alle details te zien die het ministerie heeft toegevoegd.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    generic: ["#3B95D0", "#1C5075", "#FF834D", "#DD3C31" ]
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
        var shareText = 'Op Integrity Watch Nederland kun je snel zien welke giften, reizen en nevenactiviteiten Kamerleden hebben! ' + thisPage;
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
  ministries: {
    chart: dc.rowChart("#ministries_chart"),
    type: 'row',
    divId: 'ministries_chart'
  },
  eventtype: {
    chart: dc.rowChart("#eventtype_chart"),
    type: 'row',
    divId: 'eventtype_chart'
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
//Turn date to int for comparison
function dateToInt(date) {
  if(date.trim() == 'Present') { return 99999999; }
  var dateInt = 0;
  var dateParts = date.split('-');
  if(dateParts.length == 3) {
    if(dateParts[0].length == 4) {
      dateInt = parseInt(dateParts[0]+''+dateParts[1]+''+dateParts[2]);
    } else {
      dateInt = parseInt(dateParts[2]+''+dateParts[1]+''+dateParts[0]);
    }
  }
  return dateInt;
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
//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Define datasets based on terms
var agendasDataFile = './data/agendas_rutteIV.json';
var ministriesMatchingFile = './data/agendas_ministries_matching_rutteIV.csv';

if(getParameterByName('cabinet') == 'rutteIII') {
  vuedata.cabinet = 'rutteIII';
  agendasDataFile = './data/agendas_rutteIII.json';
  ministriesMatchingFile = './data/agendas_ministries_matching_rutteIII.csv';
}

//Load data and generate charts
json(agendasDataFile, (err, events) => {
  csv(ministriesMatchingFile, (err, ministriesMatching) => {
    //Loop through data to apply fixes and calculations
    _.each(events, function (d) {
      d.activiteitnaam = d.activiteitnaam.trim();
      d.type = d.type.trim();
      d.subtitel = d.subtitel.trim();
      d.people = d.bewindspersoon;
      d.peopleString = d.bewindspersoon.join(', ');
      d.ministries = [];
      //Fix links in full description
      d.subtitel_full = d.subtitel_full.replaceAll('href="/', 'href="https://www.rijksoverheid.nl/')
      //Get date int
      var dateInt = dateToInt(d.datum);
      _.each(d.people, function (p) {
        //Get ministers
        var matchingEntry = _.find(ministriesMatching, function (x) { 
          //console.log(dateInt + ' ' + dateToInt(x.start_date));
          return x.person.toLowerCase().trim() == p.toLowerCase().trim() && (dateInt >= dateToInt(x.start_date) && dateInt <= dateToInt(x.end_date)) 
        })
        if(matchingEntry) {
          //console.log(matchingEntry);
          if(d.ministries.indexOf(matchingEntry.ministry) == -1) {
            d.ministries.push(matchingEntry.ministry);
          }
        }
      });
    });

    //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
    var ndx = crossfilter(events);
    var searchDimension = ndx.dimension(function (d) {
        var entryString = d.activiteitnaam + ' ' + d.type + ' ' + d.peopleString + ' ' + d.subtitel;
        return entryString.toLowerCase();
    });

    //CHART 1
    var createMinistriesChart = function() {
      var chart = charts.ministries.chart;
      var dimension = ndx.dimension(function (d) {
          return d.ministries;
      }, true);
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
      var width = recalcWidth(charts.ministries.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(490)
        .margins({top: 0, left: 0, right: 0, bottom: 20})
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function(d, i) {
          return vuedata.colors.generic[0];
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

    //CHART 2
    var createEventtypeChart = function() {
      var chart = charts.eventtype.chart;
      var dimension = ndx.dimension(function (d) {
          return d.type;
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
      var width = recalcWidth(charts.eventtype.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(490)
        .margins({top: 0, left: 0, right: 0, bottom: 20})
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function(d, i) {
          return vuedata.colors.generic[0];
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
              return d.activiteitnaam;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 2,
            "defaultContent":"N/A",
            "data": function(d) {
              return d.type;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 3,
            "defaultContent":"N/A",
            "data": function(d) {
              return d.peopleString;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 4,
            "defaultContent":"N/A",
            "data": function(d) {
              return d.subtitel;
            }
          },
          {
            "searchable": false,
            "orderable": true,
            "targets": 5,
            "defaultContent":"N/A",
            "data": function(d) {
              return d.datum;
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
    createMinistriesChart();
    createEventtypeChart();
    createTable();

    $('.dataTables_wrapper').append($('.dataTables_length'));

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

    //Window resize function
    window.onresize = function(event) {
      resizeGraphs();
    };
  })
})
