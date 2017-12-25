---
title: "Notes on Building a CSV Powered Story Map"
layout: page
date: 2017-12-01
teaser: "How I used the venerable Comma Separated Value file format in conjunction with modern front-end web technologies to create an interactive story map for Canopy."
header: no
comments: true
tags:
  - Javascript
  - React
  - Leaflet
  - Webpack
  - CSV
---
![canopy story map splashscreen]({{site.urlimg}}canopy-story-map01.jpg)

In this post I’ll describe the workflow and framework I developed for creating an interactive “story map” for [Canopy](http://canopyplanet.org/) while I worked as a web developer for [GreenInfo Network](http://greeninfo.org). I'll describe how it was built in a way that allowed for changes to the story's **content** (copy, photos, and other media assets) as well as **map data layers** to happen in an iterative and timely manner.

## Context
A little about **Canopy:**

> The world’s ancient and endangered forests are being logged at an alarming rate, putting species, communities and our climate at risk. Canopy works with the forest industry’s biggest customers and their suppliers to develop business solutions that protect these endangered forests.

Canopy hired GreenInfo to create an interactive they could use to help influence fashion and paper industries to commit to sourcing sustainable materials, rather than sourcing from logged old growth forests. It surprised me to learn that old growth logging is still a problem in places like Indonesia and even Vancouver Island in British Columbia, and that this problem is driven by developed countries' need for paper products such as cardboard, bath tissue, and cellulose.

![]({{site.urlimg}}canopy-story-map02.jpg)

## Workflow: From Spreadsheet to Web
When creating a story map, one is often working with many people who are giving input into curating the content of the story. To facilitate this process, we used Google Sheets and set up a schema representing the necessary pieces of data to include for each part of the story, what I’ll call a “slide” from here on out. Fields in the spreadsheet such as `slide_number`, `copy`, `image_url`, `image_caption`, `map_zoom`, `map_center`, and map `data_layers` stored the necessary information for each slide. This allowed for a copy editor to easily update the content and settings for each part of the story. It allowed for me to get that data into the software I was building in relatively pain free manner.

Here’s the workflow I used for going from spreadsheet to web app:

1. Content is added or edited in a Google Sheet, called the “story outline.”

2. A sheet containing only the columns needed by the app is exported as a CSV file. There were other columns in the spreadsheet that helped copy editors keep the content organized.

3. The CSV is converted to a JSON document. (I prefer to use [csvkit](https://csvkit.readthedocs.io/en/1.0.2/) for this, but there are many types of CSV to JSON converters out there, such as [Mr. Data Converter](https://shancarter.github.io/mr-data-converter/))

4. JSON is loaded into the app via Webpack’s json-loader via a NodeJS style `require` or ES6 `import`. This bundles the JSON with the rest of the source code so that it is available at runtime. No async required!

Next I’ll talk about the how I structured the application state, which is what the JSON document ends up becoming, and how that is used to render parts of the story map UI.

![]({{site.urlimg}}canopy-story-map03.jpg)

## App State

For managing the story map’s application state, I used a popular Javascript library called Redux. The app state “shape” is fairly simple: It has only 4 properties: browser, lightbox, map, and slides. Each of these represent various parts of state which may be passed to React components to render parts of the app’s UI.

![]({{site.urlimg}}canopy-story-map04a.png)

- **browser**: stores variables pertaining to the browser’s viewport. Useful for making UI changes based on device size. This property is created by the [redux-responsive middleware](https://github.com/AlecAivazis/redux-responsive).

- **lightbox**: whether or not a lightbox should be visible, and what caused it to open. A lightbox could contain a photo, a Google Earth Engine time lapse, a splash screen, or some “about this map” copy.

- **map**: a boolean for tracking whether or not the map is animating via a “fly to” action. This is used to wait until the map is done animating between slide transitions before loading resource intensive media such as a video player.

- **slides**: stores the current slide index and the array of slides which are derived from the JSON document representing the story outline. This is the most important part of application state.

With Redux, the app state is updated via “[actions](https://redux.js.org/docs/basics/Actions.html)” and “[reducers](https://redux.js.org/docs/basics/Reducers.html)” which describe the update to be made and return a new representation of app state. Actions may be “[dispatched](https://redux.js.org/docs/basics/Store.html#dispatching-actions)” following a user interaction, such as clicking a button. Actions are then intercepted by reducers which change the app state. UI elements “[subscribe](https://redux.js.org/docs/api/Store.html#subscribe)” to these changes and respond by updating their contents.

![]({{site.urlimg}}canopy-story-map04b.png)

Here, the slide index is 0, which means we are on the very first slide. In the UI, the sidebar would show 1, the more human recognizable index format.

When the app first initializes, the story outline JSON document is parsed and becomes the `slides.outline` portion of app state at run time. The current slide is tracked via `slides.index` and may be changed by a user via forwards and backwards arrow buttons, allowing for moving between slides. A selector function that accepts `slides.index` and `slides.outline` returns the active slide which is passed down the React component tree, for example to determine what is shown in the geographic map and sidebar parts of the UI. These React components render “views” based on the data for a given slide, and when a user transitions to a new slide, these components “react” or update accordingly to the new data being passed to them.

In the context of the map this means either transitioning to a new map center and zoom, and/or adding or removing various map data layers such as forest cover, carbon, or species ranges to name just a few. For a slide this means updating the title and written copy, and/or showing an image, video, or sound cloud embed.

## Tips & Tricks
One useful feature that helped to develop the story was to use the browser’s [URL hash](https://www.w3schools.com/jsref/prop_loc_hash.asp) to both store and set the current slide index. The app listens for the URL hash to be updated by the user, and when it’s changed the `slides.index` part of app state is altered, advancing the app to the corresponding slide. For example, if I am on slide 1, the URL hash would be `#1` and the value of `slides.index` would be `0`. If I change the hash in the URL to be `#5` then `slides.index` will become `4` and the app will smoothly transition to slide 5, updating the map and sidebar contents from slide 5’s data. This feature made it easy to jump around the story in a non-linear fashion, which helped for both editing content and debugging.

Another helpful feature was to bind event listeners to the forwards and backwards arrow keys in the keyboard. This allowed for moving linearly through the story without having to mouse to the arrow buttons in the UI. I think keyboard short cuts and keys are super useful when using interfaces, such as tabbing through the fields in a form, and in a story map it’s no different.

![]({{site.urlimg}}canopy-story-map04.jpg)

## Story Outline Structure
Each row in the story outline spreadsheet represents a single slide in the story. Various fields are used to configure what should be shown in a slide and on an interactive map for any given point in the story.

We included fields for:

- `slide_id`: which slide does this row represent? 

- `lat`, `lon`, `zoom`: specify the map center and zoom level.

- `title`: the title of the active slide.

- `copy`: the main text that lives within the body of the sidebar. Markdown is accepted to format text & create hyperlinks.

- `image_file` and `image_caption`: display in the sidebar above the main text.

- `image_lightbox`: specifies a larger size image to display in the lightbox.

- `vimeoid`, `soundcloudid`, `earthengine_param`: allow for storing relevant info for loading a Vimeo, SoundCloud, or Google Earth Engine embed.

- `data_layer`: specifies which map layer(s) to use. We use short but human readable codes that represent an object on an S3 Bucket, for example carbon_density will be looked up in a separate “data inventory” meta data table which will tell the app that it’s to be loaded as a tile layer. Other types of map layers include GeoJSON overlays or markers represented by a latitude, longitude coordinate.

- `icon`: what type of icon should be displayed next to the title. There are 4 total, and not all slides get them.

![]({{site.urlimg}}canopy-story-map05.jpg)

## Map Data Layers Management
A separate Google Sheet, referred to as the “data inventory,” is used to store metadata about the map layers. This spreadsheet is also converted to JSON from a CSV and loaded into the app at runtime. Having another spreadsheet for storing information on the map layers was crucial as the same map layers are used by both this story map and a separate web app that allows for freely exploring the various data layers. In the layer explorer app, users have the ability to zoom, pan, and turn map layers on and off. These types of interactions are disabled in the story map for a much simpler user experience. With the same data fueling both apps, I felt it was important to have a single source of truth about the data layers.

Some other notes on how we handled storing data for the app:

- AWS S3 is used for storing map tiles & GeoJSON data

- We could have used S3 for storing photos and other assets, but ended up stashing them in the Github repo for the project (thanks Github!).

- The map tiles only need to go to zoom 12, so it wasn’t a problem to render tiles ahead of time, rather than use a tile server. AWS S3 works quite well as it’s own sort of tile server in this way.

## Caveats & Lessons Learned
Having systems in place that made updating the app less time consuming and managing the app’s assets became crucial. For managing the CSV to JSON updates I wrote a simple shell script that would do the conversion for me with the settings I wanted. That way I didn’t have to keep typing out the same set of commands over and over, remembering the flags for each, and so forth.

Here is that script:

{% highlight bash %}
#!/usr/bin/env bash
# csv_to_json.sh
input=$1
output=$2
set -eu pipefail
if [ -z $input ]; then
  >&2 echo "usage: $(basename $0) <input.csv> <output.geojson>"
  exit 1
fi
>&2 echo "converting ${input} to GeoJSON"
csvjson \
  --no-inference \
  --lat lat --lon lng \
  $input \
  | python -m json.tool \
  > $output
exit 0
{% endhighlight %}

You run the script by doing:

{% highlight bash %}
./csv_to_geojson.sh input.csv output.geojson
{% endhighlight %}

The script takes the CSV file (input) as the first argument and GeoJSON file (output) as the second argument. It uses csvkit’s [csvjson library](http://csvkit.readthedocs.io/en/1.0.2/scripts/csvjson.html) to do the conversion as well as [Python’s JSON encoder/decoder](https://docs.python.org/2/library/json.html) to keep the output GeoJSON human readable, which helped with debugging. Shout out to [Seth Fitzsimmons](https://twitter.com/mojodna?lang=en) for helping me learn more about the idiosyncrasies of Bash and shell scripting when we worked at [Stamen Design](http://stamen.com) together!

This made updating the story outline in the app a breeze, as I didn’t have to type out the entire command each time it needed to be updated. This process probably happened a hundred or more times over the course of the project!

![]({{site.urlimg}}canopy-story-map06.jpg)

## Conclusion
Using spreadsheet-generated CSVs to power the story map for Canopy turned out to be a very flexible and lightweight solution. The end result was a “static site” hosted on Github Pages that doesn’t require any specialized server set up. Cloud services such as AWS S3 help with this, as did the ability to use Stamen’s beautiful [Water Color map tiles](http://maps.stamen.com/watercolor/). Building the app with React and Redux allowed for fine-grained adjustments and made implementing customized features a breeze. Developing a set schema for the story outline and a sensible workflow to go from story copy, assets, and data ➔ spreadsheet ➔ CSV ➔ JSON ➔ web app made integrating updates to the content fast. 

If you are a developer and given the task of building a custom story map, I’d certainly recommend giving this approach a try. It was a fun challenge to build this system and workflow, and I can easily see it being repurposed for other story maps as well. Please feel free to leave a comment or a question, as I’d love to hear your thoughts.
