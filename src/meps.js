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
  page: 'tabA',
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  travelFilter: 'all',
  charts: {
    party: {
      title: 'Party',
      info: 'Lorem Ipsum'
    },
    positions: {
      title: 'Aantal doorlopende nevenfuncties',
      info: ''
    },
    positionsIncome: {
      title: 'Doorlopende nevenfuncties inkomsten',
      info: ''
    },
    travel: {
      title: 'Aantal reizen per jaar',
      info: ''
    },
    gifts: {
      title: 'Aantal ontvangen giften',
      info: ''
    },
    giftsValue: {
      title: 'Waarde van de giften',
      info: ''
    },
    gender: {
      title: 'Geslacht',
      info: ''
    },
    age: {
      title: 'Leeftijd',
      info: ''
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'MEPs',
      info: 'Click on any meeting for additional information.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    ecPolicy: {			
      "Directors-General": "#395a75",
      "Commissioners": "#4081ae",
      "Cabinet Members": "#3b95d0"
    },
    generic: ["#3b95d0", "#4081ae", "#406a95", "#395a75" ],
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
      "FvD": "#933939",
      "vKA": "#aaa",
      "Onafhankelijk": "#c0c0c0"
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
        var shareText = 'Share text here ' + thisPage;
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
    },
    incomesList: function (el){
      var income = el.PersoonNevenfunctieInkomsten;
      var incomeText = '';
      //If no income
      if(el.VergoedingSoort == 'Onbezoldigd'){
        return 'Niet van toepassing';
      }
      //If income
      if(el.VergoedingSoort == 'Bezoldigd'){
        //If income object
        if(income.length > 0) {
          income.forEach(function (x) {
            //If amount is empty or null
            if(x.Bedrag == null){
              incomeText += x.Jaar + ': ' + x.Opmerking;
            } else {
              //If Soort is netto or bruto
              if(x.BedragSoort == 'Netto' || x.BedragSoort == 'Bruto'){
                incomeText += x.Jaar + ': '+x.Bedrag+' € '+x.BedragSoort+' '+x.Frequentie+'<br />';
              } else if(x.BedragSoort == 'Onbekend' || x.BedragSoort == null) {
              //If Soort is null or Onbekend
                incomeText += x.Jaar + ': '+x.Bedrag+' € '+x.Frequentie+' (Onbekend)'+'<br />';
              }
            }
          });
        } else {
          //If income object is null or empty
          return el.VergoedingToelichting;
        }
      }
      return incomeText;

    },
    getGiftValue: function (desc){
      var pattern = /\€\d+(?:,\d+)*(?:\.\d+)?/;
      //var pattern = /(?<=\€)(\w*)*(\.)*(\w*)*/;
      var patternTotal = /\Totale waarde €\d+(?:,\d+)*(?:\.\d+)?/i;
      if(desc.includes('onbekend')){
        return 'onbekend';
      } else {
        var values = desc.match(pattern);
        var valueTotal = desc.match(patternTotal);
        if(valueTotal){
          return valueTotal.toString();
        }
        if(values){
          if(values.length > 1){
            console.log(values);
            return values.join(', ');
          } else {
            return values.join(' ');
          }
        } else {
          return '';
        }
      }
    },
    getActiveCommissies: function (comm){
      var activeCommissies = _.filter(comm, function(x, index) {
        return x.TotEnMet == null
      });
      return activeCommissies;
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
  travel: {
    chart: dc.barChart("#travel_chart"),
    type: 'bar',
    divId: 'travel_chart'
  },
  gifts: {
    chart: dc.barChart("#gifts_chart"),
    type: 'bar',
    divId: 'gifts_chart'
  },
  giftsValue: {
    chart: dc.pieChart("#giftsvalue_chart"),
    type: 'pie',
    divId: 'giftsvalue_chart'
  },
  gender: {
    chart: dc.pieChart("#gender_chart"),
    type: 'pie',
    divId: 'gender_chart'
  },
  age: {
    chart: dc.barChart("#age_chart"),
    type: 'bar',
    divId: 'age_chart'
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
//Calculate age and age range
var getAge = function(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  var agerange = 0;
  if(age < 30){
    agerange = "20-29";
  } else if(age < 40){
    agerange = "30-39";
  } else if(age < 50){
    agerange = "40-49";
  } else if(age < 60){
    agerange = "50-59";
  } else if(age < 70){
    agerange = "60-69";
  } else if(age < 80){
    agerange = "70-79";
  } else if(age >= 80){
    agerange = "80+";
  } else {
    agerange = "N/A";
    age = "N/A";
  }
  return [age, agerange];
}

//Totals for footer counters
var totalActivities = 0;
var totalGifts = 0;
var totalTravels = 0;

//Load data and generate charts
json('./data/meps.json', (err, meps) => {
  //Prepare data var for travel data, for the stacked bar chart
  var travelData = [];
  //Loop through data to aply fixes and calculations
  _.each(meps, function (d) {
    //Find party
    d.party = '';
    d.partyName = '';
    d.FractieZetelPersoon.forEach(function (x) {
      if(x.TotEnMet == null){
        d.party = x.FractieZetel.Fractie.Afkorting;
        d.partyName = x.FractieZetel.Fractie.NaamNL;
      }
    });
    //Calculate number of active positions and define range and income categories.
    d.activePositions = 0;
    d.activePositionsRange = '';
    d.activePositionsIncomes = [];
    d.PersoonNevenfunctie.forEach(function (x) {
      if(x.IsActief == true){
        d.activePositions ++;
        if(x.VergoedingSoort == 'Onbezoldigd'){
          d.activePositionsIncomes.push('Onbezoldigd');
        } else if(x.VergoedingSoort == 'Bezoldigd' && x.VergoedingToelichting != null) {
          d.activePositionsIncomes.push('Bezoldigd met bedrag opgave');
        } else if(x.VergoedingSoort == 'Bezoldigd' && x.VergoedingToelichting == null) {
          d.activePositionsIncomes.push('Bezoldigd zonder bedrag opgave');
        }
      }
    });
    if(d.activePositions >= 5 ){
      d.activePositionsRange = '> 5';
    } else if(d.activePositions == 3 || d.activePositions == 4){
      d.activePositionsRange = '3 - 4';
    } else if(d.activePositions == 1 || d.activePositions == 2){
      d.activePositionsRange = '1 - 2';
    } else {
      d.activePositionsRange = '0';
    }
    //Define gift values types in an array
    d.giftsValues = [];
    d.PersoonGeschenk.forEach(function (x) {
      if(x.Omschrijving){
        if(x.Omschrijving.includes('onbekend')){
          d.giftsValues.push('Giften van onbekende waarde');
        } else {
          d.giftsValues.push('Giften met bekende waarde');
        }
      }
    });
    //Calculate age and set age range
    d.birthDate = d.Geboortedatum.split('T')[0];
    d.age = getAge(d.birthDate);
    d.ageRange = d.age[1];
    //Add activities, gifts and travels to total counts for footer
    totalActivities += d.PersoonNevenfunctie.length;
    totalGifts += d.PersoonGeschenk.length;
    totalTravels += d.PersoonReis.length;
    //Photo URL
    d.photoUrl = './images/meps/'+d.Id+'.jpg';
    //Add travel entries to travelData var to use for stacked bar chart
    d.travelYears = [];
    d.travelTypes = [];
    d.PersoonReis.forEach(function (x) {
      var travelYear = x.Van.split('-')[0];
      d.travelYears.push(travelYear);
      d.travelTypes.push(x.BetaaldDoor);
      var tEntry = x;
      tEntry.Achternaam = d.Achternaam;
      tEntry.Voornamen = d.Voornamen;
      tEntry.party = d.party;
      tEntry.activePositionsRange = d.activePositionsRange;
      tEntry.activePositionsIncomes = d.activePositionsIncomes;
      tEntry.gifts = d.PersoonGeschenk.length;
      tEntry.giftsValues = d.giftsValues;
      tEntry.gender = d.Geslacht;
      tEntry.ageRange = d.ageRange;
      travelData.push(tEntry);
    });
  });

  //Set totals for footer counters
  $('.count-box-activities .total-count').text(totalActivities);
  $('.count-box-gifts .total-count').text(totalGifts);
  $('.count-box-travels .total-count').text(totalTravels);

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(meps);
  var ndx2 = crossfilter(travelData);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.Achternaam + ' ' + d.Voornamen;
      return entryString.toLowerCase();
  });
  //Dimensions used for custom filtering between the two crossfilters and travel type filters buttons
  var travelYearsDimension = ndx.dimension(function (d) { return d.travelYears; }, true);
  var travelTypesDimension = ndx.dimension(function (d) { return d.travelTypes; }, true);
  var travelTypesDimension2 = ndx2.dimension(function (d) { return d.BetaaldDoor; });
  var travelSearchDimension = ndx2.dimension(function (d) { 
    var entryString = d.Achternaam + ' ' + d.Voornamen + ' ' + d.party;
    return entryString.toLowerCase();
  });
  var travelPartyDimension = ndx2.dimension(function (d) { return d.party; });
  var travelpositionsRangeDimension = ndx2.dimension(function (d) { return d.activePositionsRange; });
  var travelpositionsIncomesDimension = ndx2.dimension(function (d) { return d.activePositionsIncomes; }, true);
  var travelGiftsDimension = ndx2.dimension(function (d) { 
    var gifts = d.gifts;
    if(gifts > 10) { gifts = '> 10'; }
    return gifts.toString();
  });
  var travelGiftsValuesDimension = ndx2.dimension(function (d) { return d.giftsValues; }, true);
  var travelGenderDimension = ndx2.dimension(function (d) { return d.gender; });
  var travelAgeDimension = ndx2.dimension(function (d) { return d.ageRange; });

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
      .height(530)
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
          return d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelPartyDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelPartyDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 2 - Positions
  var createPositionsChart = function() {
    var chart = charts.positions.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activePositionsRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['0','1 - 2','3 - 4','> 5'];
    var sizes = calcPieSize(charts.positions.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
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
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelpositionsRangeDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelpositionsRangeDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 3 - Positions Income
  var createPositionsIncomeChart = function() {
    var chart = charts.positionsIncome.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activePositionsIncomes;
    }, true);
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['Onbezoldigd','Bezoldigd met bedrag opgave','Bezoldigd zonder bedrag opgave'];
    var sizes = calcPieSize(charts.positionsIncome.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
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
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelpositionsIncomesDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelpositionsIncomesDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 4 - Travel
  var createTravelChart = function() {
    var chart = charts.travel.chart;
    var dimension = ndx2.dimension(function (d) {
        return d.Van.split('-')[0];
    });
    var group = dimension.group().reduceSum(function (d) {
        if(d.BetaaldDoor.includes('Tweede Kamer')){
          return 1;
        }
        return 0;
    });
    var group2 = dimension.group().reduceSum(function (d) {
      if(d.BetaaldDoor.includes('Tweede Kamer')){
        return 0;
      }
      return 1;
    });
    var width = recalcWidth(charts.travel.divId);
    chart
      .width(width)
      .height(440)
      .group(group)
      .stack(group2)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 20})
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .gap(5)
      .elasticY(true)
      .ordinalColors(vuedata.colors.generic);
    chart.render();
    //Custom filtering function to apply filter across the 2 different crossfiltered datasets
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelYearsDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelYearsDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 5 - Gifts
  var createGiftsChart = function() {
    var chart = charts.gifts.chart;
    var dimension = ndx.dimension(function (d) {
        var gifts = d.PersoonGeschenk.length;
        if(gifts > 10) {
          gifts = '> 10';
        }
        return gifts.toString();
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.gifts.divId);
    chart
      .width(width)
      .height(440)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 20})
      .x(d3.scaleBand().domain(["0","1","2","3","4","5","6","7","8","9","10","> 10"]))
      .xUnits(dc.units.ordinal)
      .gap(5)
      .elasticY(true)
      .ordinalColors(vuedata.colors.generic);
    chart.render();
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelGiftsDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelGiftsDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 6 - Gifts value
  var createGiftsValueChart = function() {
    var chart = charts.giftsValue.chart;
    var dimension = ndx.dimension(function (d) {
      return d.giftsValues;
    }, true);
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var order = ['Giften met bekende waarde','Giften van onbekende waarde'];
    var sizes = calcPieSize(charts.giftsValue.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
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
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelGiftsValuesDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelGiftsValuesDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 7 - Gender
  var createGenderChart = function() {
    var chart = charts.gender.chart;
    var dimension = ndx.dimension(function (d) {
      return d.Geslacht;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.gender.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
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
      .group(group);

    chart.render();
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelGenderDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelGenderDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }

  //CHART 8 - Age
  var createAgeChart = function() {
    var chart = charts.age.chart;
    var dimension = ndx.dimension(function (d) {
        return d.ageRange;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.age.divId);
    chart
      .width(width)
      .height(440)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 20})
      .x(d3.scaleBand().domain(["20-29", "30-39", "40-49", "50-59", "60-69", "70-79"]))
      .xUnits(dc.units.ordinal)
      .gap(10)
      .ordinalColors(vuedata.colors.generic)
      .elasticY(true);
    chart.render();
    chart.on('filtered', function(c) { 
      if(c.filters().length) {
        travelAgeDimension.filterFunction(function(k) { 
          return c.filters().indexOf(k) !== -1; 
        }); 
      } else {
        travelAgeDimension.filter(null);
      }
      dc.redrawAll() 
    });
  }
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
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
            return d.Achternaam + ' ' + d.Voornamen;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.partyName;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.PersoonNevenfunctie.length;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.activePositions;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.PersoonGeschenk.length;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.PersoonReis.length;
          }
        } 
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "desc" ]],
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

  //Travel type filter buttons
  $('.travel-filter-btn').click(function(){
    var filterType = 'all';
    if($(this).hasClass('thirdparty')){
      filterType = '3rd';
    } else if($(this).hasClass('nonthirdparty')){
      filterType = 'non3rd';
    }
    vuedata.travelFilter = filterType;
    travelTypesDimension.filter(function(d) { 
      var stringDim = d;
      if(d && d.length > 1){
        stringDim = d.toString();
      }
      if(filterType == '3rd'){
        return stringDim.indexOf('Tweede Kamer') == -1;
      } else if(filterType == 'non3rd'){
        return stringDim.indexOf('Tweede Kamer') !== -1;
      } else {
        return true;
      }
    });
    travelTypesDimension2.filter(function(d) { 
      if(filterType == '3rd'){
        return d.indexOf('Tweede Kamer') == -1;
      } else if(filterType == 'non3rd'){
        return d.indexOf('Tweede Kamer') !== -1;
      } else {
        return true;
      }
    });
    dc.redrawAll();
  })

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
    travelSearchDimension.filter(function(d) { 
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
    travelSearchDimension.filter(null);
    travelTypesDimension.filter(null);
    travelTypesDimension2.filter(null);
    vuedata.travelFilter = 'all';
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
  createTravelChart();
  createGiftsChart();
  createGiftsValueChart();
  createGenderChart();
  createAgeChart();
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
      if (!d.Id) {
        return "";
      } else {
        return d.Id;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.Id) {
          return p;
        }
        p.actnum = +d.PersoonNevenfunctie.length;
        p.giftsnum += +d.PersoonGeschenk.length;
        p.travelnum += +d.PersoonReis.length;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.Id) {
          return p;
        }
        p.actnum = +d.PersoonNevenfunctie.length;
        p.giftsnum -= +d.PersoonGeschenk.length;
        p.travelnum -= +d.PersoonReis.length;
        return p;
      },
      function(p,d) {  
        return {nb: 0, actnum:0, giftsnum: 0, travelnum: 0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var actnum = 0;
    var giftsnum = 0;
    var travelnum = 0;
    var counter = dc.dataCount(".count-box-activities")
    .dimension(group)
    .group({value: function() {
      giftsnum = 0;
      travelnum = 0;
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
          actnum += +kv.value.actnum;
          giftsnum += +kv.value.giftsnum;
          travelnum += +kv.value.travelnum;
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
      $(".nbactivities").text(actnum);
      $(".nbgifts").text(giftsnum);
      $(".nbtravels").text(travelnum);
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
