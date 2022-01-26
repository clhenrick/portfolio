---
title: "Introducing &lt;color-legend-element />"
layout: page
header: no
# date:
teaser: "Notes on building a legend UI component using Lit, D3JS, and TypeScript"
tags:
  - Web-Components
  - Lit
  - Lit-Element
  - D3JS
  - TypeScript
---

![screenshot of color-legend-element](#)

I recently [open sourced and launched](https://twitter.com/chrislhenrick/status/1484987005020766208?s=20) version 1.0 of [Color Legend Element](https://github.com/clhenrick/color-legend-element), a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that's intended to be used as a legend with data visualizations. I'm fairly satisified with its current functionality which covers common use cases when visualizing continuous, discrete, or categorical data. It's API (attributes and properties) makes it fairly straight forward to use (IMHO) and it is well documented in the [CLE website](#), [Observable Notebook](#), and [Github repo](#). An important part of creating the CLE was writing good documentation to help make it easy to use.

## Background

Creating legends for data visualizations is one of those pesky yet necessary tasks that I tend to find to be mundane and repetitive. Often it's a simple enough of a process to write a legend that's tightly coupled to a specific visualization that it doesn't feel worth the time to abstract it into a reusable component. Yet each time I find myself creating a legend I notice the repetition and it starts to feel like a bit of a time sink. By the time I'm done, I think "why haven't I made this reusable yet?".

When using [Observable Notebooks](#) for exploring and prototyping data visualizations, you have access to such a reusable legend component. The [Color Legend](#) component was written by [Mike Bostock](#), one of the founders of Observable and core contributors of [D3JS](#). The implementation assumes you're already using D3JS, and accepts a `d3-scale` as input, plus additional configuration options as needed. It renders an SVG legend based on the type of scale and its domain and range values. 

While the [Observable Color Legend](#) is simply a function that could be ported to vanilla JavaScript to be used outside of Observable, I was interested in the idea of packaging CLE as a Web Component. 

The idea of choosing Web Components as a "framework" was influenced by my experience working as a UX Engineer at Google. One of the projects I contributed to there utilized Custom Elements for its UI, so I had the opportunity to learn the Web Component spec. I discovered that the rationale for choosing Web Components as a technology for developing UI is due to it utilizing native Browser APIs such as Custom Elements, Shadow DOM, Slots, and Templates. The belief is that by leveraging native Browser APIs, you are free from relying on JavaScript frameworks that go through breaking changes and seem to come and go, almost like "fast fashion" these days. Custom Elements are "cross-platform" in the sense that you can use them with or without a JS framework, which makes them a good choice if you require JS framework flexibility. IMO the best part is that you don't a framework or frontend build tool to use them at all, just add the necessary `<script>` tag to include a component's JavaScript and write HTML.

### Lit & Lit Element

While it's certainly possible to build a Web Component using the native DOM APIs, it's a bit easier and a slightly better developer experience to use a Web Component wrapper library such as [Lit](#).

## Precedence?

This shouldn't discount other efforts out there, such as Susie Lu's [D3 SVG Legend](https://d3-legend.susielu.com/), which follows D3's style of method chaining and reusing scales. The D3 SVG Legend implementation also covers more use cases than CLE currently does, such as [graduated circles](https://d3-legend.susielu.com/#size-examples). My intention with CLE is to limit its functionality to using color as the primary form of visual encoding and to decouple it a bit more from D3 (even though it still requires a handful of D3 modules as dependencies). Rather than using JavaScript method chaining, the CLE can be generated using HTML:

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

This means you don't necessarily need to be rendering your chart or visualization using D3JS, or even with JavaScript for that matter.

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