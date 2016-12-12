---
title: "D3JS v4 General Update Pattern: Punchcard Chart"
layout: page
date: 2016-12-12
teaser: "Going from static to dynamic via the D3 v4 API"
header: no
comments: true
tags:
    - Javascript
    - D3JS
    - Data Visualization
---

### TOC
- [Introduction](#introduction)
- [The Static Barley Punchcard](#the-static-barley-punchcard-chart)
- [About the Nested Data Structure](#about-the-nested-data-structure)
- [Steps Towards a Dynamic Chart Using d3-dispatch](#steps-towards-a-dynamic-chart-using-d3-dispatch)
- [Setting Up the Dropdown](#setting-up-the-dropdown)
- [Punchcard Chart Set Up](#punchcard-chart-set-up)
- [The Chart Update Callback](#the-chart-update-callback)
- [Implementing the General Update Pattern on Nested SVG Elements](#implementing-the-general-update-pattern-on-nested-svg-elements)
- [Conclusion](#conclusion)


### Introduction
The most recent project I worked on at [Stamen Design](http://stamen.com) involved exploring data for a client using [D3JS](https://d3js.org), which finally gave me a reason to dive into more of the version 4 of the API. If you haven't heard of D3JS, it's a very powerful javascript library that allows for precise and elegant control over creating interactive data visualizations for the web. The "D3" part stands for "Data Driven Documents", referring to its ability to bind data to HTML DOM elements, most frequently SVG elements, or through manipulating the HTML Canvas element, then styling and animating said elements computationally. I would encourage you to take a look at the [examples on the D3 homepage](https://github.com/d3/d3/wiki/Gallery), as it will give you an idea of what the possibilities are with D3.

In this blog post I'll demonstrate the [d3 general update pattern](http://bl.ocks.org/mbostock/3808218) through creating a updatable Punchcard chart, while also discussing some of the differences I've noticed between D3 v3 and v4. Beginning with a [static barley punchcard](http://bl.ocks.org/clhenrick/2b6b5360748a06b26bfd50d96998b741) Block that I forked from [Kai Chang](http://bl.ocks.org/syntagmatic), I'll show how to add D3 v4's general update pattern while also throwing in some animations and other goodies. If you're unfamiliar with them, **Blocks** are the D3 community's primary method of sharing D3 code examples. There is even a site called [Blockbuilder.org](http://blockbuilder.org) which is sort of like a simplified version of [Codepen](http://codepen.io/) or [JSFiddle](https://jsfiddle.net/). Blocks are a system originally developed by the creator of D3, Mike Bostock (who has an [amazing gallery of blocks](https://bl.ocks.org/mbostock) by the way), to demonstrate D3's features and concepts. Because Blocks are built on top of [Github Gists](https://gist.github.com/), each Block is version controlled and "forkable", an added bonus.

I won't walk through how to set up the punchcard chart from scratch, so if you're brand new to D3 I would recommend starting with some of the basics before going through this post. The ["Let's Make a Bar Chart"](https://bost.ocks.org/mike/bar/), and ["How Selections Work"](https://bost.ocks.org/mike/selection/) are two worthy reads for beginners, or if you need a quick refresh on D3.

### The Static Barley Punchcard Chart
Here's what the Barley Punchcard Chart currently looks like:

![static d3 barley punchcard chart]({{site.urlimg}}barley-punchcard-static.png)

The one we'll be making won't look terribly different from this. We'll be adding a simple HTML dropdown (`select` element) that will enable a user to choose from different "sites" which will then dynamically update the chart with some animations, or transitions as they're called in D3.

Punchcard charts work really well for showing change over *temporarily consistent intervals*, in this case each distinct year from 1927 to 1936. When we attempt to show this data in a line chart for example, the overlap between Barley varieties make them hard to distinguish from one another:

![static d3 barley line chart]({{site.urlimg}}barley-linechart.png)

Where as in the punchcard chart the size of each circle allows the user to make a clear comparison between data points. The color scheme simply helps differentiate one variety from the next.

Take note of the various D3 Scales being used in the original chart: `scalePoint`, `scaleLinear`, `scaleSqrt`, and `scaleOrdinal`. Each is assigned to a variable which hints at what its purpose will be.

{% highlight javascript %}
var yscale = d3.scalePoint();
var xscale = d3.scaleLinear();
var radius = d3.scaleSqrt();
var color = d3.scaleOrdinal(d3.schemeCategory20b);
{% endhighlight %}

Previously in D3 when you created a scale you would do `d3.scale.scaleName()`, notice the dot between `scale` and `scaleName()`. In v4, D3 has been broken into [separate modules](https://github.com/d3), and [d3-scale](https://github.com/d3/d3-scale) an example of one such module (Mike Bostock even wrote a [Medium article about it](https://medium.com/@mbostock/introducing-d3-scale-61980c51545f)). As such, the naming convention for referencing different types of scales in D3 has changed. The general renaming of features is perhaps the biggest difference in D3 v4 from v3 I've noticed so far, and the thing that will most likely break your visualization if you attempt to use D3 v4 with code that previously used v3, without making any changes!

Previously in v3 almost all of D3's parts were contained in one place. Having separate modules allows developers to only use the parts of the d3 codebase they need, rather than importing the D3 library in its entirety and only using a couple of its features. If you're unsure of which module(s) to use for a particular visualization it's okay to load the whole library and then search [the API docs](https://github.com/d3/d3/blob/master/API.md) for information on specific features or modules. I've found that by Googling the name of a D3 feature, the API docs will forward me to the location of documentation for v4 of that feature which is super helpful (+1 D3 contributors!)

Moving on, the meat of the original punchcard chart happens in the callback of `d3.csv()`, where `data` is a parameter received by the callback and contains an array of objects, where each object corresponds to a row in the `barleyfull.csv` file.

{% highlight javascript %}
d3.csv('barleyfull.csv', function(err, data) {
  if (err) { throw error; }

  data.forEach(function(d) {
    d.yield = +d.yield;
    d.year = +d.year;
  });

  var nested = d3.nest()
    .key(function(d) { return d.site; })
    .key(function(d) { return d.gen; })
    .entries(data);

  console.log(nested);


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

});
{% endhighlight %}

In order to get from this to a place where we can update our chart with a new subset of the Barley data, we will need to do some refactoring. How I love refactoring!

### About the Nested Data Structure
Notice the hardcoded value `var site = nested[4];` towards the top of the above code, this variable references all data associated with the "Morris" site. To make the punchcard chart updatable, we'll be setting the value of `site` from a user interaction with the dropdown.

When the data is first loaded by `d3.csv`, it is formatted as an array of objects where each object contains key value pairs that represent a row in our table. Here's the very first object in that array:

{% highlight json %}
{
  id: "1",
  yield: "47.5",
  gen: "Manchuria",
  year: "1927",
  site: "StPaul"
}
{% endhighlight %}

We can see that each key name corresponds to a field name in the header of the csv file, and each key's value corresponds to a value for that field in a given row. In some cases we can leave our data structure this way, but more often than not when making a visualization with D3 you'll be doing some data parsing and re-structuring.

Enter `d3.nest`, a method of the [d3-collection](https://github.com/d3/d3-collection) module. According to the documentation, `d3.nest` lets you group data into a "hierarchal tree structure" by common attributes, similar to an SQL `GROUP BY` clause, only allowing for nested groupings. It's no coincidence that "nesting" data this way works very well for creating nested DOM elements with D3.

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

We can see that `nested` is an array of six objects, and each object has a `key` and `values` property. Here, each `key` represents a unique "site" in our data such as "StPaul", "Duluth", "Waseca", etc. This is the result of:

{% highlight javascript %}
d3.next().key(function(d) { return d.site; })
{% endhighlight %}

In the static chart we are using the 5th object in this array, which is for the site "Morris". The data contained in `values` for each of these objects is another array of objects, so let's check that out too, starting with `values` array for "StPaul":

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

Again, we have an array of objects, with each object containing the properties `key` and `values`. Each of these object's `key` property represents a barley variety or `gen`. This array of objects is the result of the second invocation of `.key()` in the `var nested` code block:

{% highlight javascript %}
.key(function(d) { return d.gen; })
{% endhighlight %}

Notice that the value of each `key` property matches a name in the y axis for our punchcard chart *(hint hint)*.

If we dig one level deeper and inspect the `values` array of each of these objects, for example `nested[0].values[0].values`, we'll find objects that have the same structure to the objects in `data`:

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

These objects are used to generate each circle in the punchcard. The value of `year` is used to map the circle's x position to a given year in the x axis, while the value of `yield` is mapped to the radius of the circle, with help from `d3.scaleLinear` and `d3.scaleSqrt` respectively. Our y axis value, `gen` isn't used when creating the circles as their parent SVG group elements have already been positioned on the y axis. We can also see that the all values for `gen` are "Manchuria" and all values for `site` are "StPaul", matching the nesting of our data structure. The numbers for each `id` further inform us that `d3.nest` has re-arranged our data, for if you inspect the array in `data` from `d3.csv` you'll see that the values for `id` increase sequentially by a factor of 1 starting at 1, or the equivalent of an object's index + 1.

In our code above leaving the data as a nested data structure works well, but what if we want to select a new site via a dropdown interaction? Say the user chooses "Duluth", how would we use that string to get the correct object for that site's data? We'd have to use a filter function to pull out the data like so:

{% highlight javascript %}
var nextSiteName = "Duluth";

nested.filter(function(d) {
  return d.key === nextSiteName;
})[0];
{% endhighlight %}

Notice the `[0]` tacked on at the very end. That's because `Array.prototype.filter` returns a new array, and we want the only object within that array. This code isn't bad, but we could make things cleaner by using `d3.map`. This will achieve the same result by simply calling `map.get("Duluth")`, where `map` represents our instance of `d3.map`. We will create the map using our nested data structure like so:

{% highlight javascript %}
var map = d3.map(nested, function(d) { return d.key; });
{% endhighlight %}

This line of code tells d3 to key our data on the site names, everything else will remain nested as before. This method is similar to creating an object with keys for each site name, but [with some additional benefits](https://github.com/d3/d3-collection#map).

### Steps Towards a Dynamic Chart Using d3-dispatch
Okay let's get down to refactoring! We'll need a way of communicating from our dropdown to our punchcard chart when the user selects a new site. If you've used jQuery before, you might be familiar with creating custom events that you can emit and subscribe to. D3 has something similar, called [d3-dispatch](https://github.com/d3/d3-dispatch), which let's you register custom events, then emit them and subscribe to them via `dispatch.call` and `dispatch.on`.

First let's create a new instance of `d3.dispatch` with events for when our data finishes loading and when a user selects a new site via the (soon to be) dropdown:

{% highlight javascript %}
var dispatch = d3.dispatch("load", "statechange");
{% endhighlight %}

We'll also set a variable for the first site we want displayed to the user. To match the static punchcard chart I'll choose "Morris":

{% highlight javascript %}
var firstSiteName = "Morris";
{% endhighlight %}

Note that `dispatch` and `firstSiteName` will be our only "global" variables, the rest of our code will be scoped within callback functions of `dispatch.on()` and `dispatch.call()`.

Now, let's rewrite our `d3.csv` code block with just the code we need to structure our data. At the end we'll emit, or call, our two events, "load" and "statechange".

{% highlight javascript %}
// load our data! When done call our dispatch events with corresponding data
d3.csv('barleyfull.csv', function(err, data) {
  if (err) { throw error; }

  data.forEach(function(d) {
    d.yield = +d.yield;
    d.year = +d.year;
  });

  var nested = d3.nest()
    .key(function(d) { return d.site; })
    .key(function(d) { return d.gen; })
    .entries(data);

  // construct a new d3 map, not as in geographic map, but more like a "hash"
  var map = d3.map(nested, function(d) { return d.key; });

  // call our dispatch events with `this` context, and corresponding data
  dispatch.call("load", this, map);
  dispatch.call("statechange", this, map.get(firstSiteName));
});
{% endhighlight %}

Notice in this case `dispatch.call` receives three arguments:

1. the name of event, as a string
2. the `this` context
3. any additional arguments, such as data we want to pass along

### Setting Up the Dropdown
Next, let's create our dropdown or `select` element, once the data has loaded and our `"load"` event has been fired.

{% highlight javascript %}
// register a listener for "load" and create a dropdown / select element
dispatch.on("load.menu", function(map) {
  // create select dropdown with listener to call "statechange"
  var select = d3.select("body")
    .append("div")
    .append("select")
      .on("change", function() {
        var site = this.value;
        dispatch.call(
          "statechange",
          this,
          map.get(site)
        );
      });

  // append options to select dropdown
  select.selectAll("option")
      .data(map.keys().sort())
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // set the current dropdown option to value of last statechange
  dispatch.on("statechange.menu", function(site) {
    select.property("value", site.key);
  });
});
{% endhighlight %}

Notice that the first argument to `dispatch.on` is a named spaced reference to the `"load"` event, `"load.menu"`. Name spacing events in `d3.dispatch` allows us to register separate callbacks to a single event every time that event is fired. This will make more sense when we set up the chart in a little bit.

The second argument of `dispatch.on` is a callback function which receives `map` as a parameter. This is because we specified `map` as the third argument to `dispatch.call("load")`. We can now use our `map` data structure to create our dropdown / `select` element.

After appending a `select` element to the body of the DOM, we register an event listener called `"change"`. In the callback of `.on("change")` we tell D3 to invoke `dispatch.call` with the values `"statechange"`, `this`, and `map.get(site)`. This block of code will run when the user selects a new site from the dropdown and is what will eventually trigger our punchcard chart to update.

In the next code block we create the `option` elements which reside within our `select` element. The data for our `option` elements are the unique site names, which we can retrieve as an array by calling `map.keys()`. We chain `.sort()` on at the end so that the site names appear in alphabetical order. If we logged this data we would see the following:

{% highlight javascript %}
["Crookston", "Duluth", "GrandRapids", "Morris", "StPaul", "Waseca"]
{% endhighlight %}

In other words, `map.keys()` returns an array of strings for all our map's keys, pretty much what it sounds like it should do.

We then append `option` elements for each of these site names, set the `value` attribute and `text` to the site name. The `value` attribute is important as it is what is passed to `dispatch.call("statechange")` within the `select`'s `on.("change")` event listener.

Finally we need to make sure that the dropdown stays set on the last option the user selected. We do this by setting the current `option` in the `select` element to match the key of the current site data after `"statechange"` is fired. Remember that the data being passed on `"statechange"` is an object that has our site name stored in the property `key` and its corresponding nested data stored in the property `values`. Eg, for "Morris" it is:

{% highlight javascript %}
{
  key: "Morris",
  values: [...]
}
{% endhighlight %}

### Punchcard Chart Set Up

Let's move on to making the punchcard chart. First we'll do the set up: specifying margins and dimensions, setting the domain and range of scales, instantiating the y and x axis creators, appending an SVG with a main group element, and appending the axises:  

{% highlight javascript %}
// set up our punchcard chart after our data loads
dispatch.on("load.chart", function(map) {
  // layout properties
   var margin = { top: 20, right: 30, bottom: 30, left: 120 };
   var width = 800 - margin.left - margin.right;
   var height = 600 - margin.top - margin.bottom;

   // scales for axises & circles
   var yScale = d3.scalePoint(); // ordinal scale for gen type / category
   var xScale = d3.scaleLinear(); // since we are just dealing with years, a linear scale will suffice
   var radius = d3.scaleSqrt(); // circle size would be too large if we used raw values, so we compute their square root
   var color = d3.scaleOrdinal(d3.schemeCategory20b); // colors used for differentiating "gen" type

   // set up yScale, hold off on setting the domain
   yScale
     .range([0, height])
     .round(true);

   // domain for our x scale is min - 1 & max years of the data set
   xScale
     .range([0, width])
     .domain([1926, 1936]);

   // domain of circle radius is from 0 to max d.yield
   radius
     .range([0, 15])
     .domain([0, 76]);

   // d3.v4 method of setting up axises: axisLeft, axisBottom, etc.
   var yAxis = d3.axisLeft()
     .scale(yScale);

   var xAxis = d3.axisBottom()
     .tickFormat(function(d) { return d; })
     .scale(xScale);

   // create an svg element to hold our chart parts
   var svg = d3.select("body").append('svg')
     .attr('width', width + margin.left + margin.right)
     .attr('height', height + margin.top + margin.bottom)
     .append('g')
       .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

   // append svg groups for the axises, then call their corresponding axis function
   svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

});
{% endhighlight %}

Similar to the `dispatch.on("load.menu")`, here we use the name space `"load.chart"` to ensure that our callback is fired which sets up the chart. Within the callback we get `map` as a parameter, but we don't actually need to use it here. This is because we can set up our x and y scales, x and y axis creators, svg with a main group element and child group elements for our axises. The only scale we haven't set a domain for is our y scale, which we'll do in our chart update code block. A quick note that I hard coded values for the domains of the x and radius scales to simplify things a bit.

We now have our chart set up, and it's hungry for some data!

### The Chart Update Callback

Next we'll add the code which utilizes D3's general update pattern to add data to the punchcard chart each time a new site is chosen from the dropdown. Note that this code block lives within the scope of the callback to `d3.on("statechange.chart")`, right below where we append the svg group for the x axis.

{% highlight javascript %}
// register a callback to be invoked which updates the chart when "statechange" occurs
dispatch.on("statechange.chart", function(site) {
  // our transition, will occur over 750 milliseconds
  var t = svg.transition().duration(750);

  // update our yScale & transition the yAxis, note the xAxis doesn't change
  yScale.domain(site.values.map(function(d) { return d.key; }).sort());
  yAxis.scale(yScale);
  t.select("g.y.axis").call(yAxis);

  // bind our new piece of data to our svg element
  // could also do: svg.data([site.values]);
  svg.datum(site.values);

  // tell d3 we want svg groups for each of our gen categories
  var gens = svg.selectAll("g.gen-row")
    .data(function(d) { return d; });

  // get rid of the old ones we don't need when doing an update
  gens.exit().remove();

  // update existing ones left over
  gens.attr("class", "gen-row")
    .transition(t)
    .attr("transform", function(d) {
      return "translate(0," + yScale(d.key) + ")"
    });

  // create new ones if our updated dataset has more then the previous
  gens.enter().append("g")
    .attr("class", "gen-row")
    .transition(t)
    .attr("transform", function(d) {
      return "translate(0," + yScale(d.key) + ")"
    });

  // reselect the gen groups, so that we get any new ones that were made
  // our previous selection would not contain them
  gens = svg.selectAll("g.gen-row");

  // tell d3 we want some circles!
  var circles = gens.selectAll("circle")
    .data(function(d) { return d.values; });

  // get rid of ones we don't need anymore, fade them out
  circles.exit()
    .transition(t)
    .attr("fill", "rgba(255,255,255,0)")
    .remove();

  // update existing circles, transition size & fill
  circles
    .attr("cy", 0)
    .attr("cx", function(d) { return xScale(d.year); })
    .transition(t)
    .attr("r", function(d) { return radius(d.yield); })
    .attr("fill", function(d) { return color(d.gen); });

  // make new circles
  circles.enter().append("circle")
    .attr("cy", 0)
    .attr("cx", function(d) { return xScale(d.year); })
    .transition(t)
    .attr("r", function(d) { return radius(d.yield); })
    .attr("fill", function(d) { return color(d.gen); });

});
{% endhighlight %}

Here is where the magic happens!

First we'll create a new transition on the main SVG group and specify that it happen over 750 milliseconds when invoked. We'll use this same transition in multiple places, within the y scale, SVG groups for each `gen`, and the circles.

Now that we have data for our currently selected site, we'll set the domain of the y scale, reset the the scale of the y axis creator, select the SVG group containing the y axis with our transition `t`, and then invoke the y scale on it.

Next we'll bind our data to the main SVG group element using `svg.datum()` instead of `svg.data()`. The reason for this is slightly tricky to grasp but I'll do my best to explain. When we select an element and use `d3.selection.data()`, we are telling d3 to join a single piece of data in an array to each element we are creating. This is a common approach when we are creating elements like SVG groups, circles, rectangles, labels, etc. However, because we are attaching data to a single SVG element and aren't actually joining it, we'll use `d3.selection`'s [datum method](https://github.com/d3/d3-selection/blob/master/README.md#selection_datum).

Alternatively, we could wrap our `site.values` within an array and use `.data()` like so:

{% highlight javascript %}
svg.data([site.values]);
{% endhighlight %}

To me using `datum()` more clearly states our intention. We aren't creating multiple SVG elements, just allowing our single SVG element and its child elements to have access to our data.

### Implementing the General Update Pattern on Nested SVG Elements
After our main SVG group selection has access to the data we intend to render, we can implement the general update pattern for group elements for each variety or `gen` as they're referred to in the data. Not all sites have data for every barley variety, some have more while some have fewer, so this is a good opportunity to perform the general update pattern. The steps are as follows:

1. We **select** all svg group elements with the class `"gen-row"` and chain the `.data(function(d) { return d; })` method to each of them. This will return an object from the top most `values` array of our site data, representing each barley variety, effectively binding that object to the corresponding svg group.

2. We **exit** and then remove any svg groups that are no longer needed by calling `gens.exit().remove();`. This happens when the previous site data has more varieties than the current site data. This won't do anything when the chart first loads, as there are no svg group elements created yet.

3. We **update** any left over svg groups with new data. We position them by adding a `"transform", "translate"` attribute with the position returned by passing the `"key"` property of the object, which is the variety or `gen`, to the y scale. This also does not do anything when the chart first loads, because there is nothing to update yet.

4. Lastly we **enter** or create any new svg groups if our new site data has more varieties than the previous site data. This step creates all the svg groups for the first site data when the chart first loads as no svg groups exist yet.

A few things to note here, first it's important that in the update and enter steps above we make sure we are adding the class name `"gen-row"` to our svg groups. If we don't do this, when the chart update pattern occurs, our `gens` selection will not contain all of our svg groups, and the update won't work. We use a class to select only the `gen` svg groups so that we don't select say our axises and main svg group as well.

Second, the `.transition()` method is chained right before the svg group is positioned via the `.attr("transform", "translate")`, and is passed the `t` transition we created earlier. When we want to transition an attribute, say a color, size, or position of an element, we chain `transition()` right before chaining whatever it is we want to change. The process of passing `t` to `.transition()` may seem slightly confusing, as why we would we pass a transition as a parameter to a transition method invocation? The reason is that when `transition()` receives `t` as a name parameter, it will use the `id` of `t` to *synchronize a transition across multiple selections.* This is why when a user selects a new site from the dropdown, the y axis, svg groups, and circles all transition simultaneously over the same time period! Pretty darn cool, right?

The last part about this that took me a bit to figure out was that upon completing the general update pattern for our svg groups, we need to reselect them before making the circles. Why would we do this? Because if we don't reselect them, and there are more svg groups then previously, the groups that were added won't end up with circles because they aren't included in the old `gens` selection. If that doesn't make sense, try commenting out the line where we reselect all of the `g.gen-row`s and see what happens when you select a new site via the dropdown.

We can use the same select, exit, update, and enter pattern for the circles. Note that here when we bind data to the circles we return `d.values`:

{% highlight javascript %}
var circles = gens.selectAll("circle")
  .data(function(d) { return d.values; });
{% endhighlight %}

This tells d3 to use the array of objects that contain objects for each circle, the inner most nested `values` array in our `map` data structure. If this is confusing I'd recommend you take a look again at the data structure section of this post and see if you can match up where each nested part of the data lines up with the code. Try to work backwards from the inner most array where the circles are, all the way back to where the dropdown is.

One nice trick to transition out the circles that are not required for new site data is to fade them out. I accomplished this by calling a transition and then setting the fill attribute to be transparent and white, so that it appears the dots fade into the background. It also helps prevent smaller dots appearing inside larger dots, when new larger dots overlap with old smaller dots.

{% highlight javascript %}
circles.exit()
  .transition(t)
  .attr("fill", "rgba(255,255,255,0)")
  .remove();
{% endhighlight %}

In both the circles' update and enter code blocks, I add the transition just before the radius and fill are set. You could also add it before the x position is set, but I prefer to not go too overboard with transitions.

The complete example can be viewed at the following Block, [Barley Punchcard – Dynamic](http://bl.ocks.org/clhenrick/5394591a62a5e61fb8753c1dca13db47).

### Conclusion
So this ended up being a much longer blog post than I originally anticipated! But I think it was worth it to cover a lot, including:

- d3-collection: d3.nest, d3.map
- d3-dispatch
- d3-scale
- d3-transition
- d3-selection: datum vs data, select, selectAll, exit, update, enter

Hopefully this post helps make sense of why nested data structures work well with D3's technique of hierarchal tree selections, and gives you a clearer picture of how the general update pattern works with these types of selections. Maybe you had never heard of a punchcard chart before either, and now know when it would be appropriate to use one.

If you have any questions or comments, please let me know! I am by no means a "D3 know it all", so would appreciate any feedback you may have. Thanks!
