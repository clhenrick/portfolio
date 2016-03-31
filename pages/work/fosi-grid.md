---
layout: page-fullwidth
show_meta: true
title: "FOSI GRID"
teaser: "Map navigation UI for the new Family Online Safety Institute website."
date: "2016-03-28"
tags:
  - web cartography 
category:
  - work
header: no
permalink: "/work/fosi-grid.html"
---

<strong>Project Link:</strong> <a href="http://fosigrid.org/" target="_blank">FOSI GRID</a>

The redesign of the FOSI GRID website required that users should be able to navigate the site's content and data through the an interactive map. To acheive this I created custom geospatial data from Natural Earth's 1:50m data and used Leaflet.JS, a popular open-source web mapping library. Region polygons were made using MAPublisher, and admin0 & admin1 polygons were created using PostGIS. To make data loading fast I used TopoJSON to store 10 different layers: region polygons, countries grouped by region, and states / provinces grouped by country. When data is added to the map it is converted from TopoJSON to GeoJSON. This cut down drastically on AJAX requests and the website's initial load time.

<strong>Technologies Used:</strong>  - Leaflet.JS  - Natural Earth Data  - TopoJSON  - GeoJSON  - MAPublisher  - PostGIS  - Mapshaper 


  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-01.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-01.png" alt="fosi-grid-01.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-02.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-02.png" alt="fosi-grid-02.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-03.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-03.png" alt="fosi-grid-03.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-04.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-04.png" alt="fosi-grid-04.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-05.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-05.png" alt="fosi-grid-05.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-06.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-06.png" alt="fosi-grid-06.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/fosi-grid-07.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/fosi-grid-07.png" alt="fosi-grid-07.png">
  </a>



[<span class="back-arrow">&#8619;</span> Back to the Portfolio](/work/)