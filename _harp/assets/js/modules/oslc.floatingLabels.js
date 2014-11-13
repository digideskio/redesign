;(function ($, window, document, undefined) {
'use strict';

var floatingLabels = _.create(OSLC, {
  name: "Floating Labels",

  init: function( $input ) {
    this.input = $input;
    
    this.bindings();
  },
  
  bindings: function(){
    //var floatingLabels = this;
    this.input.on('keyup change focus blur', function(e) {
            
      var 
        input = $(this),
        label = input.closest('.floatingLabels').find('label');
      
      if ( _.contains(['focus','blur'], e.type) ) {
        label[ e.type === 'focus' ? 'addClass' : 'removeClass' ]('is-focused');
        return;
      }

      //label[ input.val() === '' ? 'removeClass' : 'addClass' ]('is-floating');
      label.velocity('stop').velocity({
        translateY: input.val() === '' ? '-50%' : '-150%',
        scale: input.val() === '' ? '1' : '.8'
      }, {duration: 100, easing: [0.4,0,0.2,1]});
      
    });
  }

});

$.fn.floatingLabel = function(){
  return this.each(function(){
    var 
      $this = $(this),
      data = $(this).data('floatingLabels');
      
    if (!data) {
      $this.data( 'floatingLabels', data = _.create(floatingLabels) );
      data.init( $this );
    }
  });
};

$(document).ready(function(){
  $('.floatingLabels').find('input').floatingLabel();
});

})(jQuery, this, this.document);