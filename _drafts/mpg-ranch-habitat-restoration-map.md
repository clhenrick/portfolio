---
title: "MPG Ranch Habitat Restoration Map"
layout: page
# date:
teaser: ""
header: no
comments: true
tags:
  - Web Mapping
  - React JS
  - Leaflet JS
  - CARTO
  - AWS
---

![the MPG Ranch Habitat Restoration Map app]({{site.urlimg}}mpg-habitat-01-overview.jpg)

The MPG Ranch Habitat Restoration Map enables a team of biologists to effectively communicate ongoing management plans and actions, and provides a venue for discussion of restoration research and practices through an interactive web map application.

I created this web application entirely from scratch using React, Redux, Leaflet, CARTO, Heroku, and AWS to name a few tools. This was the most complex web mapping app I've worked on yet, and was a fun project to build out and iterate on. The app is not yet public, so I'm including some screen captures here alongside documenting the process of how it was built.

### About [MPG Ranch](http://www.mpgranch.com):
<br>

![photo of mpg-ranch]({{site.urlimg}}mpg-ranch-elk-herd.jpeg)
*An elk herd roaming over MPG Ranch in the winter, photo credit: Teagan Hayes*

> Set in the heart of Montana’s Bitterroot Valley, MPG Ranch lies on over
14,000 acres of rich undeveloped landscape. Established in 2009
and privately owned, MPG strives to preserve the natural
communities that make this area beautiful and focuses on research
to restore and protect native diversity.

This web app, which I developed for MPG Ranch, involved solving a multitude
of web application technical problems including the integration of:

- Shapefile of 60+ management unit polygons with corresponding environmental attribute data
- High resolution (10cm) aerial imagery of the ranch
- Raster GIS data representing [NDVI](#) and [solar insolation](#)
- Qualitative data about actions, management, plans, and research
- Professional quality photography of the ranch's management units and management actions
- Reports in the form of slide shows that document research and restoration activities

To solve these development challenges a modern web stack was used that included
the following front-end libraries:

- React for building out UI components
- Redux for managing application state
- Leaflet for displaying geographic data and handling map interactions
- EMCAScript 2015 (ES6) for leveraging more features in Javascript
- Gulp, Browserify, and Babel as a front-end build system
- Marked for handling the conversion and sanitization of markdown text into HTML

...and the following "backend" services:

- Google Forms for the client to enter qualitative data for each management unit
- [CARTO](#) for syncing tables generated from Google Forms and for hosting
Shapefile polygon data of the ranch's management units
- CARTO's [SQL API](#) for fetching data to load into the application
- The [AWS Lambda Tiler](#) for hosting aerial imagery and raster data,
then generating and serving tiles from that data
- Egnyte for hosting and resizing images on the fly

Here are some screenshots of the Habitat Restoration Map web app:

![mpg ranch habitat map landing]({{site.urlimg}}mpg-habitat02.jpg)
*Default application state*

![mpg ranch habitat map dropdown search]({{site.urlimg}}mpg-habitat03.jpg)
*Search by management unit name & dropdown select*

![mpg ranch habitat map detail pane]({{site.urlimg}}mpg-habitat04.jpg)
*Detail pane view*

![placeholder](#)

![placeholder](#)

![placeholder](#)

### Slide Builder App
In addition to the Habitat Restoration Map I built a fully separate web app, the "Slide Builder", that allows for MPG's habitat restoration team to generate slide show reports without having to do manual layout in a program like Microsoft Powerpoint. This web app ended up being very useful to them as it saved them time and made the task of creating reports less tedious.

![slide builder app]({{site.urlimg}}mpg-slide-builder-overview.jpg)

The Slide Builder web app was built using:

- React & Redux
- React Bootstrap
- Marked
- Heroku
- Node JS
- Express
- CARTO SQL API

Reports are generated through a simple UI; a form on the left lets the user select
a slide type (Title, Portrait, Landscape) while a preview of the slide is displayed
on the left. The user may move through the slide deck as slides are created and edit
or remove them as desired. Previously created slide decks may be loaded as well.

![slide builder app - editing a report](#)
![slide builder app - editing a report](#)
![slide builder app - editing a report](#)

The reports are stored as JSON data in CARTO and then are pulled into the Habitat Restoration Map web app.

A Node JS Express "proxy server" was necessary as to not expose MPG's CARTO API Key
when the Slide Builder app posts data to MPG's CARTO account. After a
report has been created and marked as "published", the report data will be
fetched by the Habitat Restoration Map web app. When the user clicks a link for
a report, the report data is rendered as a slide show within a lightbox:

![habitat map displaying a report slide deck](#)

In order to integrate the slide show for the two separate web applications I
created a React component which consumes JSON data for a report and then renders
a slide show from that data. Using [NPM](#) and Github, the slides component can be
installed as a private module in both applications, as well as developed locally
separate from either application for debugging and adding features.

Overall, this was a technically challenging but fun project to work on at Stamen Design. Working
closely with Nicolette Hayes, a UI/UX designer at Stamen, made it possible to rapidly prototype
various parts of the application and iterate on the build. The client, the habitat restoration
team at MPG Ranch, ended up being very pleased with both the Habitat Restoration Map and
Slide Builder app. The app is still under development and will likely continue to serve the
restoration team and share their work with the general public and ranch owner. I could also
see this app becoming a prototype for a platform for helps rural land owners and environmental
restoration organizations coordinate and share their work.
