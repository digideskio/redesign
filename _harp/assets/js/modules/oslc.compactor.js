// hat-tip: https://github.com/mrmrs/fluidity

;(function ($, window, document, undefined) {

var compactElements = function(){

  var 
    $main = $('#main'),
    mainWidth = $main.width();

  // First up, tables, svg, and pre blocks, which can be wrapped in a wrapper div
  $main.find('table, pre, svg').each(function(){
    var 
      $el = $(this);
      
    // this prevents it from being wrapped multiple times
    if ( $el.parent().is('.overflow-wrap') ) { return; }
    
    var width = $el.width();
    
    // Duo was saying SVGs had a negative width?
    // try using the width attribute
    if (width < 0) { width = $el.attr('width'); }
    
    if ( width > mainWidth ) {
      $el.wrap('<div class="overflow-wrap copy"></div>');
    }
    
  });
  
  // Second up: some <code> and <a> and headers (especially auto URLs eg <http:somethingreallylong.org>) can get too long and don't necessarily break
  $main.find('code, a, h1, h2, h3, h4, h5, h6').each(function(){
    
    var 
      $el = $(this),
      $parent = $el.parent();
    
    if ($el.hasClass('line-break-all-the-things')) {return;}
    
    // <code> in <pre> has overflow. We're good
    if ( $parent.is('pre') ) { return; }
    
    if ( $el.outerWidth() > $parent.width() ) {
      $el.addClass('line-break-all-the-things');
    }
    
  });
};

// do it on load
$(document).ready(function(){
  compactElements();
  $('table').stickyTableHeaders();
});

// and on resize
// this appears to capture orientation change events as well
$(window).on( 'resize', _.debounce(compactElements, 500) );

// expose it
OSLC.compactElements = compactElements;

})(jQuery, this, this.document);