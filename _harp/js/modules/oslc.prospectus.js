;(function ($, window, document, undefined) {
'use strict';

var menuID = 0;

var Prospectus = _.create(OSLC, {

  name: 'Prospectus',
  
  init: function(menu,manageFocus) {
    this.els = {menu:$(menu)};
    this.focusable = manageFocus;

    var menuItemID = 0;
    menuID++;
    
    // set WAI-ARIA roles
    this.els.menu.attr({
      'role': manageFocus ? (this.els.menu.hasClass('horizontal') ? 'menubar' : 'menu') : null,
      'data-prospectus': 'true',
      'id': this.els.menu[0].id || 'prospectus-'+menuID
    });
    this.els.menu.find('ul,li').attr('role','presentation');
    this.els.menu.find('a').attr({
      role: manageFocus ? 'menuitem' : null,
      'id':function(){
        menuItemID++;
        return this.id || 'prospectus-'+menuID+'-'+menuItemID;
      }
    });
  
    this.setFocusable();
    
  },
  findFocusableItem: function(){
    var 
      $menu = this.els.menu,
      $activeDescendant = $('#'+$menu.attr('aria-activedescendant'));
    
    return $activeDescendant.length ? $activeDescendant : $menu.find('a').first();
  },
  clearFocusable: function(){
    if (!this.focusable) {return;}
    this.els.menu.find('a').attr('tabIndex','-1');
  },
  setFocusable: function(){
    
    if (!this.focusable) {return;}
    
    var $activeDescendant = this.findFocusableItem();

    this.clearFocusable();
    $activeDescendant.length && $activeDescendant.attr('tabIndex', '0');
  },
  focus: function(){
    var $activeDescendant = this.findFocusableItem();
    
    if ($activeDescendant.length) {
      try { $activeDescendant[0].focus(); } catch (err) {}
    }
    return true;
  }
});

// jQuery plugin definition
// -------------------------------
$.fn.prospectus = function(manageFocus){
  return this.each(function(){
    manageFocus = (manageFocus || $(this).attr('data-manage-focus') || 'true').toString() === 'true';
    $(this)
      .data('prospectus', _.create(Prospectus))
      .data('prospectus').init(this,manageFocus);
  });
};

// Initialize with data-api
// -------------------------------
$(document).ready(function(){ 
  $('[data-prospectus]').prospectus();
});

$(document).on('keydown', '[role="menuitem"], [data-prospectus] :focusable', function(e){
  var
    keycode = e.which || e.keyCode,
    alphabet = _.range(65,91),
    validKey = _.contains(_.union([9,27,37,38,39,40], alphabet), keycode),
    $this = $(this),
    hasDrop = $this.data('drop'),
    $menu = $this.closest('[data-prospectus]'),
    isDrop = $menu.attr('aria-labelledby'),
    $dropOwner, $menuBar,
    $targets,
    $newTarget;
  
  if ( ! validKey || (keycode === 9 && ! isDrop)) {return;}
  
  e.preventDefault();

  if (keycode === 40 && hasDrop) {
    hasDrop.open();
    return;
  }
    
  if (isDrop && _.contains([9,27,37,39],keycode)) {
    $dropOwner = $('#'+isDrop);
    $menuBar = $dropOwner.closest('[data-prospectus]');
    
    $dropOwner.data('drop') && $dropOwner.data('drop').close();

    // left/right
    if (/(37|39)/.test(keycode)) {
      $newTarget = getNewFocusTarget($menuBar.find('[role="menuitem"]'), $dropOwner.index(), keycode);
      
      // update focus target on the parent menubar
      $menuBar.attr('aria-activedescendant', $newTarget[0].id);
      $menuBar.data('prospectus') && $menuBar.data('prospectus').setFocusable();
      
      $newTarget.data('drop') && $newTarget.data('drop').open();
      return;
    }
    
    // ESC: set focus on the owner element in the menubar
    if (keycode === 27) {
      $newTarget = $dropOwner;
    }
    
    // TAB: find the next/previous item in the taborder to focus on
    if (keycode === 9) {
      $targets = $(':tabbable')
        .not($dropOwner.siblings()) // don't want to tab back into the menu bar
        .add($dropOwner); // in a menubar, the link that owns the current popup might have tabindex="-1". This makes sure it's in $targets so we can get its index

      $newTarget = getNewFocusTarget($targets, $targets.index($dropOwner), e.shiftKey ? 37 : 39);
    }
      
  } else {
    $targets = $menu.find('a');
    
    // return only elements that start with the character
    if ( _.contains(alphabet,keycode) ) {
      $targets = $targets.filter(function(){
        return _( $(this).text() ).trim().capitalize().startsWith( String.fromCharCode(keycode).toUpperCase() ).value();
      });
    }
    
    $newTarget = getNewFocusTarget($targets,$targets.index(this),keycode);
    
  }
  
  if ($newTarget.length) {
    try { $newTarget[0].focus(); } catch(err) {}
  }
    
}).on('mouseenter focus', '[role="menuitem"], [data-prospectus] :focusable', function(e){
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

var getNewFocusTarget = function($menuItems,currentIndex,keycode){  
  /(37|38)/.test(keycode) && currentIndex--; // left/up. go back one (-1 is OK)
  /(39|40)/.test(keycode) && currentIndex++; // right/down. go forward one
  _.contains(_.range(65,91),keycode) && currentIndex++; // a-z. go forward
  
  // too far! go to the first
  if (currentIndex === $menuItems.length) { currentIndex = 0; }
  
  return $menuItems.eq(currentIndex);
};

})(jQuery, this, this.document);