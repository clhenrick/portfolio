---
layout: page-fullwidth
show_meta: true
title: "Ten and Taller"
meta_title: "Chris Henrick featured work: Ten and Taller"
teaser: "An interactive web map showing architecturally significant historic buildings in NYC"
date: "2016-02-01"
tags:
  - web cartography 
category:
  - work
header: no
permalink: "/work/ten-and-taller.html"
---

<strong>Project Link:</strong> <a href="http://ten-and-taller.clhenrick.io" target="_blank">Ten and Taller</a>

*Ten and Taller* is part of an online and gallery exhibition for the [Skyscraper Museum of NYC]('http://skyscraper.org'). The Musuem's goal for the project was to honor the work of architect & historian Don Friedman, *Structure in Skyscrapers: History and Preservation*, in the form of an interactive map. The Museum staff digitized tabular data from Friedman's book and traced the corresponding building footprints for each of the 249 structures using a digitized Bromley Atlas map from 1909. My job was to show the footprints on both a historic and modern day map (the latter was designed by the Museum) and to create interactions such as popups that display data from the Friedman book as well as historic photos of the building. To accomplish this I had to create the map tiles for the basemap layers, as well as generate the GeoJSON overlay of the footprint data. Another requirement was for the UI to enable the user to filter which buildings are displayed by their year built via a slider. There is an animation on page load demonstrating this as well. The screenshots below are from a working prototype.

<strong>Technologies Used:</strong>  - Leaflet.JS  - D3.JS  - GeoJSON  - MAPublisher 


  <a href="{{site.url}}{{site.baseurl}}/images/ten-taller01.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/ten-taller01.png" alt="ten-taller01.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/ten-taller04.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/ten-taller04.png" alt="ten-taller04.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/ten-taller02.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/ten-taller02.png" alt="ten-taller02.png">
  </a>

  <a href="{{site.url}}{{site.baseurl}}/images/ten-taller03.png" target="_blank">
    <img class="portfolio" src="{{site.url}}{{site.baseurl}}/images/ten-taller03.png" alt="ten-taller03.png">
  </a>



[<span class="back-arrow">&#8619;</span> Back to the Portfolio](/work/)
