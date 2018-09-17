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
If you're not familiar with D3JS and its usefulness when it comes to creating geographic maps, here's a short primer. Feel free to skip ahead to the next section otherwise.

D3's native rendering environment is Scalable Vector Graphics (SVG), a format that lends itself to be easily manipulated by cartographers and designers alike via popular vector editing software such as Adobe Illustrator, Inkscape, and Sketch. Alternatively D3 can also render to HTML5 canvas, a raster format, if you prefer images instead of scalable vectors. The advantage of working with SVG is that you can "fine tune" your maps and visualizations in vector editing software after exporting them from the web. One common need that relates to this is adjusting the positions of labels, something that may often be painstaking to do programatically, but easier by hand with software such as Illustrator.

The `d3-geo` package allows for a very wide variety of map projections, such as state plane, so that we don't have to use web mercator like other web mapping tools. For my project I ended up using the equivalent of [California State Plane 3 (EPSG:2227)](http://epsg.io/2227) which is suitable for minimizing distortion of the SF Bay Area. More importantly though, it allows for ingesting complex geographic data such as census tracts, and turning their geometries into SVG path elements which may be styled via CSS and SVG attributes. There's a ton more that what I've mentioned here, so if you're interested in learning more check out [the documentation for `d3-geo`](https://github.com/d3/d3-geo).

The `d3-scale-chromatic` package gives us instant access to color palettes suitable for thematic mapping such as those from [Cynthia Brewer's Color Brewer](http://colorbrewer2.org/). The documentation has [examples of all the various color schemes](https://github.com/d3/d3-scale-chromatic).

D3's close cousin, `TopoJSON`, allows for convenient cartographic techniques like rendering shared edges between polygons only once, helpful when styling using line dashes to delineate administrative boundaries. With TopoJSON, one may also package up all your map layers into a single `topojson` file which makes data storage a little less cumbersome. For this project I created a `Makefile` that scripts the data transformation and serves as documentation for how I processed the data using Python, Mapshaper, GDAL, etc.

Lastly, making maps with code allows for quickly iterating on and documenting your process. This is invaluable when you'd like to share how you created something with others, or remind yourself how you did something 6 months or a year from now. I often start out the viz process by making prototypes, where one builds off another. Using code makes this process fairly straight forward.

## Tips and Tricks

## Editing in Adobe Illustrator
