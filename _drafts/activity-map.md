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

## Introduction

One of the first major features I worked on with the Esri StoryMaps team in 2023 was the Activity Map block for [StoryMaps.com][smx]. This work began with conceptual and exploratory research earlier in the year, evolved through the creation of several prototypes, and eventually was released as a "beta" feature in November at the end of the year. It was a first for many things in StoryMaps: the first time we enabled users to upload their own (geospatial) data, the first compound or dashboard like block made available to users, and the first time we released a chart block of some kind. One might say it was a little ambitious and that this meant there was a lot of room for things to go wrong, both technically and in terms of usability. I am happy to say however that we pulled it off, and in this post I'll go over how I helped the team get there.

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

Since I knew that from the start this feature had a ton of complexity to it, prior to doing any coding work I drafted a software design document to help keep the work grounded and to make sure everyone involved was on the same page about what we were building. Writing this doc allowed for explicitly stating aspects of the project like the technical considerations and limitations, security concerns, accessibility requirements, etc.

Since StoryMaps.com doesn't integrate with ArcGIS Online (AGOL) the way ArcGIS StoryMaps does, where AGOL users can insert interactive maps they've created into a story for example, we had to decide on how we were going to provide StoryMaps.com users with an affordance to import geospatial data. Mainly, this came down to how to parse, validate, convert, and then store user provided geo data. In the case of the Activity Map block, the focus was specifically on GPX data, a data format that is commonly used by GPS hardware such as Garmin devices. However, the implications of this were seen as being more broad and to eventually allow StoryMaps users to import other types of geo data such as KML, KMZ, Shapefile, and GeoJSON.

Originally we anticipated doing this data conversion work in the frontend, so I explored using solutions from third party libraries such as [toGeoJSON](#). However, our team was already working on a new backend RESTful API to enable various types of media conversion. I suggested that we could take advantage of more powerful geospatial libraries such as GDAL in a server environment rather than having to download more JavaScript and create more work for the frontend. We eventually decided on this latter approach and I was relieved to have this piece of the project off of my plate given how much else there was to do at the time. Additionally, it was fun to collaborate with our backend team to test out the data conversion API and to make sure it worked as expected for use with the Activity Map block. We had to make sure we had a normalized GeoJSON data structure returned from the API that we could use for every block instance, no matter what the user provided GPX data is.

- how to utilize GPX data, including the file type (XML), conversion to GeoJSON for usage with the ArcGIS JS SDK via the `toGeoJSON` npm module
- narrowed down goals and non-goals of the block
- involved creating Observable notebooks to explore using the ArcGIS JS SDK to create the elevation profile and statistics of geospatial data from the GPX file data
- exploration of integrating the Strava API to directly import activities
- identified accessibility: what semantic markup to use, possible author provided `aria-label` text, keyboard interaction for the chart

## Prototyping
- prototyping the block before writing production code:
  - included writing several mini web-apps developed using Vite, TypeScript, CSS, and Svelte which differs from our traditional stack of NextJS, React, TypeScript, CSS in JS.
	- purpose of prototyping was to explore the design concepts in a more tangible and tactile way, something I learned while working as a UX Engineer at Google.
	- benefits of prototyping: not worried about writing production quality code (type checking, linting, testing, code quality, etc.) or working within the limitations of the production codebase (beholden to established patterns),
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
[prototype-activity-map]: https://activity-map-viewer-prototype.netlify.app
[prototype-elev-chart]: https://elev-profile-chart-prototype.netlify.app/
[ride-with-gps]: https://ridewithgps.com/
[smx]: https://storymaps.com
[strava]: https://www.strava.com/
[svelte]: https://svelte.dev/
[vite]: https://vitejs.dev/
[webgl-contexts]: https://stackoverflow.com/questions/61277222/how-to-determine-number-of-active-webgl-contexts
