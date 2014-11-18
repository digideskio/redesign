;(function ($, window, document, undefined) {
'use strict';

OSLC.dropdowns = []; // store these so we can do mass _.invokes later

var menuID = 0;

var Prospectus = _.create(OSLC, {

  name: 'Prospectus',
  
  DEFAULTS: {
    isDropdown: null,
    manageFocus: true,
    menuRole: 'menu',
    itemRole: 'menuitem',
    transitionIn: 'transition.slideUpIn',
    transitionOut: 'transition.slideUpOut'
  },
  
  init: function( menu, options ) {
    this.els = {menu:$(menu)};
    this.options = options;
    if ( options.isDropdown ) { this.isOpened = false; }
    
    var 
      $menu = this.els.menu,
      menuItemID = 0;

    menuID++;
    
    // set WAI-ARIA roles
    $menu.attr({
      'role': options.manageFocus ? options.menuRole : 'group',
      'data-prospectus': 'true',
      'id': $menu.attr('id') || 'prospectus-'+menuID
      })
    .find('ul,li').attr('role','presentation')
    .end() // back to the $menu
      .find('a')
      .not('.gsst_a') // google custom search
      .addClass('js-prospectus-focusable')
        .attr({
          role: options.manageFocus ? options.itemRole : null,
          'id':function(){
            menuItemID++;
            return this.id || 'prospectus-'+menuID+'-'+menuItemID;
          }
        });
  
    if (options.isDropdown && options.isDropdown.control) {
      var control = options.isDropdown.control;
    
      $menu.attr({
        'aria-hidden': 'true',
        'aria-expanded': 'false',
        'aria-labelledby': control.id
      });
      
      $(control).addClass('has-popup')
        .data('hasDropdown', this) // Stick a data flag on the control that it has a dropdown
        .attr({
        'aria-haspopup': 'true',
        'aria-owns': $menu.attr('id'),
        'aria-controls': $menu.attr('id')
        });

      OSLC.dropdowns.push(this);

      $('<button type="button" tabindex="-1" class="close"><span class="sr-only">Close</span><i class="icon grunticon-js-close"></i></button>')
        .data('dismiss',this)
        .appendTo( $menu.find('.items') );
        
      
    }

    this.setFocusable();    

  },
  findFocusableItem: function(){
    var 
      $menu = this.els.menu,
      $activeDescendant = $('#'+$menu.attr('aria-activedescendant'));
    
    return $activeDescendant.length ? $activeDescendant : $menu.find('a').first();
  },
  clearFocusable: function(){
    if (!this.options.manageFocus) {return;}
    this.els.menu.find('a').attr('tabIndex','-1');
  },
  setFocusable: function(){
    
    if (!this.options.manageFocus) {return;}
    
    var $activeDescendant = this.findFocusableItem();

    this.clearFocusable();
    $activeDescendant.length && $activeDescendant.attr('tabIndex', '0');
  },
  focus: function(){
    this.findFocusableItem().attemptFocus();
    return true;
  },
  open: function(){
  
    if ( ! this.options.isDropdown || this.isOpened ) { return; }
    
    // Initial status is NOT inserted into the DOM
    this.tether = this.tether || new Tether({
      element: this.els.menu.appendTo('body')[0],
      target: this.options.isDropdown.control,
      attachment: 'top left',
      targetAttachment: 'top left',
      constraints: [{
        to: 'scrollParent',
        attachment: 'together',
        pin: ['right']
      }]
    });
    
    var 
      tether = this.tether,
      prospectus = this;
    
    $(this.options.isDropdown.control).addClass('is-open');
    
    this.els.menu.removeClass('hidden').toggleAria('expanded','hidden')
      .find('.items')
        .velocity('stop')
        .velocity( this.options.transitionIn, {
        duration: 200,
        begin: function(){ tether.position(); },
        complete: function() { prospectus.focus(); }
      });
    
    this.isOpened = true;
  },
  close: function(){

    if ( ! this.options.isDropdown || ! this.isOpened ) { return; }
    
    var menu = this.els.menu;
    
    $(this.options.isDropdown.control).removeClass('is-open');
    
    menu.toggleAria('expanded','hidden')
      .find('.items')
        .velocity('stop')
        .velocity( this.options.transitionOut, {
        duration: 150,
        display: 'block',
        complete: function(){ menu.addClass('hidden'); }
      });
    
    this.isOpened = false;
  }
});

// jQuery plugin definition
// -------------------------------
$.fn.prospectus = function(option){
  return this.each(function(){    
    var 
      $this = $(this),
      options = _.extend({}, Prospectus.DEFAULTS, $this.data(), typeof option === 'object' && option);
    
    // If not initialized already, init it.
    if (! _.has($this.data('prospectus'), 'els') ) {
      $this
        .data('prospectus', _.create(Prospectus))
        .data('prospectus').init(this,options);
    }
      
    if (typeof option === 'string') {
      $this.data('prospectus')[option]();
    } 
  });
};

// Initialize with data-api
// -------------------------------
$(document).ready(function(){ 
  $('[data-prospectus]').prospectus();
});

// When you click another menu item, close all other dropdowns
// If applicable, open the new one
$(document).on('click', '.js-prospectus-focusable, .has-popup', function(e){
  var hasDrop = $(this).data('hasDropdown');
  
  if ( ! hasDrop ) {return;}
  
  e.preventDefault();
  
  // so you're going to invoke a .close() on every dropdown
  // they'll all report isOpened == false at that point
  // so we're going to cache if it WAS opened at the time of the click
  var wasOpened = hasDrop.isOpened;
  
  _.invoke(OSLC.dropdowns,'close');
  
  // only open up if it wasn't already
  ! wasOpened && hasDrop.open();

})
// If you click the document our outside a dropdown, close all open dropdowns
.on('click',function(e){
  var 
    openDropdowns = _.filter(OSLC.dropdowns,'isOpened'),
    firstDropdown = _.first(openDropdowns);
  
  if (!firstDropdown) {return;}
  
  var control = firstDropdown.options.isDropdown.control;
  
  if ( $(e.target).is(control) || $.contains(control,e.target) ) { return; }
  
  if ( ! $.contains(firstDropdown.els.menu[0],e.target) ) {
    _.invoke(openDropdowns,'close');
  }
  
})
// keycode management for menu items
.on('keydown', '.js-prospectus-focusable, .has-popup', function(e){
  var
    keycode = e.which || e.keyCode,
    alphabet = _.range(65,91),
    validKey = _.contains(_.union([9,27,37,38,39,40], alphabet), keycode),
    direction = /37|38/.test(keycode) ? 'prev' : 'next', // most likely
    $this = $(this),
    hasDropdown = $this.data('hasDropdown'),
    $menu = $this.closest('[data-prospectus]'),
    isDrop = $menu.length && $menu.data('prospectus').options.isDropdown,
    $dropdownControl, $menuBar, $otherDropdownControl,
    $targets;
  
  if ( ! validKey ) { return; }
  if ( ! isDrop && _.contains([9,27], keycode) ) { return; }
  
  e.preventDefault();
  
  if (keycode === 40 && hasDropdown) {
    hasDropdown.open();
    return;
  }
    
  if (isDrop && _.contains([9,27,37,39],keycode)) {
    $dropdownControl = $(isDrop.control);
    $menuBar = $dropdownControl.closest('[data-prospectus]');
    
    $dropdownControl.data('hasDropdown').close();

    // left/right
    if (/(37|39)/.test(keycode)) {
      $otherDropdownControl = $menuBar.find(':focusable').traverse(direction,$dropdownControl);
      
      // update focus target on the parent menubar
      $menuBar.attr('aria-activedescendant', $otherDropdownControl[0].id)
        .data('prospectus').setFocusable();
      
      $otherDropdownControl.data('hasDropdown') && $otherDropdownControl.data('hasDropdown').open();
      return;
    }
    
    // ESC: set focus on the owner element in the menubar
    if (keycode === 27) {
      $dropdownControl.attemptFocus();
      return;
    }
    
    // TAB: find the next/previous item in the taborder to focus on
    if (keycode === 9) {
      $(':tabbable')
        .not($dropdownControl.siblings()) // don't want to tab back into the menu bar
        .add($dropdownControl) // in a menubar, the link that owns the current popup might have tabindex="-1". This makes sure it's in the collection so we can get the index
        .traverseAndFocus(e.shiftKey ? 'prev':'next', $dropdownControl);
      return;
    }
      
  }
    
  // TODO: maybe ':focusable'? will have to exclude .close
  $targets = $menu.find('a:focusable'); 
  
  // return only elements that start with the character
  if ( _.contains(alphabet,keycode) ) {
    $targets = $targets.filter(function(){
      return _( $(this).text() ).trim().capitalize().startsWith( String.fromCharCode(keycode).toUpperCase() ).value();
    });
  }
  
  $targets.traverseAndFocus(direction, this);
  
}).on('mouseenter focus', '.js-prospectus-focusable', function(e){
  var 
    $menu = $(this).closest('[data-prospectus]'),
    prospectus = $menu.data('prospectus');
  
  // Don't set a new active descendent on mouseover if you're focused on a sibling menu item
  if (e.type === 'mouseenter' && $menu.find(':tabbable').is(document.activeElement)) {
    return;
  }
  
  $menu.attr('aria-activedescendant', this.id || '');
  prospectus && prospectus.setFocusable();

});

})(jQuery, this, this.document);