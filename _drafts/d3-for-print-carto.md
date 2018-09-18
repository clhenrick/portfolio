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
Recently I've been working on visualizing how various job sectors have changed in the San Francisco Bay Area through a series of maps and charts made with D3JS, the popular data visualization Javascript library for the web. These visualizations will eventually be included in the [Anti Eviction Mapping Project](https://www.antievictionmap.com/)'s forthcoming Atlas, to be published by [AK Press](https://www.akpress.org/). The Atlas project seeks to compile many of AEMP's interactive web maps and writings, plus some brand new work, which is where I fit in.

Knowing from the outset of the project that the deliverables would be for print, and not the web, forced me to think about the design and development process in a slightly different way. This was partly due to the fact that I no longer had access to one of the necessary pieces of software I've used in the past for creating print maps. Previously when I've created print maps I've used a combination of [QGIS](https://www.qgis.org/en/site/), the free and open source desktop GIS software; and [MAPublisher](https://www.avenza.com/mapublisher/), a plugin for Adobe Illustrator that allows for working with geospatial vector data. Unfortunately MAPublisher is not free nor is it open source, and the computer I happen to have a license on has just about bit the dust. Even if I did decide to shell out the [$1,399 for a new license](https://www.avenza.com/mapublisher/pricing/), I didn't have a computer that I could install it on.

So what to do? I felt that my options were to either try to make the maps entirely in QGIS, using the Print Composer feature, or to explore making the maps using D3JS in the browser and exporting the rendered graphics for print some how. I ended up settling on the second option and I'm happy to say that I'm satisfied with the results. The rest of this blog post will be describing how I went about creating maps using D3JS in a way that was suitable for print.

## Why D3JS?
When using D3 one typically thinks of its utility for creating highly customized, dynamic, and _interactive_ visualizations for the web, not for making _static_ graphics for print. However, many news outlets such as the New York Times use D3 for both their interactive and print graphics.

If you're not familiar with D3JS and its usefulness when it comes to creating geographic maps, here's a short primer. Feel free to skip ahead to the next section otherwise.

D3's native rendering environment is the HTML Document Object Model (DOM), and most often it's used to generate [Scalable Vector Graphics (SVG)](https://developer.mozilla.org/en-US/docs/Web/SVG), a subset of the DOM that is a flexible format for creating graphics which works well for both the web and print. Alternatively D3 is capable of rendering to [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), a raster graphics format, if you prefer images instead of SVG. There are some advantages of using Canvas over SVG for rendering, but I'll leave that topic for another blog post.

The advantage of working with SVG from a designer's or cartographer's perspective is that you can "fine tune" your maps and visualizations in common vector editing software, such as Adobe Illustrator, Inkscape, or Sketch. One example of fine tuning a map is adjusting the placement of labels, something that may often be painstaking to get absolutely right programmatically, and may be accomplished somewhat easier by hand with design software such as Illustrator. In my opinion, hand placed labels that are given a "cartographer's touch" is still one of those techniques that hasn't been entirely replicated or solved by algorithms and programming, although I haven't looked to see if machine learning has been applied to the problem yet.

The `d3-geo` package allows for utilizing a very wide variety of map projections, such as state plane, so that we don't have to use Web Mercator like other web mapping tools such as MapboxGL, Leaflet, and Google Maps. For my project I ended up using the equivalent of [California State Plane 3 (EPSG:2227)](http://epsg.io/2227) which is suitable for minimizing distortion of the SF Bay Area. More importantly though, `d3-geo` allows for ingesting complex geographic data such as census tracts, and magically turning their geometries into SVG path elements which may be styled via CSS and SVG attributes. There's much more to `d3-geo` then what I've mentioned here, so if you're interested in learning more check out [the documentation for `d3-geo`](https://github.com/d3/d3-geo).

The `d3-scale-chromatic` package gives us instant access to color palettes suitable for thematic mapping such as those from [Cynthia Brewer's Color Brewer](http://colorbrewer2.org/). The documentation has [examples of all the various color schemes](https://github.com/d3/d3-scale-chromatic).

D3's close cousin, `TopoJSON`, allows for convenient cartographic techniques like rendering shared edges between polygons only once, which is enormously helpful when applying styling such as line dashes to delineate administrative boundaries. Often when applying a dashed line style to a polygon geometry the edges shared between polygons are drawn twice on top of one another, and this may result in a dashed line looking more like a solid line. It's important to keep in mind that `TopoJSON` is both a data storage format and a library that converts data between the `TopoJSON` format and others such as the more familiar `GeoJSON`. Using the `TopoJSON` library, you may package up all your map layers into a single `.topojson` file which makes data storage a little less cumbersome. For this project I created a `Makefile` that scripts the entire data transformation pipeline and serves as documentation for how I processed the data using Python, Mapshaper, and GDAL.

Lastly I've found that making maps with code allows for quick iteration on ideas, while providing "free" documentation of your process. This is invaluable when you'd like to share how you created a visualization with others, or remind yourself how you managed to create something 6 months, a year, or more from now. I often start out the data viz process by making many prototypes of charts, maps, and ideas, where one prototype builds off another (by "prototype" I mean something that is "quick and dirty", not a final product, contains minimal UI, isn't "pixel perfect"). Using code makes this process fairly straight forward, and once I've arrived at something I'm happy with I can clean up the prototype and port it to whatever format I need (e.g. a React application).

## Tips and Tricks

## Editing in Adobe Illustrator
