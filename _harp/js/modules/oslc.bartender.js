;(function ($, window, document, undefined) {

var Bartender = _.create(OSLC, {
  name: 'Bartender',
  
  els: {
    menu: $('#bartender'),
    listing: $('#main').find('.listing').first()
  },
  
  state: {
    filter: "All",
    sort: 'order',
    direction: 'asc'
  },
  
  init: function(){
    this.constructMenu();
    
    // todo: allow default state to be overridden by GET in the url
    
    this.bindings();
    
    this.update();
  },
  
  update: function(){
    var 
      bartender = this,
      $cols = this.els.listing.find('[data-filter-on]');
    
    // --- Filter --- //
    
      // update the menu
      $(this.els.filterMenu.content).find('.item')
        .removeClass('current')
        .filter('[data-tagname="'+ this.state.filter +'"]')
        .addClass('current');
      
      // show the appropriate elements
      var filterSelector = '[data-filter-on~="'+ _.classify(this.state.filter) +'"]';
      var $show = $cols.filter(filterSelector).filter(':hidden');
      var $hide = $cols.not(filterSelector).filter(':visible'); 
    
      $hide.velocity({
          opacity: [0,1],
          transformOriginX: ['50%','50%'],
          transformOriginY: ['50%','50%'],
          transformOriginZ: [0,0],
          scaleX: 0.5,
          scaleY: 0.5,
          translateZ: 0      
        }, 
        {
          duration: 200,
          easing: 'easeOutCubic',
          complete: function(){ $(this).addClass('hidden'); }
        });

      $show.removeClass('hidden').velocity({
          opacity: [1,0],
          transformOriginX: ['50%','50%'],
          transformOriginY: ['50%','50%'],
          transformOriginZ: [0,0],
          scaleX: [ 1, 0.625 ],
          scaleY: [ 1, 0.625 ],
          translateZ: [0,0]
        }, 
        {
          duration:200,
          easing: 'easeOutCubic'
        });
        
      $('#filterBody').html( $('#filterBody').data('text') + ( bartender.state.filter === 'All' ? '' : ': <span id="activeFilter">'+bartender.state.filter+'</span>' ) );
      
    // --- Sort --- //
      
      // update the menu
      $(this.els.sortMenu.content).find('.item')
        .removeClass('current')
        .filter('[data-sort="'+this.state.sort+'"][data-order="'+this.state.direction+'"]')
        .addClass('current');
        
      // reorder
      $cols.tsort({data:this.state.sort, order: this.state.direction});
  },
  
  bindings: function(){
    var bartender = this;

    $(document)
      .on('click','[data-filter]', function(e){
        e.preventDefault();
      
        var $el = $(this);
      
        if ($el.hasClass('current')) {return;}
      
        bartender.state.filter = $el.data('tagname');
        bartender.update();
      })
      .on('click','[data-sort]', function(e){
        e.preventDefault();
        
        var $el = $(this);
        
        if ($el.hasClass('current')) {return;}
        
        bartender.state.sort = $el.data('sort');
        bartender.state.direction = $el.data('order');
        bartender.update();
      });

  },
  
  constructMenu: function(){
    _.each(this.els.menu.data('bartender').split(','), function(item){
      _.has(this, 'build_'+item) && this['build_' + item]();
    }, this);
  },
  
  build_filter: function(){
    var 
      menuItem = $( this.buildMenuItem('filter') ).appendTo(this.els.menu),
      dropContent = $('<div>').addClass('menu tensed'),
      tags = this.els.listing.find('.tag');
    
    // Set up data-filter-on on the .cards
    var cardCount = this.els.listing.find('.card')
      .closest('.column') // CORRECTION on the parent .column
      .attr('data-filter-on', function(){
        return _.reduce( $(this).find('.tag'), function(sum,el) { 
          return sum + ' ' + _.classify(_.trim( $(el).text()));
        }, "All" );
      }).length;
    
    var tagData = _(tags).groupBy('textContent') // groups the tags together by text label
      .map(function(arr){
        var el = arr[0], text = _.trim(el.textContent);
        
        return {
          count: arr.length,
          link: el.href || '#',
          html: el.innerHTML,
          classes: el.className,
          text: text,
          filter: _.classify(text)
        };
      })
      .value(); // break out of the _ chain

    // Tack on an "All" element
    tagData.push({
      count: cardCount,
      link: '#',
      html: 'All',
      text: 'All',
      filter: 'All',
      classes: ''
    });
    
    // Build the dropdown menu from the tags
    var menuItemIterator = this.templateFold('<a class="item" href="<%= link %>" data-count="<%= count %>" data-tagname="<%= text %>" data-filter="<%= filter %>"><span class="count"><%= count %> &times;</span> <span class="<%= classes %>"><%= html %></span></a>');
    
    dropContent
      .append(_.reduceRight(tagData, menuItemIterator, ''))
      .find('.item').tsort({data:'count', order: 'desc'},{data:'tagname'});
    
    // Initialize Drop for the menu item
    this.els.filterMenu = new Drop({
      target: menuItem[0],
      classes: 'drop-theme-oslc',
      content: dropContent[0],
      tetherOptions: {
        attachment: 'top left',
        targetAttachment: 'top left'
      }
    });
    
    this.els.filterMenu.on('open', function(){
      $(this.content).find('.current').velocity('callout.pulse', {duration: 400});
    });
    
  },
  
  build_sort: function(){
    var 
      menuItem = $( this.buildMenuItem('sort') ).appendTo( this.els.menu ), 
      sorters = [
        {
          text: "Newest",
          sort: 'date',
          order: 'desc',
          classes: ''
        },
        {
          text: "Oldest",
          sort: 'date',
          order: 'asc',
          classes: ''
        },
        {
          text: "Original Order",
          sort: 'order',
          order: 'asc',
          classes: 'current'
        }
      ],
      dropContent = $('<div>')
        .addClass('menu')
        .append( _.reduce(sorters,this.templateFold('<a class="item <%= classes %>" href="#" data-sort="<%= sort %>" data-order="<%= order %>"><%= text %></a>'),'') );
      
        
    // store the original order of the card columns
    this.els.listing.find('.column').each(function(){
      $(this).attr('data-order', $(this).index());
    });
    
    this.els.sortMenu = new Drop({
      target: menuItem[0],
      classes: 'drop-theme-oslc',
      content: dropContent[0],
      tetherOptions: {
        attachment: 'top left',
        targetAttachment: 'top left'
      }
    });
    
    this.els.sortMenu.on('open', function(){
      $(this.content).find('.current').velocity('callout.pulse', {duration: 400});
    });
  },
  
  buildMenuItem: function(name) {
    return _.template('<a href="#" data-has-drop="true" class="item hasFlagInline"><div class="flag"><div class="image"><i class="icon grunticon-menu-<%= name %>"></i></div><div class="body"><span id="<%= name %>Body" data-text="<%= capName %>"><%= capName %></span> &#9662;</div></div></a>', {'name': name, capName: _.capitalize(name)});
  }
});

Bartender.init();

})(jQuery, this, this.document);