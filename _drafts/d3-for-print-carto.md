---
title: D3JS for Print Cartography
layout: page
date: 2018-09-17
teaser: "Towards a D3 Web to Print Cartography Workflow"
header: no
comments: true
tags:
    - Javascript
    - D3JS
    - cartography
    - Data Visualization
---

## Intro
Recently I've been working on a project that attempts to visualize how various job sectors have changed in the San Francisco Bay Area over time. I've chosen to do this through creating a series of maps and charts made with D3JS, the popular data visualization library for the web. These visualizations will eventually be included in the [Anti Eviction Mapping Project](https://www.antievictionmap.com/)'s forthcoming Atlas, to be published by [AK Press](https://www.akpress.org/). The Atlas project seeks to compile many of AEMP's interactive web maps and writings, plus some brand new work, which is where I fit in.

Knowing from the outset of the project that the deliverables would be for print, and not the web, forced me to think about the design and development process in a slightly different way. This was partly due to the fact that I no longer had access to one of the necessary pieces of software I've used in the past for creating print maps. Previously I've used a combination of [QGIS](https://www.qgis.org/en/site/), the free and open source desktop GIS software; and [MAPublisher](https://www.avenza.com/mapublisher/), a plugin for Adobe Illustrator that allows for working with geospatial vector data in Illustrator. Unfortunately MAPublisher is not free nor is it open source, and the computer I happen to have a license on has just about bit the dust. Even if I did decide to shell out the [$1,399 for a new license](https://www.avenza.com/mapublisher/pricing/), at the time of this writing I didn't have a computer that I could install it on that fit the system requirements.

So what to do? I felt that my options were to either try to make the maps entirely in QGIS, using the Print Composer feature, or to explore making the maps using D3JS in the browser and exporting the rendered graphics for print some how. I ended up settling on the second option and I'm happy to say that I'm satisfied with the results. The rest of this blog post will be describing how I went about creating maps using D3JS in a way that was suitable for print. It assumes that you are familiar with a vector graphics editing software such as Adobe Illustrator, but if you aren't you may still find parts of this post helpful.

## Why D3JS?
When using D3JS one typically thinks of its utility for creating highly customized, dynamic, and _interactive_ visualizations for the web; not for making _static_ graphics for print. However, many news outlets such as the New York Times use D3 for both their interactive and print graphics. In fact, the primary author of D3JS, Mike Bostock, created it while working as a graphics editor at the NY Times!

If you're not familiar with D3JS and its usefulness when it comes to creating geographic maps, here's a short primer. Feel free to skip ahead to the next section otherwise.

D3's native rendering environment is the HTML Document Object Model (DOM), and most often it's used to generate [Scalable Vector Graphics (SVG)](https://developer.mozilla.org/en-US/docs/Web/SVG), a subset of the DOM that is a flexible format for creating graphics which works well for both the web and print. Alternatively D3 is capable of rendering to [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), a raster graphics format, if you prefer images instead of SVG. There are some advantages of using Canvas over SVG for rendering, but I'll leave that topic for another blog post.

The advantage of working with SVG from a designer's or cartographer's perspective is that you can "fine tune" your maps and visualizations in common vector editing software, such as Adobe Illustrator, Inkscape, or Sketch. One example of fine tuning a map is adjusting the placement of labels, something that may often be painstaking to get absolutely right programmatically, and may be accomplished somewhat easier by hand with design software such as Illustrator. In my opinion, hand placed labels that are given a "cartographer's touch" is still one of those techniques that hasn't been entirely replicated or solved by algorithms and programming, although I haven't looked to see if machine learning has been applied to the problem yet.

The `d3-geo` package allows for utilizing a very wide variety of map projections, such as state plane, so that we don't have to use Web Mercator like other web mapping tools such as MapboxGL, Leaflet, and Google Maps. For my project I ended up using the equivalent of [California State Plane 3 (EPSG:2227)](http://epsg.io/2227) which is suitable for minimizing distortion of the SF Bay Area. More importantly though, `d3-geo` allows for ingesting complex geographic data such as census tracts, and magically turning their geometries into SVG path elements which may be styled via CSS and SVG attributes. There's much more to `d3-geo` then what I've mentioned here, so if you're interested in learning more check out [the documentation for `d3-geo`](https://github.com/d3/d3-geo).

The `d3-scale-chromatic` package gives us instant access to color palettes suitable for thematic mapping such as those from [Cynthia Brewer's Color Brewer](http://colorbrewer2.org/). The documentation has [examples of all the various color schemes](https://github.com/d3/d3-scale-chromatic).

D3's close cousin, `TopoJSON`, allows for convenient cartographic techniques like rendering shared edges between polygons only once, which is enormously helpful when applying styling such as line dashes to delineate administrative boundaries. Often when applying a dashed line style to a polygon geometry the edges shared between polygons are drawn twice on top of one another, and this may result in a dashed line looking more like a solid line. It's important to keep in mind that `TopoJSON` is both a data storage format and a library that converts data between the `TopoJSON` format and others such as the more familiar `GeoJSON`. Using the `TopoJSON` library, you may package up all your map layers into a single `.topojson` file which makes data storage a little less cumbersome. For this project I created a `Makefile` that scripts the entire data transformation pipeline and serves as documentation for how I processed the data using Python, Mapshaper, and GDAL.

Lastly I've found that making maps with code allows for quick iteration on ideas, while providing "free" documentation of your process. This is invaluable when you'd like to share how you created a visualization with others, or remind yourself how you managed to create something 6 months, a year, or more from now. I often start out the data viz process by making many prototypes of charts, maps, and ideas, where one prototype builds off another (by "prototype" I mean something that is "quick and dirty", not a final product, contains minimal UI, isn't "pixel perfect"). Using code makes this process fairly straight forward, and once I've arrived at something I'm happy with I can clean up the prototype and port it to whatever format I need (e.g. a React application).

## Tips and Tricks
While working through this process I've learned some stuff...

### Exporting SVG
The question that is probably the most important: how to get maps rendered with D3JS out of the web and into vector editing software? I'm glad you asked! Perhaps the most straight forward and easiest method is to use the [SVG Crowbar](https://nytimes.github.io/svg-crowbar/) bookmarklet created by folks at NY Times. Using it is very simple, when you visit a web page that has SVG elements on it and run it, all SVG elements will be downloaded auto-magically as `.svg` files. The caveats to this tool are that it only works in the Chrome web browser, and that you need to be semi-cautious in how you apply CSS to your SVG. For example the authors recommend to not use a descendant selector, `>`, watch out for using fonts that Adobe Illustrator may not recognize, and that some styles that cascade downward to SVG elements won't show up after downloading the SVG.

I ended up using a combination of SVG Crowbar and [Observable's "Saving SVG" technique](https://beta.observablehq.com/@mbostock/saving-svg) for exporting my graphics. This was the result of moving my prototype map to an [Observable Notebook](https://beta.observablehq.com/), which is a new Javascript based notebook that runs in the browser. Similar to Jupyter notebooks that are often used for data exploration, Observable let's you work with data analysis and visualization but in a reactive and asynchronous programming environment.

Caution! Once you have your map exported as SVG, it's effectively static, meaning that you lose all attributes of your geospatial data. If you decide to make changes to that data at a later point in time, you'll have to go through the export process again. There are some tricks to making this less painful and time consuming however, which I'll mention below.

### Structuring SVG for Illustrator
There are some things you can do with your D3 code to keep your SVG neat and tidy when opening it in Illustrator, and to make the export import process go smoother.

First, you will want to group each of your various map layers and apply HTML "id" attributes to them. For example here is code that creates a SVG group for a "land" map layer, gives it an "id" attribute of `"land"`, and applies a SVG path element of the land polygons as its child:

{% highlight javascript %}
// group containing land polygons
svg.append("g")
    .attr("id", "land")
  .append("path")
  .datum(landArea)
    .attr("fill", "#fff")
    .attr("stroke-width", 0.3)
    .attr("stroke", "lightgrey")
    .attr("stroke-line-join", "round")
    .attr("d", path)
{% endhighlight %}

This way when you open your exported SVG file in Illustrator all of your layers will be neatly contained inside groups, which you can then move into layers to make any post-export editing easier (More on this in the next section).

I made sure that all styling was applied inline instead of using a CSS style tag or external style sheet. This is accomplished using d3-selections `selection.attr` and `selection.style` methods, which you can see in the above code example. The rationale for this is that if you don't use inline styling, when opening your SVG file in your favorite vector editing software the styles may be missing.

If exporting multiple maps of the same geographic area but with different data overlays, I found that creating a simple UI to select different views of your data can be helpful. This could be as simple as a dropdown menu, radio buttons, or checkboxes; and [here's a good example](https://bl.ocks.org/mbostock/5872848) of how to use the `d3-dispatch` module to accomplish this. Doing this can be a little more programming intensive, so if you're new to programming and/or D3 expect to have to put a little more work in.

An alternative to a UI for selecting different views of your data could be to render separate maps  on the same page, similar to [a small multiples visualization](https://bl.ocks.org/mbostock/1157787). The downside to this is that if your maps are very detailed or resource intensive, and you have lots of them, then the browser might become bogged down and sluggish. With programming there's typically not one way or right way to accomplish something, so I encourage you to experiment.

One of the trickiest parts I found was the process of sizing and cropping the map's extent. It can be painstaking to have to resize each of your exported maps from the size they were rendered at on screen to say 8.5" x 11", so getting the map extent and SVG dimensions correct on the web is a huge time saver.

Overall the goal here is getting things "good enough" on the web knowing that any fine tuning can be done in Illustrator, for example adjusting label placement. The next section will cover this part.

## Editing in Adobe Illustrator

## Caveats
