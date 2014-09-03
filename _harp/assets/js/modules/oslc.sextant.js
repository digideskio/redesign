//
// Heading-driven Table of Contents
//

;(function ($, window, document, undefined) {
'use strict';

var Sextant = _.create(OSLC, {
  els: {
    content: $('#content')
  },

  init: function() {
    
    // Bail if there are only a few headings
    if ( this.els.content.find('h1, h2, h3, h4, h5, h6').length < 4 ) { return; }
    
    this
      .insertMenu()
      .bindings();
  },
  
  insertMenu: function() {
    
    var titleWithTocToggle = _.template('<div class="flag reversed"><div class="body">${ title }</div><div class="image"><button id="sextant-toggler" class="sextant-toggler outlined"><i class="icon grunticon-sextant-menu"></i><span class="block text">Contents</span></button></div></div>', {
      title: $('#pagetitle').html()
    });

    $('#pagetitle').html( titleWithTocToggle );
    
    this.els.toggler = $('#sextant-toggler');
    
    this.els.toc = $('<div>').attr('id','table-of-contents')
      .addClass('menu dropdown hidden tensed toc')
      .html( this.generateMenuItems() )
      .prospectus( {isDropdown: {
        control: this.els.toggler[0]
      }} );
      
    return this;
  },

  generateMenuItems: function() {
    var
      slugs = [],
      dupes = {},
      headings = $('h1, h2, h3, h4, h5, h6', this.els.content),
      itemTemplate = '<a class="${ classes }" href="#${ id }">${ text }</a>';
      
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
        .append('<a class="back-to-top" href="#content">&#8679;Top</a>');
      
      return {
        text: text,
        id: this.id,
        classes: 'item ' + this.tagName.toLowerCase() + ($el.hasClass('godzilla') ? ' godzilla' : '')
      };
    }).toArray();
    
    return $('<div>').addClass('items')
      .html( _.reduce( data, this.templateFold(itemTemplate), '') );
  },
  
  bindings: function() {
    
    $(document).on('click.oslc.sextant', '#table-of-contents .item, .back-to-top', function() {
    
      var 
        isBackToTop = this.hash === '#content',
        target = $(this.hash),        
        duration = Math.abs( $(window).scrollTop() - target.offset().top ) / 18;
      
      if (duration < 250) {
        duration = 250;
      } else if ( duration > 2250 ) {
        duration = 2250;
      }
      
      ! isBackToTop && $(this).closest('[data-prospectus]').prospectus('close');

      target.velocity('scroll', {
        duration: duration,
        easing: [0.4,0,0.2,1],
        complete: function() { 
          ! isBackToTop && $.Velocity( this, 'callout.flash', 800 );
        }
      });
      
    });
    
  }
});

$(document).ready(function(){ Sextant.init(); });

}(jQuery, this, this.document));