// because she's The Closer

;(function ($, window, document, undefined) {
'use strict';

  $(document).on('click','.close',function(e){

   e.preventDefault();

   var dismiss = $(this).data('dismiss');

   if (! dismiss) {return;}

   // Drop instance?
   dismiss.close && dismiss.close();

  });

})(jQuery, this, this.document);