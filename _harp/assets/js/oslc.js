/* Build process prefixes this with modernizr.js */

/* Catch console.log errors. You are welcome. */
if (! window.console) { window.console = {log: function () {}}; }

// Additional Flexbox detection for IE10/11 with 'tweener' flexbox implementations
// https://github.com/Modernizr/Modernizr/issues/812
Modernizr.addTest('flexboxtweener', Modernizr.testAllProps('flexAlign', 'end', true));

/* 
  add .mustard/.no-mustard css classes 
  http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
*/
Modernizr.addTest( 'mustard', 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window );

/*
  Load "enhanced" experience
  + Enhanced OSLC CSS
  + JS libraries: jQuery, lo-dash, animations, etc.
  + Enhanced OSLC scripts and modules
*/
Modernizr.load({
  test: Modernizr.mustard,
  yep: [
    window.site_url + 'assets/css/build/oslc_enhanced.min.css',
    window.site_url + 'assets/js/build/libraries.js',
    window.site_url + 'assets/js/build/oslc_enhanced.min.js'
  ],
  callback: function(url) {
    console.log(url + ' loaded');
  }
});