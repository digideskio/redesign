window.site_url = window.site_url || '/';


/**
 * Cut the mustard
 */
if( 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window ) {
  
  /* Catch console.log errors. You are welcome. */
  if (! window.console) {
    window.console = {
      log: function () {}
    };
  }
  
  var OSLC = {
    init: function() {
    
      $('#nav').insertBefore('#main');
      
      //
      // SUPER SIMPLE CLASS TOGGLER
      // 
      // On an element, add data-toggle-class="%class string%"
      // Set the target with a CSS selector data-toggle-target="%selector string%"
      // 
      
      $(document).on('click', '[data-toggle-class]', function(){
        
        var $el = $(this);
        var toggleClass = $el.attr('data-toggle-class');
        var toggleTarget = $el.attr('data-toggle-target');
        
        toggleTarget && $( toggleTarget ).toggleClass( toggleClass );
      });
    
    
      this.makeFluidVideos();
    
    },
    
    //
    // FLUID VIDEOS
    // 
    // Wraps youtube/vimeo iframes in a div.fluid-video class
    // 
    makeFluidVideos: function() {
      
      var fluidVidTemplate = _.template('<div class="fluid-video" <%= style %> ><%= video %></div>');

      $('iframe[src*="youtube"], iframe[src*="vimeo"]')
        .not('.no-resize')
        .each( function(i, vid) {
        
          // Replace the videos HTML with the new template
          vid.outerHTML = fluidVidTemplate( {
            style: 'style="padding-bottom: ' + ( vid.height / vid.width * 100 ) + '%;"',
            video: vid.outerHTML
          } );
        
        });
      
    }
  };
  
  //
  // Load libraries, and then run OSLC.init()
  // Libraries include:
  //  - jQuery ($)
  //  - lodash (_)
  //
  Modernizr.load({
    load: window.site_url + 'js/libraries.js',
    // must .bind to own object, as this will get called in the window context
    complete: function(){
      _.bind(OSLC.init, OSLC)();
    }
  });

}