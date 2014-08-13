;(function($, window, document, undefined){

/* 
  Will attempt to focus on the first :focusable element in the collection.
  
    Solves a couple boilerplate code issues:
      - filters down to focusable elements
      - no more constant try/catch 
      - if you pass no elements, no error
      - if you pass multiple elements, it will only do the first instead of all of them

  $('a').attemptFocus();  
*/

$.fn.attemptFocus = function(){
  
  this.filter(':focusable').first().each(function(){
    try { this.focus(); } catch(err) {}
  });
  
  return this;
};

/* 
  Little utility function
  Given a collection of elements, finds the previous or next element within that collection
  
  This is NOT the same as $.prev() or $.next() that return sibling DOM elements
  
  It wraps around the selection!
  If current is the last element in the collection, "next" returns the first
  If current is the first element in the collection, "prev" returns the last element
  If current is not in the collection, you'll get the 1st element ("next") or last ("prev")
  
  PARAMETERS
  ----------------
  
  dir       String            'prev(ious)' or 'next'

  current   DOM or jQuery    The 'current' element to traverse from
  
  Ex: 
  $(':focusable').traverse('next',document.activeElement) // returns next focusable element after the current one
  
*/
$.fn.traverse = function(dir,current) {

  if (typeof dir === 'string' && /prev|next/.test(dir)) {
    var currentIndex = this.index(current);
    var newIndex = /prev/.test(dir) ? -1 : 0;
    
    if (current && currentIndex !== -1) {
      newIndex = /prev/.test(dir) ? currentIndex-1 : currentIndex+1;
    }
    
    // negative indexes are OK; they just wrap around backwards
    // but too large is bad. go to the first    
    if ( newIndex === this.length ) { newIndex = 0; }
    
    return this.eq(newIndex);
  }

  return this;
};

/* 
  Another little utility to traverse a collection of elements and then attempt to focus on the new target
  
  Pass two arguments: direction and the base index element

  Will attempt to focus on the prev/next element in the collection FROM the current element you pass.
  
  $('.menu').find(':focusable').attemptFocus('previous');
  
  PARAMETERS
  -------------------
  
  dir       String            'prev(ious)' or 'next'

  current   DOM or jQuery     The 'current' element to traverse from. 
                              Defaults to document.activeElement
*/  
  

$.fn.traverseAndFocus = function(dir,current) {
  
  var collection = this;
  
  if (typeof dir === 'string' && /prev|next/.test(dir)) {
    collection = this.traverse(dir,current || document.activeElement).attemptFocus();
  }
  
  return collection;
};

})(jQuery, this, this.document);
