---
title: D3JS for Print Cartography
layout: page
date: 2018-09-17
teaser: "Towards a D3JS Web to Print Cartography Workflow"
header: no
comments: true
tags:
    - Javascript
    - D3JS
    - cartography
    - Data Visualization
---

## Intro
Recently I've been working on a project that attempts to visualize how various job sectors have changed in the San Francisco Bay Area over time. I've chosen to do this through creating a series of maps and charts made with D3JS, the popular data visualization library for the web. These visualizations will eventually be included in the [Anti Eviction Mapping Project](https://www.antievictionmap.com/)'s forthcoming Atlas, to be published by [PM Press](http://www.pmpress.org). The Atlas project seeks to compile many of AEMP's interactive web maps and writings, plus some brand new work. The latter is where I fit in.

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
Here are the notes on how I worked with SVG and D3 in order to prepare my map for editing in Illustrator.

### Exporting the SVG
The question that is probably the most important: how to get maps rendered with D3JS out of the web and into vector editing software? I'm glad you asked! Perhaps the most straight forward and easiest method is to use the [SVG Crowbar](https://nytimes.github.io/svg-crowbar/) bookmarklet created by folks at NY Times. Using it is very simple, when you visit a web page that has SVG elements on it and run it, all SVG elements will be downloaded auto-magically as `.svg` files. The caveats to this tool are that it only works in the Chrome web browser, and that you need to be semi-cautious in how you apply CSS to your SVG. For example the authors recommend to not use a descendant selector, `>`, watch out for using fonts that Adobe Illustrator may not recognize, and that some styles that cascade downward to SVG elements won't show up after downloading the SVG.

I ended up using a combination of SVG Crowbar and [Observable's "Saving SVG" technique](https://beta.observablehq.com/@mbostock/saving-svg) for exporting my graphics. This was the result of moving my prototype map to an [Observable Notebook](https://beta.observablehq.com/), which is a new Javascript based notebook that runs in the browser. Similar to Jupyter notebooks that are typically used for data exploration and analysis, Observable let's you work with data analysis and visualization but in a reactive and asynchronous programming environment with Javascript.

Caution! Once you have your map exported as SVG, it's effectively static, meaning that you lose all attributes of your geospatial data. If you decide to make changes to that data at a later point in time, you'll have to go through the export process again. There are some tricks to making this less painful and time consuming however, which I'll mention below.

### Structuring SVG for Illustrator
Here are some techniques to keep your SVG neat and tidy when opening it in Illustrator, and to make the export/import process go smoother.

First, you will want to group each of your various map layers and apply HTML "id" attributes to them. For example here is code that creates a SVG group for a "places labels" map layer, gives it an "id" attribute of `"place-labels"`, and applies SVG text elements as its children:

{% highlight javascript %}
// places labels
svg.append("g").attr("id", "place-labels")
  .selectAll(".place-label")
  .data(places.features)
  .enter().append("text")
  .classed("place-label", true)
  .attr("x", d => path.centroid(d)[0])
  .attr("y", d => path.centroid(d)[1] - textOffset.y)
  .attr("text-anchor", "end")
  .attr("fill", greys[7])
  .style("font", "7px sans-serif")
  .style("text-shadow", textShadow)
  .text(d => d.properties.name)
{% endhighlight %}

Using SVG groups and id attributes will ensure that when you open your exported SVG file in Illustrator all of your layers will be neatly contained and identifiable. This is important as it simplifies the process of moving grouped features into Illustrator layers to make any post-export editing easier (more on this in the next section).

I made sure that all styling was applied inline instead of using a CSS style tag or external style sheet. This is accomplished using `d3-selection`s `selection.attr` and `selection.style` methods, which you can see in the above code example. The rationale for this is that if you don't use inline styling, when opening your SVG file in your favorite vector editing software the styles may be missing.

If exporting multiple maps of the same geographic area but with different data overlays, I found that creating a simple UI to select different views of your data can be helpful. This could be as simple as a dropdown menu, radio buttons, or checkboxes; and [here's a good example](https://bl.ocks.org/mbostock/5872848) of how to use the `d3-dispatch` module to accomplish this. Doing this can be a little more programming intensive, so if you're new to programming and/or D3 expect to have to put a little more work in.

An alternative to a UI for selecting different views of your data could be to render separate maps  on the same page, similar to [a small multiples visualization](https://bl.ocks.org/mbostock/1157787). The downside to this is that if your maps are very detailed or resource intensive, and you have lots of them, then the browser might become bogged down and sluggish. With programming there's typically not one way or right way to accomplish something, so I encourage you to experiment.

### Sizing and Cropping the Map
One of the trickiest parts I've found in this workflow is the process of sizing and cropping the map's extent, when that extent is arbitrarily determined. This is often the case when making maps for print!

It can be painstaking to have to resize each of your exported maps from the size they were rendered at in the browser to the size they'll be printed at, e.g. 8.5" x 11", so getting the map extent and SVG dimensions correct on the web _before exporting the SVG_ can be a huge time saver.

Solving the problem of getting the exported SVG to be the same size as your desired print document size is relatively simple. In Illustrator pixels will map to points (points are an old school measurement system used by graphic designers and typographers), so if you figure out the dimensions of your document size in points then you can simply set your SVG dimensions to be the same in pixels. For an 8.5" x 11" document this ends up being 612 x 792 pixels or points, so in my code I simply set the SVG width to be 612 pixels and the height to be 792 pixels.

In my project, I was working with data at the census tract level for all nine counties of the San Francisco Bay Area but knew I would be cropping the map area to only include cities that were adjacent to the San Francisco Bay. But how would I get the cropping correct?

I accomplished this by first exporting an SVG with the map area to include all nine counties, which was much larger than I needed. After opening the SVG file in Illustrator I drew a rectangle proportional to 8.5" x 11", and then positioned and sized it to include the area I wanted to crop my map to. You could theoretically do this in D3 without Illustrator, but as I'm comfortable working with Illustrator this approach made sense to me.

![drawing and selecting a map frame in illustrator]({{site.urlimg}}illustrator-rect-crop.png)

To get this "map frame" rectangle back into my D3 code, I did the following: first I selected the rectangle and using Illustrator's _transform_ window menu, changed the origin to the "upper left" to match how browsers determine the origin (e.g. `0,0`) of SVG (meaning `y` increases from top to bottom and `x` increases from left to right). Then I noted the x, y, width, and height values of my rectangle. I could now use these values to draw the same rectangle with D3!

![transform window example]({{site.urlimg}}illustrator-transform-panel.png)

You don't actually need the rectangle to be drawn in D3 in order to crop the map area, but it helps to draw it to verify that it looks correct. Once you crop the map area this rectangle will no longer look correct because the coordinates will have changed. However if you'd still like to have the map frame rectangle in your SVG you can simply draw a rectangle with D3 from `0,0` to `width, height`.

Here's the secret to cropping your map area once you have your map frame rectangle, basically it involves some temporary math and code that we can throw away later. First using `d3-geo`'s `projection` function, we can _invert_ our pixel coordinates to get longitude and latitude coordinates. You only need two pairs of coordinates, the _upper left_ which comes straight from the `x` and `y` values we got from Illustrator's _transform_ window, and the _bottom right_, which can be computed by adding the `width` and `height` to our upper left coordinates. Here's an example of how that works:

{% highlight javascript %}
var mapFrameCoords = [
  projection.invert([403, 561]),
  projection.invert([737, 993])
]

// ends up being:
[
  [-122.54644297642132, 37.989209933976475]
  [-121.74157680240731, 37.19360698897229]
]
{% endhighlight %}

Next, we can use those longitude latitude coordinates to create a GeoJSON linestring feature that we can pass to D3's `projection.fitSize()` method. The tricky part is that we can't _both_ invert our pixel coordinates _and_ fit our map extent to the resulting lon lat coordinates at the same time! To get around this, I "hard coded" the GeoJSON:

{% highlight javascript %}
var mapExtent = {
  "type": "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-122.54644297642132, 37.989209933976475],
      [-121.74157680240731, 37.19360698897229]
    ]
  }
}
{% endhighlight %}

Now that we have a GeoJSON feature that represents the desired extent of our map area, we can pass it to `projection.fitSize()` to crop our map area as follows:

{% highlight javascript %}
// california state plane 3 https://github.com/veltman/d3-stateplane
projection = d3.geoConicConformal()
  .parallels([37 + 4 / 60, 38 + 26 / 60])
  .rotate([120 + 30 / 60], 0)
  .fitSize([width, height], mapExtent) // <--- add geojson here
{% endhighlight %}

Now when the D3 renders our map, it will be cropped to our desired extent.

Overall the goal in prepping our map SVG is getting things "good enough" knowing that any fine tuning can be done in Illustrator, for example adjusting the placement of labels for cities and counties. The next section will cover what happens in Illustrator.

## Editing in Adobe Illustrator
Now that we've prepped our SVG with D3 for importing into Illustrator and exported our SVG from the browser to a local file using SVG Crowbar, it's time to open it in Illustrator. Here's what a sample exported SVG looks like when opening it:

![sample svg map opened in illustrator]({{site.urlimg}}d3-print-ai-svg-in-ai.png)

Looks fairly similar to our map in the browser right? Notice that if you click on it it's one giant group of nested elements. Here's what the Layers panel looks like:

![screenshot of layers panel]({{site.urlimg}}d3-print-ai-layers-panel.png)

You can see that our entire SVG is nested under "Layer 1", and that each of our map layers are nested in named groups, thanks to the `id` attributes we created with D3. This means we can select each of these groups and drag them into individual named layers, and then un-group them to make any post SVG export editing easier. You might be asking, "why not just leave the SVG groups in place and edit them there?" Well if you've ever tried to edit a "grouped anything" in Illustrator you'll know that you need to use the direct selection tool and that it can become tedious work fairly quickly. I find that it's much easier to edit my map features when they've been separated into different layers as shown below:

![screenshot of layers panel with map layers]({{site.urlimg}}d3-print-ai-layers-panels-map-layers.png)

Now it might make sense to do this whole un-grouping and moving to separate layers process for one or two maps, but if you're rendering a bunch of maps you probably don't want to do this each time. For my project I was rendering the same geographic area, but with a different data overlay (choropleth visualization at the census tract level), so I decided to create a _template_ (`.ait`) file that I could reuse for each of my maps. This is a technique used frequently by cartographers when working in Illustrator when they want to keep a common look and feel for a set of maps. In a template we can define layer names, graphic styles, character styles, swatches, symbols, etc., so that there is consistency among all our maps. In this case I created a template that had all of my base map layers and labels in place, here's what it looks like below:  

![screenshot of map template]({{site.urlimg}}d3-print-ai-map-template.png)

I used this template for each of the maps I created in Illustrator. This is done by first creating a new file from the template file (opening a `template.ait` file will default to an `untitled.ai` file). Then I grab just the tracts / choropleth group from the SVG file, and place that group in the appropriate layer in my new map file. This makes the process of creating lots of maps go much faster as you don't have to mess with all the other layers, styling, labeling, etc. Here is what a final map looks like, after creating a new file from a template and copying over just the tracts layer from an SVG file:

![screenshot of finished map]({{site.urlimg}}d3-print-ai-final-map.png)

Another benefit of using a template to create your maps is that if you need to do any touch up work that is shared between all maps you can do it in one place, as it really wouldn't make sense to try to copy edits from one file to a dozen others. For my template I touched up roads, my layer ordering, label placement, and a couple county boundaries that I forgot to render in D3. The only downside to this workflow is that when you change something in your template, you'll need to recreate each of your maps again, but this typically goes much smoother and fairly quickly after you already have everything neatly separated into layers. An important tip is to remember to check "Paste Remember Layers" in the Layers panel options. That way when you copy and paste a set of map features from one file into another, it will be pasted into the correct layer.

Other adjustments I made with my maps in Illustrator were as follows:

  - Adding a title and legend

  - Adjusting of place name labels as needed for each map so that they avoid overlap with areas that have dark fill colors

  - Converting the file to a CMYK color space

  - Creating an action to automate exporting to PDF

The last part was important as I wanted to deliver the maps as PDF files, not Illustrator files. In the PDF settings I typically choose "Press Quality" for the quality setting. After I have this "save to pdf" action defined I then open all my `.ai` map files and run the action, which will save the file in a directory of my choosing (I typically keep `.pdf` and `.ai` files separate from one another to avoid accidentally editing the `.pdf` files), and then close the file for me so that I'm not tempted to mess with it after it's been saved to a PDF.

## Caveats
There are some drawbacks to this approach, of course, and I wouldn't recommend it for every project. Here's a short list of things to keep in mind when using this approach.

- Most obviously, you'll need to be somewhat familiar with or comfortable learning D3JS, which initially comes with a steep learning curve, especially if you're not familiar with Javascript, CSS, and web standards such as SVG and asynchronous operations.

- That being said, there are plenty of resources to learn from, many of them free. [D3's blocks](https://bl.ocks.org), are the way most examples are shared and [Blockbuilder](http://blockbuilder.org) makes searching and "forking" (e.g. modifying) examples more convenient. There's the [D3JS Slack community](https://d3-slackin.herokuapp.com/) where you can ask people questions when you run into trouble. If you're someone who likes to learn from tutorials or books, there is also plenty of free online material. [Curran Keller](https://curran.github.io/dataviz-course-2018/) and [Malcom Maclean](https://leanpub.com/D3-Tips-and-Tricks) both have terrific and helpful resources. The two books I recommend are Scott Murray's [Interactive Data Visualization for the Web](http://alignedleft.com/work/d3-book-2e) if you're a total beginner, and Elijah Meeks' [D3JS In Action](https://www.manning.com/books/d3js-in-action-second-edition) if you are looking to go beyond the basics.

- Once you have your map exported as SVG, it's effectively static, meaning that you lose all geospatial attributes. Creating maps with desktop GIS software definitely has an advantage here, as you can update your data at any point and apply the same styles.

- SVG Crowbar saves your file with an RGB colorspace, if you'll be sending your file for offset printing, then you'll have to manually convert the document and colors to the CMYK colorspace.

- If you are planning on creating many, many graphics for print you probably don't want to use a manual process like SVG Crowbar. In this case you may want to look at using [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome), a tool that lets you use the Chrome web browser programmatically from the command line or via NodeJS.

Happy map making with D3JS! If you found any of this useful or have any suggestions, clarifications, or questions please feel free to reach out to me via [the contact form]({{ site.url }}{{ site.baseurl }}/contact) on this site.
