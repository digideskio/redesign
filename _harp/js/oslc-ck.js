window.site_url=window.site_url||"/";if("querySelector"in document&&"localStorage"in window&&"addEventListener"in window){window.console||(window.console={log:function(){}});var OSLC={init:function(){$(document).on("click","[data-toggle-class]",function(){var e=$(this),t=e.attr("data-toggle-class"),n=e.attr("data-toggle-target");n&&$(n).toggleClass(t)});this.makeFluidVideos()},makeFluidVideos:function(){var e=_.template('<div class="fluid-video" <%= style %> ><%= video %></div>');$('iframe[src*="youtube"], iframe[src*="vimeo"]').not(".no-resize").each(function(t,n){n.outerHTML=e({style:'style="padding-bottom: '+n.height/n.width*100+'%;"',video:n.outerHTML})})}};Modernizr.load({load:window.site_url+"js/libraries.js",complete:function(){_.bind(OSLC.init,OSLC)()}})};