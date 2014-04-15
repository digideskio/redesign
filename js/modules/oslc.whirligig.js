;(function ($, window, document, undefined) {
'use strict';

var tabCount = 0;

var Whirligig = _.create( OSLC, {

  classes: {
    active: 'active'
  },
  
  aria: {
    tab: {
      off: {
        'aria-expanded': 'false',
        'aria-selected': 'false',
        'tabindex': '-1'
      },
      on: {
        'aria-expanded': 'true',
        'aria-selected': 'true',
        'tabindex': '0'
      }
    },
    tabpanel: {
      off: {
        'aria-hidden': 'true',
        'tabindex': '-1'
      },
      on: {
        'aria-hidden': 'false',
        'tabindex': '0'
      }
    }
  },
  
  init: function( element ){
    
    var whirligig = this;
    
    // Set the carousel wrapper. This is what will emit events
    this.el = $(element);

    // Cache the controls and set initial ARIA roles for tabs and tabpanels
    this.controls = $('.tab', this.el).each(function(){
    
      var controls = this.getAttribute('href'), newID = 'whirligig-tab-' + tabCount++;

      $(this).attr( _.extend({
        'role': 'tab',
        id: newID,
        'aria-controls': controls.replace('#','')
      }, whirligig.aria.tab.off) );
      
      $( controls ).attr(
        _.extend({
          'role': 'tabpanel',
          'aria-labelledby': newID
        }, whirligig.aria.tabpanel.off)
      );
    
    });
    
    // Tablist wrapper
    this.control_wrap = $('.tabs', this.el).attr('role','tablist');
    
    // Controls area 
    this.controls_area = $( '.controls', this.el );
    
    // Selected tab indicator
    this.indicator = $('<ins class="indicator"></ins>').attr('role','presentation').appendTo( this.control_wrap );

    this.wrapper = $('.panels', this.el);
    this.panels = $('.panel', this.el);
    
    // If there's no "active" tab, set one
    if ( ! this.controls.hasClass( this.classes.active ) ) {
      this.controls.first().addClass(this.classes.active);
    }
    
    // Go to the active one
    // But don't set focus
    this.to( this.controls.filter( '.' + this.classes.active ).attr('href'), false );
    
    this.bindings();
  },
  
  bindings: function(){
    
    var whirligig = this;
    
    this.controls.on('click.oslc.whirligig', function(e){
      
      e.preventDefault();
      
      if ( $(this).hasClass( whirligig.classes.active ) ) {
        return;
      }
      
      whirligig.to( $(this).attr('href'), true );
      
    }).on( 'keydown.oslc.whirligig', function(e){
      
      $.inArray( e.keyCode, [37,38,39,40] ) > -1 && e.preventDefault();
            
      // up/left: previous
      (e.keyCode === 37 || e.keyCode === 38) && whirligig.prev( true );
      
      // down/right: next
      (e.keyCode === 39 || e.keyCode === 40) && whirligig.next( true );
      
    });
        
  },
  
  next: function(setFocus) {
    
    var current = this.panels.filter('.' + this.classes.active);
    var next = current.is( this.panels.last() ) ? this.panels.first() : current.next();
    
    this.to( '#' + next[0].id, setFocus );
    
    return false;
    
  },
  
  prev: function(setFocus) {
  
    var current = this.panels.filter('.' + this.classes.active);
    var prev = current.is( this.panels.first() ) ? this.panels.last() : current.prev();
    
    this.to( '#' + prev[0].id, setFocus );
    
    return false;
  
  },
  
  to: function( id, setFocus ) {
    var $target, index, position, attr, val;
    
    $target = $(id);
    index = $target.index();
    position = '-' + (index*100) + '%';
    attr = this.supportsAcceleratedTransitions ? Modernizr.prefixed('transform') : 'left';
    val = this.supportsAcceleratedTransitions ? 'translate3d('+ position +',0,0)' : position;
    
    // Already active? Bail.
    if ( $target.hasClass( this.classes.active ) ) { return; }

    // Trigger an event if anyone cares
    this.el.trigger({
      type: 'slideStart',
      relatedTarget: $target[0]
    });
    
    // (1) Shift the wrapper over
    // (2) Find the currently active panel
    // (3) Set it inactive
    this.wrapper
      .css( attr, val ) // (1)
      .find('> .' + this.classes.active) // (2)
        .removeClass(this.classes.active) // (3)
        .attr( this.aria.tabpanel.off ); // (3)
    
    // Set the new target panel as the active one
    $target
      .addClass( this.classes.active )
      .attr( this.aria.tabpanel.on );
    
    // (1) Set all controls inactive
    // (2) Find the new control that should be active
    // (3) Set as the active tab
    this.controls
      .removeClass( this.classes.active ) // (1)
      .attr( this.aria.tab.off ) // (1)
      .filter('[href="'+ id +'"]') // (2)
        .addClass( this.classes.active ) // (3)
        .attr( this.aria.tab.on ); // (3)
    
    this.move_indicator();
    
    setFocus && this.controls.filter('.' + this.classes.active ).focus();
    
  },
  
  move_indicator: function(){
    var $active, pos, width, shift_attr, shift_val;
    
    $active = this.controls.filter('.' + this.classes.active);
    pos = $active.position().left + 'px';
    width = $active.width() - ( $active.is(':first-child') ? 0 : 4 )  + 'px';
    
    shift_attr = this.supportsAcceleratedTransitions ? Modernizr.prefixed('transform') : 'left';
    shift_val = this.supportsAcceleratedTransitions ? 'translate3d('+ pos +',0,0)' : pos;
    
    // This adds a class ('moving') that snaps the width down for a few ticks
    // Once there, it removes that class so the indicator can grow
    // to the newly calculated width
    this.supportsTransitions && this.indicator
      .filter(':visible') // only do this if it's visible, otherwise it'll never get removed
      .one( this.supportsTransitions.end, function(){ $(this).removeClass('moving'); })
      .addClass('moving');
    
    this.indicator.css('width', width).css( shift_attr, shift_val );
    
  }
  
});

$(function(){
  
  $('[data-whirligig]').each(function(){
    
    $(this)
      .data( 'whirligig', _.create(Whirligig) )
      .data( 'whirligig' ).init( this );
    
  });
  
});

OSLC.modules.whirligig = Whirligig;

}(jQuery, this, this.document));