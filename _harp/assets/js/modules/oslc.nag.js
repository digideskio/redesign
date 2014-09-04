;(function ($, window, document, undefined) {
'use strict';

var messageTemplate = _.template('<div role="alert" class="message closeable ${ level }"><% if (title) { %><strong>${ title }</strong>:<% } %> ${html} <button class="close"><i class="icon grunticon-nag-close"></i> <span class="sr-only">Close</span></button></div>');

var addMessage = function( html, title, level ) {
    
  var 
    $messages = $('#messages'),
    $message = $( messageTemplate({ 
      html: html || 'No content, bruh?', 
      title: title || '', 
      level: level || '' 
    }) );
    
  $messages = $messages.length ? $messages : $('<div id="messages">').addClass('messages').appendTo('body');
          
  $messages.append( $message );

  
  $message
    .find('.close') // Make it closeable via the API for Brenda
      .data('dismiss', { 
        close: function(){
          $message.velocity('transition.flipBounceYOut', {
            duration: 720,
            complete: function(){
              $(this).remove();
            }
          });
        }
      })
    .end() // back to $message
    .velocity('transition.flipBounceYIn', { duration: 720 });

  return this;
};
  
// expose it
OSLC.addMessage = addMessage;

}(jQuery, this, this.document));