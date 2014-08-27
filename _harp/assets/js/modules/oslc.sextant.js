// 
// OSLC Primary Navigation Scripts
// 

;(function ($, window, document, undefined) {
'use strict';

var Sextant = _.create( OSLC, {
  name: "Sextant",
  els: {
   nav: $('#nav'),
   main: $('#main'),
   toggle: $('#navToggle'),
   close: $('.close-nav'),
   allToggled: $('#nav,#main,#navToggle,.close-nav')
  },
  
  moves: [],
  
  openClass: 'nav-is-open',
  
  isOpen: function() {
    return this.els.main.hasClass( this.openClass );
  },
  
  init: function() {
    console.log('Initializing Sextant global navigation');
  
    // In markup order, #nav comes after #main 
    // This doesn't make much of a difference for most layouts
    // as #nav gets positioned absolutely
    // but for mobile (slide-down) it matters
    this.els.nav.insertBefore(this.els.main);

    this.toggleVisibility('close');
    
    // insert "close" menu icon and wrapping element to contain them
    this.els.toggle.find('.icon').wrap('<span class="js-icon-swapper"></span>')
      .parent() // the wrapper
      .append('<i class="icon grunticon-navtoggle-close"></i>');
    
    this.bindings();
  },
  
  toggleVisibility: function(dir) {
    var large = matchMedia( this.mediaQueries['desk-up'] ).matches;

    // Only want the menu invisible IF we call 'close' explicitly
    // AND we're on a small screen. With Large, the menu is always visible
    if ( dir === 'close' && ! large ) {
      this.els.nav.addClass('invisible');
    } else {
      this.els.nav.removeClass('invisible');
    }
    
    return this;
  },
  
  bindings: function() {
    
    var 
      sextant = this;
    
    this.els.toggle
      .add( this.els.close )
      .on('click.oslc.sextant touchend.oslc.sextant', function(e){
        e.preventDefault();
        sextant.toggle();
      });
    
    enquire.register(this.mediaQueries['hand-only'], {
      match: function(){
        sextant.moves = {
          main: {
            props: { 
              translateY: sextant.els.nav.height(), 
              translateX: 0,
              translateZ: 0
            }
          },
          nav: {
            props: {
              translateX: 0, 
              translateZ: 0
            },
            options: {duration: 100}
          }
        };
        
        sextant.isOpen() && sextant._doAnimations();
      }
    })
    .register(this.mediaQueries['knee-only'], {
      match: function(){
        sextant.moves = {
          main: {
            props: {
              translateY: 0,
              translateX: sextant.els.nav.width(),
              translateZ: 0,
            }
          },
          nav: {
            props: { 
              translateX: '100%',
              translateZ: 0
            },
            options: {'delay': 125}
          }
        };

        sextant.isOpen() && sextant._doAnimations();
      }
    })
    .register(this.mediaQueries['desk-up'], {
      match: function(){
        sextant.close();
      },
      unmatch: function(){
        // the whole menu system should be closed,
        // but the menu was visible
        // so now we need to make sure you can't tab into it
        sextant.toggleVisibility('close');
      }
    });
    
  },

  open: function() { this.toggle('open'); },
  
  close: function() { this.toggle('close'); },
  
  toggle: function(dir) {
  
    dir = dir || (this.isOpen() ? 'close' : 'open');
    var 
      open = dir === 'open',
      sextant = this;

    $(window).trigger(dir + '.oslc.sextant');
    
    this.els.allToggled[ open ? 'addClass' : 'removeClass' ]( this.openClass );
    
    this.els.toggle
      .find( '.icon' )[ open ? 'first' : 'last' ]()
      .velocity({ scale: 0.3, opacity: 0 }, 120, 'easeOutCubic', function(){ 
          sextant.els.toggle.find( '.icon' )[ open ? 'last' : 'first' ]()
            .velocity( { scale: [1, 0.3], opacity: 1 }, 180, 'spring' );
        }
      );
    
    this
      .toggleVisibility('open')
      ._doAnimations(dir)
      .els
        .close.velocity('fade' + (open ? 'In' : 'Out'), 240);
    
  },
  
  _doAnimations: function(dir) {
    var open = (dir || 'open') === 'open';
    
    var sextant = this;
    
    _.forEach( this.moves, function(val,el){
      var options = _.assign({
        easing: 'easeOutCubic',
        duration: 225
      }, val.options);
      
      if (open) {
        this.els[el].velocity(val.props, options);
      } else {
        this.els[el].velocity({
            translateX: 0, 
            translateY: 0
          },
          $.extend({},options,{
            delay: false,
            complete: function() { 
              sextant.toggleVisibility('close');
            }
          })
        );
      }
      
    }, sextant);
    
    return this;
  }
});

// Tack a reference to the global OSLC object
OSLC.modules.sextant = Sextant;

$(document).ready(function(){ Sextant.init(); });

}(jQuery, this, this.document));