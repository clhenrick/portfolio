---
layout: page-fullwidth
show_meta: false
title: "My Work"
subheadline: "Use the buttons below to filter..."
permalink: "/work/"
header: no
---

<!-- use isotope.js to create and organize content here -->
<div id="filters" class="button-group filter-button-group">
  <button data-filter="*">all</button>
  <button data-filter=".print">print</button>
  <button data-filter=".web">interactive</button>
  <button data-filter=".data-viz">data viz</button>
  <button data-filter=".carto">cartographic design</button>
</div>

<!-- to-do: create and populate these with templates & JSON data -->
<div class="grid print carto">
  <div class="grid-item print">
    <!-- link will be to a page (blog post?) with more descriptive info -->
    <!-- or perhaps a light box? -->
    <a href="">
      <!-- link to the portfolio's image here -->
      <img class="item-img" src="">
    </a>
    <div class="item-meta">
      <a href="">
        <h4 class="item-title">Some Print Work</h4>
      </a>
      <p class="item-description">a piece of garbage</p>
    </div>
  </div>  
  <div class="grid-item width2 web">
    <p>some web work</p>
  </div>
  <div class="grid-item web data-viz">
    <p>*some other data-viz*</p>
  </div>
  <div class="grid-item web">
    <p>some more web</p>
  </div>
  <div class="grid-item print carto">
    <p>some more print and carto</p>
  </div>
  <div class="grid-item width3 carto">
    <p>some carto work</p>
  </div>
</div>

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