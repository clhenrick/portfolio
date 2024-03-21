---
title: "Developing the Activity Map block for StoryMaps.com"
layout: page
header: no
date: 2023-12-26
teaser: "Detailing the process and lessons learned from developing an exciting new block type for StoryMaps.com"
comments: true
tags:
  - CSS
  - React
  - Geospatial
  - Prototyping
---

<img src="{{site.url}}{{site.baseurl}}/images/activity-map-01.jpg" alt="Screenshot of the Activity Map block in StoryMaps.com">

## TODO

- [ ] recreate video using Chrome to fix flicker in block palette

## Introduction

One of the first major features I worked on with the Esri StoryMaps team in 2023 was the [Activity Map block](https://www.storymaps.com/learn/mapping#ref-n-Vfb1T4) for [StoryMaps.com][smx]. This work began with conceptual and exploratory research earlier in the year, evolved through the creation of several prototypes, and eventually was released as a "beta" feature in November at the end of the year. It was a first for many things in StoryMaps: the first time we enabled users to upload their own (geospatial) data, the first compound or dashboard like block made available to users, and the first time we released a chart block of some kind. One might say it was a little ambitious and that this meant there was a lot of room for things to go wrong, both technically and in terms of usability. I am happy to say however that we pulled it off, and in this post I'll go over how I helped the team get there.

Before we get into all the details though, here's a short video that demonstrates creating an Activity Map block in the StoryMaps story editor:

<style>
  /* Thank you CSS Tricks! https://css-tricks.com/responsive-iframes/ */
  [style*="--aspect-ratio"] > :first-child {
    width: 100%;
  }
  [style*="--aspect-ratio"] > img {
    height: auto;
  }
  @supports (--custom:property) {
    [style*="--aspect-ratio"] {
      position: relative;
      margin-bottom: 3rem;
    }
    [style*="--aspect-ratio"]::before {
      content: "";
      display: block;
      padding-bottom: calc(100% / (var(--aspect-ratio)));
    }
    [style*="--aspect-ratio"] > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }
</style>

<div style="--aspect-ratio: 16/9;">
  <iframe
    width="960"
    height="569"
    src="https://www.youtube.com/embed/fzCpzTGhM6M?si=N6ieIVfP267kzhYS&autoplay=1"
    srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/fzCpzTGhM6M?si=N6ieIVfP267kzhYS&autoplay=1><img src={{site.url}}{{site.baseurl}}/images/activity-map-01.jpg alt='Screen recording of the StoryMaps.com Activity Map block demo'><span>▶</span></a>"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    title="StoryMaps: Activity Map block demo"
  ></iframe>
</div>


## Research

I began work on the Activity Map by drafting a software design document to keep the work grounded and to make sure everyone involved was on the same page about what we were building. Writing this doc allowed for explicitly stating aspects of the project like the technical considerations and limitations, security concerns, accessibility requirements, goals and non-goals, etc. The concept of writing a software design doc was new to the development team at the time but welcomed. We now incorporate software design documents into all new feature work in the StoryMaps ecosystem.

Since StoryMaps.com doesn't integrate with [ArcGIS Online (AGOL)][agol] the way [ArcGIS StoryMaps][agsm] does, we had to determine how we were going to provide StoryMaps.com authors with a method to import geospatial data. This boiled down to figuring out how we would parse, validate, convert, and store author provided geo data. In the case of the Activity Map block, the focus was specifically on enabling an author to import [GPX data][gpx], a data format that is commonly used by GPS hardware such as Garmin devices. However, the implications of this were seen as being more broad to eventually allow StoryMaps authors to import other types of geo data such as KML, KMZ, Shapefile, and GeoJSON for general purpose mapping.

Originally we anticipated doing the geo data conversion work in the browser, so I explored using solutions from third party libraries such as [toGeoJSON](#). However, our team was already beginning work on a new backend file conversion API to enable various types of media conversion for video and image types that are not fully supported by the browser. I suggested that we could take advantage of powerful geospatial libraries such as [GDAL](#) in a server environment rather than requiring the user to download more JavaScript to convert the data client side. We eventually decided on this approach and I was relieved to have this piece of the project off of my plate given how much else there was to sort out at the beginning of the project. That being said, it was fun to collaborate with our backend team to test out the file conversion API and to make sure it worked as expected for use with the Activity Map block. We had to make sure we had a normalized GeoJSON data structure returned from the API that we could use for every Activity Map block instance, no matter the user provided GPX data.

As part of the initial research I created around a dozen [Observable Notebooks][observable-jssdk] that explored using the [ArcGIS JavaScript SDK][jssdk] to accomplish some of the technical requirements of the Activity Map. This primarily had to do with computing summary statistics of the users GPX data, such as total elevation gain and total distance, as well as creating a line area chart of the activity's elevation profile. I had not used the ArcGIS JS SDK prior to my role at Esri, so it was new territory to become familiar with that I would likely need throughout my time as an front-end engineer on the StoryMaps team.

I've previously written more extensively about [using Observable Notebooks for data visualization prototyping]({{site.url}}{{site.baseurl}}/prototyping-with-observable-notebooks/), so I'll only briefly discuss why I chose to use Observable Notebooks for this part of the research here. For one, Observable's reactive coding environment feels liberating for smaller one off projects when compared to writing code that is typically parsed and run from a file top to bottom. It's super fun and convenient to edit one cell and have the notebook update without having to reload the page or rerun your notebook. Observable's notebook environment has a lot of useful built-in abstractions such as being able to easily `require` an NPM module or another notebook's cell, simplifying asynchronous code like Promises, loading data from file attachments, adding UI elements like buttons and checkboxes for interactivity, etc. Perhaps the best part is that one may easily "fork" an existing notebook to make some additions or changes to try something out and then merge those changes back to the original notebook if desired. This made doing exploratory work go much more quickly and served as a convenient way to document my research and share it with my colleagues.

### Accessibility

A personally important aspect of the initial research to me included ensuring the Activity Map block would be digitally accessible. The first way I approached this was by determining what semantic HTML to use for its structure. One might consider this process akin to writing an outline for an essay. Rather than wait until writing production code to piece the HTML together as separate UI components, I stubbed out the raw HTML for the Activity Map in a [Codepen][#]. I feel this approach makes structuring semantic HTML for a composite UI much less cognitively taxing, as you're not having to think about both the underlying HTML and how to break the whole thing up into separate UI components at the same time. Once you have an understanding of the entire HTML structure that needs to be generated, it is typically much more apparent how to break it up into separate, smaller UI components that handle the individual pieces of the composite whole.

What I eventually decided on for the Activity Map's HTML is the following:

<style>
  figcaption {
    color: rgb(221, 221, 221);
    font-size: 1em;
    font-style: italic;
    margin-bottom: 1em;
  }
</style>

<figure>
  <figcaption>Basic semantic HTML structure of the Activity Map block:</figcaption>
{% highlight html %}
<!-- container element for the block -->
<article aria-label="My Awesome Activity">
  <!-- top row on desktop, child elements stack on narrower viewports -->
  <div class="row">
    <!-- an optional image the user may upload to associate with their activity -->
    <img
      alt="A view from the top of some hill during My Activity"
      src="photo.jpg"
    >
    <!-- container representing the interactive web map -->
    <div
      tabindex="0"
      role="application"
      aria-label="An interactive geographic map of My Activity"
    >
    </div>
  </div>
  <!-- bottom row on desktop, child elements stack on narrower viewports -->
  <div class="row">
    <!-- activity statistics description list -->
    <dl aria-label="Summary statistics of My Activity">
      <div>
        <dt>Distance</dt>
        <dd>24 km</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>2:25:00</dd>
      </div>
      <div>
        <dt>Elevation Gain</dt>
        <dd>1,250 m</dd>
      </div>
    </dl>
    <!-- elevation profile line chart -->
    <svg
      role="image"
      aria-label="Elevation profile line chart of My Activity"
      aria-describedby="chart-description"
    >
      <desc id="chart-description">
        A line chart showing variance from 100 to 1400 meters in elevation change on the y-axis and 0 to 24 kilometers on the x axis.
      </desc>
      <!-- more chart related markup here -->
    </svg>
  </div>
  <!-- an optional caption for the activity -->
  <footer>
    <p>Here's a caption describing My Activity in a little more detail</p>
  </footer>
</article>
{% endhighlight %}
</figure>

<!-- When using JavaScript frameworks such as React, I find it difficult to think about the mental model within existing production code, it can feel difficult to determine what the correct semantic HTML for a feature should be due to the abstractions of HTML such frameworks provide.  -->

I settled on using the HTML `<article>` element as the container for the Activity Map, since it is a composite of "widgets" such as an interactive map, a list of statistics, and an elevation profile chart. [According to MDN][mdn-article], the `<article>` element is not just for content such as blog posts. In fact the example they give on their page is a weather forecast widget.

For the Activity Map's summary statistics (elevation gain, distance, and elapsed time) I decided on using the [description list element][mdn-dl] (`<dl>`) with its corresponding `<dd>` and `<dt>` child elements. The `<dl>` element is fairly similar to the more commonly used unordered (`<ul>`) and ordered (`<ol>`) list elements, but with the advantage of semantically structuring data or content in the form of key, value pairs.

Lastly, I researched how to render the elevation profile chart as an accessible SVG element using an `aria-label` for its accessible name and the `<desc>` SVG child element to provide an accessible description. Adding the `role="image"` attribute on the `<svg>` tag means assistive tech will announce the chart as an image and hide all of its child elements. One aspect of the chart I have not yet gotten around to making accessible is its interactive tooltips that appear when mousing over (hovering) the chart. Making this part accessible would require a bit more research and work, which unfortunately I was not allocated time for prior to the Activity Map being released.

In summary, by writing out the semantic HTML separately from using a JavaScript framework like React, I was able to more easily determine what the ideal markup should be output by the framework. This simplified the process of breaking up the Activity Map into separate UI components when it came to writing the production code. Another benefit of this approach is that I can test the HTML with various screen reader software to see if it behaves as intended. Fortunately there's nothing too fancy going on in the HTML so I had fairly good results with my tests. I probably could have done away with so many `aria-label` attributes by utilizing heading level elements, but unfortunately our UI designs did not call for visible title text in the Activity Map or its sub-components. What was quite tricky however was writing the CSS to accommodate the fluid layout of the Activity Map. I ended up tackling that in the web prototyping phase which I'll dive into next.

## Prototyping

After flushing out the software design doc and reviewing it with my team, I realized some uncertainty remained about a few key aspects of the Activity Map block. A significant source of this had to do with how the UI design would hold up when using real world data. The original design mocks for the Activity Map conveyed the "best case scenario" of how it would look. However, I knew from my past experience doing data visualization work that there could be plenty of input data scenarios that might break parts of the original design. For example, a GPX file containing data of a very long activity, such as a long distance bicycle race or run, could make the bottom row of the Activity Map's layout feel squished or even create text crashes. In such an input data scenario we would need additional space for the summary statistics to hold larger values. The elevation profile chart would also benefit from more horizontal room to show the variation in elevation more clearly if the activity traversed mountainous terrain.

This led me to develop several prototypes outside of our production codebase in the form of a small Svelte JS web app, several Codepens, and a small React app. The different choices in frontend tech might sound random or odd, but they were for good reason. For example, I find the SvelteJS framework very easy to reason about and quick to work with when compared to the complexity of the React ecosystem, so I chose to use it for making a prototype of the Activity Map block to test real world GPX data with. To solve some of our layout challenges which required various cells within the `<article>` container to expand and contract their horizontal space, I created a Codepen that consisted of mostly HTML and CSS with a sprinkling of vanilla JavaScript. This simplified trying out different types of CSS layout techniques using CSS Grid and Flexbox until I arrived at a sensible solution. When I discovered that the ArcGIS JavaScript SDK's `ElevationProfileViewModel` would not render a chart with input data over a certain size and that the chart was not customizable to the extent that we needed it to be, I prototyped an line/area chart using D3JS and React that could also be tested with real data. Because this chart prototype code included solving a technical problem in our production codebase, I chose to use React instead of Svelte, which helped expedite porting of the code to our production codebase.

Generally speaking, these prototypes served more of the purpose of being design artifacts, similar to polished UI design mocks one might create in design software such as Figma or Sketch. Thinking of prototypes in this way helps alleviate you from things such as code quality, type safety, reusability or modularity, etc. which I believe helps you focus on the creative and UX aspects of the work. Doing this work outside of our production codebase (which uses ReactJS, NextJS, TypeScript, and CSS in JS) meant that I was not burdened by slow build times (our app is quite large, consisting of thousands of modules), type checking, writing tests, writing documentation, doing code reviews, and more generally the limitations of software design patterns we adhere to within our production code to keep our code standardized. As a senior front-end engineer I did not feel bothered by refactoring code from each of the prototypes when I felt parts of them could be used in our production codebase. If there's one thing I've noticed about becoming a more senior it's that I feel less precious about writing, removing, and refactoring code.

- prototyping the block before writing production code:
  - included writing several mini web-apps developed using Vite, TypeScript, CSS, and Svelte which differs from our traditional stack of NextJS, React, TypeScript, CSS in JS.
  - purpose of prototyping was to explore the design concepts in a more tangible and tactile way, something I learned while working as a UX Engineer at Google.
  - also helped uncover some technical problems such as the EPVM's elevation chart's limit on the number of nodes in a path, and theming issues with the chart. This lead us to decide to develop our own custom line area chart using D3JS and React. This saved us time by encountering it before working on the production code, since production code can be expensive to change.
  - benefits of prototyping: not worried about writing production quality code (type checking, linting, testing, code quality, etc.) or working within the limitations of the production codebase (beholden to established patterns or waiting for changes to appear in the browser because of slower rebuild times that come with large codebases),
  - makes it easier to try things quickly, can throw things out if they don't work,
  - benefit of reducing uncertainty for what is being built, to better understand the problem space
  - allowed for working with our designer to iron out UI problems like the dashboard layout and how design mocks will hold up with real world data created by real people recording activities in the outdoors
  - help convey to stakeholders (Product Engineers, leads, editorial) how it will work through interactive examples made using code and real data
  - solving the dashboard layout challenges (image vs. no image, three vs two stats, variance in chart data)
  - was able to advocate for using an intrinsic design method via a Flexbox layout to let content wrap when there's not enough room, rather than using breakpoints as first proposed by the designer
  - determining what semantic HTML and ARIA to use in order to ensure the block is accessible (easier to do with plain HTML vs. front-end UI frameworks that use JSX) and then test it with screen readers like JAWS, NVDA, and VoiceOver
  - getting a sense of user provided GPX data by using various GPX data from public activities in apps such as Strava, Ride-With-GPS, Cal-Topo, etc.; determine what size limit should be placed on data imports, whether data will have elevation and/or timestamps encoded
  - understanding how the ArcGIS JS SDK Elevation Profile widget and corresponding view model works: creating samples, statistics, interaction with the map when hovering the chart
  - developing a custom area chart using D3JS for showing the elevation profile that consumes data provided by the `ElevationProfileViewModel` and interacts with the map on mouse over
  - converting GPX (XML) data to GeoJSON prior to use with the JS SDK
  - theming

## Moving to Production
- production tweaks and problems:
  - stack consists of React, NextJS, TypeScript, CSS in JS; plus our own "block" API that handles adding, updating, and removing blocks from stories
    - "viewer" and "builder" modes
    - print preview
  - using the `IntersectionObserver` API for "lazy loading" the map
    - two many WebGL contexts can cause problems, so we disable maps that are not within the viewport
  - considerations for print view and mobile app
  - persisting the GPX data as GeoJSON
  - persisting data for the chart and activity statistics
  - supporting the user agent's locale units (imperial vs. metric)
  - utilizing our UI theme variables to update the look and feel when a user changes their story's theme (e.g. light, dark, custom)


<!-- Links -->
[agol]: https://www.arcgis.com/index.html
[agsm]: https://storymaps.arcgis.com/
[aria]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
[caltopo]: https://caltopo.com/
[css-tricks-intrinsic-design]: https://css-tricks.com/new-css-features-are-enhancing-everything-you-know-about-web-design/
[codepen-activity-map-layout]: https://codepen.io/clhenrick/pen/LYgaJGw
[flex-wrap]: https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
[geojson]: https://geojson.org/
[gpx]: https://en.wikipedia.org/wiki/GPS_Exchange_Format
[intersection-observer-api]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[jssdk]: https://developers.arcgis.com/javascript/latest/
[jssdk-ep]: https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-ElevationProfile.html
[jssdk-epvm]: https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-ElevationProfile-ElevationProfileViewModel.html
[jssdk-notebook-collection]: https://observablehq.com/collection/@clhenrick/arcgis-js-api
[mdn-article]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
[mdn-dl]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
[observable-jssdk]: https://observablehq.com/collection/@clhenrick/arcgis-js-api
[prototype-activity-map]: https://activity-map-viewer-prototype.netlify.app
[prototype-elev-chart]: https://elev-profile-chart-prototype.netlify.app/
[ride-with-gps]: https://ridewithgps.com/
[smx]: https://storymaps.com
[strava]: https://www.strava.com/
[svelte]: https://svelte.dev/
[vite]: https://vitejs.dev/
[webgl-contexts]: https://stackoverflow.com/questions/61277222/how-to-determine-number-of-active-webgl-contexts
