// because she's The Closer

;(function ($, window, document, undefined) {
'use strict';

  $(document).on('click','.close',function(e){

     e.preventDefault();

     var dismiss = $(this).data('dismiss');

     if (! dismiss) {return;}

     // Drop instance?
     dismiss.close && dismiss.close();
     
  })
  .on('click', '[data-close]', function() {
    
    // preventDefault????
    
    var data = $(this).attr('data-close').split(':');
    
    if ( data.length !== 3 ) { return; }
    
    $(this)[ data[0] ]( data[1] )[ data[2] ]('close');
    
  });
  
})(jQuery, this, this.document);