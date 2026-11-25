import jquery from "jquery";
window.jQuery = jquery;
window.$ = jquery;
require("datatables.net")(window, $);
require("datatables.net-dt")(window, $);

import underscore from "underscore";
window.underscore = underscore;
window._ = underscore;

import "../public/vendor/js/popper.min.js";
import "../public/vendor/js/bootstrap.min.js";
import { csv } from "d3-request";
import { json } from "d3-request";

import "../public/vendor/css/bootstrap.min.css";
import "../public/vendor/css/dc.css";
import "/scss/main.scss";

import Vue from "vue";
import Loader from "./components/Loader.vue";
import ChartHeader from "./components/ChartHeader.vue";

// Data object - is also used by Vue

var vuedata = {
  page: "tabA",
  loader: true,
  supportModalShown: 0,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  mandateIniDate: 20231206,
  mandateEndDate: 20251112,
  chartMargin: 40,
  travelFilter: "all",
  charts: {
    party: {
      title: "Tweede Kamerzetels per partij",
      info: "Aantal zetels zoals evenredig verdeeld naar aanleiding van de resultaten van de meest recente Tweede Kamerverkiezingen. Nederland kent in totaal 150 Tweede Kamerleden.<br />Zweef met je muis boven een staaf uit het diagram om de hoeveelheid eenheden (in dit geval zetels) weer te geven.<br />Klik op een partij om een filter aan te zetten. De resultaten op de rest van deze pagina geven dan enkel gegevens over de aangeklikte partij(en) weer. Klik op ‘reset filter’ om de selectie weer ongedaan te maken.",
    },
    positions: {
      title: "Nevenfuncties per kamerlid (2023)",
      info: "Hoeveelheid nevenfuncties van Tweede Kamerleden. Wanneer iemand een zetel bezet in de Tweede Kamer, betreft dat een fulltime positie. Toch zijn er Tweede Kamerleden die daarnaast nog andere rollen bekleden.<br />Er kan belangenverstrengeling optreden wanneer vertegenwoordigers moeten beslissen over een onderwerp dat één van hun nevenfuncties raakt. Zij vertegenwoordigen dan niet (volledig) de belangen van de burger, maar (ook) belangen van hun andere werkgever/ organisatie.<br />Ook als vertegenwoordigers geen nevenfuncties hebben opgegeven, kan het uiteindelijk resulteren in ‘draaideur’-gevallen. Dit treedt op wanneer een voormalig Kamerlid aan de slag gaat in de private sector, bijvoorbeeld als lobbyist. Gezien er in Nederland nauwelijks regulatie van de draaideur plaatsvindt, kan bijvoorbeeld bekendheid met de politieke agenda’s en vertegenwoordigers resulteren in een bevoorrechte invloed.",
    },
    positionsIncome: {
      title: "Nevenfuncties met inkomsten (2023)",
      info: "Indien er sprake is van een nevenfunctie, moeten Kamerleden opgeven of die functie ook een inkomen genereert. Omdat het gaat om beloningen die meer kunnen omvatten dan alleen loon, wordt er van bezoldiging gesproken.<br /> In het register zijn drie categorieën meegenomen: ‘met opgave’, ‘zonder opgave’ en ‘te verwachten inkomsten’. De laatste categorie valt in dit diagram onder ‘bezoldigd met bedrag opgave.’",
    },
    travel: {
      title: "Aantal reizen per jaar",
      info: "Onder ‘niet door derden betaald’ vallen reizen die zijn gefinancierd door de eigen partij of door de Tweede Kamer. Alle andere financiers worden gezien als derden.",
    },
    gifts: {
      title: "Aantal giften per partij",
      info: "In Nederland is het verplicht om giften te registeren, als de waarde meer dan vijftig euro betreft. Sommige partijen registreren meer giften dan andere partijen. Het is onduidelijk of dit komt omdat sommige partijen meer giften krijgen, of omdat zij deze netter registreren.",
    },
    giftsValue: {
      title: "Waarde van giften",
      info: "In Nederland is het in principe verplicht om op te geven hoeveel een gift waard is, als de waarde meer dan vijftig euro betreft. Sommige Kamerleden geven echter alle giften aan als ‘waarde onbekend’ of registreren ook de waarde van giften die zij krijgen van minder dan vijftig euro.",
    },
    gender: {
      title: "Geslacht",
      info: "",
    },
    age: {
      title: "Leeftijd",
      info: "",
    },
    mainTable: {
      chart: null,
      type: "table",
      title: "Tweede Kamerleden",
      info: "Klik op een Kamerlid om informatie op te halen over commissies, nevenfuncties, reizen, giften en loopbaan.",
    },
  },
  selectedElement: { P: "", Sub: "" },
  modalShowTable: "a",
  colors: {
    generic: ["#3B95D0", "#1C5075", "#DD3C31", "#FF834D"],
    parties: {
      VVD: "#F68F1E",
      PVV: "#153360",
      CDA: "#009C48",
      D66: "#3DB54A",
      GL: "#8CBE57",
      SP: "#EE2E22",
      PvdA: "#BB1018",
      CU: "#00AEEF",
      ChristenUnie: "#00AEEF",
      PvdD: "#006535",
      SGP: "#F36421",
      DENK: "#35BFC1",
      FVD: "#933939",
      "Fractie Den Haan": "#aaaaaa",
      "Van Haga": "#777777",
      BBB: "#A6CB45",
      BIJ1: "#FFFF00",
      Volt: "#582488",
      "Groep Van Haga": "#cccccc",
      //"JA21": "#999999",
      Omtzigt: "#34b4eb",
      Ephraim: "#333",
      Gündoğan: "#b5a2fa",
      Krol: "#9379f2",
      "GroenLinks-PvdA": "#BB1018",
      JA21: "#2f4b91",
      OPNL: "#d69f3a",
      "50PLUS": "#90268f",
      "Nieuw Sociaal Contract": "#F0C400",
      NSC: "#F0C400",
    },
    partiesPrevious: {
      VVD: "#f68f1e",
      PVV: "#153360",
      CDA: "#009c48",
      D66: "#3db54a",
      GL: "#8cbe57",
      SP: "#ee2e22",
      PvdA: "#bb1018",
      CU: "#00aeef",
      PvdD: "#006535",
      "50PLUS": "#90268f",
      SGP: "#f36421",
      DENK: "#35bfc1",
      FVD: "#933939",
      vKA: "#aaa",
      Onafhankelijk: "#c0c0c0",
      "Groep Krol/vKA": "#999",
      "Van Haga": "#777",
      Krol: "#9379f2",
    },
  },
};

//Set vue components and Vue app

Vue.component("chart-header", ChartHeader);
Vue.component("loader", Loader);

new Vue({
  el: "#app",
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if (platform == "twitter") {
        var thisPage = window.location.href.split("?")[0];
        var shareText =
          "Op Integrity Watch Nederland kun je snel  zien welke giften, reizen en nevenactiviteiten Kamerleden hebben! " +
          thisPage;
        var shareURL =
          "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(shareText);
        window.open(shareURL, "_blank");
        return;
      }
      if (platform == "facebook") {
        var toShareUrl = "https://integritywatch.nl";
        var shareURL =
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(toShareUrl);
        window.open(
          shareURL,
          "_blank",
          "toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300",
        );
        return;
      }
      if (platform == "linkedin") {
        var shareURL =
          "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fintegritywatch.nl&title=Integrity+Watch+Nederland&summary=Integrity+Watch+Nederland&source=integritywatch.nl";
        window.open(
          shareURL,
          "_blank",
          "toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes",
        );
      }
    },
    incomesList: function (el) {
      var income = el.PersoonNevenfunctieInkomsten;
      var incomeText = "";
      //If no income
      if (el.VergoedingSoort == "Onbezoldigd") {
        return "Niet van toepassing";
      }
      //If income
      if (el.VergoedingSoort == "Bezoldigd") {
        //If income object
        if (income.length > 0) {
          income.forEach(function (x) {
            //If amount is empty or null
            if (x.Bedrag == null) {
              incomeText += x.Jaar + ": " + x.Opmerking;
            } else {
              //If Soort is netto or bruto
              if (x.BedragSoort == "Netto" || x.BedragSoort == "Bruto") {
                incomeText += x.Jaar + ": " + x.Bedrag + " € " + x.BedragSoort;
                if (x.Frequentie) {
                  incomeText += " " + x.Frequentie;
                }
                if (x.Opmerking) {
                  incomeText += "<br />" + x.Opmerking + "";
                }
                incomeText += "<br />";
              } else if (x.BedragSoort == "Onbekend" || x.BedragSoort == null) {
                //If Soort is null or Onbekend
                incomeText += x.Jaar + ": " + x.Bedrag + " €";
                if (x.Frequentie) {
                  incomeText += " " + x.Frequentie;
                }
                incomeText += " (Onbekend)";
                if (x.Opmerking) {
                  incomeText += "<br />" + x.Opmerking + "";
                }
                incomeText += "<br />";
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
    getGiftValue: function (desc) {
      var pattern = /\€\d+(?:,\d+)*(?:\.\d+)?/;
      //var pattern = /(?<=\€)(\w*)*(\.)*(\w*)*/;
      var patternTotal = /\Totale waarde €\d+(?:,\d+)*(?:\.\d+)?/i;
      if (desc.includes("onbekend")) {
        return "onbekend";
      } else {
        var values = desc.match(pattern);
        var valueTotal = desc.match(patternTotal);
        if (valueTotal) {
          return valueTotal.toString();
        }
        if (values) {
          if (values.length > 1) {
            return values.join(", ");
          } else {
            return values.join(" ");
          }
        } else {
          return "";
        }
      }
    },
    getActiveCommissies: function (comm) {
      var activeCommissies = _.filter(comm, function (x, index) {
        return x.TotEnMet == null;
      });
      return activeCommissies;
    },
  },
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover();
});

//Charts
var charts = {
  party: {
    chart: dc.rowChart("#party_chart"),
    type: "row",
    divId: "party_chart",
  },
  positions: {
    chart: dc.pieChart("#positions_chart"),
    type: "pie",
    divId: "positions_chart",
  },
  positionsIncome: {
    chart: dc.pieChart("#positionsincome_chart"),
    type: "pie",
    divId: "positionsincome_chart",
  },
  travel: {
    chart: dc.barChart("#travel_chart"),
    type: "bar",
    divId: "travel_chart",
  },
  gifts: {
    chart: dc.barChart("#gifts_chart"),
    type: "bar",
    divId: "gifts_chart",
  },
  giftsValue: {
    chart: dc.pieChart("#giftsvalue_chart"),
    type: "pie",
    divId: "giftsvalue_chart",
  },
  mainTable: {
    chart: null,
    type: "table",
    divId: "dc-data-table",
  },
};

//Functions for responsivness
var recalcWidth = function (divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function () {
  //Replace element if with wordcloud column id
  var width =
    document.getElementById("party_chart").offsetWidth -
    vuedata.chartMargin * 2;
  return [width, 550];
};
var recalcCharsLength = function (width) {
  return parseInt(width / 8);
};
var calcPieSize = function (divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    width: newWidth,
    height: 0,
    radius: 0,
    innerRadius: 0,
    cy: 0,
    legendY: 0,
  };
  if (newWidth < 300) {
    sizes.height = newWidth + 170;
    sizes.radius = newWidth / 2;
    sizes.innerRadius = newWidth / 4;
    sizes.cy = newWidth / 2;
    sizes.legendY = newWidth + 30;
  } else {
    sizes.height = newWidth * 0.75 + 170;
    sizes.radius = (newWidth * 0.75) / 2;
    sizes.innerRadius = (newWidth * 0.75) / 4;
    sizes.cy = (newWidth * 0.75) / 2;
    sizes.legendY = newWidth * 0.75 + 30;
  }
  return sizes;
};
var resizeGraphs = function () {
  for (var c in charts) {
    if ((c == "gender" || c == "age") && vuedata.showAllCharts == false) {
    } else {
      var sizes = calcPieSize(charts[c].divId);
      var newWidth = recalcWidth(charts[c].divId);
      var charsLength = recalcCharsLength(newWidth);
      if (charts[c].type == "row") {
        charts[c].chart.width(newWidth);
        charts[c].chart.label(function (d) {
          var thisKey = d.key;
          if (thisKey.indexOf("###") > -1) {
            thisKey = thisKey.split("###")[0];
          }
          if (thisKey.length > charsLength) {
            return thisKey.substring(0, charsLength) + "...";
          }
          return thisKey;
        });
        charts[c].chart.redraw();
      } else if (charts[c].type == "bar") {
        charts[c].chart.width(newWidth);
        charts[c].chart.rescale();
        charts[c].chart.redraw();
      } else if (charts[c].type == "pie") {
        charts[c].chart
          .width(sizes.width)
          .height(sizes.height)
          .cy(sizes.cy)
          .innerRadius(sizes.innerRadius)
          .radius(sizes.radius)
          .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
        charts[c].chart.redraw();
      } else if (charts[c].type == "cloud") {
        charts[c].chart.size(recalcWidthWordcloud());
        charts[c].chart.redraw();
      }
    }
  }
};

//Add commas to thousands
function addcommas(x) {
  if (parseInt(x)) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}

//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if (date.indexOf("Cancelled") > -1) {
      date = date.split(" ")[0];
    }
    return dmy(date);
  },
  "date-eu-asc": function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  },
  "date-eu-desc": function (a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  },
});
//Calculate age and age range
var getAge = function (dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  var agerange = 0;
  if (age < 30) {
    agerange = "20-29";
  } else if (age < 40) {
    agerange = "30-39";
  } else if (age < 50) {
    agerange = "40-49";
  } else if (age < 60) {
    agerange = "50-59";
  } else if (age < 70) {
    agerange = "60-69";
  } else if (age < 80) {
    agerange = "70-79";
  } else if (age >= 80) {
    agerange = "80+";
  } else {
    agerange = "N/A";
    age = "N/A";
  }
  return [age, agerange];
};
//Lists sorting functions
var comparatorActivities = function (a, b) {
  var aDate = a.vanaf;
  var bDate = b.vanaf;
  if (aDate === "" || aDate === null || !aDate) return 1;
  if (bDate === "" || bDate === null || !bDate) return -1;
  var aSplit = aDate.split("-");
  if (aSplit.length == 3) {
    aDate = aSplit[2] + "-" + aSplit[1] + "-" + aSplit[0];
  }
  var bSplit = bDate.split("-");
  if (bSplit.length == 3) {
    bDate = bSplit[2] + "-" + bSplit[1] + "-" + bSplit[0];
  }
  if (aDate === b) return 0;
  return Date.parse(bDate) - Date.parse(aDate);
};
var comparatorVan = function (a, b) {
  var aDate = a.datum_vanaf;
  var bDate = b.datum_vanaf;
  if (aDate === "" || aDate === null) return 1;
  if (bDate === "" || bDate === null) return -1;
  var aSplit = aDate.split("-");
  if (aSplit.length == 3) {
    aDate = aSplit[2] + "-" + aSplit[1] + "-" + aSplit[0];
  }
  var bSplit = bDate.split("-");
  if (bSplit.length == 3) {
    bDate = bSplit[2] + "-" + bSplit[1] + "-" + bSplit[0];
  }
  if (aDate === b) return 0;
  return Date.parse(bDate) - Date.parse(aDate);
};
var comparatorGiften = function (a, b) {
  var aDate = a.datum;
  var bDate = b.datum;
  if (aDate === "" || aDate === null) return 1;
  if (bDate === "" || bDate === null) return -1;
  var aSplit = aDate.split("-");
  if (aSplit.length == 3) {
    aDate = aSplit[2] + "-" + aSplit[1] + "-" + aSplit[0];
  }
  var bSplit = bDate.split("-");
  if (bSplit.length == 3) {
    bDate = bSplit[2] + "-" + bSplit[1] + "-" + bSplit[0];
  }
  if (aDate === b) return 0;
  return Date.parse(bDate) - Date.parse(aDate);
};

//Totals for footer counters
var totalActivities = 0;
var totalGifts = 0;
var totalTravels = 0;

//Compare date for Gifts and Travels initial filtering
var compareDate = function (date) {
  if (!date) {
    return false;
  }
  var minDate = vuedata.mandateIniDate;
  var maxDate = vuedata.mandateEndDate;
  var dateSplit = date.split("T")[0].split("-");
  var dateToNum = dateSplit[2] + dateSplit[1] + dateSplit[0];
  if (parseInt(dateToNum) >= minDate && parseInt(dateToNum) <= maxDate) {
    return true;
  }
  return false;
};
var compareDateActivities = function (dateIni, dateEnd) {
  var minDate = vuedata.mandateIniDate;
  var maxDate = vuedata.mandateEndDate;
  if (!dateEnd || dateEnd == null || dateEnd == "" || dateEnd == "Heden") {
    return true;
  }
  var dateEndSplit = dateEnd.split("T")[0].split("-");
  var dateEndNum = dateEndSplit[2] + dateEndSplit[1] + dateEndSplit[0];
  if (parseInt(dateEndNum) >= minDate) {
    return true;
  }
  return false;
};

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Generate random parameter for dynamic dataset loading (to avoid caching)
var randomPar = "";
var randomCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for (var i = 0; i < 5; i++) {
  randomPar += randomCharacters.charAt(
    Math.floor(Math.random() * randomCharacters.length),
  );
}

var peopleDataset = "./data/tweedekamer_2023_2025/peopleList.csv?" + randomPar;
var activitiesDataset =
  "./data/tweedekamer_2023_2025/nevenactiviteiten.csv?" + randomPar;
var giftsDataset = "./data/tweedekamer_2023_2025/geschenken.csv?" + randomPar;
var travelDataset = "./data/tweedekamer_2023_2025/reizen.csv?" + randomPar;

//Load data and generate charts
csv(peopleDataset, (err, people) => {
  csv(activitiesDataset, (err, activities) => {
    csv(giftsDataset, (err, gifts) => {
      csv(travelDataset, (err, travel) => {
        var mepsArray = {};
        var meps = [];
        var mepsList = [];
        var travelData = [];
        //Filter out PersoonGeschenk, PersoonReis and PersoonNevenfunctie ended before mandate start
        gifts = _.filter(gifts, function (x) {
          return compareDate(x.datum);
        });
        travel = _.filter(travel, function (x) {
          return compareDate(x.datum_vanaf) || compareDate(x.datum_tm);
        });
        activities = _.filter(activities, function (x) {
          return compareDateActivities(x.vanaf, x["t/m"]);
        });

        _.each(people, function (d) {
          mepsList.push(d.name);
          mepsArray[d.name] = {
            name: d.name,
            party: d.party,
            activities: [],
            gifts: [],
            travels: [],
          };
        });
        _.each(activities, function (d) {
          if (!mepsArray[d.name]) {
            mepsList.push(d.name);
            mepsArray[d.name] = {
              name: d.name,
              party: d.party,
              activities: [],
              gifts: [],
              travels: [],
            };
          }
          var actEntry = {
            year: d.year,
            omschrijving: d.omschrijving,
            from: d.vanaf,
            to: d["t/m"],
            soort: d.soort,
            inkomsten: d.inkomsten,
          };
          mepsArray[d.name]["activities"].push(actEntry);
        });
        _.each(gifts, function (d) {
          if (mepsArray[d.name]) {
            var giftEntry = {
              geschenk: d.geschenk,
              datum: d.datum,
            };
            mepsArray[d.name]["gifts"].push(giftEntry);
          }
        });
        _.each(travel, function (d) {
          if (mepsArray[d.name]) {
            var travelEntry = {
              bestemming: d.bestemming,
              doel: d.doel,
              betaald_door: d.betaald_door,
              datum_vanaf: d.datum_vanaf,
              datum_tm: d.datum_tm,
              year: "",
            };
            if (d.datum_vanaf.split("-").length == 3) {
              var travelYear = d.datum_vanaf.split("-")[2];
              travelEntry.year = travelYear;
            }
            if (parseInt(travelEntry.year) >= 2017) {
              mepsArray[d.name]["travels"].push(travelEntry);
            }
          }
        });
        _.each(mepsList, function (m) {
          meps.push(mepsArray[m]);
        });

        _.each(meps, function (d) {
          d.fullName = d.name;
          if (d.party == "Nieuw Sociaal Contract") {
            d.party = "NSC";
          }
          d.activePositions = 0;
          d.activePositionsRange = "";
          d.activePositionsIncomes = [];
          d.activities.forEach(function (x) {
            if (x.year == 2023) {
              d.activePositions++;
              if (x.soort == "Onbezoldigd") {
                d.activePositionsIncomes.push("Onbezoldigd");
              } else if (
                x.soort == "Bezoldigd" &&
                x.inkomsten != null &&
                x.inkomsten != "Onbekend"
              ) {
                d.activePositionsIncomes.push("Bezoldigd met opgave bedrag");
              } else if (
                x.soort == "Bezoldigd" &&
                (x.inkomsten == null || x.inkomsten == "Onbekend")
              ) {
                d.activePositionsIncomes.push("Bezoldigd zonder bedrag opgave");
              } else {
                d.activePositionsIncomes.push("N/A");
              }
            }
          });
          if (d.activePositions >= 5) {
            d.activePositionsRange = "> 5";
          } else if (d.activePositions == 3 || d.activePositions == 4) {
            d.activePositionsRange = "3 - 4";
          } else if (d.activePositions == 1 || d.activePositions == 2) {
            d.activePositionsRange = "1 - 2";
          } else {
            d.activePositionsRange = "0";
          }
          //Define gift values types in an array
          d.giftsValues = [];
          d.gifts.forEach(function (x) {
            if (x.geschenk) {
              if (x.geschenk.includes("waarde is onbekend")) {
                d.giftsValues.push("Giften van onbekende waarde");
              } else {
                d.giftsValues.push("Giften met bekende waarde");
              }
            }
          });
          //Travel
          d.travelYears = [];
          d.travelTypes = [];
          //Add travel entries to travelData var to use for stacked bar chart
          d.travels.forEach(function (x) {
            d.travelYears.push(x.year);
            var tEntry = x;
            tEntry.name = d.name;
            tEntry.party = d.party;
            tEntry.activePositionsRange = d.activePositionsRange;
            tEntry.activePositionsIncomes = d.activePositionsIncomes;
            tEntry.gifts = d.gifts.length;
            tEntry.giftsValues = d.giftsValues;
            travelData.push(tEntry);
            d.travelTypes.push(x.betaald_door);
          });
          //Sort lists by date
          d.activities.sort(comparatorActivities);
          d.gifts.sort(comparatorGiften);
          d.travels.sort(comparatorVan);
          //Add activities, gifts and travels to total counts for footer
          totalActivities += d.activities.length;
          totalGifts += d.gifts.length;
          totalTravels += d.travels.length;
        });

        //Set totals for footer counters
        $(".count-box-activities .total-count-act").text(totalActivities);
        $(".count-box-gifts .total-count").text(totalGifts);
        $(".count-box-travels .total-count").text(totalTravels);

        //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
        var ndx = crossfilter(meps);
        var ndx2 = crossfilter(travelData);
        var searchDimension = ndx.dimension(function (d) {
          var entryString = d.name + " " + d.party;
          return entryString.toLowerCase();
        });

        //Dimensions used for custom filtering between the two crossfilters and travel type filters buttons
        var travelYearsDimension = ndx.dimension(function (d) {
          return d.travelYears;
        }, true);
        var travelTypesDimension = ndx.dimension(function (d) {
          return d.travelTypes;
        }, true);
        var travelTypesDimension2 = ndx2.dimension(function (d) {
          return d.betaald_door;
        });
        var travelSearchDimension = ndx2.dimension(function (d) {
          var entryString = d.name + " " + d.party;
          return entryString.toLowerCase();
        });
        var travelPartyDimension = ndx2.dimension(function (d) {
          return d.party;
        });
        var travelpositionsRangeDimension = ndx2.dimension(function (d) {
          return d.activePositionsRange;
        });
        var travelpositionsIncomesDimension = ndx2.dimension(function (d) {
          return d.activePositionsIncomes;
        }, true);
        var travelGiftsDimension = ndx2.dimension(function (d) {
          return d.party;
        });
        var travelGiftsValuesDimension = ndx2.dimension(function (d) {
          return d.giftsValues;
        }, true);

        //CHART 1
        var createPartyChart = function () {
          var chart = charts.party.chart;
          var dimension = ndx.dimension(function (d) {
            if (d.party == "FvD") {
              return "FVD";
            }
            return d.party;
          });
          var group = dimension.group().reduceSum(function (d) {
            return 1;
          });
          var filteredGroup = (function (source_group) {
            return {
              all: function () {
                return source_group.top(100).filter(function (d) {
                  return d.value != 0;
                });
              },
            };
          })(group);
          var width = recalcWidth(charts.party.divId);
          var charsLength = recalcCharsLength(width);
          chart
            .width(width)
            .height(490)
            .margins({ top: 0, left: 0, right: 0, bottom: 20 })
            .group(filteredGroup)
            .dimension(dimension)
            .colorCalculator(function (d, i) {
              return vuedata.colors.parties[d.key];
            })
            .label(function (d) {
              if (d.key.length > charsLength) {
                return d.key.substring(0, charsLength) + "...";
              }
              return d.key;
            })
            .title(function (d) {
              return d.value;
            })
            .elasticX(true)
            .xAxis()
            .ticks(4);
          chart.render();
          chart.on("filtered", function (c) {
            if (c.filters().length) {
              travelPartyDimension.filterFunction(function (k) {
                return c.filters().indexOf(k) !== -1;
              });
            } else {
              travelPartyDimension.filter(null);
            }
            dc.redrawAll();
          });
        };

        //CHART 2 - Positions
        var createPositionsChart = function () {
          var chart = charts.positions.chart;
          var dimension = ndx.dimension(function (d) {
            return d.activePositionsRange;
          });
          var group = dimension.group().reduceSum(function (d) {
            return 1;
          });
          var order = ["0", "1 - 2", "3 - 4", "> 5"];
          var sizes = calcPieSize(charts.positions.divId);
          chart
            .width(sizes.width)
            .height(sizes.height)
            .cy(sizes.cy)
            .ordering(function (d) {
              return order.indexOf(d);
            })
            .innerRadius(sizes.innerRadius)
            .radius(sizes.radius)
            .legend(
              dc
                .legend()
                .x(0)
                .y(sizes.legendY)
                .gap(10)
                .autoItemWidth(true)
                .horizontal(false)
                .legendWidth(sizes.width)
                .legendText(function (d) {
                  var thisKey = d.name;
                  if (thisKey.length > 40) {
                    return thisKey.substring(0, 40) + "...";
                  }
                  return thisKey;
                }),
            )
            .title(function (d) {
              return d.key + ": " + d.value;
            })
            .dimension(dimension)
            .ordinalColors(vuedata.colors.generic)
            .group(group);
          chart.render();
          chart.on("filtered", function (c) {
            if (c.filters().length) {
              travelpositionsRangeDimension.filterFunction(function (k) {
                return c.filters().indexOf(k) !== -1;
              });
            } else {
              travelpositionsRangeDimension.filter(null);
            }
            dc.redrawAll();
          });
        };

        //CHART 3 - Positions Income
        var createPositionsIncomeChart = function () {
          var chart = charts.positionsIncome.chart;
          var dimension = ndx.dimension(function (d) {
            return d.activePositionsIncomes;
          }, true);
          var group = dimension.group().reduceSum(function (d) {
            return 1;
          });
          var order = [
            "Onbezoldigd",
            "Bezoldigd met opgave bedrag",
            "Bezoldigd zonder bedrag opgave",
          ];
          var sizes = calcPieSize(charts.positionsIncome.divId);
          chart
            .width(sizes.width)
            .height(sizes.height)
            .cy(sizes.cy)
            .ordering(function (d) {
              return order.indexOf(d);
            })
            .innerRadius(sizes.innerRadius)
            .radius(sizes.radius)
            .legend(
              dc
                .legend()
                .x(0)
                .y(sizes.legendY)
                .gap(10)
                .autoItemWidth(true)
                .horizontal(false)
                .legendWidth(sizes.width)
                .legendText(function (d) {
                  var thisKey = d.name;
                  if (thisKey.length > 40) {
                    return thisKey.substring(0, 40) + "...";
                  }
                  return thisKey;
                }),
            )
            .title(function (d) {
              return d.key + ": " + d.value;
            })
            .dimension(dimension)
            .ordinalColors(vuedata.colors.generic)
            .group(group);

          chart.render();
          chart.on("filtered", function (c) {
            if (c.filters().length) {
              travelpositionsIncomesDimension.filterFunction(function (k) {
                return c.filters().indexOf(k) !== -1;
              });
            } else {
              travelpositionsIncomesDimension.filter(null);
            }
            dc.redrawAll();
          });
        };

        //CHART 4 - Travel
        var createTravelChart = function () {
          var chart = charts.travel.chart;
          var dimension = ndx2.dimension(function (d) {
            return d.year;
          });
          var group = dimension.group().reduceSum(function (d) {
            if (d.betaald_door.includes("Tweede Kamer")) {
              return 1;
            }
            return 0;
          });
          var group2 = dimension.group().reduceSum(function (d) {
            if (d.betaald_door.includes("Tweede Kamer")) {
              return 0;
            }
            return 1;
          });
          var width = recalcWidth(charts.travel.divId);
          chart
            .width(width)
            .height(400)
            .group(group)
            .stack(group2)
            .dimension(dimension)
            .on("preRender", function (chart, filter) {})
            .margins({ top: 0, right: 10, bottom: 20, left: 20 })
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .gap(5)
            .elasticY(true)
            .ordinalColors(vuedata.colors.generic);
          chart.render();
          //Custom filtering function to apply filter across the 2 different crossfiltered datasets
          chart.on("filtered", function (c) {
            if (c.filters().length) {
              travelYearsDimension.filterFunction(function (k) {
                return c.filters().indexOf(k) !== -1;
              });
            } else {
              travelYearsDimension.filter(null);
            }
            dc.redrawAll();
          });
        };

        //CHART 5 - Gifts
        var createGiftsChart = function () {
          var chart = charts.gifts.chart;
          var dimension = ndx.dimension(function (d) {
            return d.party;
          });
          var group = dimension.group().reduceSum(function (d) {
            return d.gifts.length;
          });
          var filteredGroup = (function (source_group) {
            return {
              all: function () {
                return source_group.top(Infinity).filter(function (d) {
                  return d.value > 0;
                });
              },
            };
          })(group);
          var width = recalcWidth(charts.gifts.divId);
          chart
            .width(width)
            .height(460)
            .group(filteredGroup)
            .dimension(dimension)
            .on("preRender", function (chart, filter) {})
            .margins({ top: 0, right: 10, bottom: 20, left: 20 })
            //.x(d3.scaleBand().domain(["0","1","2","3","4","5","6","7","8","9","10","> 10"]))
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .gap(5)
            .elasticY(true)
            .ordering(function (d) {
              return -d.value;
            })
            .colorCalculator(function (d, i) {
              return vuedata.colors.parties[d.key];
            });
          //.ordinalColors(vuedata.colors.generic);
          chart.render();
          chart.on("filtered", function (c) {
            if (c.filters().length) {
              travelGiftsDimension.filterFunction(function (k) {
                return c.filters().indexOf(k) !== -1;
              });
            } else {
              travelGiftsDimension.filter(null);
            }
            dc.redrawAll();
          });
        };

        //CHART 6 - Gifts value
        var createGiftsValueChart = function () {
          var chart = charts.giftsValue.chart;
          var dimension = ndx.dimension(function (d) {
            return d.giftsValues;
          }, true);
          var group = dimension.group().reduceSum(function (d) {
            return 1;
          });
          var order = [
            "Giften met bekende waarde",
            "Giften van onbekende waarde",
          ];
          var sizes = calcPieSize(charts.giftsValue.divId);
          chart
            .width(sizes.width)
            .height(sizes.height)
            .cy(sizes.cy)
            .ordering(function (d) {
              return order.indexOf(d);
            })
            .innerRadius(sizes.innerRadius)
            .radius(sizes.radius)
            .legend(
              dc
                .legend()
                .x(0)
                .y(sizes.legendY)
                .gap(10)
                .autoItemWidth(true)
                .horizontal(false)
                .legendWidth(sizes.width)
                .legendText(function (d) {
                  var thisKey = d.name;
                  if (thisKey.length > 40) {
                    return thisKey.substring(0, 40) + "...";
                  }
                  return thisKey;
                }),
            )
            .title(function (d) {
              return d.key + ": " + d.value;
            })
            .dimension(dimension)
            .ordinalColors(vuedata.colors.generic)
            .group(group);

          chart.render();
          chart.on("filtered", function (c) {
            if (c.filters().length) {
              travelGiftsValuesDimension.filterFunction(function (k) {
                return c.filters().indexOf(k) !== -1;
              });
            } else {
              travelGiftsValuesDimension.filter(null);
            }
            dc.redrawAll();
          });
        };

        //TABLE
        var createTable = function () {
          var count = 0;
          charts.mainTable.chart = $("#dc-data-table").dataTable({
            language: {
              emptyTable:
                "Geen zoek resultaten in the Tweede Kamer. Klik <a href='eerste-kamerleden.php'>hier</a> om naar de Eerste kamer te gaan.",
            },
            columnDefs: [
              {
                searchable: false,
                orderable: false,
                targets: 0,
                data: function (row, type, val, meta) {
                  return count;
                },
              },
              {
                searchable: false,
                orderable: true,
                targets: 1,
                defaultContent: "N/A",
                data: function (d) {
                  return d.fullName;
                },
              },
              {
                searchable: false,
                orderable: true,
                targets: 2,
                defaultContent: "N/A",
                data: function (d) {
                  return d.party;
                },
              },
              {
                searchable: false,
                orderable: true,
                targets: 3,
                defaultContent: "N/A",
                data: function (d) {
                  return d.activePositions;
                },
              },
              {
                searchable: false,
                orderable: true,
                targets: 4,
                defaultContent: "N/A",
                data: function (d) {
                  return d.gifts.length;
                },
              },
              {
                searchable: false,
                orderable: true,
                targets: 5,
                defaultContent: "N/A",
                data: function (d) {
                  return d.travels.length;
                },
              },
            ],
            iDisplayLength: 25,
            bPaginate: true,
            bLengthChange: true,
            bFilter: false,
            order: [[1, "asc"]],
            bSort: true,
            bInfo: true,
            bAutoWidth: false,
            bDeferRender: true,
            aaData: searchDimension.top(Infinity),
            bDestroy: true,
          });
          var datatable = charts.mainTable.chart;
          datatable.on("draw.dt", function () {
            var PageInfo = $("#dc-data-table").DataTable().page.info();
            datatable
              .DataTable()
              .column(0, { page: "current" })
              .nodes()
              .each(function (cell, i) {
                cell.innerHTML = i + 1 + PageInfo.start;
              });
          });
          datatable.DataTable().draw();

          $("#dc-data-table tbody").on("click", "tr", function () {
            var data = datatable.DataTable().row(this).data();
            vuedata.selectedElement = data;
            vuedata.modalShowTable = "a";
            $("#detailsModal").modal();
          });
        };
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
        $(".travel-filter-btn").click(function () {
          var filterType = "all";
          if ($(this).hasClass("thirdparty")) {
            filterType = "3rd";
          } else if ($(this).hasClass("nonthirdparty")) {
            filterType = "non3rd";
          }
          vuedata.travelFilter = filterType;
          travelTypesDimension.filter(function (d) {
            var stringDim = d;
            if (d && d.length > 1) {
              stringDim = d.toString();
            }
            if (filterType == "3rd") {
              return stringDim.indexOf("Tweede Kamer") == -1;
            } else if (filterType == "non3rd") {
              return stringDim.indexOf("Tweede Kamer") !== -1;
            } else {
              return true;
            }
          });
          travelTypesDimension2.filter(function (d) {
            if (filterType == "3rd") {
              return d.indexOf("Tweede Kamer") == -1;
            } else if (filterType == "non3rd") {
              return d.indexOf("Tweede Kamer") !== -1;
            } else {
              return true;
            }
          });
          dc.redrawAll();
        });

        //SEARCH INPUT FUNCTIONALITY
        var typingTimer;
        var doneTypingInterval = 1000;
        var $input = $("#search-input");
        $input.on("keyup", function () {
          clearTimeout(typingTimer);
          typingTimer = setTimeout(doneTyping, doneTypingInterval);
        });
        $input.on("keydown", function () {
          clearTimeout(typingTimer);
        });
        function doneTyping() {
          var s = $input.val().toLowerCase();
          searchDimension.filter(function (d) {
            return d.indexOf(s) !== -1;
          });
          travelSearchDimension.filter(function (d) {
            return d.indexOf(s) !== -1;
          });
          throttle();
          var throttleTimer;
          function throttle() {
            window.clearTimeout(throttleTimer);
            throttleTimer = window.setTimeout(function () {
              dc.redrawAll();
            }, 250);
          }
        }

        //Reset charts
        var resetGraphs = function () {
          for (var c in charts) {
            if (charts[c].type !== "table" && charts[c].chart.hasFilter()) {
              charts[c].chart.filterAll();
            }
          }
          searchDimension.filter(null);
          travelSearchDimension.filter(null);
          travelTypesDimension.filter(null);
          travelTypesDimension2.filter(null);
          vuedata.travelFilter = "all";
          $("#search-input").val("");
          dc.redrawAll();
        };
        $(".reset-btn").click(function () {
          resetGraphs();
        });

        //Render charts
        createPartyChart();
        createPositionsChart();
        createPositionsIncomeChart();
        createTravelChart();
        createGiftsChart();
        createGiftsValueChart();
        createTable();

        $(".dataTables_wrapper").append($(".dataTables_length"));

        //Toggle last charts functionality and fix for responsiveness
        vuedata.showAllCharts = false;
        $("#charts-toggle-btn").click(function () {
          if (vuedata.showAllCharts) {
            resizeGraphs();
          }
        });

        //Hide loader
        vuedata.loader = false;

        //COUNTERS
        //Main counter
        var all = ndx.groupAll();
        var counter = dc.dataCount(".dc-data-count").dimension(ndx).group(all);
        counter.render();
        //Update datatables
        counter.on("renderlet.resetall", function (c) {
          RefreshTable();
        });

        //Custom counters
        function drawActivitiesCounter() {
          var dim = ndx.dimension(function (d) {
            if (!d.name) {
              return "";
            } else {
              return d.name;
            }
          });
          var group = dim.group().reduce(
            function (p, d) {
              p.nb += 1;
              if (!d.name) {
                return p;
              }
              p.actnum = +d.activities.length;
              p.giftsnum += +d.gifts.length;
              p.travelnum += +d.travels.length;
              return p;
            },
            function (p, d) {
              p.nb -= 1;
              if (!d.name) {
                return p;
              }
              p.actnum = +d.activities.length;
              p.giftsnum -= +d.gifts.length;
              p.travelnum -= +d.travels.length;
              return p;
            },
            function (p, d) {
              return { nb: 0, actnum: 0, giftsnum: 0, travelnum: 0 };
            },
          );
          group.order(function (p) {
            return p.nb;
          });
          var actnum = 0;
          var giftsnum = 0;
          var travelnum = 0;
          var counter = dc
            .dataCount(".count-box-activities")
            .dimension(group)
            .group({
              value: function () {
                giftsnum = 0;
                travelnum = 0;
                return group.all().filter(function (kv) {
                  if (kv.value.nb > 0) {
                    actnum += +kv.value.actnum;
                    giftsnum += +kv.value.giftsnum;
                    travelnum += +kv.value.travelnum;
                  }
                  return kv.value.nb > 0;
                }).length;
              },
            })
            .renderlet(function (chart) {
              $(".nbactivities").text(actnum);
              $(".nbgifts").text(giftsnum);
              $(".nbtravels").text(travelnum);
              actnum = 0;
            });
          counter.render();
        }
        drawActivitiesCounter();

        //Window resize function
        window.onresize = function (event) {
          resizeGraphs();
        };

        //Show donation modal if not already shown
        if (getParameterByName("s") && getParameterByName("s") == 1) {
          vuedata.supportModalShown = 1;
        }
        if (vuedata.supportModalShown == 0) {
          $("#donationModal").modal();
          vuedata.supportModalShown = 1;
          var url = new URL(window.location.href);
          url.searchParams.set("s", vuedata.supportModalShown);
          window.history.pushState(null, "", url.toString());
        }
        $("#donateBtn").on("click", function () {
          $("#donationModal").modal();
        });
      });
    });
  });
});
