;(function ($, window, document, undefined) {
'use strict';

var Manilla = _.create(OSLC,{

  name: 'Manilla',

  init: function(tablist) {
    
    // lazy|smart: $.fn.prospectus handles roles, setting unique IDs on the anchors, keyboard controls
    this.tablist = tablist.prospectus({
      menuRole: 'tablist',
      itemRole: 'tab'
    });
    
    this.tabs = tablist.find('[role="tab"]').each(function(){
      var 
        tab = $(this),
        id = tab.attr('href');
        
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
      current = tablist.find('[role="tab"]').first().addClass('current');
    }
    
    this.show( current.attr('href') );
    
  },
  
  show: function(selector) {
    
    var
      newPanel = $(selector),
      oldPanel;
      
    if (newPanel.is(':visible')) { return; }
    
    this.tabs.each(function(){
      var tab = $(this),
        href = tab.attr('href'),
        newCurrent = selector === href;
        
      if ($(this).hasClass('current')) {
        oldPanel = $( href );
      }
      
      tab
        .attr('aria-selected', newCurrent)
        [newCurrent ? 'addClass' : 'removeClass']('current');
      
    });
    
    oldPanel.attr('aria-hidden','true')
      .velocity('transition.slideDownOut',{
        duration: 300,
        complete: function(){
          newPanel.attr('aria-hidden','false')
            .velocity('transition.slideUpIn', 300);
        }
      });    
  }

});

$.fn.manilla = function() {
  return this.each(function() {
    
    var 
      $this = $(this),
      data = $this.data('manilla');
    
    if ( ! _.has(data,'tablist') ) {
      $this
        .data('manilla', _.create(Manilla))
        .data('manilla').init($this);
    }
    
  });
};

$(document).ready(function(){
  $('[data-manilla]').manilla();
});

$(document).on('click.oslc.manilla', '[role="tab"]', function(e){
  e.preventDefault();
  var 
    tab = $(this),
    manilla = tab.closest('[data-manilla]').data('manilla');
    
  if ( _.has(manilla, 'tablist') ) {
    manilla.show( tab.attr('href') );
  }

});

})(jQuery, this, this.document);