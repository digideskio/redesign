;(function ($, window, document, undefined) {
'use strict';

var ShowMore = _.create(OSLC, {
  
  name: 'ShowMore',
  
  init: function(list, items, max) {
  
    var showmore = this;
  
    this.list = list;
    this.items = items;
    this.max = max;
    
    // clone a list item
    this.clonedItem = list.children('li, [data-showmore-item]')
      .first().clone()
      .html('<a class="showmore" href="#" title="Show more">&hellip;</a>')
      .insertAfter( items.get(max-1) );
    
    this.clonedItem
      .on('click', function(e){
        e.preventDefault();
        showmore.toggle();
      })
      .find('~ li, ~ [data-showmore-item]').hide();
    
    return this;
  },
  
  toggle: function() {
    var isOpen = this.clonedItem.next().is(':visible');
    
    this.clonedItem
      .find('~ li, ~ [data-showmore-item]')[isOpen ? 'hide' : 'show']()
      .end() // back to the cloned item;
      .find('.showmore')
      .attr('title', isOpen ? 'Show more': 'Hide more');
  }

});


$.fn.showmore = function(){
  return this.each(function(){
    var 
      $list = $(this),
      max = $list.data('showmore-limit') || 5,
      $items = $list.find('li, [data-showmore-item]'),
      showmore = $list.data('showmore');
      
    if ($items.length < max) {return;}
    
    console.log(this);
    
    // not set up yet
    if ( ! _.has(showmore, 'init') ) {
      showmore = $list
        .data('showmore', _.create(ShowMore))
        .data('showmore')
        .init($list, $items, max);
    }
    
  });
};

$(document).ready(function(){ $('[data-showmore]').showmore(); });

})(jQuery, this, this.document);