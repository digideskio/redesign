// @codekit-prepend "./lib/modernizr.js";

/* Catch console.log errors. You are welcome. */
if (! window.console) { window.console = {log: function () {}}; }

/* 
  add .mustard/.no-mustard css classes 
  http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
*/
Modernizr.addTest( 'mustard', 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window );

/*! EnhanceJS: a progressive enhancement boilerplate. Copyright 2014 @scottjehl, Filament Group, Inc. Licensed MIT */
(function( window, undefined ) {

	// Enable JS strict mode
	"use strict";

	// expose the 'enhance' object globally. Use it to expose anything in here that's useful to other parts of your application.
	window.enhance = {};

	// Define some variables to be used throughout this file
	var doc = window.document,
		docElem = doc.documentElement,
		production = window.environment === 'production',
		baseCSSKey = 'basecss',
		// this references a meta tag's name whose content attribute should define the path to the enhanced CSS file for the site
		enhancedCSSKey = "enhancedcss",
		// this references a meta tag's name whose content attribute should define the path to the enhanced JS file for the site (delivered to qualified browsers)
		fullJSKey = "enhancedjs",
		// classes to be added to the HTML element in qualified browsers
		htmlClasses = [ "enhanced" ];

	// loadJS: load a JS file asynchronously. Included from https://github.com/filamentgroup/loadJS/
	function loadJS( src ){
		var ref = window.document.getElementsByTagName( "script" )[ 0 ];
		var script = window.document.createElement( "script" );
		script.src = src;
		ref.parentNode.insertBefore( script, ref );
		return script;
	}

	// expose it
	enhance.loadJS = loadJS;

	// loadCSS: load a CSS file asynchronously. Included from https://github.com/filamentgroup/loadCSS/
	function loadCSS( href, before, media ){
		var ss = window.document.createElement( "link" );
		var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
		ss.rel = "stylesheet";
		ss.href = href;
		// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = "only x";
		// inject link
		ref.parentNode.insertBefore( ss, ref );
		// set media back to `all` so that the styleshet applies once it loads
		setTimeout( function(){
			ss.media = media || "all";
		} );
		return ss;
	}

	// expose it
	enhance.loadCSS = loadCSS;

	// getMeta function: get a meta tag by name
	// NOTE: meta tag must be in the HTML source before this script is included in order to guarantee it'll be found
	function getMeta( metaname ){
		var metas = window.document.getElementsByTagName( "meta" );
		var meta;
		for( var i = 0; i < metas.length; i ++ ){
			if( metas[ i ].name && metas[ i ].name === metaname ){
				meta = metas[ i ];
				break;
			}
		}
		return meta;
	}

	// expose it
	enhance.getMeta = getMeta;

	// cookie function from https://github.com/filamentgroup/cookie/
	function cookie( name, value, days ){
		// if value is undefined, get the cookie value
		var expires;

		if( value === undefined ){
			var cookiestring = "; " + window.document.cookie;
			var cookies = cookiestring.split( "; " + name + "=" );
			if ( cookies.length === 2 ){
				return cookies.pop().split( ";" ).shift();
			}
			return null;
		}
		else {
			// if value is a false boolean, we'll treat that as a delete
			if( value === false ){
				days = -1;
			}
			if ( days ) {
				var date = new Date();
				date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
				expires = "; expires="+date.toGMTString();
			}
			else {
				expires = "";
			}
			window.document.cookie = name + "=" + value + expires + "; path=/";
		}
	}

	// expose it
	enhance.cookie = cookie;

	/* Enhancements for all browsers - qualified or not */

	/* Load non-critical CSS async on first visit:
		On first visit to the site, the critical CSS for each template should be inlined in the head, while the full CSS for the site should be requested async and cached for later use.
		A meta tag with a name matching the fullCSSKey should have a content attribute referencing the path to the full CSS file for the site.
		If no cookie is set to specify that the full CSS has already been fetched, load it asynchronously and set the cookie.
		Once the cookie is set, the full CSS is assumed to be in cache, and the server-side templates should reference the full CSS directly from the head of the page with a link element, in place of inline critical styles.
		*/
	var baseCSS = getMeta( baseCSSKey );
	if (baseCSS && production) { 
	  loadCSS( baseCSS.content ); 
	}
  // 	if( fullCSS && !cookie( fullCSSKey ) ){
  // 		loadCSS( fullCSS.content );
  // 		// set cookie to mark this file fetched
  // 		cookie( fullCSSKey, "true", 7 );
  // 	}

	/* grunticon Stylesheet Loader | https://github.com/filamentgroup/grunticon | (c) 2012 Scott Jehl, Filament Group, Inc. | MIT license. 
	  Modified by me to 
	   + write a cookie with icon support (svg || png || fallback)
	   + reuse loadCSS
	*/
  var grunticon = function(e) {
    if (e && 3 === e.length) {
      var 
        t = window,
        n = !(!t.document.createElementNS || !t.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect || !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") || window.opera && -1 === navigator.userAgent.indexOf("Chrome")),
        o = function(o) {
          loadCSS( e[o && n ? 0 : o ? 1 : 2] );
          cookie('grunticons',(o && n ? 'svg' : o ? 'png' : 'fallback'),7);
        },
        r = new t.Image();
      r.onerror = function() { o(!1); };
      r.onload = function() { o(1 === r.width && 1 === r.height); };
      r.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    }
  };
  enhance.grunticon = grunticon;  
  
  var grunticons = getMeta('grunticons');
  if (grunticons && production) {
    grunticon( grunticons.content.split(',') );
  }  


	/* 
	  Enhancements for qualified browsers - “Cutting the Mustard” 
	*/
	if( !('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) ){
		// basic browsers: last stop here!
		return;
	}

	// From here on we're dealing with qualified browsers.

	// Add scoping classes to HTML element: useful for upgrading the presentation of elements that will be enhanced with JS behavior
	docElem.className += " " + htmlClasses.join(" ");

  /* Load enhanced CSS async */
	var enhancedCSS = getMeta( enhancedCSSKey );
	if( enhancedCSS && window.environment === 'production' ){
		loadCSS( enhancedCSS.content );
	}

	/* Load JavaScript enhancements in one request.
		Your DOM framework and dependent component scripts should be concatenated and minified into one file that we'll load dynamically (keep that file as small as possible!)
		A meta tag with a name matching the fullJSKey should have a content attribute referencing the path to this JavaScript file.
		*/
	var fullJS = getMeta( fullJSKey );
	if( fullJS ){
		loadJS( fullJS.content );
	}

}( this ));