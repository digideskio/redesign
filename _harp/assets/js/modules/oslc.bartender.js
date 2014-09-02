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
  '<a href="#" class="item hasFlagInline" id="bartender-${ id }-${ name }-control">'+
    '<div class="flag">' +
      '<div class="image"><i class="icon grunticon-menu-${ name }"></i></div>'+
      '<div class="body">'+
        '<span id="bartender-${ id }-${ name }-label" data-text="${ _.capitalize(name) }">${ _.capitalize(name) }</span> &#9662;'+
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
      $(bartender.dropdowns[key]).find('.item')
        .removeClass('current')
        .filter('[data-label="'+val.label+'"]')
        .addClass('current');
      
      var $control = $('#bartender-'+bartender.id+'-'+key+'-control');

      if ( _.contains( ['All','Original order'], val.label ) ) {
        $control.find('.activeFilter').remove();
      } else {
        $control.append( _.template('<button class="activeFilter" ${ update } ${ data }><div class="flag"><div class="image">${ icon }</div><div class="body">${ label }</div></button>', {
          icon: '<i class="icon grunticon-menu-remove-filter"><span class="sr-only">Remove filter: </span></i>',
          label: val.label,
          update: 'data-update="'+key+'"',
          data: _.reduce( bartender.defaultStates[key==='sort' ? 'sort' : 'filter'], function(sum, val, key) {return sum + ' data-'+key+'="'+val+'"';},'')
        }) 
        );
      }

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

    $(document).on('click.oslc.bartender touchend.oslc.bartender','[data-update]', function(e){
        e.preventDefault();
      
        var $el = $(this), data = $el.data();
        
        $el.hasClass('activeFilter') && e.stopPropagation();
      
        if ($el.hasClass('current')) {return;}
      
        bartender.state[data.update] = _.omit(data,'update');
        bartender.update();
        
        ! $el.hasClass('activeFilter') && $el.closest('[data-prospectus]').prospectus('close');
    });
  },
  
  constructMenu: function(){
    this.state = {};
    this.dropdowns = {};
    this.menuItems = {};
    this.els.cards = this.els.listing.find('.card').closest('.column');
    
    var controls = this.els.menu.data('controls');
    
    if ( ! controls) {
      console.log('No controls specified for Bartender. Bailing.');
      return;
    }
    
    _.forEach(controls.split(','), this.buildControl, this);
    
    this.els.menu.prospectus();
  },
  
  buildControl: function(control) {
    var 
      cards = this.els.cards,
      $bartenderItem,
      dropdownItems = this.getMenuItems(control,true);
    
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
    
    this.dropdowns[control] = this.buildDropdownMenu(control);
  
    this.dropdowns[control].prospectus({
      isDropdown: {
        control: $bartenderItem[0]
      }
    });

  },
  
  getMenuItems: function(control,cache) {
    var 
      items = [],
      zipToItemObj = function(arr) {
        var keys = ['data', 'html', 'href', 'classes'],
            temp = _.defaults( 
              _.zipObject( keys, arr ),
              _.zipObject( keys, [{},'Label not found','#',''] ) // <-- defaults
            );
        if ( ! temp.data.label ) { temp.data.label = temp.html; }
        return temp;
      };

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
    
    items = _.map(items,zipToItemObj);
    
    if (cache) { this.menuItems[control] = items; }
    
    return items;  
  },
  
  buildDropdownMenu: function(control) {
    var 
      menu = $('<div class="items">'),
      itemTemplate = '<a class="item" href="${ href }" ' + 
        'data-update="'+control+'" ' +
        '<% _.each(data, function(val,key) { %>data-${ key }="${ val }" <% }); %>>' +
        //'<% if (data.count) { %><span class="count">${ data.count } &times;</span> <% } %>' +
        '<span class="${ classes }">${ html }</span></a>';
        
    menu.html( _.reduce(this.menuItems[control], this.templateFold(itemTemplate),'') );
    
    // Sort on item count for filter dropdowns
    if ( control !== 'sort' ) {
      menu.find('.item').tsort({data:'count',order:'desc'},{data:'label'});
    }
    
    return $('<div>').addClass('hidden dropdown menu tensed')
      .attr( 'id','bartender-'+this.id+'-'+control+'-dropdown' )
      .append(menu);
      
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