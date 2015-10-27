---
layout: page
show_meta: false
title: "Work"
subheadline: "My personal work in print and web."
permalink: "/work/"
header: no
---

<ul>
    {% for page in site.pages %}
    {% if page.title contains "Portfolio" %}
        <li><a href="{{ site.url }}{{ page.url }}">{{ page.title }}</a></li>
    {% endif %}
    {% endfor %}
</ul>