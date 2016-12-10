---
title: "D3 v4 General Update Pattern: Punchcard Chart Example"
layout: page
date: 2016-05-08
teaser: "Demoing a few D3 v4 features via a punchcard chart."
header: no
comments: true
tags:
    - Javascript
    - D3JS
---

### Introduction
One of the last projects I worked on while at [Stamen Design](1) involved (non-geographic) data exploration for a client using [D3JS](2), which gave me a chance to explore more of the v4 API of D3. If you haven't heard of D3JS, it's a very powerful javascript library that allows for precise and elegant control over creating interactive data visualizations on the web. The "D3" part stands for "Data Driven Documents", referring to its ability to bind data to HTML DOM elements, most frequently SVG elements, or through manipulating the HTML Canvas element, and then styling and animating said elements computationally. I would encourage you to take a look at the [examples on the D3 homepage](3), as there are a ton of really neat things to check out!

In this blog post I thought I'd reveal some of the key differences I've noticed between v3 and v4 as well as demonstrate the [d3 general update pattern](http://bl.ocks.org/mbostock/3808218) through creating a updatable Punchcard chart. Starting with Kai Chang's [static barley punchcard block](4), I'll show how to add D3 v4's general update pattern while throwing in some animations, and other goodies. If you're unfamiliar with them, **Blocks** are the D3 community's main method of sharing code examples, and there is even a site called [Blockbuilder.org](5) which works similar to Codepen and JSFiddle. Blocks is a system originally developed by the creator of D3, Mike Bostock, to demonstrate D3 features and concepts. Because Blocks are built on top of Github Gists, each Block is version controlled, another nice feature of them.

I won't walk through how to set up the punchcard chart from scratch, so if you're brand new to D3 I would recommend starting with some of the basics, like [let's make a bar chart](https://bost.ocks.org/mike/bar/) and learning how [d3 selections work](https://bost.ocks.org/mike/selection/).


### Static Barley Punchcard Chart
Here's what the Barley Punchcard Chart currently looks like:

![static d3 barley punchcard chart]({{site.urlimg}}barley-punchcard-static.png)

The one we'll be making won't look terribly different from this. We'll be adding a simple HTML dropdown (select element) that will enable a user to choose from different "sites" which will then dynamically update the chart with some animations, or transitions as they're called in D3.

Punchcard charts work really well for showing change over *temporarily consistent intervals*, in this case each distinct year from 1927 to 1936. When we attempt to show this data in a line chart for example, the overlap between different varieties make them hard to distinguish from one another:

![static d3 barley linechart]({{site.urlimg}}barley-linechart.png)

Where as in the punchcard chart the size of each circle allows the user to make a clear comparison between data points. The color scheme simply helps differentiate one variety from the next.

Take note of the various D3 Scales being used in the original chart: `scalePoint`, `scaleLinear`, `scaleSqrt`, and `scaleOrdinal`. Each is assigned to a variable which hints at what the purpose will be.

{% highlight javascript %}
var yscale = d3.scalePoint();
var xscale = d3.scaleLinear();
var radius = d3.scaleSqrt();
var color = d3.scaleOrdinal(d3.schemeCategory20b);
{% endhighlight %}

Previously in D3 when you created a scale you would do `d3.scale.scaleName()`, notice the dot between `scale` and `scaleName()`. Now that D3 has become modularized in v4, and [d3-scale](https://github.com/d3/d3-scale) is it's own module, the naming convention for scales has changed slightly. This is perhaps the biggest difference in d3 v4 and the thing that will most likely break your visualization if you attempt to use D3 v4 in place of v3 without making any code edits! Previously in v3 almost all of D3's parts were contained in a single library. Now that it has been broken up into [many separate modules](https://github.com/d3), many of the names for d3 features have changed slightly. Remember though, if you're unsure of which module to use you may still load the library in it's entirety and search [the API docs](https://github.com/d3/d3/blob/master/API.md) for information on a specific module. I've found that by Googling the name of a D3 v3 feature, the API docs will forward me to the location of documentation for that feature in D3 v4 which is super helpful.

The main part of the original punchcard chart happens in the callback of `d3.csv()`, where `data` contains the response array:

{% highlight javascript %}
data.forEach(function(d) {
  d.yield = +d.yield;
  d.year = +d.year;
});

var nested = d3.nest()
  .key(function(d) { return d.site; })
  .key(function(d) { return d.gen; })
  .entries(data);

var site = nested[4];

yscale
  .range([0, height])
  .domain(site.values.map(function(d) { return d.key; }))
  .round(true);

xscale
  .range([0, width])
  .domain([1927, 1936]);

radius
  .range([0, 15])
  .domain([0, d3.max(data, function(d) { return d.yield; }) ]);

var yaxis = d3.axisLeft()
  .scale(yscale);

var xaxis = d3.axisBottom()
  .tickFormat(function(d) { return d; })
  .scale(xscale);

var chart = d3.select("body")
  .append("div")
  .datum(site);

chart.append("h2")
  .text(function(d) { return d.key; });

var svg = chart.append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

svg.append("g")
  .call(yaxis);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xaxis);

var gens = svg.selectAll("g.sites")
  .data(function(d) { return d.values; })
  .enter().append("g")
  .attr("class", function(d) { return d.key; })
  .attr("transform", function(d) {
    return "translate(0," + yscale(d.key) + ")"
  });

gens.selectAll("circle")
  .data(function(d) { return d.values; })
  .enter().append("circle")
  .attr("r", function(d) { return radius(d.yield); })
  .attr("cy", 0)
  .attr("cx", function(d) { return xscale(d.year); })
  .attr("fill", function(d) { return color(d.gen); })
  .on("mouseover", function(d) {
    console.log(d.yield);
  });
{% endhighlight %}

In order to get from this to a place where we can update our chart with a new subset of the Barley data, we will need to do some refactoring. How I love refactoring!

### Steps Towards a Dynamic Chart


[1]: http://stamen.com  
[2]: https://d3js.org  
[3]: https://github.com/d3/d3/wiki/Gallery  
[4]: http://bl.ocks.org/syntagmatic/4a20123bf00563f073ec12326eddc725  
[5]: http://blockbuilder.org  
