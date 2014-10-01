// see: http://bl.ocks.org/mbostock/4063570
// @codekit-prepend "../lib/d3.min.js";

;(function ($, window, document, d3, undefined) {
'use strict';

$(document).ready(function(){

var
  nodeVSpacing = 30,
  productName = $('#product-name').text(),
  providers = $('[data-compatible-provider]'),
  consumers = $('[data-compatible-consumer]'),
  productNode = {
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
  height;

providers.each(function(){
  var 
    $el = $(this),
    node = {
      name: $el.text().trim(),
      children: [productNode],
      title: $el.attr('data-dendogram-tooltip') || null,
      specifications: $el.data('specifications').split('||'),
      provider: true,
      x: 0,
      y: providerNodes.length * nodeVSpacing,
    };
    
  links.push({
    source: node,
    target: productNode
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
      parent: productNode,
      title: $el.attr('data-dendogram-tooltip') || null,
      specifications: $el.data('specifications').split('||'),
      consumer: true,
      x: width,
      y: consumerNodes.length * nodeVSpacing,
    };
  
  links.push({
    source: productNode,
    target: node
  });
  
  consumerNodes.push(node);

});

height = (_.max([ consumers.length, providers.length ])-1) * nodeVSpacing;
productNode.x = providers.length ? (width/2) : 0;
productNode.y = (height+ margins.top + margins.bottom)/2;

allNodes = [].concat( providerNodes, productNode, consumerNodes );

compatibleNodes = [].concat( providerNodes, consumerNodes );

var 
  uniqueSpecs = _.uniq(_.flatten(compatibleNodes,'specifications')),
  specClasses = _.reduce( uniqueSpecs.sort(), function(sum, spec, idx) {
    sum[spec] = 'spec-'+idx;
    return sum;
  }, {});

productNode.specifications = uniqueSpecs;

svg = d3.select('#compatibility-graphic').append('svg')
  .attr('width', width+ margins.left+margins.right)
  .attr('height', height+margins.top+margins.bottom)
  .append('g')
    .attr("transform", "translate("+margins.top+","+margins.left+")");

svg.selectAll('.node-link')
  .data(links)
  .enter().append('path')
    .attr('class','node-link')
    .attr('d', d3.svg.diagonal());

// duplicate links that show directionality of connection
svg.selectAll('.node-link.directional')
  .data(links)
  .enter().append('path')
    .attr('class','node-link directional')
    .attr('d', d3.svg.diagonal())
    .style('stroke-dasharray', function(){ return this.getTotalLength(); });
    
var 
  node = svg.selectAll('.node')
    .data(allNodes)
    .enter().append('g')
      .attr('class','node')
      .attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr('title', function(d){ return d.title || null; })
      // insert the circles
      .each(function(d){
        var g = d3.select(this);

        _.forEach( d.specifications, function(spec,idx) {
          g.append('circle')
            .attr('r', 5)
            .attr( 'cx',  idx*(d.parent ? -6 : 6) )
            .attr('class', specClasses[spec]);              
        });

      });
      

$('#compatibility-graphic-legend')
  .append( _.reduce( specClasses, function(sum, className, spec){
    return sum + '<li><div class="flag"><div class="image"><span class="legend-node '+className+'"></span></div><div class="body">Supports '+spec+'</div></div></li>';
  }, '') );

  
// activate tooltips
$('.node[title]').deepthroat({
  addTooltipIcon: false,
  addWrapperClass: false
});

node.append('text')
  .attr('dx', function(d) { return (8 + (6 * (d.specifications.length-1))) * (d.parent ? -1 : 1); })
  .attr('dy', 4)
  .style('text-anchor', function(d) { return d.parent ? 'end' : 'start'; })
  .text(function(d) { return d.name; })
  .each(function() {
    var bbox = this.getBBox();
    var g = d3.select(this).node().parentNode;
    var padding = 2;
    
    d3.select(g).insert('rect', 'text') // prepends it
      .attr('x', bbox.x - padding)
      .attr('y', bbox.y - padding)
      .attr('width', bbox.width + padding*2)
      .attr('height', bbox.height + padding*2);
  });

// see: http://css-tricks.com/svg-line-animation-works/
$.Velocity.RegisterUI( 'animateStroke', {
  defaultDuration: 2000,
  calls: [
    [{ 'stroke-dashoffset' : 0 }]
  ]
});

var animateStroke = function(){
  // only do this if the SVG is visible
  if ( $('#compatibility-graphic').is(':visible') ) {
  
    $('.node-link.directional').velocity( 'animateStroke', {
      begin: function(){
        d3.selectAll('.node-link.directional')
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
  
  } else {
    // otherwise check again in a while
    setTimeout( animateStroke, 5000 );
  }
};

setTimeout(animateStroke, 2000);

});

}(jQuery, this, this.document, d3));