---
title: "Story Maps Activity Map block"
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

## Introduction

- This was new territory in [StoryMaps.com][smx]:
	- enabling user provided / uploaded geospatial data for the first time
	- charting for the first time
	- dashboard layout for first time
	- lots of room for things to go wrong both technically and usability wise, so we had to make sure to get it right

## Prototyping
- prototyping the block before writing production code:
  - included writing Observable notebooks, Codepens, and even mini web-apps developed using Vite + Svelte
	- benefits of prototyping: not worried about writing production quality code (type checking, linting, testing, code quality, etc.) or working within the limitations of the production codebase (established patterns), makes it easier to try things quickly, can throw things out if they don't work, reduce uncertainty for what is being built, better understand the problem space
	- allowed for working with our designer to iron out UI problems like the dashboard layout and how design mocks will hold up with real world data created by real people recording activities in the outdoors
	- help convey to stakeholders (PEs, leads, designers) how it will work through interactive examples made using code and real data
  - solving the dashboard layout challenges (image vs. no image, three vs two stats, variance in chart data) by writing HTML and CSS
	- was able to advocate for intrinsic design principles using a Flex layout to let content wrap when there's not enough room, rather than using lots of breakpoints as first proposed by the designer
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
