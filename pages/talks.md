---
layout: page-fullwidth
show_meta: false
title: "Talks"
meta_title: "Public lectures and presentations given by Chris Henrick"
meta_description: "A list of public lectures and presentations given by Chris Henrick, ordered by date."
subheadline: ""
permalink: "/about/talks/"
header: no
---

### GeoVisualization Workshop at the I School
*UC Berkeley School of Information / Berkeley, CA / April 20, 2020*

What separates geo-visualization from other types of data visualization? What are the some of the choices you must make when visualizing data in the context of maps and the web? How might we go about visualizing geospatial data that allows for a rich user experience, or at least one similar to what users might expect from their familiarity with popular mapping platforms such as Google Maps? This workshop intends to at least partly answer these questions through a 20 minute lecture followed by an hour long hands on workshop. Participants will write javascript code and utilize MapboxGL.JS, GeoJSON, and Turf.JS to visualize vehicle collision data in New York City. The end goal of the workshop will be creating an interactive hexbin map from the point GeoJSON data. Participants will walk away with a better understanding of the landscape of geo-visualization; including its tools, data types, and how to avoid common pitfalls. Due to COVID-19 this talk and workshop was given remotely.

- [Presentation Slides](https://docs.google.com/presentation/d/1F-VDg0ZO3L_g-fd4Apc0PQmEiKNWNyzDVesUuD3dwV0/edit?usp=sharing)
- [Observable Notebook](https://observablehq.com/@clhenrick/mapboxgl-hexbin-map)

### Arts, Politics, and the City: Webmapping Workshop
*UC Berkeley / Berkeley, CA / April 1, 2020*

Guest lecture and workshop on making interactive maps for the web for a core methods course in the [Global Urban Humanities certificate program](http://globalurbanhumanities.berkeley.edu/graduate-certificate) titled *The Demos: Politics, Art and the City (Spring 2020)*. Following a lecture on cartography and making on the web, students gained hands on experience working with geospatial data on the web and creating their own interactive web map using open data on San Francisco 311 cases, [geojson.io](http://geojson.io), and [Glitch](https://glitch.com). Due to COVID-19 this talk and workshop was given remotely.

- [Presentation Slides](https://docs.google.com/presentation/d/15LDhtoHi3jxT4K5cQKv3yyyOT16xxrlcx-GF3iFhf5Y/edit?usp=sharing)
- [Glitch project](https://glitch.com/~sf-311-data)

### Using D3JS for Print Cartography
*NACIS Annual Meeting / Tacoma, WA / October 17, 2019*

D3JS, the popular data visualization Javascript library, is most frequently used for creating highly customized and even bespoke interactive and dynamic data visualizations for the web. However, D3JS may also be used to create well crafted, static graphics for print publication. In this talk, I'll share some tips and tricks I learned for integrating D3JS into a print cartography workflow with the vector editing software Adobe Illustrator. 

- [Presentation Slides](https://docs.google.com/presentation/d/1ScwgVbhcNJsY9mzjOY3k-lsq_2ESafnxrTh_nnFg7yU/edit?usp=sharing)
- [Video Recording](https://www.youtube.com/watch?v=U5I16zw_K10)

### Using GPUs to Interactively Visualize Billions of Points with MapD
*OpenVis Conf / Paris, France / May 16, 2018*

MapD’s GPU-powered, in-memory SQL engine and analytics platform are the logical successor to CPU in-memory databases. Modern GPUs have many advantages over CPUs, including much greater compute and memory bandwidth, as well as a native graphics pipeline optimized for rapid visualization. In this workshop, Christophe Viau and Chris Henrick will show how to interactively query and visualize billions of points with MapD. Participants will learn how to use MapD’s open-source GPU datastore to scale their own interactive visualizations. To facilitate hands-on learning, each participant will be provided with a cloud GPU instance to use throughout the workshop.

Agenda for this half-day workshop:

- Overview of the MapD ecosystem
- Rapid dashboard prototyping with MapD Immerse
- A tour of MapD’s suite of open-source Javascript libraries for creating custom visualizations
- How to build a custom visualization with data from the GPU using said libraries
- How MapD uses the Vega specification standard for declarative server-side rendering

### NYC Crash Mapper
*NACIS Annual Meeting / Montreal, Québec, Canada / October 12, 2017*

Open Data is open, but does that make it actionable? Does the "one size fits all" model of Open Data Portals truly serve the civic interests of citizens who stand to benefit from them? In this talk I discuss the short comings of Open Data Portals, often a result of city agencies neglecting to "eat their own dog food" and how the web application I developed, [NYC Crash Mapper]({{site.url}}{{site.baseurl}}/work/nyc-crash-mapper.html), seeks to make Open Data on vehicle collisions actionable for transportation safety advocates within New York City.

- [presentation slides](https://speakerdeck.com/clhenrick/nacis-2017)
- [video](https://www.youtube.com/watch?v=FbvoYQc19V8&index=16&list=PLcBEhOBZvhcZ2AYb-wHsOcpte7Zd_t4zL)

### GeoVisualization Workshop at the I School
*UC Berkeley School of Information / Berkeley, CA / April 10, 2017*

What separates geo-visualization from other types of data visualization? What are the some of the choices you must make when visualizing data in the context of maps and the web? How might we go about visualizing geospatial data that allows for a rich user experience, or at least one similar to what users might expect from their familiarity with popular mapping platforms such as Google Maps? This workshop intends to at least partly answer these questions through a 20 minute lecture followed by an hour long hands on workshop. Participants will write javascript code and utilize MapboxGL.JS, GeoJSON, and Turf.JS to visualize tens of thousands of vehicle collision data points in New York City for the month of March, 2017. The end goal of the workshop will be creating an interactive hexbin map from the point GeoJSON data. Participants will walk away with a better understanding of the landscape of geo-visualization; including its tools, data types, and how to avoid common pitfalls.

- [presentation slides](https://docs.google.com/presentation/d/1zJrk_NaD8NuH7_OP75ke27lAX9I0drC2Cd2RTHUEufE/edit?usp=sharing)
- [workshop code](https://github.com/clhenrick/geovisualization_workshop_ischool)

### Practical and Impractical Uses of Terrain Data
*NACIS Annual Meeting / Colorado Springs / October 21, 2016*

Stamen has been collecting, processing, and experimenting with worldwide digital elevation models (DEMs) for the past year, supported by a grant from the Knight Foundation. The primary output of this is the Open Terrain project, which aims to collect resources on how to process and work with DEMs and their derivatives using open source tools, and cloud-based and scale data pipelines. In this talk we'll demonstrate a few techniques to incorporate these components into your maps as well as discuss how we're using the Open Terrain data to add hillshades to HOT's humanitarian map style and to reboot our OSM-based classic Stamen Terrain style and deploy it worldwide. We'll also explore some impractical uses of DEMs that we've experimented with purely for their aesthetic value.

- [presentation slides](https://clhenrick.github.io/presentations-nacis-2016-terrain/)

### Maps, Open Data, & The Web
*Urban Planning & Design / USF, San Francisco, CA / October 5, 2016*

How can maps, open data, and the web be used to advance causes for social justice? In this presentation I reviewed personal projects that have helped advance causes relating to housing and social justice in New York City. Lessons I've learned are discussed as are recommendations for those interested in learning how create projects involving interactive maps for the web. This was a guest lecture for a Urban Planning and Design graduate class at the University of San Francisco, California.

- [presentation slides]({{site.url}}{{site.baseurl}}/presentations/usf-urban-design/)


### Am I Rent Stabilized?
*NACIS Annual Meeting / Minneapolis, MN / October 16, 2015*

**Am I Rent Stabilized?** is a web application that encourages New York City tenants to find out if their landlord may be illegally overcharging them for a rent stabilized apartment and if so, motivates them to take action. It is an attempt at using open data acquired through a Freedom of Information Law request as a prompt for civic action, rather than solely for visualization and analysis. The app asks the user to input their address and checks it against a database of properties that are likely to have rent stabilized apartments. From here the app recommends a course of action and informs the user of their nearest tenants rights group so they may receive help. This presentation will discuss my development of the app and the geospatial technologies used to create it.

- [presentation slides]({{site.url}}{{site.baseurl}}/presentations/am-i-rent-stabilized/)

### Mapping for Housing Justice in Bushwick, NYC
*NACIS Annual Meeting / Minneapolis, MN / October 15, 2015*   

**The Bushwick Community Map** is an interactive web-mapping project that provides local residents and community organizers with access to data relating to housing and urban planning of the Bushwick neighborhood in Brooklyn, NY. It's goal is to help track gentrification and prevent the displacement of longterm residents from illegitimate practices by landlords. This talk will provide an overview of the project's history as well as how open government data and open source web-mapping technology can be used to strengthen the tenants rights movement and the work of anti-displacement activists.

- [presentation slides]({{site.url}}{{site.baseurl}}/presentations/bcm-nacis-2015/)

### Mapping For Social Justice Workshop
*NACIS Annual Meeting / Minneapolis, MN / October 15, 2015*

Some cartographers and data analysts work closely with communities to use maps for spatial justice—equitable determination over and production of space. Meanwhile, there are many in the mapping community who care about social change but don't know how to connect their work to real advocacy. This session creates a space to think through important questions around grassroots mapping and community cartography.

Participants will share, pecha-kucha style, their work in grassroots mapping and counter-cartography. Then, as a group, we'll discuss the ethics of community-based work including questions of representation, authorship, race and class. We'll also talk about what the potential impacts of grassroots mapping can be on policy and on communities themselves.

### Connection
*MFA Design & Technology Symposium / Parsons School of Design, New York, NY / May 2015*  

- [video](https://vimeo.com/album/3468048/video/130331997#t=230s)

### Visualizing Tenants Rights Activism
*NYU Democracy Lab / New York University, New York, NY / March 10, 2015*

### Narrative Capabilities of Web & Experimental Cartography
*cARTography GeoMixer / California College of the Arts, SF / June 19, 2014*

### Bias In Cartography And Geospatial Data
*GeoNYC Student Showcase / New York Public Library Main Branch, New York, NY / February 10, 2014*
