//
// CLASS TOGGLER
// 

$(document).on('click', '[data-toggle-class]', function(evt){
  
  var el = $(this);
  
  if ( ! el.attr('data-target') ) {
    return;
  }

  _.forEach( el.attr('data-target').split(','), function(selector) {
    
    var $target;
    
    if ( selector.indexOf('|self|') > -1 ) {
      $target = el;
    } else if (selector.indexOf('|parent') > -1 ) {
      $target = el.parent();
    } else {
      $target = $( selector );
    }
        
    $target.length && $target.toggleClass( el.attr('data-toggle-class').split('.').join('') );
    
  });
  
  evt.preventDefault();
});


