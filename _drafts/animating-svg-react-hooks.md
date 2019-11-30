---
title: "Animating SVG with D3JS and React Hooks"
layout: page
date: 2019-11-27
teaser: "SVG animation via React Hooks + d3-interpolate + requestAnimationFrame"
header: no
comments: true
tags:
  - Javascript
  - React
  - D3JS
  - SVG
  - Animation
---

## Intro

Recently I've been trying out [React Hooks](https://reactjs.org/docs/hooks-overview.html), and had an opportunity to use them in a project to animate a data visualization rendered using SVG. The project I worked on called for a zoom in and out animation on one of the SVG's child elements, triggered by the browser's y scroll position.

In this project I used a combination of [D3JS](https://d3js.org/) and React for creating the data visualizations. I decided on taking the approach of only using D3 for non-DOM mutation tasks such as generating complex [SVG path commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) from GeoJSON, then handing those off to a React component for rendering the SVG Path to the DOM.

An alternative approach to combining D3 and React is to use a combination of [d3-selection](#) and React's [ref](https://reactjs.org/docs/refs-and-the-dom.html) utility to allow D3 to render the part of the DOM which contains the visualization (aside: this is the approach I typically take when using [LeafletJS](https://leafletjs.com/) with React). However, some in the data visualization developer community believe that this approach should generally be avoided as it 1. means having two different libraries handle DOM updates and therefore introduces more code complexity, and 2. this forgoes React's diffing algorithm which helps make DOM updates fast (Amelia Wattenberger ran [some benchmarking tests](https://twitter.com/Wattenberger/status/1123413424678027265) that seem to show React is faster at updating the DOM than D3).

There has been a lot written on the subject of various methods of combining React and D3, which I won't go into in this post any further. However if you're interested in learning more I encourage you to take a look at the writings and presentations of data vis folks such as [Shirley Wu](http://slides.com/shirleywu/deck#/4), [Amelia Wattenberger](https://wattenberger.com/blog/react-and-d3), and [Thibaut Tiberghien](https://medium.com/@tibotiber/react-d3-js-balancing-performance-developer-experience-4da35f912484).

The trade off I ran into with using the first approach is that I lost D3's magical animation capabilities (referred to as "transitions") that belong to the [d3-transition](#) module. In order to animate (or transition) part of the DOM with D3, you need to `select` it, which you can't do without using `d3-selection`. So the question then became, how would I create this animation?

## The Solution

I ended up deciding to use a combination of the [requestAnimationFrame API](#), React's `useState` and `useEffect` hooks, and D3's `interpolateZoom` method. This ended up working quite nicely, and I was pleased with the results. Unfortunately due to the confidentiality of the project, I can't show the actual source code here. However, I've ported an example from the [`d3.interpolateZoom` documentation on Observable.com](https://observablehq.com/@d3/d3-interpolatezoom?collection=@d3/d3-interpolate) that demonstrates the technique which I will cover here.

**_Pssst!_** _If you'd like to skip to the final code, check out [the demo on codesandbox.io](https://codesandbox.io/s/react-d3-animation-with-hooks-wz8cl)._

I want to start off by saying that `d3-interpolate` is such a handy module. It allows for you to interpolate not just numbers, but colors, strings, arrays, objects, and dates! Take a look at the [`d3-interpolate` documentation on ObservableHQ](https://observablehq.com/collection/@d3/d3-interpolate) for plenty of examples and explanations of how the various interpolators work.

Okay so the first thing to know about `d3.interpolateZoom` is that it will interpolate between two SVG `transform` attribute definitions. Rather than interpolating between a string, an array of 3 values is expected which represent the x, y, and size of the `transform`.

Say we have the following SVG graphic (this is stolen straight from the ObservableHQ example):

![circle and star svg]({{site.urlimg}}d3-interpolatezoom.png)

We could represent the center position and size of the circle as `[30, 30, 40]` and the start as `[135, 85, 60]`. Size here is defined either by the object's width or height, which ever is greater. We can call the first array the "start" position and the second array the "end" position.

In order to apply the SVG transformation we need to do a little math. First we need to figure out how much to scale the SVG. The dimensions of our SVG are `260` pixels wide by `190` pixels high. To get the value `k`, we simply use the following calcuation:

{% highlight js %}
const width = 260;
const height = 190;
const start = [30, 30, 40]

const k = Math.min(width, height) / start[2];
// 4.75
{% endhighlight %}

So the value `4.75` is what we'll use for our `transform`'s `scale`. Now what about repositioning the SVG origin? To do this we use some more math, which ends up looking like:

{% highlight js %}
const translate = [width / 2 - start[0] _ k, height / 2 - start[1] _ k]
// [-12.5, -47.5]
{% endhighlight %}

We may now use those values to creat our SVG transform string, which ends up being:

{% highlight js %}
const transformStart = `translate(${translate}) scale(${k})`
// "translate(-12.5,-47.5) scale(4.75)"
{% endhighlight %}

Of course we don't apply this transformation to the SVG element itself, we apply it to the top most "g" element:

{% highlight html %}
<svg viewBox="-2 -2 264 194" style="max-width: 600px">
<g id=view transform="translate(-12.5,-47.5) scale(4.75)">

  <!-- more svg markup here -->
  </g>
</svg>
{% endhighlight %}

_Note: we actually won't apply the transform string manually like above, we'll be letting React do this for us._

We use the same math for our star shape to get it's `k` and `translate` values. Now that we have both our starting and ending arrays, we can construct our zoom interpolator!

{% highlight js %}
const zoomInterpolator = d3.interpolateZoom(start, end)
{% endhighlight %}

Now, using this interpolator we may create a function that given a value `t` between 0 – 1, will return our SVG transform string:

{% highlight js %}
function transform(t) {
const view = interpolator(t);
const k = Math.min(width, height) / view[2]; // scale
const translate = [width / 2 - view[0] _ k, height / 2 - view[1] _ k]; // translate

return `translate(${translate}) scale(${k})`;
}
{% endhighlight %}

---

{% highlight js %}

{% endhighlight %}

[demo here](https://codesandbox.io/s/react-d3-animation-with-hooks-wz8cl)

One important part of this animation is that it had to be triggered programatically, I wanted the vis to wait to animate until the user scrolled to a certain part of the page.
