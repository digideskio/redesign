;(function ($, window, document, undefined) {
'use strict';

var Doubtfire = _.create(OSLC, {
  name: "Doubtfire",

  init: function() {
    this.els = {};
      
    this.bindings();
  
  },
  
  bindings: function(){
  
  }
  
});

$(document).ready(function(){ Doubtfire.init(); });


})(jQuery, this, this.document);