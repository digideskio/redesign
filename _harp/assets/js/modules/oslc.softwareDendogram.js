// see: http://bl.ocks.org/mbostock/4063570

;(function ($, window, document, d3, undefined) {
'use strict';

var
  productName = $('#product-name').text(),
  providers = $('[data-compatible-provider]'),
  consumers = $('[data-compatible-consumer]'),
  thisNode = {
    name: productName,
    title: null
  },
  links = [],
  providerNodes = [],
  consumerNodes = [],
  compatibleNodes,
  allNodes,
  svg,
  margins = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 720,
  height
;

providers.each(function(){
  
  var 
    $el = $(this),
    node = {
      name: $el.text().trim(),
      children: [thisNode],
      title: $el.attr('data-dendogram-tooltip') || null,
      specifications: $el.data('specifications').split('||'),
      provider: true,
      x: 0,
      y: providerNodes.length * 40,
    };
    
  links.push({
    source: node,
    target: thisNode
  });
  
  providerNodes.push(node);

});

if ( ! providerNodes.length ) {
  width = width*2/3;
}

consumers.each(function(){
  var 
    $el = $(this),
    node = {
      name: $el.text().trim(),
      parent: thisNode,
      title: $el.attr('data-dendogram-tooltip') || null,
      specifications: $el.data('specifications').split('||'),
      consumer: true,
      x: width,
      y: consumerNodes.length * 40,
    };
  
  links.push({
    source: thisNode,
    target: node
  });
  
  consumerNodes.push(node);

});

height = (_.max([ consumers.length, providers.length ])-1) * 40;
thisNode.x = providers.length ? (width/2) : 0;
thisNode.y = (height+ margins.top + margins.bottom)/2;

allNodes = [].concat( providerNodes, thisNode, consumerNodes );

compatibleNodes = [].concat( providerNodes, consumerNodes );

var 
  uniqueSpecs = _.uniq(_.flatten(compatibleNodes,'specifications')),
  specClasses = _.reduce( uniqueSpecs.sort(), function(sum, spec, idx) {
    sum[spec] = 'spec-'+idx;
    return sum;
  }, {});

thisNode.specifications = uniqueSpecs;

svg = d3.select('#compatibility-graphic').append('svg')
  .attr('width', width+ margins.left+margins.right)
  .attr('height', height+margins.top+margins.bottom)
  .append('g')
    .attr("transform", "translate("+margins.top+","+margins.left+")");

svg.selectAll('.link')
  .data(links)
  .enter().append('path')
    .attr('class','link')
    .attr('d', d3.svg.diagonal());

// duplicate links that show directionality of connection
svg.selectAll('.link.directional')
  .data(links)
  .enter().append('path')
    .attr('class','link directional')
    .attr('d', d3.svg.diagonal())
    .style('stroke-dasharray', function(){ return this.getTotalLength(); });
    
var 
  node = svg.selectAll('.node')
    .data(allNodes)
    .enter().append('g')
      .attr('class','node')
      .attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      // insert the circles
      .each(function(d){
        var g = d3.select(this);

        _.forEach( d.specifications, function(spec,idx) {
          var circle = 
            g.append('circle')
              .attr('r', 5 + (3*idx))
              .attr('class', specClasses[spec] + (idx === 0 ? ' inner' : ''));
              
            // tooltip prep
            if (idx+1 === d.specifications.length) {
              circle
                .attr('title', function(d) { return d.title || null; });
            }
        });

      });
      

$('#compatibility-graphic-legend')
  .append( _.reduce( specClasses, function(sum, className, spec){
    return sum + '<li><div class="flag"><div class="image"><span class="legend-node '+className+'"></span></div><div class="body">Supports '+spec+'</div></div></li>';
  }, '') );

  
// activate tooltips
$('circle[title]').deepthroat({
  addTooltipIcon: false,
  addWrapperClass: false
});

node.append('text')
  .attr('dx', function(d) { return d.parent ? -8 : 8; })
  .attr('dy', 4)
  .style('text-anchor', function(d) { return d.parent ? 'end' : 'start' })
  .text(function(d) { return d.name })
  .each(function(d) {
    var bbox = this.getBBox();
    var g = d3.select(this).node().parentNode;
    var padding = 2;
    
    d3.select(g).insert('rect', 'text') // prepends it
      .attr('x', bbox.x - padding)
      .attr('y', bbox.y - padding)
      .attr('width', bbox.width + padding*2)
      .attr('height', bbox.height + padding*2)
  });

// see: http://css-tricks.com/svg-line-animation-works/
$.Velocity.RegisterUI( 'animateStroke', {
  defaultDuration: 2000,
  calls: [
    [{ 'stroke-dashoffset' : 0 }]
  ]
});

var animateStroke = function(){
  $('.link.directional').velocity( 'animateStroke', {
    begin: function(){
      d3.selectAll('.link.directional')
        .style('stroke-dashoffset', function(){ return this.getTotalLength(); });
    },
    easing: 'ease-out-cubic',
    duration: 2000,
    drag: true,
    stagger: 20,
    complete: function(){
      setTimeout( animateStroke, 2000 );
    }
  });
}

setTimeout(animateStroke, 2000)

}(jQuery, this, this.document, d3));