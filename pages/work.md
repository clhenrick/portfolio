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
<div id="target" class="grid print carto"></div>

<!-- template for rendering isotope grid items -->
<script id="item-template" type="text/x-handlebars-template">
    <div class="grid-item {{ size }}  {{ type }}">
    <a href="{{ post-url }}">
      <img class="item-img" src="{{ img }}">
    </a>
    <div class="item-meta">
      <a href="{{ post-url }}">
        <h4 class="item-title">{{ title }}</h4>
      </a>
      <p class="item-description">{{ description }}</p>
    </div>
  </div>  
</script>