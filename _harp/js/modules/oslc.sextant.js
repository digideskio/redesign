// 
// OSLC Primary Navigation Scripts
// 

;(function ($, window, document, undefined) {
'use strict';
  
var Sextant = _.create( OSLC, {
  name: "Sextant",
  els: {
   nav: $('#nav'),
   main: $('#main'),
   toggle: $('#navToggle'),
   allToggled: $( '#nav,#main,#navToggle,.close-nav' ),
   close: $('.close-nav')
  },
  
  classes: {
    open: 'nav-is-open'
  },
  
  is_open: function(){
    return this.els.main.hasClass( this.classes.open );
  },
  
  init: function(){
    console.log('Initializing Sextant global navigation');
  
    // In markup order, #nav comes after #main 
    // This doesn't make much of a difference for most layouts
    // as #nav gets positioned absolutely
    // but for mobile (slide-down) it matters
    this.els.nav.insertBefore( this.els.main );
    
    this.set_main_slide_distance();
    
    this.bindings();
  },
  
  bindings: function(){
    
    var sextant = this;
    
    this.els.toggle
      .add( this.els.close )
      .on('click.oslc.sextant', function(e){
        e.preventDefault();
        sextant.toggle();
      });
    
    //
    // When the window is resized, check if we need to insert the is_open styles
    // 
    // see: http://blogorama.nerdworks.in/entry-JavaScriptfunctionthrottlingan.aspx
    // and: http://drupalmotion.com/article/debounce-and-throttle-visual-explanation
    // 
    // Ahem. I thought maybe this should be debounced, but in reality you
    // only need to run it once: when you're at hand size
    var fixOnce = _.once( function(){
      console.log('doing the one-time injection in case we started too large');
      sextant.set_main_slide_distance();
      $(window).trigger('lateStyleInjected.oslc.sextant');
    });

    // Only add the listener if we started too large
    ! Modernizr.mq( sextant.mediaQueries['hand-only'] ) && $(window).on( 'resize.oslc.sextant orientationchange.oslc.sextant', function(){
      Modernizr.mq(sextant.mediaQueries['hand-only']) && fixOnce();
    });
    
  },
  
  open: function() {
    this.toggle('open');
  },
  
  close: function() {
    this.toggle('close');
  },
  
  toggle: function( dir ) {
  
    dir = dir || ( this.is_open() ? 'close' : 'open' );
    var open = dir === 'open';

    console.log( dir );
    
    $(window).trigger(dir + '.oslc.sextant');
    
    this.els.allToggled[ open ? 'addClass' : 'removeClass' ]( this.classes.open );
      
  },
  
  set_main_slide_distance: function( explicit_height ){
      
    var handOnly = this.mediaQueries['hand-only'];
    
    if ( Modernizr.mq( handOnly ) ) {
      
      var mq = '@media ' + handOnly;
      var selector = {};
      selector[ mq ] = ['#main.' +  this.classes.open]; // stupid syntax tricks
      var height = explicit_height || this.els.nav.outerHeight() + 'px';
      var prop = Modernizr.csstransforms ? Modernizr.prefixed('transform') : 'top';
      prop = this.dasherize(prop);
      var property = {};
      property[ prop ] = Modernizr.csstransforms ? 'translate(0,'+ height +')' : height;
      
      // We use style injection instead of applying it directly to #nav
      // (1) You can inject the style with the appropriate media query
      // (2) You can inject it with the appropriate is_open class too
      // (3) Highly performant this way
      vein.inject( [selector], property );
      console.log( 'injecting distance of ' + height );
    }
  }
});

// Tack a reference to the global OSLC object
OSLC.modules.sextant = Sextant;

$(document).ready(function(){ Sextant.init(); });

}(jQuery, this, this.document));