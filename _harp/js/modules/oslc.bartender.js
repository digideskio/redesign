;(function ($, window, document, undefined) {

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
  
  bartenderItemTemplate: _.template('<a href="#" class="item hasFlagInline"><div class="flag"><div class="image"><i class="icon grunticon-menu-<%= name %>"></i></div><div class="body"><span id="<%= name %>Body" data-text="<%= _.capitalize(name) %>"><%= _.capitalize(name) %></span> &#9662;</div></div></a>'),
  
  init: function( el ){
    
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
      velocityDefaults = { duration: 200, easing: 'easeOutCubic' };
    
    // update the menus
    _.forEach(this.state, function(val,key){
      $(bartender.drops[key].content).find('.item')
        .removeClass('current')
        .filter('[data-label="'+val.label+'"]')
        .addClass('current');
        
      $('#'+key+'Body').html(
        $('#'+key+'Body').data('text') + 
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
    $targets.not($matches).filter(':visible').velocity({
        opacity: [0,1],
        transformOriginX: ['50%','50%'],
        transformOriginY: ['50%','50%'],
        transformOriginZ: [0,0],
        scaleX: 0.5,
        scaleY: 0.5,
        translateZ: 0      
      }, 
      _.defaults(
        {complete: function(){ $(this).addClass('hidden'); }},
        velocityDefaults
      ));

    $matches.filter(':hidden').removeClass('hidden').velocity({
        opacity: [1,0],
        transformOriginX: ['50%','50%'],
        transformOriginY: ['50%','50%'],
        transformOriginZ: [0,0],
        scaleX: [ 1, 0.625 ],
        scaleY: [ 1, 0.625 ],
        translateZ: [0,0]
      }, 
      velocityDefaults);

    // --- Sort --- //      
    $targets.tsort({data:this.state.sort.on, order: this.state.sort.direction});
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
    $bartenderItem = $( this.bartenderItemTemplate({name:control}) ).appendTo(this.els.menu);
    
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

    
    this.drops[control] = new Drop({
      target: $bartenderItem[0],
      classes: 'drop-theme-oslc',
      toggleBodyClass: false,
      tetherOptions: {
        attachment: 'top left',
        targetAttachment: 'top left',
        optimizations: {
          moveElement: false
        }
      }
    });
    
    this.buildDropMenu(control, dropdownItems);
    
    this.drops[control].on('open', function(){
      $(this.content).find('.current').velocity('callout.pulse', {duration: 400});
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
        .groupBy('textContent')
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
      menu = $('<div>').addClass('menu tensed'),
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
      };
      
      menu.html( _.reduce(items.map(zipToItemObj),itemTemplateFold,'') );
      
      // Sort on item count for filter dropdowns
      if ( control !== 'sort' ) {
        menu.find('.item').tsort({data:'count',order:'desc'},{data:'label'});
      }

      $(this.drops[control].content).html(menu);
      this.drops[control].position();
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