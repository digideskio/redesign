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
  // Speed up targeted touch events
  // https://gist.github.com/adamcbrewer/4994466
  .on('touchend','.close',function(e){
    // prevent the built-in delay and simulated mouse events
    e.preventDefault();
    
    // trigger the click that we defined above
    e.target.click();
  });

})(jQuery, this, this.document);