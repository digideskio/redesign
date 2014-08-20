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
  
    var sextant = this.modules.sextant;
    var whirligig = this.els.nav.data('whirligig');
    var doubtfire = this;
    
    if ( sextant && whirligig ) {
     
      console.log('DOUBTFIRE: Initialize Sextant + Whirligig interactions');

      // This is the important one:
      // When the carousel changes, match the preset slide distance to the .active panel
      this.els.nav.on('slideStart', function(e) {
        doubtfire.setSextantHandSlideDistance( e.relatedTarget );
        
        // If sextant is open, do the appropriate shift
        sextant.isOpen() && sextant._doAnimations();
      });
      
    }
  
  },
  
  setSextantHandSlideDistance: function(activePanel) {
    
    var 
      whirligig = this.els.nav.data('whirligig'),
      sextant = this.modules.sextant;

    activePanel = activePanel ? $(activePanel) : whirligig.panels.filter('.' + whirligig.classes.active);
    
    var height = whirligig.controls_area.outerHeight() + activePanel.outerHeight();
    
    // set how far to move in the future directly
    sextant.moves.main.props.translateY = height; 
    
  }
});

$(document).ready(function(){ Doubtfire.init(); });


})(jQuery, this, this.document);