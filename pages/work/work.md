---
layout: page-fullwidth
show_meta: false
title: "Portfolio"
meta_description: "Featured work of Chris Henrick"
subheadline: ""
permalink: "/work/"
header: no
---

<!-- use isotope.js to create and organize content here -->
<div id="filters" class="button-group filter-button-group t30">
  <button class="active all" data-filter="*">all</button>
  <button data-filter=".web">interactive</button>
  <button data-filter=".data-viz">data viz</button>  
  <button data-filter=".cartography">cartographic design</button>
  <button class="shuffle">shuffle!</button>
</div>

<!-- this pulls in projects from _data/work.json -->
<div id="target" class="grid t30">
  <div class="gutter-sizer"></div>
  <div class="grid-sizer"></div>
  {% for item in site.data.work.work %}
    <div class="grid-item {{ item.size }} {% for tag in item.tags %}{{tag}} {% endfor %}">
      <a href="{{ site.url }}{{ site.baseurl }}/work/{{item.title | slugify}}.html">
        {% if item.thumb.size != 0  %}      
          <img class="item-img" src="{{ site.url }}{{ site.baseurl }}/images/{{item.thumb}}">
        {% endif %}
        <div class="item-meta">
          <h4 class="item-title">{{ item.title }}</h4>
          <p class="item-description">{{ item.description }}</p>
        </div>
      </a>
    </div>  
  {% endfor %}
</div>
