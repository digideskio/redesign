;(function ($, window, document, undefined) {
'use strict';

var Manilla = _.create(OSLC,{

  name: 'Manilla',

  init: function(tablist) {
    
    this.tablist = tablist;
    
    // lazy|smart: $.fn.prospectus handles roles, setting unique IDs on the anchors, keyboard controls
    if ( tablist.find('a').length ) {
      tablist.prospectus( {menuRole: 'tablist', itemRole: 'tab'} );
    }
    
    this.tabs = tablist
      .find('[role="tab"], input[type="radio"]') // .prospectus() above adds the tab role
      .each(function(){
        var 
          tab = $(this),
          id = tab.attr('href') || tab.data('target');
          
          $(id)
            .hide()
            .attr({
              'role': 'tabpanel',
              'aria-labelledby': tab[0].id,
              'aria-hidden': 'true'
            });

          tab.attr({
            'aria-controls': id.replace('#',''),
            'aria-selected': 'false'
          });

      });
    
    var current = tablist.find('.current');
    if ( ! current.length ) {
      current = tablist.find('[role="tab"], label').first().addClass('current');
    }
    
    // @todo: maybe move this into the jQuery plugin definition
    this.show( current.attr('href') || current.find('input').data('target') );
    
    return this;
    
  },
  
  show: function(selector) {
    
    // @todo: it might be nice if this could accept a tab's index in addition to a tabpanel's selector
    // eg this.show(0) -> "activate 1st tab"
    
    var
      newPanel = $(selector),
      tabPanels = newPanel.closest('.tabpanels'),
      showEvent,
      oldPanel;
      
    if (newPanel.is(':visible')) { return; }
    
    this.tabs.each(function(){
      var tab = $(this),
        href = tab.attr('href') || tab.data('target'),
        newCurrent = selector === href;
        
      if ( tab.parent().addBack().hasClass('current') ) {
        oldPanel = $( href );
      }
      
      tab.attr('aria-selected', newCurrent);
      
      if ( tab.is('a') ) {
        tab[newCurrent ? 'addClass' : 'removeClass']('current');
      } else { // input
        tab.prop('checked', newCurrent )
          .parent()[newCurrent ? 'addClass' : 'removeClass']('current');
      }
      
    });
    
    showEvent = $.Event('show.oslc.tab', {
      relatedTarget: oldPanel[0]
    });
        
    oldPanel.attr('aria-hidden','true')
      .velocity('stop').velocity('transition.slideDownOut',{
        begin: function() { tabPanels.css( 'min-height', oldPanel.height() ); 
        },
        duration: 300,
        complete: function() {
          newPanel.attr('aria-hidden','false')
            .velocity('stop').velocity('transition.slideUpIn', {
              duration: 300,
              complete: function(){
                newPanel.trigger(showEvent);
              }
            });
          tabPanels.css( 'min-height', newPanel.height() );
        }
      });    
  }

});

/*
  jQuery Plugin

  Two uses: use it on a menu to initialize the whole tabular setup
  This includes ARIA roles, keyboard navigation, etc
  $('.menu').manilla();
  
  Or you can fire it on a single link to show that tabpanel immediately.
  It'll set up the entire tablist for you if needed.
  $('a.tab').manilla();
*/
$.fn.manilla = function() {
  return this.each(function() {
    
    var 
      $el = $(this),
      tabList = $el, // default, but could be called on a panel or tab directly
      isTab = $el.is('[aria-controls]'),
      isTabPanel = $el.is('[aria-labelledby]'),
      manilla; 
      
    if (isTab) {
      tabList = $el.closest('[data-manilla]');
    } 
    
    if (isTabPanel) {
      tabList = $( '#' + $el.attr('aria-labelledby') ).closest('[data-manilla]');
    }
      
    manilla = tabList.data('manilla');
    
    // need to initialize the entire tablist
    if ( ! _.has(manilla,'tablist') ) {
      manilla = tabList
        .data('manilla', _.create(Manilla))
        .data('manilla')
        .init($el);
    }
    
    if (isTab) { 
      manilla.show( $el.attr('href') || $el.data('target') );
      return;
    }
    
    if (isTabPanel) { manilla.show( '#' + this.id ); }
    
  });
};

/* DOM Ready */
$(document).ready(function(){
  // auto-initialize
  $('[data-manilla]').manilla();
  
  if ( location.hash && $(location.hash).is('[role="tabpanel"]') ) {
    $( '#' + $(location.hash).attr('aria-labelledby') ).manilla();
  }
  
});

/* Click + change events */
$(document).on('click.oslc.manilla', '.item[role="tab"]', function(e){
  e.preventDefault();
  $(this).manilla();
})
.on('change.oslc.manilla', 'input[aria-controls]', function(){
  $(this).manilla();
});


})(jQuery, this, this.document);