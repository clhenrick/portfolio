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

<style>
  color-legend {
    display: block;
    color: #222;
    margin-bottom: 1rem;
    --cle-border: 1px solid gray;
    --cle-padding: 1rem;
  }
</style>

<img alt="Animation showing the Color Legend Element's many variants." src="{{ site.url }}{{ site.baseurl }}/images/color-legend-element-2022-01-22.gif">

I recently [open sourced and launched](https://twitter.com/chrislhenrick/status/1484987005020766208?s=20) version 1.0 of [Color Legend Element](https://github.com/clhenrick/color-legend-element), a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that's intended to be used as a legend with data visualizations. I'm fairly satisified with its current functionality which covers common use cases when visualizing continuous, discrete, or categorical data. It's API (attributes and properties) makes it fairly straight forward to use (IMHO) and it is well documented in the [CLE website][cle-website], [Observable Notebook][cle-notebook], and [Github repository][cle-github].

An important part of creating the CLE for me was making it simple to use. You can read more about its usage in the links mentioned above, but the gist of it is: 

1. include the script tag
2. declare the HTML

{% highlight html %}
<script src="https://unpkg.com/color-legend-element@1.0.3/build/color-legend-element.umd.js"></script>

<color-legend
  titletext="Temperature (°C)"
  scaletype="continuous"
  tickFormat=".0f"
  domain="[0, 100]"
>
</color-legend>
{% endhighlight %}

Which then gives you:

<color-legend
  titletext="Temperature (°C)"
  scaletype="continuous"
  tickFormat=".0f"
  domain="[0, 100]"
>
</color-legend>

The above CLE example is rendered in the DOM of this webpage. Try opening your browser's developer tools and poking around at it!

## Background

Creating legends for data visualizations is one of those pesky yet necessary tasks that I tend to find to be mundane and repetitive. Often it's a simple enough of an exercise to write a legend that's paired with a specific visualization that it doesn't feel worth the time to abstract it into a reusable component. Yet each time I find myself creating a legend I notice the repetition and it starts to feel like a bit of a time sink. By the time I'm done, I lament "why haven't I made this reusable yet?".

When using [Observable Notebooks](https://observablehq.com) for exploring and prototyping data visualizations, one has access to such a reusable legend component. The [Color Legend](https://observablehq.com/@d3/color-legend) (which CLE is directly influenced by) was written by [Mike Bostock](https://observablehq.com/@mbostock), one of the founders of Observable and author of [D3JS](https://d3js.org/). Its implementation assumes you're already using D3JS, and accepts a `d3-scale` as input, plus additional configuration options as needed. It renders an SVG legend based on the type of scale as well as its domain and range. It was an epiphany when I began using Mike's Color Legend; I realized how great it was to not have to write a legend from scratch as it meant more time to focus on the visualization I was working on. The only issue was using it outside of Observable.

One option would be to port the Observable Color Legend to vanilla JavaScript. This wouldn't be too difficult as it's simply a function that relies on D3JS as a dependency. However, I was more interested in the idea of packaging CLE as a Web Component so that it could be used declaratively in HTML or JSX like syntax.

I do want to mention that CLE shouldn't discount previous legend components or libraries out there. One of which is [Susie Lu](https://susielu.com/)'s [D3 SVG Legend](https://d3-legend.susielu.com/) library, which follows D3's style of method chaining and reusing scales. The D3 SVG Legend implementation also covers more use cases than CLE currently does, such as [graduated circles](https://d3-legend.susielu.com/#size-examples). My intention with CLE is to limit its functionality to using color as the primary form of visual encoding and to decouple it a bit more from D3 (even though it still requires a handful of D3 modules as dependencies). 

Rather than using JavaScript functions, classes, or method chaining, the CLE is most often generated using HTML:

{% highlight html %}
  <color-legend
    titletext="Temperature (°C)"
    scaletype="continuous"
    tickFormat=".0f"
    domain="[0, 100]"
  >
  </color-legend>
{% endhighlight %}

<color-legend
  titletext="Temperature (°C)"
  scaletype="continuous"
  tickFormat=".0f"
  domain="[0, 100]"
>
</color-legend>

This means you don't necessarily need to be rendering your chart or visualization using D3JS, or even with client side JavaScript for that matter.

## Design Decisions

### Why Web Components?

First off let me preface the following text by confessing that I am not a Web Components "expert", but that I've learned a thing or two about them. I see both their inherit value and drawbacks, so am neither really for or against them. When building web applications using JavaScript, I typically reach for JS frameworks like React or Svelte, not Web Components, partly because of the ecosystem that exists around those frameworks (e.g. things like component libraries such as Material UI or Carbon Components, as well as starter kits like Create React App and Svelte Kit).

The motivation for choosing Web Components as a (non?) "framework" for building the CLE was influenced by my experience working as a UX Engineer at Google. One of the projects I contributed to while working there utilized Custom Elements for its UI, so I had the opportunity to learn the Web Component spec and create some fun and interesting stuff using it. I discovered that the rationale for choosing Web Components as a technology for developing UI is due to it utilizing native Browser APIs such as [Custom Elements][custom-element], [Shadow DOM][shadow-dom], [Slots][slot], and [Templates][template]. One of the core, supporting ideas of choosing Web Components is that by leveraging these native Browser APIs, you are free from relying on JavaScript frameworks that must (well let's face it, should) be kept up date. Frameworks seem to come and go, almost like "fast fashion" these days, so much so it's hard to keep up with them all. Browser APIs on the other hand tend to be a bit more stable and don't go through major breaking changes over the timespan that frameworks such as Angular or React do. For example, think about how many changes those frameworks have been through since the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) has been around.

Another benefit of choosing Custom Elements is that they are fairly "cross-platform" in the sense that you can use them with just about any JavaScript framework in existance. This makes them a good choice if you require JS framework flexibility, for example if you're building a design system at a company that uses multiple JS frameworks. I think the best part of using Web Components is that you don't even need a framework or frontend build tool to use them at all, just add the necessary `<script>` tag to include a component's JavaScript and instantiate it by writing HTML. The one caveat to Web Components is that they are a modern browser technology, so if you need to support older browsers or devices you will need the appropriate polyfills. 

By choosing Web Components as a framework I hope that the CLE can be useful to more folks on the web, rather than say those who use a particular JS framework and to not exclude those who prefer not to use a JS framework. Furthermore, I hope that it means less work on my end to keep it up to date 🙂.

### Lit & Lit Element

While it's certainly possible to use Web Components via the aforementioned native DOM APIs alone, I found that it is a bit easier and a better developer experience to use a Web Component "wrapper library" such as [Lit][lit]. Aside: I'm not sure if "wrapper library" is the right terminology here, but I think it describes these sorts of Web Component libraries well enough.

Why did I choose Lit vs. some other Web Component library? Well it happens to be the Web Component library developed at Google, so it was the one I learned while working there and thus am biased towards it. I haven't tried other Web Component libraries like StencilJS, and I have yet to try using [Svelte][svelte] to create a Custom Element, so I can't honestly or authoratively give an valid comparison. Here's [an article that summarizes all(?) the choices you have when working with Web Components](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/), in case you're interested.

The benefit of using Lit is that it handles a lot of things for you out of the box that you otherwise would need to handle yourself, such as:

- re-renders when attributes / properties change (reactivity)
- declarative templating
- enabling the Shadow DOM by default to encapsulate CSS
- compiles to standard Custom Elements

Lit is a tiny library, around 5 KB (minified and compressed), much smaller than your average JS framework. While it's most typically used for creating individual components, you can also leverage it to write entire web-apps. Lit can `import` and render other (web) components enabling you to create a UI entirely consisting of Custom Elements. You can even use your favorite state management library as well if you like.

If you're new to Web Components I'd recommend giving Lit a try. There's a [tutorial](https://lit.dev/tutorial/) and [playground](https://lit.dev/playground/) plus [starter kits](https://lit.dev/docs/tools/starter-kits/) to get you going. Or maybe try the [Open Web Components project generator](https://open-wc.org/docs/development/generator/).

### Styling with CSS Variables

An interesting aspect of Web Components that I learned while creating CLE was providing a structured mechanism for CSS style overrides. While the legend items are set using CLE's attributes/properties, changing the style of its other internals like fonts, border, and background color resided in the realm of CSS. A result of Shadow DOM encapsulation is that applying styles to the CLE like you would with normal HTML elements doesn't work. 

For example, the following style rule would have no effect on the CLE's text:

{% highlight css %}
color-legend {
  font-family: comic-sans;
}
{% endhighlight %}

One simple solution to this problem is to use CSS variables ("officially" reffered to as [Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)). Just about every style property of the CLE may be overriden using a CSS variable. For example, here's how the same style rules above could be applied using CSS variables:

{% highlight css %}
color-legend {
  --cle-font-family: comic-sans;
}
{% endhighlight %}

A big thanks to [Nolan Lawson](https://nolanlawson.com/) for his write up on [Options for Styling Web Components](https://nolanlawson.com/2021/01/03/options-for-styling-web-components/), which was influential for how I decided to expose styling the CLE. You can see the full list of CSS Variables for the CLE in the [Readme file](https://github.com/clhenrick/color-legend-element#css-variables).

### Inserting Child Content using Slots

I anticipated CLE's markup not suiting every possible use case, so I decided to take advantage of the [HTML slot element][slot] to enable the rendering of child elements. The CLE has two named slots: one for a "subtitle" that fits between the title and legend area, and another for a "footer" that fits below the legend area. Here is how they are used:

{% highlight html %}
<color-legend>
  <small slot="subtitle">
    Some subtitle text here perhaps?
  </small>
  <p slot="footer" class="no-data">
     = No data
  </p>
</color-legend>
{% endhighlight %}

<style>
  color-legend p {
    margin: 0.5rem 0;
  }
  color-legend small {
    font-size: 0.75rem;
  }
  p.no-data {
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
  }
  p.no-data:before {
    content: "";
    width: 0.75rem;
    height: 0.75rem;
    background: #ccc;
    margin-right: 0.5rem;
  }
</style>

<color-legend>
  <small slot="subtitle">Some subtitle text here perhaps?</small>
  <p slot="footer" class="no-data"> = No data</p>
</color-legend>

One thing that's interesting to note about slotted elements is that they are considered part of the "light DOM" and as such may be styled by any global CSS. For example, here's the CSS used for the above slots demo:

{% highlight css %}
color-legend p {
  margin: 0.5rem 0;
}
color-legend small {
  font-size: 0.75rem;
}
p.no-data {
  display: inline-flex;
  align-items: center;
}
p.no-data:before {
  content: "";
  width: 0.75rem;
  height: 0.75rem;
  background: #ccc;
  margin-right: 0.5rem;
}
{% endhighlight %}

## Roadmap:

I didn't get around to everything I would have liked to for the v1 release, so here are some updates I have in mind.

### Accessibility:

After announcing CLE on Twitter, [someone quickly pointed out](#) that relying on color alone does not accomodate users who have vision color deficiencies. One way of accommodating this is by using patterns and symbols in addition to color, which could be enabled with the CLE's categorical scale type.

Another trickier piece of A11Y that I have been anticipating is making the SVG elements accessible. This is not trivial and would require some research and user testing to get right. Perhaps at the bare minimum the "continuous" scale type could provide "alt" text that describes the legend. For example, "a graduated color bar transitioning from yellow to green to blue, with a value of zero at yellow, fifty at green, and one hundred at blue." This might also be good for discrete and threshold scales, where alt text could describe the bin values and color for each SVG `rect` element.

### More Legend Types

Currently the CLE does not support the full range of scales available in the [d3-scale][d3-scale] library. Given the declarative nature of the CLE, I'm not sure supporting every type of D3 scale would make sense. Though I'm interested in adding support for a few more scale types such as [Diverging](https://observablehq.com/@d3/diverging-scales) and [Logarithmic](https://observablehq.com/@d3/continuous-scales#scale_log) scales. These would render similarly to the CLE's existing "continuous" scale type, but would utilize D3's diverging and logarithmic scales under the hood. I think they're common enough in data visualizations that they're worth supporting.

### Event Handlers

Interactive legends can really help make a data visualization shine. For example, they can act as filters to enable a user to toggle various categories or groupings of data "on" and "off" in the visualization. Unfortunately the CLE currently does not have any kind of event handling, and while it wouldn't be too difficult to add event handlers for things like clicking and focusing on the legend, it would be tricky to make those handlers accessible. It might mean for instance fussing with roles, ARIA, and implementing keyboard navigation; all of which can be tricky to get right for users of assistive technology when using SVG. It's not to say I'm not up for the challenge, but time is a factor. 

## Feedback

That about sums up Color Legend Element. Please make sure to check out the [CLE website][cle-website] and [Observable Notebook][cle-notebook] for examples on how to use it (if you're interested that is). To report a bug or make a suggestion, please open an issue in the [Github repository][cle-github] or send me a [Tweet](https://twitter.com/chrislhenrick). Lastly, please do let me know if it's helped you out at all in a project, I would be flattered to see it out in the wild! Thanks for reading 🙏.

[cle-github]: https://github.com/clhenrick/color-legend-element
[cle-website]: https://clhenrick.github.io/color-legend-element/
[cle-notebook]: https://observablehq.com/@clhenrick/color-legend-element
[custom-element]: https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements
[d3-scale]: https://github.com/d3/d3-scale
[lit]: https://lit.dev/
[slot]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Slot
[shadow-dom]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[svelte]: https://svelte.dev/
[template]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

<script async defer src="{{ site.url }}{{ site.baseurl }}/assets/js/color-legend-element.umd.js"></script>