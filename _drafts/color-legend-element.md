---
title: "Introducing &lt;color-legend-element />"
layout: page
header: no
# date:
teaser: "Notes on building a legend UI Web Component using Lit, D3JS, and TypeScript"
tags:
  - Web-Components
  - Lit
  - D3js
  - TypeScript
---

![screenshot of color-legend-element](#)

I recently open sourced and launched version `1.0.0` of [Color Legend Element](https://github.com/clhenrick/color-legend-element), a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that's intended to be used as a legend with data visualizations. I'm fairly satisified with its current functionality which covers common use cases when visualizing continuous, discrete, or categorical data. It's API (attributes and properties) makes it fairly straight forward to use (IMHO) and well documented in the [CLE website](#), [Observable Notebook](#), and [Readme](#). 

## Background

Creating legends for data visualizations is one of those pesky yet necessary tasks that I mostly find to be somewhat mundane and repetitive. Often it's a simple enough of a process to write a legend that's tightly coupled to a specific visualization that it doesn't feel worth the time to abstract it into a reusable component. Yet each time I find myself creating a legend I notice the repetition and it starts to feel like a bit of a time sink. By the time I'm done, I tend to ask myself why I'm redoing things.

One of the nice things about using [Observable Notebooks](#) for exploring and prototyping data visualizations is that it has its own reusable [Color Legend](#) that was written by [Mike Bostock](#), one of the founders of Observable and core contributors of [D3JS](#). The implementation assumes you're already using D3JS, and accepts a `d3-scale` as input (plus additional configuration options as needed), and renders a legend based on the type of scale and it's domain and range.

This shouldn't discount other efforts out there, such as Susie Lu's [D3 SVG Legend](https://d3-legend.susielu.com/), which follows D3's style of method chaining and passing scales. The D3 SVG Legend implementation also covers more use cases than CLE currently does, such as [graduated circles](https://d3-legend.susielu.com/#size-examples). My color with CLE was to limit its functionality to using color and decouple it a bit more from D3 even though it still requires some D3 modules as dependencies. Rather than using JavaScript method chaining, the CLE can be generated using HTML:

{% highlight html %}
  <color-legend
    class="continuous-with-interpolator"
    titletext="Temperature (°C)"
    scaletype="continuous"
    tickFormat=".0f"
    domain="[0, 100]"
  >
  </color-legend>
{% endhighlight %}

This means you don't necessarily need to be rendering your chart or visualization using D3JS or even with JavaScript for that matter. 

## Design decisions:
- why web components
- why lit
- customizing with CSS variables
- why TypeScript

## Improvements:
- A11Y: 
  - accessible SVG isn't trivial
  - support for patterns & symbols
  - aria & roles
- more legend types
  - diverging
  - logarythmic
- event handlers for clicks, focus, etc.

## Feedback