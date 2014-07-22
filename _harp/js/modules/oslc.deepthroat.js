/* 
because it gives hot tips

hat-tip: 
http://hanshillen.github.io/jqtest/#
http://accessibility.athena-ict.com/aria/examples/tooltip.shtml
http://msdn.microsoft.com/en-us/library/ie/jj152135(v=vs.85).aspx (but aria-haspopup is explicitly *not* for tooltips)

*/

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
      $btn,
      data = {
        header: $el.text(),
        tip: $el.attr('title') || $el.attr('data-tooltip') || 'You did not define tooltip text, silly!', 
        id: this.id
      };
        
    $el.attr('title',null);

    if ( ! $el.is(':focusable')) {
      $btn = $el.wrap('<button role="presentation" type="button" class="tooltip-btn"></button>')
        .parent().append(' <i class="icon grunticon-js-infotip"></i>').data('deepthroat',this); 
    } else {
      $btn = $el;
    }
    
    $btn
      .addClass('js-activates-tooltip')
      .attr({'aria-describedby': this.id})
      .data('drop', this.drop = new Drop({
        target: $btn[0],
        classes: 'drop-theme-oslc drop-theme-deepthroat',
        content: _.template('<div id="<%= id %>" class="copy"><%- tip %></div>',data),
        position: 'top center',
        openOn: 'hover', // hover is the expected action for tooltips; I cover other events below
        tetherOptions: {
          constraints: [{
            to: 'scrollParent',
            attachment: 'together',
            pin: ['right','left']
          }]
        }
      }));
      
    $(this.drop.content).attr({'role':'tooltip','aria-hidden':'true'});
    
    this.drop.on('open',function(){ $(this.content).toggleAria('hidden'); });
    this.drop.on('close',function(){ $(this.content).toggleAria('hidden'); });
    
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

$(document).on('focusin focusout keydown touchend', '.js-activates-tooltip', function(e){  
  var 
    drop = $(this).data('drop'),
    keycode = e.which || e.keyCode;

  if (e.type === 'keydown' && keycode !== 27) { return; }

  e.preventDefault(); // mostly stops the artificial delayed click on mobile/iOS
  drop && drop[/focusout|keydown/.test(e.type) ? 'close' : 'open']();
});

})(jQuery, this, this.document);