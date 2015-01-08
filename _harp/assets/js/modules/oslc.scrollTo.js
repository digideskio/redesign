;(function ($, window, document, undefined) {
'use strict';

// I can't provide a good, smooth experience without pushState. So bail if not supported.
if (! history.pushState) { return; }

var 
  validCallouts = _( $.Velocity.Redirects )
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
  },
  updateStatePosition = function(){
    var state = {
      position: {
        x: window.scrollX,
        y: window.scrollY
      }
    };
    
    history.replaceState( state, '' );
  },
  $html = $('html');
    
$(document).on('click.oslc.scrollTo', '[data-scroll-to]', function(e) {

  if ( ! this.hash ) { return; }
  
  e.preventDefault();
  
  var 
    data = $(this).data(),
    target = $(this.hash),
    currentScroll = $(window).scrollTop();
    
  // could be a name=""
  target = target.length ? target : $('[name="'+this.hash.slice(1)+'"]');
  
  if ( ! target.is(':visible')) {
    // do something?
  }
  
  // iOS Safari has a bug where if you tap the status bar, window.scrollTo (and, accordingly, $.Velocity('scroll') ) just fails
  // See https://github.com/julianshapiro/velocity/issues/282
  // and http://blog.b123400.net/window-scrollto-and-ios-status-bar/
  // and now https://gist.github.com/leereamsnyder/33504ae18b58d25646b6
  // This IS in an onClick event, so we can just fire a worthless scrollTo here
  // even if it's (0,0) that seems to snap iOS out of its funk
  //
  // UPDATE this is fixed in iOS 8+
  if ( currentScroll === 0 && /iPhone|iPad|iPod/.test(navigator.userAgent) ) {
    window.scrollBy(0,0);
  }
  
  // UPDATE HASH?
  // The trick is to do it BEFORE you move anything
  // That way when the history is updated it stores where you *were*
  // - http://stackoverflow.com/questions/17090143/jquery-animate-for-hash-anchor-causes-back-button-bug
  // - https://github.com/cferdinandi/smooth-scroll/issues/26  
  
  // addresses the possibility that we haven't scrolled at all
  // and have a null history.state
  updateStatePosition(); 
  
  // only add a new thing to the history stack if the new hash is different
  // (mimics browser behavior, even if I don't love it)
  location.hash !== this.hash && history.pushState( {}, '', this.hash );  
      
  $html.velocity('stop').velocity('scroll', { 
    begin: function() {
      $(window).one('touchstart.scrollToTemp mousewheel.scrollToTemp', function(){
        $html.velocity('stop');
      });
    },
    offset: target.offset().top,
    duration: normalizeDurationByDistance( currentScroll - target.offset().top ),
    easing: [0.4,0,0.2,1],
    complete: function() {
      
      $(window).off('.scrollToTemp');

      _.contains(validCallouts, data.scrollTo) && target.velocity( 'callout.'+data.scrollTo, 800 );

    }
  });
  
});

$(window).on('popstate', function(){
  if (history.state && history.state.position) {
    window.scrollTo(history.state.position.x, history.state.position.y);
  } 
});

$(window).on('scroll', _.debounce(updateStatePosition, 500));

}(jQuery, this, this.document));