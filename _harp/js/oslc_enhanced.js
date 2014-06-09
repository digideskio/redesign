
$.fn.toggleAria = function( attr ) {
  
  return this.each( function() {
    var $el = $(this);
    var ariaAttr = 'aria-' + attr;
    var current = $el.attr(ariaAttr);
  
    $el.attr(ariaAttr, ( current === 'true' ? 'false' : 'true' ));
  });

};


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