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
  
  openClass:  'nav-is-open',
  
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
    
    this.bindings();
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
      deferSetup: true,
      match: function(){
        sextant.moves = {
          main: {
            props: { 
              translateY: sextant.els.nav.height(), 
              translateX: 0
            }
          },
          nav: {
            props: {translateX: 0},
            options: {duration: 100}
          }
        };
        
        sextant.isOpen() && sextant._doAnimations();
      }
    })
    .register(this.mediaQueries['knee-only'], {
      deferSetup: true,
      match: function(){
        sextant.moves = {
          main: {
            props: {
              translateY: 0,
              translateX: sextant.els.nav.width()
            }
          },
          nav: {
            props: { translateX: '100%' },
            options: {'delay': 125}
          }
        };

        sextant.isOpen() && sextant._doAnimations();
      }
    })
    .register(this.mediaQueries['desk-up'], {
      deferSetup: true,
      match: function(){
        // just close it
        sextant.isOpen() && sextant.close();
      }
    });
    
  },

  open: function() { this.toggle('open'); },
  
  close: function() { this.toggle('close'); },
  
  toggle: function(dir) {
  
    dir = dir || (this.isOpen() ? 'close' : 'open');
    var open = dir === 'open';

    console.log( dir );
    
    $(window).trigger(dir + '.oslc.sextant');
    
    this.els.allToggled[ open ? 'addClass' : 'removeClass' ]( this.openClass );
    
    this._doAnimations(open);
    
    this.els.close.velocity('fade' + (open ? 'In' : 'Out'), 250);

  },
  
  _doAnimations: function(open) {
    open = _.isUndefined(open) ? true : open;
    
    _.forEach( this.moves,function(val,el){
      var options = _.assign({
        easing: 'easeOutCubic',
        duration: 225
      }, val.options);
      
      this.els[el].velocity(
        open ? val.props : {translateX: 0, translateY: 0}, 
        open ? options : $.extend({},options,{delay:false})
      );
    }, this);

  }
});

// Tack a reference to the global OSLC object
OSLC.modules.sextant = Sextant;

$(document).ready(function(){ Sextant.init(); });

}(jQuery, this, this.document));