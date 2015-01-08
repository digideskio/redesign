//
// Heading-driven Table of Contents
//

;(function ($, window, document, undefined) {
'use strict';

var Sextant = _.create(OSLC, {

  init: function() {
    
    this.els = {
      content: $('[data-sextant]')
    };
        
    // Bail if there are only a few headings
    if ( this.els.content.find('h1, h2, h3, h4, h5, h6').length < 4 ) { return; }
    
    this.insertMenu();

  },
  
  insertMenu: function() {
  
    var titleWithTocToggle = _.template('<div class="strip reversed"><div class="body">${ title }</div><a href="#" id="toc-button" class="toggle sextant-toggler"><i class="icon grunticon-sextant-menu"></i><span class="block text">Contents</span></a></div>', {
      title: $('#pagetitle').html()
    });

    $('#pagetitle').html( titleWithTocToggle );
    
    this.els.toggler = $('#toc-button');
    
    this.els.toc = $('<div>').attr('id','table-of-contents')
      .addClass('menu dropdown hidden tensed toc')
      .html( this.generateMenuItems() )
      .prospectus( {
        isDropdown: {
          control: this.els.toggler[0]
        },
        transitionIn: 'transition.slideRightBigIn',
        transitionOut: 'transition.slideRightBigOut'
      });
      
    return this;
  },

  generateMenuItems: function() {
    var
      slugs = [],
      dupes = {},
      headings = $('h1, h2, h3, h4, h5, h6', this.els.content),
      itemTemplate = '<a data-scroll-to="flash" data-close="closest:[data-prospectus]:prospectus" class="${ classes }" href="#${ id }">${ text }</a>';
      
    var data = headings.map(function(){

      var 
        $el = $(this),
        text = $el.text(),
        slug = _.trim( _.prune(text, 40) ).toLowerCase().replace(/[^a-z0-9 -]/g,'').replace(/\s+/g, '-');
      
      // uniquify, if needed
      if ( _.indexOf(slugs, slug) > -1 ) {
        dupes[slug] = _.has(dupes, slug) ? ++dupes[slug] : 1;
        slug = 'oslc-id-' + dupes[slug] + '-' + slug;
      }
      slugs.push(slug);
      
      // Existing ID or slugify
      $el
        .attr('id', this.id || slug)
        .addClass('js-in-sextant')
        .append(function(){
          // only do this for .copy headers
          if ( ! $(this).closest('.copy').length ) { return; } 
          
          return '<a class="back-to-top" data-scroll-to="true" href="#toc-button"><i class="icon grunticon-sextant-backToTop"></i>Top</a>';
        });
      
      return {
        text: text,
        id: this.id,
        classes: 'item ' + this.tagName.toLowerCase() + ($el.hasClass('godzilla') ? ' godzilla' : '')
      };
    }).toArray();
    
    return $('<div>').addClass('items')
      .html( _.reduce( data, this.templateFold(itemTemplate), '') );
  }
  
});

$(document).ready(function(){ Sextant.init(); });
 
}(jQuery, this, this.document));