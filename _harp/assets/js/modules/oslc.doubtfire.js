;(function ($, window, document, undefined) {
'use strict';

var Doubtfire = _.create(OSLC, {
  name: "Doubtfire",

  els: {
    nav: $('#nav')
  },
  
  init: function(){
  
    console.log('Initialize Doubtfire nanny class');
    
    this.bindings();
  
  },
  
  bindings: function(){
  
  },
  
  setCheckovHandSlideDistance: function(activePanel) {
    
    console.log('setting slide distance to active panel');
    
    var 
      whirligig = this.els.nav.data('whirligig'),
      checkov = this.modules.checkov;

    activePanel = activePanel ? $(activePanel) : whirligig.panels.filter('.' + whirligig.classes.active);
    
    var height = whirligig.controls_area.outerHeight() + activePanel.outerHeight();
    
    // set how far to move in the future directly
    checkov.moves.main.props.translateY = height; 
    
  }
});

$(document).ready(function(){ Doubtfire.init(); });


})(jQuery, this, this.document);