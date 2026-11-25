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

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';
import '/scss/about.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


Vue.component('chart-header', ChartHeader);

var vuedata = {
  page: 'about',
  supportModalShown: 0
};

var vueApp = new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    getUrlParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=')
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1]
        }
      }
    },
  },
  mounted () {
    if(this.getUrlParameter('section') == 4 ){
      $('#collapse4').addClass('show');
    }
  }
});

//Show donation modal if not already shown   
  if(vueApp.getUrlParameter('s') && vueApp.getUrlParameter('s') == 1) {
    vuedata.supportModalShown = 1;
  }  
  if(vuedata.supportModalShown == 0) {
    $('#donationModal').modal();
    vuedata.supportModalShown = 1;
    var url = new URL(window.location.href);
    url.searchParams.set("s", vuedata.supportModalShown);
    window.history.pushState(null, "", url.toString());
  }
  $("#donateBtn").on( "click", function() {
    $('#donationModal').modal();
  });