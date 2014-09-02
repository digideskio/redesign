;(function ($, window, document, undefined) {
'use strict';

var tabCount = 0;

var Whirligig = _.create( OSLC, {
  name: "Whirligig",
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
        'aria-expanded': 'false'
      },
      on: {
        'aria-hidden': 'false',
        'aria-expanded': 'false'
      }
    }
  },
  
  init: function( element ){
    console.log('Initializing Whirligig for #' + element.id);
    
    var whirligig = this;
    
    // Set the carousel wrapper. This is what will emit events
    this.el = $(element);

    // Cache the controls and set initial ARIA roles for tabs and tabpanels
    this.controls = $('.tab', this.el).each(function(){
    
      var 
        controls = this.getAttribute('href'), 
        newID = 'whirligig-tab-' + tabCount++;

      $(this).attr( _.extend({
        'role': 'tab',
        id: newID,
        'aria-controls': controls.replace('#',''),
        'aria-owns': controls.replace('#','')
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
    this.indicator = $('<ins class="indicator"></ins>')
      .attr('role','presentation')
      .appendTo( this.control_wrap );

    this.wrapper = $('.panels', this.el);
    this.panels = $('.panel', this.el);
    
    // If there's no "active" tab, set one
    if ( ! this.controls.hasClass( this.classes.active ) ) {
      this.controls.first().addClass( this.classes.active );
    }
    
    this.bindings();
  },
  
  bindings: function(){
    
    var whirligig = this;
    
    this.controls.on('click.oslc.whirligig touchend.oslc.whirligig', function(e){
      
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
    
    enquire.register( whirligig.mediaQueries['knee-up'], {
      match: function(){
        // when you're out of the hand zone, undo the panel shifts
        whirligig.wrapper
          .velocity('stop', true)
          .velocity({translateX: 0}, 125, [0.4,0,0.2,1]);
        
        whirligig.panels.removeClass('invisible');
      }
    })
    .register( whirligig.mediaQueries['hand-only'], {
      match: function() { 
        // this solves 2 issues
        // (1) It defers initialization until needed, which helps properly position the indicator (the controls / indicator are hidden at knee-up size)
        // (2) It RE-inits if you go large-to-small
        whirligig.to( whirligig.controls.filter('.'+whirligig.classes.active).attr('href'), false);
      }
    });
        
  },
  
  next: function(setFocus) {
    
    this.to(this.panels.traverse( 'next', this.panels.filter('.' + this.classes.active) ), setFocus);
    
    return false;
    
  },
  
  prev: function(setFocus) {
  
    this.to(this.panels.traverse('prev', this.panels.filter('.' + this.classes.active)), setFocus);
    
    return false;
  
  },
  
  to: function( target, setFocus ) {
    var 
      whirligig = this,
      $target = $(target), // could be either an #href string or DOM or jQuery. Same result either way.
      id = $target[0].id, 
      index = $target.index(),
      active = this.classes.active;

    // Trigger an event if anyone cares
    this.el.trigger({
      type: 'slideStart',
      relatedTarget: $target[0]
    });
    
    // (1) Make sure all panels are visible (and tabbable!)
    // (2) Find the currently active one
    // (3) Disable (class and ARIA)
    this.panels
      .removeClass('invisible') // (1)
      .filter( '.'+active ) // (2)
      .removeClass(active) // (3)
      .attr( this.aria.tabpanel.off ); // (3)
    
    // Shift the wrapper over
    this.wrapper
      .velocity('stop', true)
      .velocity( 
      {translateX: '-' + (index*100) + '%'}, {
        easing: [0.4,0,0.2,1], 
        duration: 250,
        complete: function(){
          // When done, make all non-active panels invisible
          // (this removes them from the tab order)
          whirligig.panels.not($target).addClass('invisible');
        }
      } 
    );
    
    // Set the new target panel as the active one
    $target
      .addClass( active )
      .attr( this.aria.tabpanel.on );
    
    // (1) Set all controls inactive
    // (2) Find the new control that should be active
    // (3) Set as the active tab
    this.controls
      .removeClass(active) // (1)
      .attr(this.aria.tab.off) // (1)
      .filter('[aria-controls="'+ id +'"]') // (2)
        .addClass(active) // (3)
        .attr(this.aria.tab.on); // (3)
    
    this.move_indicator();
    
    setFocus && this.controls.filter('.'+active).attemptFocus();
    
  },
  
  move_indicator: function(){
    var 
      $active = this.controls.filter('.' + this.classes.active),
      width = $active.width() - ( $active.is(':first-child') ? 0 : 4 );
    
    this.indicator.velocity('stop', true)
      .velocity({
        width: [width, [1,-1,0.6,1]], 
        translateX: [$active.position().left, [0.4,0,0.2,1]]
      }, 
      {duration: 300}
    );
  }
  
});

OSLC.modules.whirligig = Whirligig;

$(function(){
  
  $('[data-whirligig]').each(function(){    
    $(this)
      .data('whirligig', _.create(Whirligig))
      .data('whirligig').init(this);
  });
  
});

}(jQuery, this, this.document));