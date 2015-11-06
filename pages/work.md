---
layout: page-fullwidth
show_meta: false
title: "Portfolio"
subheadline: ""
permalink: "/work/"
header: no
---

<!-- use isotope.js to create and organize content here -->
<div id="filters" class="button-group filter-button-group">
  <button data-filter="*">all</button>
  <button data-filter=".web">interactive</button>
  <button data-filter=".data-viz">data viz</button>  
  <button data-filter=".carto">cartographic design</button>
  <button data-filter=".print">print</button>
  <button class="shuffle">shuffle!</button>
</div>

<!-- to-do: create and populate these with templates & JSON data -->
<div id="target" class="grid print carto">
  <div class="grid-sizer"></div>
  {% for item in site.data.work.work %}
    <div class="grid-item {{ item.size }} {% for tag in item.tags %}} {{tag}} {% endfor %}">
      <a href="{{ site.url }}{{ site.baseurl }}/portfolio/{{item.date}}-{{item.title | slugify}}/">
        <img class="item-img" src="">
      </a>
      <div class="item-meta">
        <a href="{{ site.url }}{{ site.baseurl }}/portfolio/{{item.date}}-{{item.title | slugify}}/">
          <h4 class="item-title">{{ item.title }}</h4>
        </a>
        <p class="item-description">{{ item.description }}</p>
      </div>
    </div>  
  {% endfor %}
</div>
