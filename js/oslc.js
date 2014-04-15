/* 
  Catch console.log errors. You are welcome. 
*/
if (! window.console) {
  window.console = {
    log: function () {}
  };
}

window.site_url = window.site_url || '/';

Modernizr.load({
  // Cut the mustard
  test: ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window),
  
  //
  // Load oslc_enhanced 
  //
  // Includes libraries:
  //  - jQuery ($)
  //  - lodash (_)
  //  - Vein CSS injection (vein)
  //
  yep: [
    window.site_url + 'js/libraries.js',
    window.site_url + 'js/build/oslc_enhanced.min.js'
  ],
  callback: function(url) {
    console.log(url + ' loaded');
  }
});