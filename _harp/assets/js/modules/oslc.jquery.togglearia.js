/*
  Micro jQuery extension to toggle common ARIA properties
  
  Send as many string aria-XXX attributes as you want, and this will toggle them true/false.
  
  If not set, defaults to aria-XXX="true"
  
  You don't have to pass the full name "aria-hidden"; you can just pass "hidden"
  
  USAGE: 
  
  $(el).toggleAria('hidden','expanded')
*/

$.fn.toggleAria = function() {
  
  var 
    attributes = arguments,
    toggle = function(el,attr) {
    var 
      $el = $(el),
      ariaAttr = 'aria-' + attr.replace('aria-',''),
      current = $el.attr(ariaAttr);
    $el.attr(ariaAttr, ( current === 'true' ? 'false' : 'true' ));
  };
  
  return this.each( function() {
    var el = this;
    $.each(attributes, function(i,att){
      toggle(el,att);
    });  
  });

};
