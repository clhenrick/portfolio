---
title: "D3JS v4 General Update Pattern: Punchcard Chart Example Part I"
layout: page
#date: # TO DO: add date
teaser: "Demoing a few D3 v4 features via a punchcard chart."
header: no
comments: true
tags:
    - Javascript
    - D3JS
    - Data Visualization
---

### Introduction
The most recent project I worked on at [Stamen Design](1) involved exploring auto data for a client using [D3JS](2), which gave me a chance to explore more of the v4 API of D3. If you haven't heard of D3JS, it's a very powerful javascript library that allows for precise and elegant control over creating interactive data visualizations on the web. The "D3" part stands for "Data Driven Documents", referring to its ability to bind data to HTML DOM elements, most frequently SVG elements, or through manipulating the HTML Canvas element, then styling and animating said elements computationally. I would encourage you to take a look at the [examples on the D3 homepage](3), as there are a ton of mind bending and jaw dropping visualizations people have created!

In this blog post I thought I'd reveal some of the differences I've noticed between D3 v3 and v4 as well as demonstrate the [d3 general update pattern](http://bl.ocks.org/mbostock/3808218) through creating a updatable Punchcard chart. Beginning with a [static barley punchcard block](4), I'll show how to add D3 v4's general update pattern while throwing in some animations and other goodies. If you're unfamiliar with them, **Blocks** are the D3 community's main method of sharing code examples, and there is even a site called [Blockbuilder.org](5) which is sort of like a simplified version of [Codepen](http://codepen.io/) or [JSFiddle](https://jsfiddle.net/). Blocks are a system originally developed by the creator of D3, Mike Bostock (who has an [amazing gallery of blocks](https://bl.ocks.org/mbostock) by the way), to demonstrate D3's features and concepts. Because Blocks are built on top of Github Gists, each Block is version controlled and forkable, an added bonus.

I won't walk through how to set up the punchcard chart from scratch, so if you're brand new to D3 I would recommend starting with some of the basics before going through this post. The ["let's make a bar chart"](https://bost.ocks.org/mike/bar/), and ["Selections in D3"](https://bost.ocks.org/mike/selection/) are two worthy reads for beginners, or if you need a quick refresh on D3.

### Static Barley Punchcard Chart
Here's what the Barley Punchcard Chart currently looks like:

![static d3 barley punchcard chart]({{site.urlimg}}barley-punchcard-static.png)

The one we'll be making won't look terribly different from this. We'll be adding a simple HTML dropdown (aka `select` element) that will enable a user to choose from different "sites" which will then dynamically update the chart with some animations, or transitions as they're called in D3.

Punchcard charts work really well for showing change over *temporarily consistent intervals*, in this case each distinct year from 1927 to 1936. When we attempt to show this data in a line chart for example, the overlap between different varieties make them hard to distinguish from one another:

![static d3 barley line chart]({{site.urlimg}}barley-linechart.png)

Where as in the punchcard chart the size of each circle allows the user to make a clear comparison between data points. The color scheme simply helps differentiate one variety from the next.

Take note of the various D3 Scales being used in the original chart: `scalePoint`, `scaleLinear`, `scaleSqrt`, and `scaleOrdinal`. Each is assigned to a variable which hints at what the purpose will be.

{% highlight javascript %}
var yscale = d3.scalePoint();
var xscale = d3.scaleLinear();
var radius = d3.scaleSqrt();
var color = d3.scaleOrdinal(d3.schemeCategory20b);
{% endhighlight %}

Previously in D3 when you created a scale you would do `d3.scale.scaleName()`, notice the dot between `scale` and `scaleName()`. D3 been broken into [separate modules](https://github.com/d3) in v4, and [d3-scale](https://github.com/d3/d3-scale) is it's own module (Mike Bostock even wrote a [Medium article about it](https://medium.com/@mbostock/introducing-d3-scale-61980c51545f)), the naming convention for scales has changed slightly. The general renaming of features is perhaps the biggest difference in D3 v4 from v3 and the thing that will most likely break your visualization if you attempt to use D3 v4 with code that previously used v3, without making any edits! Previously in v3 almost all of D3's parts were contained in a single library. Now that it has been broken up into many separate modules, many of the names for d3 features have changed slightly. Remember though, if you're unsure of which module to use you may still load the library in it's entirety and search [the API docs](https://github.com/d3/d3/blob/master/API.md) for information on a specific module. I've found that by Googling the name of a D3 feature, the API docs will forward me to the location of documentation for v4 of that feature which is super helpful (+1 D3 contributors!)

The meat of the original punchcard chart happens in the callback of `d3.csv()`, where `data` contains an array of objects:

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
  .domain([1926, 1936]);

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
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

svg.append("g")
  .call(yaxis);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xaxis);

var rows = svg.selectAll("g.row")
  .data(function(d) { return d.values; })
  .enter().append("g")
  .attr("class", function(d) { return d.key + " row"; })
  .attr("transform", function(d) {
    return "translate(0," + yscale(d.key) + ")"
  });

rows.selectAll("circle")
  .data(function(d) { return d.values; })
  .enter().append("circle")
  .attr("r", function(d) { return radius(d.yield); })
  .attr("cy", 0)
  .attr("cx", function(d) { return xscale(d.year); })
  .attr("fill", function(d) { return color(d.gen); });
{% endhighlight %}

In order to get from this to a place where we can update our chart with a new subset of the Barley data, we will need to do some refactoring. How I love refactoring!

### About the Nested Data Structure
Notice the hardcoded value `var site = nested[4];` towards the top of the above code, this variable references all data associated with the "Morris" site. To make the punchcard chart updatable, we'll be setting the value of `site` from a user interaction with the dropdown.

The data for our punchcard chart is currently being structured using D3's `nest`, a method of [`d3-collection`](https://github.com/d3/d3-collection). According to the documentation, `d3.nest` lets you group data into a "hierarchal tree structure" by common attributes, similar to an SQL `GROUP BY` clause. It's no coincidence that "nesting" data this way works very well for creating nested DOM elements with SVG.

Let's take a look at our nested data:

{% highlight json %}
[
  {
    "key": "StPaul",
    "values": [...]
  },
  {
    "key": "Duluth",
    "values": [...]
  },
  {
    "key": "Waseca",
    "values": [...]
  },
  {
    "key": "GrandRapids",
    "values": [...]
  },
  {
    "key": "Morris",
    "values": [...]
  },
  {
    "key": "Crookston",
    "values": [...]
  }
]
{% endhighlight %}

*Note that `[...]` is just a place holder for a non-empty array.*

We can see that `nested` is an array of objects, and each object has a `key` and `values` property. Here, each `key` represents a unique "site" in our data such as "StPaul", "Duluth", "Waseca", etc. This is the result of calling `d3.next().key(function(d) { return d.site; })`. In the static chart we are using the 5th object in this first array, which is for the site "Morris". The data contained in `values` for each of these objects is another array of objects, so let's check that out too, starting with "StPaul":

{% highlight json %}
[
  {
    "key": "StPaul",
    "values": [
      {
        "key": "Manchuria",
        "values": [...]
      },
      {
        "key": "Glabron",
        "values": [...]
      },
      {
        "key": "Svansota",
        "values": [...]
      },
      {
        "key": "Velvet",
        "values": [...]
      },
      {
        "key": "Trebi",
        "values": [...]
      },
      {
        "key": "ManxSA",
        "values": [...]
      },
      {
        "key": "SAxMan",
        "values": [...]
      },
      ...
  },
  ...
]
{% endhighlight %}

*Note: `...` implies more data, omitted for the sake of brevity.*

Again, we have an array of objects, with each object containing properties "key" and "values". Each of these object's "key" represents a barley variety  ("gen"), the result of calling `.key(function(d) { return d.gen; })` in the `var nested` code block above. Notice that each "key" matches a name in the y axis for our punchcard chart.

If we dig one level deeper and inspect the values of each of these objects, for example `nested[0].values[0].values`, we'll find objects that have the same structure to our original `data`:

{% highlight json %}
[
  {
    "key": "StPaul",
    "values": [
      {
        "key": "Manchuria",
        "values": [
          {
            "id": "1",
            "yield": 47.5,
            "gen": "Manchuria",
            "year": 1927,
            "site": "StPaul"
          },
          {
            "id": "54",
            "yield": 32.9,
            "gen": "Manchuria",
            "year": 1928,
            "site": "StPaul"
          },
          {
            "id": "103",
            "yield": 48.9,
            "gen": "Manchuria",
            "year": 1929,
            "site": "StPaul"
          },
          {
            "id": "171",
            "yield": 34.1,
            "gen": "Manchuria",
            "year": 1930,
            "site": "StPaul"
          },
          ...
        ],
      },
      ...
    ]
  },
  ...
]
{% endhighlight %}

These objects are what are finally used to generate each circle in the punchcard. The `year` maps to a given year in the x axis, while the value of `yield` is mapped to the radius of the circle. Our y axis value, `gen` isn't used as we've already mapped this value through creating svg `g` (group) elements for each `gen` or variety. We can also see that the all values for `gen` are "Manchuria" and all values for `site` are "StPaul", matching the nesting or grouping of our data structure. The numbers for each `id` within the inner most nested array of objects further inform us that `d3.nest` has re-arranged our data, if you inspect the original response of the data from `d3.csv` you'll see that the values for `id` increase incrementally by a factor of 1.

### Steps Towards a Dynamic Chart
Okay let's get down to refactoring!

[1]: http://stamen.com  
[2]: https://d3js.org  
[3]: https://github.com/d3/d3/wiki/Gallery  
[4]: http://bl.ocks.org/clhenrick/2b6b5360748a06b26bfd50d96998b741
[5]: http://blockbuilder.org  
