//
// FLUID VIDEOS
// 
// Wraps youtube/vimeo iframes in a div.fluid-video class
// 

$(function(){

  var fluidVidTemplate = _.template('<div class="fluid-video" <%= style %> ><%= video %></div>');
  
  $('iframe[src*="youtube"], iframe[src*="vimeo"]')
    .not('.no-resize')
    .each( function(i, vid) {

      // Replace the videos HTML with the new template
      vid.outerHTML = fluidVidTemplate( {
        style: 'style="padding-bottom: ' + ( vid.height / vid.width * 100 ) + '%;"',
        video: vid.outerHTML
      } );

    });

});