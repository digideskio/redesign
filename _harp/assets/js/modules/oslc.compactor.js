// hat-tip: https://github.com/mrmrs/fluidity

;(function ($, window, document, undefined) {

var compactElements = function(){

  // First up, tables, svg, and pre blocks, which can be wrapped in a wrapper div
  $('#main').find('table, pre, svg').each(function(){
    var 
      $el = $(this);
      
    // this prevents it from being wrapped multiple times
    if ( $el.parent().is('.overflow-wrap') ) { return; }
    
    if ( $el.width() > $el.closest('.content').width() ) {
      $el.wrap('<div class="overflow-wrap copy"></div>');
    }
    
  });
  
  // Second up: some <code> and <a> (especially auto URLs eg <http:somethingreallylong.org>) can get too long and don't necessarily break
  $('.content').find('code, a').each(function(){
    
    var 
      $el = $(this),
      $parent = $el.parent();
    
    // <code> in <pre> has overflow. We're good
    if ( $parent.is('pre') ) { return; }
    
    if ( $el.width() > $parent.width() ) {
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

})(jQuery, this, this.document);