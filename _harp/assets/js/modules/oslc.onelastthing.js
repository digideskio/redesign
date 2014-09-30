// Tiny module to load 'just one more thing' JS file
// Perfect for those one-offs that need another library that you don't want to load on every other page
// Software pages (which need D3) are a good example
// Define a meta tag with a URL 
// <meta name="oneLastScript" content="/assets/js/build/oslc.softwareDendogram.min.js">
// And that script will be loaded, and it will be loaded after all your main enhanced.js libraries (jQuery, Velocity, lodash, etc)

;(function (window, document, undefined) {
"use strict";

  var oneLastScript = enhance.getMeta('oneLastScript');

  if (oneLastScript) {
    enhance.loadJS( oneLastScript.content );
  }

}(this, this.document));