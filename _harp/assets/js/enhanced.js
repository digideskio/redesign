// @codekit-prepend "./_libraries.js";
// @codekit-prepend "./modules/oslc.jquery.attemptfocus.js";
// @codekit-prepend "./modules/oslc.jquery.togglearia.js";

$(function() {
  FastClick.attach(document.body);
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
  mediaQueries: {
    screen: "only screen",
    portrait: "only screen and (orientation: portrait)",
    landscape: "only screen and (orientation: landscape)",
    'hand-up': "only screen",
    'hand-only': "only screen and (max-width: 40em)",
    'knee-up': "only screen and (min-width:40.0625em)",
    'knee-only': "only screen and (min-width:40.0625em) and (max-width:64em)",
    'knee-down': "only screen and (max-width:64em)",
    'desk-up': "only screen and (min-width:64.0625em)",
    'desk-only': "only screen and (min-width:64.0625em) and (max-width:90em)",
    'workstation-up': "only screen and (min-width:90.0625em)",
    'workstation-only': "only screen and (min-width:90.0625em) and (max-width:120em)",
    'neckbeard-up': "only screen and (min-width:120.0625em)",
    'neckbeard-only': "only screen and (min-width:120.0625em)"
  },

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
// REMOVED 18 Nov 2014; Modernizr seems to false negative on "csstransforms3d" in Webkit. Maybe revisit when Modernizr 3.0 hits?
// It could also only be an issue when Modernizr is loaded ASYNC (as it is prefixed to this file). Or not? I dunno, it's very random!
//OSLC.supportsAcceleratedTransitions = Modernizr && "csstransforms3d" in Modernizr && Modernizr.csstransforms3d;

// For browsers that do not support accelerated transitions, probably best to just do all animations instantly
// http://julian.com/research/velocity/#mock
// this overrides all durations and delays to 0ms
//if ( ! OSLC.supportsAcceleratedTransitions ) { $.Velocity.mock = true; }

// @codekit-append "./modules/oslc.google-cse.js";
// @codekit-append "./modules/oslc.toggler.js";
// @codekit-append "./modules/oslc.scrollTo.js";
// @codekit-append "./modules/oslc.fluidvideos.js";
// @codekit-append "./modules/oslc.prospectus.js";
// @codekit-append "./modules/oslc.checkov.js";
// @codekit-append "./modules/oslc.whirligig.js";
// @codekit-append "./modules/oslc.floatingLabels.js";
// @codekit-append "./modules/oslc.brenda.js";
// @codekit-append "./modules/oslc.bartender.js";
// @codekit-append "./modules/oslc.deepthroat.js";
// @codekit-append "./modules/oslc.sextant.js";
// @codekit-append "./modules/oslc.manilla.js";
// @codekit-append "./modules/oslc.nag.js";
// @codekit-append "./modules/oslc.compactor.js";
// @codekit-append "./modules/oslc.doubtfire.js";
// @codekit-append "./modules/oslc.onelastthing.js";