// see: http://bl.ocks.org/mbostock/4063570

;(function ($, window, document, d3, undefined) {
'use strict';

var
  productName = $('#product-name').text(),
  providers = _.keys( _.groupBy( $('#providers').find('td a').toArray(), function(el){ return $(el).text(); }) ),
  consumers = _.keys( _.groupBy( $('#consumers').find('td a'), function(el){ return $(el).text() } ) ),
  thisNode = {
    'name': productName
  },
  links = [],
  providerNodes = [],
  consumerNodes = [],
  allNodes,
  svg,
  margins = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 720,
  height
;

_.each(providers, function(name){
  var node = {
    "name": name,
    children: [{name: productName}],
    'provider': true,
    x: 0,
    y: providerNodes.length * 30,
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

_.each(consumers, function(name){
  var node = {
    "name": name,
    parent: productName,
    'consumer': true,
    x: width,
    y: consumerNodes.length * 30,
  };
  
  links.push({
    source: thisNode,
    target: node
  });
  
  consumerNodes.push(node);

});

height = _.max([ consumers.length, providers.length ]) * 30;
thisNode.x = providers.length ? (width/2) : 0;
thisNode.y = (height+ margins.top + margins.bottom)/2;

allNodes = [].concat( providerNodes, thisNode, consumerNodes );

svg = d3.select('#compatibility-graphic-goes-here').append('svg')
  .attr('width', width+ margins.left+margins.right)
  .attr('height', height+margins.top+margins.bottom)
  .append('g')
    .attr("transform", "translate("+margins.top+","+margins.left+")");

svg.selectAll('.link')
  .data(links)
  .enter().append('path')
    .attr('class','link')
    .attr('d', d3.svg.diagonal())
    .style('stroke-dasharray', function(){ return this.getTotalLength(); })
    .style('stroke-dashoffset', function(){ return this.getTotalLength(); });
    
var 
  node = svg.selectAll('.node')
    .data(allNodes)
    .enter().append('g')
      .attr('class','node')
      .attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      
node.append('circle')
  .attr('r',4.5);
  
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

$('.link').velocity( 'animateStroke', {
  easing: 'ease-out-cubic',
  duration: 2000,
  delay: 1000,
  drag: true,
  stagger: 10
});


}(jQuery, this, this.document, d3));