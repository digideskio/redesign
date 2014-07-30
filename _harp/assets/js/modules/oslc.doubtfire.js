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
      // When the carousel changes, match the slide distance to the .active panel
      this.els.nav.on('slideStart', function(e) {
        doubtfire.set_main_slide_distance( e.relatedTarget );
      });
      
      // This covers all the possibilities for trouble:
      // 1: Started small, but need to resize to the .active panel height when opened the first time
      // 2: Started large, [maybe opened it already!], went small
      var fixOnce = _.once(function(){
        console.log('fired the resize fixes. shouldnt see this again!');
        
        // sextant.move_indicator() didn't know where to go
        // because the controls are not visible
        // so trigger it now
        whirligig.move_indicator();
      
        // and recalculate the slide distance
        // based on the current .active panel
        doubtfire.set_main_slide_distance();
      });
      
      $(window).on('open.oslc.sextant lateStyleInjected.oslc.sextant orientationchange.oslc.sextant', function(){
        Modernizr.mq(OSLC.mediaQueries['hand-only']) && fixOnce();
      });
           
    }
  
  },
  
  set_main_slide_distance: function( active_panel ){
    
    var whirligig = this.els.nav.data('whirligig');
    active_panel = active_panel ? $(active_panel) : whirligig.panels.filter('.active');
    
    var total_height = whirligig.controls_area.outerHeight() + active_panel.outerHeight() + 'px';
    
    // Borrow Sextant's method
    this.modules.sextant.set_main_slide_distance( total_height );
    
  }
});

$(document).ready(function(){ Doubtfire.init(); });


})(jQuery, this, this.document);