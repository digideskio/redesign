;(function ($, window, document, undefined) {
'use strict';

var bartenderID = 0;

var Bartender = _.create(OSLC, {
  name: 'Bartender',
  defaultStates: {
    filter: {
      on: 'All',
      label: 'All'
    },
    sort: {
      on: 'order',
      direction: 'asc',
      label: 'Original order'
    }
  },
  
  bartenderItemTemplate: _.template(
  '<a href="#" class="item hasFlagInline" id="bartender-<%= id %>-<%= name %>-control" '+
    'aria-haspopup="true" '+
    'aria-owns="bartender-<%= id %>-<%= name %>-dropdown" '+
    'aria-controls="bartender-<%= id %>-<%= name %>-dropdown">' +
    '<div class="flag">' +
      '<div class="image"><i class="icon grunticon-menu-<%= name %>"></i></div>'+
      '<div class="body">'+
        '<span id="bartender-<%= id %>-<%= name %>-label" data-text="<%= _.capitalize(name) %>"><%= _.capitalize(name) %></span> &#9662;'+
      '</div>'+
    '</div>'+
  '</a>'),
  
  init: function(el){
    
    bartenderID++;
    this.id = bartenderID;
    
    this.els = {
      menu: $(el),
      listing: $('#main').find('.listing').first()
    };
    
    this.constructMenu();
    
    // todo: allow default state to be overridden by GET in the url
    this.bindings();
    this.update();
  },
  
  update: function(){
    var 
      bartender = this,
      $targets = this.els.listing.find('[data-filter-target]'),
      $matches,
      velocityDefaults = { duration: 250, drag: true };
    
    // update the menus
    _.forEach(this.state, function(val,key){
      $(bartender.drops[key].content).find('.item')
        .removeClass('current')
        .filter('[data-label="'+val.label+'"]')
        .addClass('current');
      
      var labelId = '#bartender-'+bartender.id+'-'+key+'-label';

      $(labelId).html(
        $(labelId).data('text') + 
        (_.contains( ['All','Original order'], val.label ) ? '' : ': <span class="activeFilter">'+val.label+'</span>' )
      );
    });

    // --- Filters --- //
    $matches = $targets.filter(function(){
      var $el = $(this);
      return _(bartender.state)
        .omit('sort')
        .mapValues('on')
        .every(function(val,key){ 
          // if this is ever false, the whole statement is false
          return $el.is('[data-filter-'+key+'~="'+val+'"]');
        });
    });
    
    // hide
    $targets.not($matches).filter(':visible').velocity('transition.expandOut', 
      _.defaults(
        {complete: function(){ $(this).addClass('hidden'); }},
        velocityDefaults
      ));

    $matches.filter(':hidden').removeClass('hidden').velocity('transition.expandIn', 
      velocityDefaults);

    // --- Sort --- //
    this.state.sort && $targets.tsort({data:this.state.sort.on, order: this.state.sort.direction});
  },
  
  bindings: function(){
    var bartender = this;

    $(document).on('click','[data-update]', function(e){
        e.preventDefault();
      
        var $el = $(this), data = $el.data();
      
        if ($el.hasClass('current')) {return;}
      
        bartender.state[data.update] = _.omit(data,'update');
        bartender.update();
    });
  },
  
  constructMenu: function(){
    this.state = {};
    this.drops = {};
    this.els.cards = this.els.listing.find('.card').closest('.column');
    
    var controls = this.els.menu.data('controls');
    
    if ( ! controls) {
      console.log('No controls specified for Bartender. Bailing.');
      return;
    }
    
    _.forEach(controls.split(','), this.buildControl, this);
    
    $.fn.prospectus && this.els.menu.prospectus();
  },
  
  buildControl: function(control) {
    var 
      cards = this.els.cards,
      $bartenderItem,
      dropdownItems = this.listFilterMenuItems(control);
    
    if ( dropdownItems.length < 2 ) {
      console.log('Control for ',control,' did not have enough items. Bailing.');
      return;
    }
    
    // Add the main menu item
    $bartenderItem = $( this.bartenderItemTemplate({name:control,id:this.id}) ).appendTo(this.els.menu);
    
    // Set up default state for the control.
    // "sort" has a special one; otherwise, copy defaultStates.filter
    this.state[control] = this.defaultStates[control] || this.defaultStates.filter;
    
    // Set up the cards to be sortable/filterable
    if (control === 'sort') {
      cards.attr('data-order', function(){ return $(this).index(); });
    } else {
      cards
        .attr('data-filter-target','true')
        .attr('data-filter-'+control, function(){
          return _.reduce( $(this).find('[data-filter-on="'+control+'"]'), function(sum,el){
            return sum + ' ' + _.classify( _.trim($(el).text()));
          }, 'All');
        });
    }
    
    $bartenderItem.data('drop',this.drops[control] = new Drop({
      target: $bartenderItem[0],
      classes: 'drop-theme-oslc',
      toggleBodyClass: false,
      tetherOptions: {
        attachment: 'top left',
        targetAttachment: 'top left',
        optimizations: {
          moveElement: false
        },
        constraints: [{
          to: 'scrollParent',
          attachment: 'together',
          pin: ['right']
        }]
      }
    }));
    
    // Builds the menu items, activates Prospectus and inserts them into the appropriate Drop
    this.buildDropMenu(control, dropdownItems);
    
    this.drops[control].on('open', function(){
      //$(this.content).find('.current').velocity('callout.pulse', {duration: 400});
      var prospectus = $(this.content).find('.menu')
        .attr({'aria-hidden':'false','aria-expanded':'true'})
        .data('prospectus');
      
      prospectus && prospectus.focus();
    });
    
    this.drops[control].on('close', function(){
      $(this.content).find('.menu').attr({'aria-hidden':'true','aria-expanded':'false'});
    });

  },
  
  listFilterMenuItems: function(control) {
    var items = [];
    if (control === 'sort') {
      items = [
        [{on:'date',direction:'desc'}, 'Newest'],
        [{on:'date',direction:'asc'}, 'Oldest'],
        [{on:'order',direction:'asc'}, 'Original order'] 
      ];
    } else {
      items = _(this.els.listing.find('[data-filter-on="'+control+'"]'))
        .groupBy(function(item){ return _.trim($(item).text()); })
        .map(function(arr,key){
          var el = arr[0], text = _.trim(key);
          
          return [
            {
              count: arr.length,
              label: text,
              on: _.classify(text)
            },
            el.innerHTML,
            el.href,
            el.className              
          ];
        }).value();

      // Add an "All" object
      items.push( [{count: this.els.cards.length, on: 'All'}, 'All'] );
    }
    return items;
  },
  
  buildDropMenu: function(control,items){
    var 
      drop = this.drops[control],
      menu = $('<div>').addClass('menu tensed')
        .attr({
          'aria-expanded':'false',
          'aria-hidden':'true',
          'data-focusable':'false',
          'aria-labelledby': 'bartender-'+this.id+'-'+control+'-control',
          'id': 'bartender-'+this.id+'-'+control+'-dropdown'
      }),
      itemTemplateFold = this.templateFold('<a class="item" href="<%= href %>" ' + 
        'data-update="'+control+'" ' +
        '<% _.each(data, function(val,key) { %>data-<%= key %>="<%= val %>" <% }); %>>' +
        //'<% if (data.count) { %><span class="count"><%= data.count %> &times;</span> <% } %>' +
        '<span class="<%= classes %>"><%= html %></span></a>'),
      zipToItemObj = function(arr) {
        var keys = ['data', 'html', 'href', 'classes'],
            temp = _.defaults( 
              _.zipObject( keys, arr ),
              _.zipObject( keys, [{},'Label not found','#',''] ) // <-- defaults
            );
        if ( ! temp.data.label ) { temp.data.label = temp.html; }
        return temp;
      },
      // http://www.nczonline.net/blog/2013/04/01/making-accessible-icon-buttons/
      close = $('<button type="button" tabindex="-1" class="close"><span class="sr-only">Close</span><i class="icon grunticon-js-close"></i></button>').data('dismiss',drop);
            
      menu.html( _.reduce(items.map(zipToItemObj),itemTemplateFold,'') );
      
      // Sort on item count for filter dropdowns
      if ( control !== 'sort' ) {
        menu.find('.item').tsort({data:'count',order:'desc'},{data:'label'});
      }
      
      $.fn.prospectus && menu.prospectus();

      $(drop.content).html(menu).append(close);
        
      drop.position();
  }
});

OSLC.modules.bartender = Bartender;

$(document).ready(function(){ 
  $('[data-bartender]').each(function(){
    $(this)
      .data('bartender', _.create(Bartender))
      .data('bartender').init(this);
  });
});

})(jQuery, this, this.document);