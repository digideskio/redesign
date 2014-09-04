;(function ($, window, document, undefined) {
'use strict';

var 
  validCallouts = _( $.Velocity.Sequences )
    .keys()
    .filter( function(val) { return _.startsWith(val,'callout'); } )
    .map( function(val) { return val.split('.').pop(); } )
    .value(),
  normalizeDurationByDistance = function(distance) {
    var duration = Math.abs( distance ) / 15;
    
    if (duration < 250) {
      return 250;
    } else if ( duration > 2700 ) {
      return 2700;
    }
    return duration;
  };
    
$(document).on('click.oslc.scrollTo', '[data-scroll-to]', function(e) {

  if ( ! this.hash ) { return; }
  
  e.preventDefault();
  
  var 
    data = $(this).data(),
    target = $(this.hash),
    currentScroll = $(window).scrollTop();
    
  // could be a name=""
  target = target.length ? target : $('[name="'+this.hash.slice(1)+'"]');
  
  // iOS Safari has a bug where if you tap the status bar, window.scrollTo (and, accordingly, $.Velocity('scroll') ) just fails
  // See https://github.com/julianshapiro/velocity/issues/282
  // and http://blog.b123400.net/window-scrollto-and-ios-status-bar/
  // This IS in an onClick event, so we can just fire a worthless scrollTo here
  // even if it's (0,0) that seems to snap iOS out of its funk
  if ( currentScroll === 0 && /iPhone|iPad|iPod/.test(navigator.userAgent) ) {
    window.scrollTo(0,0);
  }
  
  // UPDATE HASH?
  // The trick is to do it BEFORE you move anything
  // That way when the history is updated it stores where you *were*
  // - http://stackoverflow.com/questions/17090143/jquery-animate-for-hash-anchor-causes-back-button-bug
  // - https://github.com/cferdinandi/smooth-scroll/issues/26
  if (history.pushState) {
    history.pushState( {}, '', this.hash );  
  } else {
    location.hash = this.hash; // sets the #anchor and also stores your current window position in history
    window.scrollTo(0, currentScroll); // immediately pop back
  }
      
  $('html').velocity('stop').velocity('scroll', {
    offset: target.offset().top,
    duration: normalizeDurationByDistance( currentScroll - target.offset().top ),
    easing: [0.4,0,0.2,1],
    complete: function() {

      _.contains(validCallouts, data.scrollTo) && target.velocity( 'callout.'+data.scrollTo, 800 );

    }
  });
  
});


}(jQuery, this, this.document));