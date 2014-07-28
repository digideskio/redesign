
$.fn.toggleAria = function() {
  
  var 
    attributes = arguments,
    toggle = function(el,attr) {
    var 
      $el = $(el),
      ariaAttr = 'aria-' + attr.replace('aria-',''),
      current = $el.attr(ariaAttr);
    $el.attr(ariaAttr, ( current === 'true' ? 'false' : 'true' ));
  };
  
  return this.each( function() {
    var el = this;
    _.forEach(attributes, function(att){
      toggle(el,att);
    });  
  });

};

/* :focusable and :tabbable selectors from
   https://raw.github.com/jquery/jquery-ui/master/ui/jquery.ui.core.js */

function visible(element) {
    return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
        return $.css(this, "visibility") === "hidden";
    }).length;
}

function focusable(element, isTabIndexNotNaN) {
    var map, mapName, img,
        nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
        map = element.parentNode;
        mapName = map.name;
        if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
            return false;
        }
        img = $("img[usemap=#" + mapName + "]")[0];
        return !!img && visible(img);
    }
    return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled :
            "a" === nodeName ?
                    element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
                        // the element and all of its ancestors must be visible
                        visible(element);
}

$.extend($.expr[":"], {
    data: $.expr.createPseudo ? $.expr.createPseudo(function (dataName) {
        return function (elem) {
            return !!$.data(elem, dataName);
        };
    }) : // support: jQuery <1.8
            function (elem, i, match) {
                return !!$.data(elem, match[3]);
            },

    focusable: function (element) {
        return focusable(element, !isNaN($.attr(element, "tabindex")));
    },

    tabbable: function (element) {
        var tabIndex = $.attr(element, "tabindex"),
            isTabIndexNaN = isNaN(tabIndex);
        return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }
});



var OSLC = {
  dasherize: function(str){
    // via http://modernizr.com/docs/#prefixed
    return _.dasherize(str).replace(/^ms-/,'-ms-');
  },
  funcFold: function(func) { 
    // pass a function (eg compiled _.template) that expects one argument
    // this returns an iterator for use with _.reduce(Right)
    return function(sum, el) { return sum+func(el); };
  },
  templateFold: function(templateStr) {
    return function(sum, el) { return sum+_.template(templateStr,el); };
  },
  mediaQueries: {},
  modules: {},
  
  //
  // Gather together all possibilities for transitionend event names
  //
  transitionEventNames: {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd otransitionend', // Opera used both at one point
  // Microsoft never supported prefixed transitions. IE10 is not prefixed.
  'transition'       : 'transitionend'
  }
};


//
// Insert Media Query-based meta tags 
//
_.forEach( [
  'screen',
  'landscape',
  'portrait',
  'hand-up',
  'hand-only',
  'knee-up',
  'knee-only',
  'desk-up',
  'desk-only',
  'workstation-up',
  'workstation-only',
  'neckbeard-up',
  'neckbeard-only'
], function( query ){
  $('head').append('<meta class="oslc-mq-' + query + '" />');
  
  // I have the strings wrapped in "/" so that there's no way they'll be read as a valid font-family
  // different browsers put different quote styles around the font-family strings
  // Chrome does '
  // FF does "
  // Sometimes there's "\"??
  OSLC.mediaQueries[ query ] = $('.oslc-mq-' + query).css('font-family').split(/\/|\\|'|"/g).join('');
});


//
// Return whether or not CSS transitions are supported
// If yes, returns { end: 'transitionend' } with the proper prefix
//
OSLC.supportsTransitions = Modernizr && "csstransitions" in Modernizr && Modernizr.csstransitions && {
  end: OSLC.transitionEventNames[ Modernizr.prefixed('transition') ]
};


//
// Return whether or not CSS transitions are GPU-accelerated
// This is an imperfect test, but 3D Transforms are a good sign
//
OSLC.supportsAcceleratedTransitions = Modernizr && "csstransforms3d" in Modernizr && Modernizr.csstransforms3d;