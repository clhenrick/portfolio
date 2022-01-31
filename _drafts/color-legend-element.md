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
<!-- OR embed tweet? -->

I recently [open sourced and launched](https://twitter.com/chrislhenrick/status/1484987005020766208?s=20) version 1.0 of [Color Legend Element](https://github.com/clhenrick/color-legend-element), a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that's intended to be used as a legend with data visualizations. I'm fairly satisified with its current functionality which covers common use cases when visualizing continuous, discrete, or categorical data. It's API (attributes and properties) makes it fairly straight forward to use (IMHO) and it is well documented in the [CLE website](#), [Observable Notebook](#), and [Github repository](#).

An important part of creating the CLE for me was writing good documentation to help make it easy to use. You can read more in the links above, but the gist of it is just declare the HTML:

{% highlight html %}
  <color-legend
    titletext="Temperature (°C)"
    scaletype="continuous"
    tickFormat=".0f"
    domain="[0, 100]"
  >
  </color-legend>
{% endhighlight %}

## Background

Creating legends for data visualizations is one of those pesky yet necessary tasks that I tend to find to be mundane and repetitive. Often it's a simple enough of an exercise to write a legend that's paired with a specific visualization that it doesn't feel worth the time to abstract it into a reusable component. Yet each time I find myself creating a legend I notice the repetition and it starts to feel like a bit of a time sink. By the time I'm done, I lament "why haven't I made this reusable yet?".

When using [Observable Notebooks](#) for exploring and prototyping data visualizations, one has access to such a reusable legend component. The [Color Legend](#) (which CLE is directly influenced by) was written by [Mike Bostock](#), one of the founders of Observable and author of [D3JS](#). Its implementation assumes you're already using D3JS, and accepts a `d3-scale` as input, plus additional configuration options as needed. It renders an SVG legend based on the type of scale as well as its domain and range. It was an epiphany when I began using Mike's Color Legend; I realized how great it was to not have to write a legend from scratch as it meant more time to focus on the visualization I was working on. The only issue was using it outside of Observable.

One option would be to port the [Observable Color Legend](#) to vanilla JavaScript which wouldn't be too difficult as it's simply a function that relies on D3JS as a dependency. However, I was interested in the idea of packaging CLE as a Web Component so that it could be used declaratively in HTML or JSX like syntax.

I do want to mention that CLE shouldn't discount previous legend components or libraries out there. One of which is [Susie Lu](#)'s [D3 SVG Legend](https://d3-legend.susielu.com/) library, which follows D3's style of method chaining and reusing scales. The D3 SVG Legend implementation also covers more use cases than CLE currently does, such as [graduated circles](https://d3-legend.susielu.com/#size-examples). My intention with CLE is to limit its functionality to using color as the primary form of visual encoding and to decouple it a bit more from D3 (even though it still requires a handful of D3 modules as dependencies). 

Rather than using JavaScript method chaining, the CLE can be generated using HTML:

{% highlight html %}
  <color-legend
    titletext="Temperature (°C)"
    scaletype="continuous"
    tickFormat=".0f"
    domain="[0, 100]"
  >
  </color-legend>
{% endhighlight %}

This means you don't necessarily need to be rendering your chart or visualization using D3JS, or even with clientside JavaScript for that matter.

## Design Decisions

### Why Web Components?

First off let me preface the following text by confessing that I am not a Web Components "expert", but that I've learned a thing or two about them. I see both their inherit value and drawbacks, so am neither really for or against them. When building web applications using JavaScript, I typically reach for JS frameworks like React or Svelte, not Web Components, partly because of the ecosystem that exists around those frameworks (e.g. things like component libraries such as Material UI or Carbon Components, as well as starter kits like Create React App and Svelte Kit).

The motivation for choosing Web Components as a (non?) "framework" for building the CLE was influenced by my experience working as a UX Engineer at Google. One of the projects I contributed to while working there utilized Custom Elements for its UI, so I had the opportunity to learn the Web Component spec and create some fun and interesting stuff using it. I discovered that the rationale for choosing Web Components as a technology for developing UI is due to it utilizing native Browser APIs such as [Custom Elements](#), [Shadow DOM](#), [Slots](#), and [Templates](#). One of the core, supporting ideas of choosing Web Components is that by leveraging these native Browser APIs, you are free from relying on JavaScript frameworks that must (well let's face it, should) be kept up date. Frameworks seem to come and go, almost like "fast fashion" these days, it's hard to keep up with them. Browser APIs on the other hand tend to be a bit more stable and don't go through major breaking changes over the timespan that frameworks such as Angular or React do. For example, think about how many changes those frameworks have been through since the [Fetch API](#) has been around.

Another benefit of choosing Custom Elements is that they are fairly "cross-platform" in the sense that you can use them with just about any JavaScript framework in existance. This makes them a good choice if you require JS framework flexibility, for example if you're building a design system at a company that uses multiple JS frameworks. I think the best part of using Web Components is that you don't even need a framework or frontend build tool to use them at all, just add the necessary `<script>` tag to include a component's JavaScript and instantiate it by writing HTML. The one caveat to Web Components is that they are a modern browser technology, so if you need to support older browsers or devices you will need the appropriate polyfills. 

By choosing Web Components as a framework I hope that the CLE can be useful to more folks on the web, rather than say those who use a particular JS framework and to not exclude those who prefer not to use a JS framework. Furthermore, I hope that it means less work on my end to keep it up to date 🙂.

### Lit & Lit Element

While it's certainly possible to use Web Components via the aforementioned native DOM APIs alone, I found that it is a bit easier and a better developer experience to use a Web Component "wrapper library" such as [Lit][lit]. Aside: I'm not sure if "wrapper library" is the right terminology here, but I think it describes these sorts of Web Component libraries well enough.

Why did I choose Lit vs. some other Web Component library? Well it happens to be the Web Component library developed at Google, so it was the one I learned while working there and thus am biased towards it. I haven't tried other Web Component libraries like StencilJS, and I have yet to try using [Svelte](#) to create a Custom Element, so I can't honestly or authoratively give an valid comparison. Here's [an article that summarizes all(?) the choices you have when working with Web Components](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/), in case you're interested.

The benefit of using Lit is that it handles a lot of things for you out of the box that you otherwise would need to handle yourself, such as:

- re-renders when attributes / properties change (reactivity)
- declarative templating
- enabling the Shadow DOM by default to encapsulate CSS
- compiles to standard Custom Elements

Lit is a tiny library, around 5 KB (minified and compressed), much smaller than your average JS framework. While it's most typically used for creating individual components, you can also leverage it to write entire web-apps. Lit can `import` and render other (web) components enabling you to create a UI entirely consisting of Custom Elements. You can even use your favorite state management library as well if you like.

If you're new to Web Components I'd recommend giving Lit a try. There's a [tutorial](https://lit.dev/tutorial/) and [playground](https://lit.dev/playground/) plus [starter kits](https://lit.dev/docs/tools/starter-kits/) to get you going. Or maybe try the [Open Web Components project generator](https://open-wc.org/docs/development/generator/).

### Styling with CSS Variables

...


## Roadmap:

I didn't get around to everything I would have liked to for the v1 release, so here are some updates I have in mind.

- A11Y: 
  - accessible SVG isn't trivial
  - support for patterns & symbols
  - aria & roles
- more legend types
  - diverging
  - logarythmic
- event handlers for clicks, focus, etc.

## Feedback

If you end up trying CLE out please let me know what you think.

[lit]: https://lit.dev/