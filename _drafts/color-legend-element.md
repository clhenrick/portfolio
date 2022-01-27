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

I recently [open sourced and launched](https://twitter.com/chrislhenrick/status/1484987005020766208?s=20) version 1.0 of [Color Legend Element](https://github.com/clhenrick/color-legend-element), a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that's intended to be used as a legend with data visualizations. I'm fairly satisified with its current functionality which covers common use cases when visualizing continuous, discrete, or categorical data. It's API (attributes and properties) makes it fairly straight forward to use (IMHO) and it is well documented in the [CLE website](#), [Observable Notebook](#), and [Github repo](#). An important part of creating the CLE for me was writing good documentation to help make it easy to use.

## Background

Creating legends for data visualizations is one of those pesky yet necessary tasks that I tend to find to be mundane and repetitive. Often it's a simple enough of a process to write a legend that's tightly coupled to a specific visualization that it doesn't feel worth the time to abstract it into a reusable component. Yet each time I find myself creating a legend I notice the repetition and it starts to feel like a bit of a time sink. By the time I'm done, I lament "why haven't I made this reusable yet?".

When using [Observable Notebooks](#) for exploring and prototyping data visualizations, one has access to such a reusable legend component. The [Color Legend](#) (which CLE is directly influenced by) was written by [Mike Bostock](#), one of the founders of Observable and core contributors of [D3JS](#). Its implementation assumes you're already using D3JS, and accepts a `d3-scale` as input, plus additional configuration options as needed. It renders an SVG legend based on the type of scale and its domain and range values. When Mike first published the Color Legend I realized how great it was to not have to write a legend from scratch. It made me feel motivated to create a reusable legend that wasn't bound to a specific platform or JavaScript framework.

While the [Observable Color Legend](#) is simply a function that could be ported to vanilla JavaScript so that it could be used outside of Observable, I was interested in the idea of packaging CLE as a Web Component. There's a bunch of reasons why I was interested in using Web Components, which I'll cover next.

## Why Web Components?

First off let me preface the following text by confessing that I am not a Web Components "expert", but that I've learned a thing or two about them and that I dig them.

The idea of choosing Web Components as a (non?) "framework" for building the CLE was influenced by my experience working as a UX Engineer at Google. One of the projects I contributed to while working there utilized Custom Elements for its UI, so I had the opportunity to learn the Web Component spec and create some stuff using it. I discovered that the rationale for choosing Web Components as a technology for developing UI is due to it utilizing native Browser APIs such as [Custom Elements](#), [Shadow DOM](#), [Slots](#), and [Templates](#). One of the core, supporting ideas of choosing Web Components is that by leveraging these native Browser APIs, you are free from relying on JavaScript frameworks that must (well let's face it, should) be kept up date. Frameworks seem to come and go, almost like "fast fashion" these days, it's hard to keep up with them. Browser APIs on the other hand tend to be a bit more stable and don't go through major breaking changes over the timespan that frameworks such as Angular or React do. Think about how many changes those frameworks have been through since the [Fetch API](#) has been around.

Another benefit of choosing Custom Elements is that they are fairly "cross-platform" in the sense that you can use them with just about any JavaScript framework, which makes them a good choice if you require JS framework flexibility (for example if you're building a design system at a company that uses multiple JS frameworks). However, I think the best part of using Web Components is that you don't even need a framework or frontend build tool to use them at all, just add the necessary `<script>` tag to include a component's JavaScript and write HTML. 

The one caveat to Web Components is that they are a modern browser technology, so if you need to support older browsers or devices you will need the appropriate polyfills. 

### Lit & Lit Element

While it's certainly possible to build a Web Component using the aforementioned native DOM APIs alone, I found that it is definitely easier and a better developer experience to use a Web Component "wrapper library" (not sure if that's the right term but I think it describes these sorts of libraries well enough?) such as [Lit][lit]. 

Why did I choose Lit? Well it happens to be the Web Component wrapper library developed at Google, so it was the one I learned and thus am biased towards it. To be fair, I haven't tried other WC libraries like Stencil, and I have yet to try using [Svelte](#) to create a web component, so I can't give a valid comparison. Here's [an article that summarizes the choices nicely](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/) in case you're interested.

The benefit of using Lit is that it handles a lot of things for you, like:

- re-renders when attributes / properties change (reactivity)
- declarative templating
- enabling the Shadow DOM by default to encapsulate CSS
- compiles to standard Custom Elements

Plus you get things that you might be used to from JS frameworks like [LifeCycle methods](#)

Lit is a tiny library, around 5 KB (minified and compressed), much smaller than your average JS framework. While it's most typically used for creating individual components, you can also leverage it to write entire web-apps as components created with Lit can `import` and use other (web) components enabling you to create a UI entirely consisting of Custom Elements.

If you're shopping around I'd say give Lit a try. There's a [tutorial](https://lit.dev/tutorial/) and [playground](https://lit.dev/playground/) plus [starter kits](https://lit.dev/docs/tools/starter-kits/) to get you going. Or maybe try the [Open Web Components project generator](https://open-wc.org/docs/development/generator/).

## Precedence(?)

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

[lit]: https://lit.dev/