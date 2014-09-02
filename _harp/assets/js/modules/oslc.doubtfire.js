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
  
    var checkov = this.modules.checkov;
    var whirligig = this.els.nav.data('whirligig');
    var doubtfire = this;
    
    if ( checkov && whirligig ) {
     
      console.log('DOUBTFIRE: Initialize Checkov + Whirligig interactions');

      // This is the important one:
      // When the carousel changes, match the preset slide distance to the .active panel
      this.els.nav.on('slideStart', function(e) {
        doubtfire.setCheckovHandSlideDistance( e.relatedTarget );
        
        // If checkov is open, do the appropriate shift
        checkov.isOpen() && checkov._doAnimations();
      });
      
      enquire.register(this.mediaQueries['hand-only'], function(){
        doubtfire.setCheckovHandSlideDistance();
      });
    }
  
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