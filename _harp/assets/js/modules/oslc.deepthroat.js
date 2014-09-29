/* 
because it gives hot tips

Hat tips: 
http://hanshillen.github.io/jqtest/#
http://accessibility.athena-ict.com/aria/examples/tooltip.shtml
http://msdn.microsoft.com/en-us/library/ie/jj152135(v=vs.85).aspx (but aria-haspopup is explicitly *not* for tooltips)

*/

;(function ($, window, document, undefined) {
'use strict';

var tooltipID = 0;

var DeepThroat = _.create(OSLC,{
  name: 'DeepThroat',
  
  DEFAULTS: {
    addTooltipIcon: true,
    addWrapperClass: true
  },
  
  init: function(el,options) {
    this.el = el;
    this.id = 'deepthroat-tooltip-'+tooltipID;
    tooltipID++;
    this.isOpen = false;
    this.mouseOver = false;
    
    var
      $el = $(el),
      skipIcon = options.addTooltipIcon === false,
      skipWrapperClass = options.addWrapperClass === false,
      data = {
        header: $el.text(),
        tip: $el.attr('title') || $el.attr('data-tooltip') || 'You did not define tooltip text, silly!', 
        id: this.id },
      tip = _.template('<div class="hidden tooltip" id="<%= id %>" role="tooltip" aria-hidden="true"><div class="body copy"><%- tip%></div></div>', data);
    
    ! $el.is(':tabbable') && $el.attr('tabindex','0');
    
    $el
      .attr('class', function() {
        // this hoop is required to add the hover classes to SVG elements
        return ($el.attr('class') || '') + ' js-activates-tooltip ' + (skipWrapperClass ? '' : 'tooltip-wrap');
      })
      .append( skipIcon ? '' : ' <i class="icon grunticon-js-infotip"></i>')
      .attr({
        'aria-describedby': this.id, 
        title: null });

    this.tip = $(tip).data('deepthroat',this);
    
    $('<button type="button" tabindex="-1" class="close"><span class="sr-only">Close</span><i class="icon grunticon-js-close"></i></button>')
      .data('dismiss',this)
      .appendTo($(this.tip).find('.body'));
    
  },
  open: function() { 
  
    if (this.isOpen) { return; }

    // definition inserts into the DOM
    this.tether = this.tether || new Tether({
      element: this.tip[0],
      target: this.el,
      attachment: 'bottom center',
      targetAttachment: 'top center',
      constraints: [{
        to: 'scrollParent',
        attachment: 'together',
        pin: ['right','left']
      }]
    });
    
    var tether = this.tether;
    
    this.tip.removeClass('hidden').toggleAria('hidden')
      .find('.body').velocity('transition.flipYIn',{
        duration: 250,
        begin: function(){ 
          tether.position(); 
        }
      });
    
    this.isOpen = true;
    
  },
  close: function() { 
    
    if (!this.isOpen) { return; }
    
    var tooltip = this;

    this.tip.toggleAria('hidden').find('.body').velocity('transition.flipYOut',{
      duration: 150,
      display: 'block', // this is the trick. maintain visibility so Tether can position accurately when (re)opening
      complete: function(){
        tooltip.tip.addClass('hidden');
      }
    });
    
    this.isOpen = false;
  },
  show: function() { this.open(); },
  hide: function() { this.close(); }
});

// jQuery plugin definition
// -------------------------------
$.fn.deepthroat = function(option){
  return this.each(function(){
    var 
      $this = $(this),
      options = _.extend({}, DeepThroat.DEFAULTS, $this.data(), typeof option === 'object' && option);
    
    if ( ! _.has( $this.data('deepthroat'), 'el' ) ) {
      $this
        .data('deepthroat', _.create(DeepThroat))
        .data('deepthroat').init(this, options);      
    }
    
    if (typeof option === 'string') {
      $this.data('deepthroat')[option]();
    }
    
  });
};

// Initialize with data-api
// -------------------------------
$(document).ready(function(){
  $('[data-tooltip]').deepthroat();
});

// Event handlers
// -------------------------------
$(document).on('focusin focusout mouseenter keydown touchend', '.js-activates-tooltip', function(e){  
  var tooltip = $(this).data('deepthroat');

  if (e.type === 'keydown' && (e.which || e.keyCode) !== 27) { return; }
  if (e.type === 'mouseenter') { tooltip.mouseOver = true; }
  if (e.type === 'touchend') { e.preventDefault(); } // mostly stops the artificial delayed click on mobile/iOS 

  tooltip && tooltip[/focusout|keydown/.test(e.type) ? 'close' : 'open']();
}).on('mouseenter', '.tooltip', function(){
  var tooltip = $(this).data('deepthroat');
  if (tooltip) { tooltip.mouseOver = true; }
}).on('mouseleave', '.tooltip, .js-activates-tooltip', function(){
  var tooltip = $(this).data('deepthroat');
  if (!tooltip) { return; }
  
  tooltip.mouseOver = false;
  
  _.delay( function(){
    if (!tooltip.mouseOver) { tooltip.close(); }
  }, 500);
});

})(jQuery, this, this.document);