// because it gives hot tips

;(function ($, window, document, undefined) {
'use strict';

var tooltipID = 0;

var DeepThroat = _.create(OSLC,{
  name: 'DeepThroat',
  init: function(el) {
    this.el = el;
    this.id = 'deepthroat-tooltip-'+tooltipID;
    tooltipID++;
    
    var
      $el = $(el),
      data = {
        header: $el.text(),
        tip: $el.attr('title') || $el.attr('data-tooltip') || 'You did not define tooltip text, silly!', 
        id: this.id
      };
        
    $el
      .append(' <i class="icon grunticon-js-infotip"></i>')
      .wrap(_.template('<button aria-described-by="<%= id %>" class="tooltip-btn"></button>',data))
      .attr('title',null)
      .parent() // the .tooltip-btn that you just wrapped 
      .data('drop', this.drop = new Drop({
        target: el,
        classes: 'drop-theme-oslc drop-theme-deepthroat',
        content: _.template('<div id="<%= id %>" class="copy"><%- tip %></div>',data),
        position: 'top center',
        tetherOptions: {
          constraints: [{
            to: 'scrollParent',
            attachment: 'together',
            pin: ['right','left']
          }]
        }
      }));
    
    $('<button type="button" tabindex="-1" class="close"><span class="sr-only">Close</span><i class="icon grunticon-js-close"></i></button>')
      .data('dismiss',this.drop)
      .appendTo(this.drop.content);
  },
  open: function() { this.drop && this.drop.open(); },
  close: function() { this.drop && this.drop.close(); },
  show: function() { this.open(); },
  hide: function() { this.close(); }
});

// jQuery plugin definition
// -------------------------------
$.fn.deepthroat = function(){
  return this.each(function(){
    $(this)
      .data('deepthroat', _.create(DeepThroat))
      .data('deepthroat').init(this);
  });
};

// Initialize with data-api
// -------------------------------
$(document).ready(function(){
  $('[data-tooltip]').deepthroat();
});

$(document)
.on('focusin focusout', '.tooltip-btn', function(e){  
  var drop = $(this).data('drop');
  drop && drop[e.type === 'focusin' ? 'open' : 'close']();
})
.on('keydown', '.tooltip-btn', function(e){
  var
    drop = $(this).data('drop'),
    keycode = e.which || e.keyCode;
  
  if (keycode !== 27) {return;}
  
  drop && drop.close();  
});



})(jQuery, this, this.document);