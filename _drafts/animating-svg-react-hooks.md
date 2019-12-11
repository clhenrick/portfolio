---
title: "Animating SVG with D3JS and React Hooks"
layout: page
date: 2019-11-27
teaser: "SVG + React Hooks + d3-interpolate + requestAnimationFrame"
header: no
comments: true
tags:
  - Javascript
  - React
  - D3JS
  - SVG
  - Animation
---

<style>
    small {
        font-size: 14px;
    }
</style>

## Intro

Recently I've been trying out [React Hooks](https://reactjs.org/docs/hooks-overview.html), and had an opportunity to use them in a project to animate a data visualization rendered using SVG. The project I worked on called for a zoom in and out animation on one of the SVG's child elements, triggered by the browser's y scroll position.

In this project I used a combination of [D3JS](https://d3js.org/) and React for creating the data visualizations. I decided on taking the approach of only using D3 for non-DOM mutation tasks such as generating complex [SVG path commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) from GeoJSON, then handing those off to a React component for rendering the SVG Path to the DOM.

An alternative approach to combining D3 and React is to use a combination of [d3-selection](https://github.com/d3/d3-selection) and React's [ref](https://reactjs.org/docs/refs-and-the-dom.html) utility to allow D3 to render the part of the DOM which contains the visualization (aside: this is the approach I typically take when using [LeafletJS](https://leafletjs.com/) with React). The benefit of this approach is that if you already know D3JS, you can continue developing similar to how you normally would without React. However, some in the data visualization developer community believe that this approach should generally be avoided as it 1. means having two different libraries handle DOM updates and therefore introduces more code complexity, and 2. this forgoes React's diffing algorithm which helps make DOM updates fast (Amelia Wattenberger ran [some benchmarking tests](https://twitter.com/Wattenberger/status/1123413424678027265) that seem to show React is faster at updating the DOM than D3).

There has been a lot written on the subject of various methods of combining React and D3, which I won't go into in this post any further. If you're interested in learning more I encourage you to take a look at the writings and presentations of data vis folks such as [Shirley Wu](http://slides.com/shirleywu/deck#/4), [Amelia Wattenberger](https://wattenberger.com/blog/react-and-d3), and [Thibaut Tiberghien](https://medium.com/@tibotiber/react-d3-js-balancing-performance-developer-experience-4da35f912484).

One trade off, which became the subject of this blog post, that I ran into with using the first approach is that I lost D3's magical animation capabilities (referred to as "transitions" in D3JS) that belong to the [d3-transition](https://github.com/d3/d3-transition) module. In order to animate (or transition) part of the DOM with D3, you need to `select` it, which you can't do without using `d3-selection`. So the question then became, how would I create this animation?

## The Solution

I ended up deciding to use a combination of the [requestAnimationFrame API](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), React's `useState` and `useEffect` hooks, and D3's [interpolateZoom](https://github.com/d3/d3-interpolate/blob/master/README.md#interpolateZoom) method. This ended up working quite nicely, and I was pleased with the results. Unfortunately due to the confidentiality of the project, I can't show the source code here, so instead I've ported the demo from the [d3.interpolateZoom documentation on Observable.com](https://observablehq.com/@d3/d3-interpolatezoom?collection=@d3/d3-interpolate) written by [Philippe Rivière](https://twitter.com/recifs) (thank you Philippe!) to React in order to demonstrate the technique.

**_Pssst!_** _If you'd like to skip to the final code, check out [the demo on codesandbox.io](https://codesandbox.io/s/react-d3-animation-with-hooks-wz8cl)._

### SVG Zoom Transforms and Interpolation

I want to start off with an aside and say that `d3-interpolate` is such a handy module. It enables you to interpolate not just numbers, but colors, strings, arrays, objects, and dates! Take a look at the [d3-interpolate documentation on ObservableHQ](https://observablehq.com/collection/@d3/d3-interpolate) for plenty of examples and explanations of how the various interpolators work. And if the word "interpolator" or "interpolation" is just foreign tech jargon to you, then I would recommend reading the [d3-interpolate notebook on Observable](https://observablehq.com/@d3/d3-interpolate?collection=@d3/d3-interpolate) for a good introduction to the concept in the context of D3JS.

While I'm using `d3.interpolateZoom` for this tutorial, D3JS also has interpolators for both SVG and CSS transform strings. The benefit of using `d3.interpolateZoom` over these other interpolators is that it uses an algorithm for smooth zooming and panning developed by [Jarke van Wijk and Wim Nuij](http://www.win.tue.nl/~vanwijk/zoompan.pdf). Check out the [smooth zooming demo by Mike Bostock](https://observablehq.com/@d3/smooth-zooming?collection=@d3/d3-interpolate) for a good stand alone example of using `d3.interpolateZoom`.

The first thing to know about `d3.interpolateZoom` is that similar to other `d3-interpolate` methods, when given two arguments, in this case starting and ending transform values, it will return an interpolator function. Both the start and end values are expected to be tuples consisting of three numbers. The first two numbers represent the center of the transform's `x` and `y` coordinates, while the third number represents the `size` or scale of the transform. The interpolator function that is returned will accept a single value, `t`, which is expected to be a value between zero to one, inclusive. Passing a value of zero to the interpolator function will return the start transform, and passing a value of one will return the end transform. Any value between these will be an interpolated transform between the start and end transforms. Passing the interpolator function a value of `0.5` for example would return a transform representing the middle point between the start and end transforms.

Phew! If that was a lot to take in don't sweat it, things should become more clear after we dig into it some more.

Say we have the following SVG graphic:

![circle and star svg]({{site.urlimg}}d3-interpolatezoom.png)
<small>
Image credit: [ObservableHQ](https://observablehq.com/@d3/d3-interpolatezoom?collection=@d3/d3-interpolate) under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)
</small>

We can represent the center position and size of the circle as `[30, 30, 40]` and the star as `[135, 85, 60]`. Remember the first two values, `x` and `y`, represent the center of the transform. The third value, `size`, is defined either by the object's width or height, whichever is greater. We'll refer to the first array for the circle as the "start" position and the second array for the star as the "end" position.

In order to apply the SVG transformation we need to do a little math. First we need to figure out how much to scale the SVG. The dimensions of our SVG are `260` pixels wide by `190` pixels high. To get the scale value `k`, we use the following calculation:

{% highlight js %}
const width = 260;
const height = 190;
const start = [30, 30, 40];
const k = Math.min(width, height) / start[2];
// 4.75
{% endhighlight %}

So the value `4.75` is what we'll use for our `transform`'s `size` value. Now what about repositioning the SVG origin to re-center things? To do this we use some more math, which ends up looking like:

{% highlight js %}
const translate = [width / 2 - start[0] * k, height / 2 - start[1] * k];
// [-12.5, -47.5]
{% endhighlight %}

We may now use those values to create our SVG transform string, which ends up being:

{% highlight js %}
const transformStart = `translate(${translate}) scale(${k})`;
// "translate(-12.5, -47.5) scale(4.75)"
{% endhighlight %}

Of course we don't apply this transformation to the SVG element itself, we apply it to the top most "g" element:

{% highlight html %}
<svg viewBox="-2 -2 264 194" style="max-width: 600px">
  <g id=view transform="translate(-12.5,-47.5) scale(4.75)">
    <!-- more svg markup here -->
  </g>
</svg>
{% endhighlight %}

_Note: we actually won't apply the transform string manually like above, we'll eventually let React do this for us._

And here is what our SVG ends up looking like after applying the `transform`:

![svg zoomed in on circle shape]({{site.urlimg}}d3-interpolatezoom-circle.png)
<small>
Image credit: [ObservableHQ](https://observablehq.com/@d3/d3-interpolatezoom?collection=@d3/d3-interpolate) under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)
</small>

We use the same math for our star shape to get its `k` and `translate` values. When applied to the SVG it will end up looking like this:

![svg zoomed in on star shape]({{site.urlimg}}d3-interpolatezoom-star.png)
<small>
Image credit: [ObservableHQ](https://observablehq.com/@d3/d3-interpolatezoom?collection=@d3/d3-interpolate) under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)
</small>

Cool, so we now know how to use some math to apply a "zoom" transform to either of the two objects in our SVG element! That's great, but what about the in between states where we are zooming from one element to the other?

Because we have the center and size values for both our starting and ending zoom positions, we can construct our zoom interpolator as follows:

{% highlight js %}
const start = [30, 30, 40]; // cx, cy, size
const end = [135, 85, 60]; // cx, cy, size
const zoomInterpolator = d3.interpolateZoom(start, end);
{% endhighlight %}

Using this zoom interpolator from D3JS with the math from above, we may create a function that given a value `t` (between `0` and `1`), will return an SVG transform string for the transition zooms between our start and end points, inclusive:

{% highlight js %}
function getTransformStr(t) {
  const view = interpolator(t);
  const k = Math.min(width, height) / view[2]; // scale
  const translate = [width / 2 - view[0] _ k, height / 2 - view[1] _ k]; // translate
  return `translate(${translate}) scale(${k})`;
}
{% endhighlight %}

In other words, when the `getTransformStr` function above receives a value of zero, it will return the same SVG `transform` string for our circle as we calculated by hand above, and ditto for the star. Anything in between zero and one will return a transitional `transform` string that has been computed by `d3.interpolateZoom`'s algorithm.

This `getTransformStr` function will come in handy later when using React's `useEffect()` hook to animate our SVG. Let's move on to how to apply this function in conjunction with the browser's `requestAnimationFrame API`.

### Applying requestAnimationFrame

Now that we have a function that handles the zoom interpolation for us, we need to apply it to create our animation. To accomplish this we'll be using the browser's [requestAnimationFrameAPI](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). From the Mozilla documentation:

> The `window.requestAnimationFrame()` method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.  
Note: Your callback routine must itself call requestAnimationFrame() if you want to animate another frame at the next repaint.

The general idea is that we'll pass a callback function to `requestAnimationFrame` that invokes our `getTransformStr` on each "tick" of the animation. We'll call this function `ticked` and it will accept a single argument, the current timestamp of the animation which is passed to it by `requestAnimationFrame`. We'll also want some mutable variables outside of the function that store the start time and current frame of the animation, and a constant variable that sets how long the animation should run for.

{% highlight js %}

let startTime;
let frame;
const duration = 1000; // milliseconds

function ticked(timestamp) {
  if (!startTime) startTime = timestamp;

  const elapsed = timestamp - startTime;
  const t = elapsed / duration;

  if (elapsed < duration) {
    // if the elapsed time is less than the duration, continue the animation
    const transformStr = getTransformStr(t);
    frame = requestAnimationFrame(ticked);
  }
};

{% endhighlight %}

Notice that within the `ticked()` function if the elapsed time is less than the total duration of the animation we pass the value `t` to `getTransformStr()`. We also update the value of the external variable `frame` which is returned by invoking `requestAnimationFrame()` with our `ticked()` function. We'll need the value of `frame` later in order to cancel the animation, say for instance if we no longer want to run it based on some user action.

In order to start the animation we must invoke `requestAnimationFrame` with our `ticked` callback:

{% highlight js %}

// when the animation is ready to begin do:
requestAnimationFrame(ticked);

{% endhighlight %}

If we want to stop the animation before it finishes running we call `cancelAnimationFrame` with the current value of `frame` like so:

{% highlight js %}
// cancel the animation by passing it the most recent value of `frame`
cancelAnimationFrame(frame);
{% endhighlight %}

We'll add more to the `ticked` function later when we set up our `useEffect` hook in the next section, but this is the basic premise. On to applying the React hooks!

### Enter React Hooks

By now you hopefully have a decent understanding of how we are interpolating the zooming and panning between our two SVG shapes, and how this will be controlled by `requestAnimationFrame`. This next section will describe how these two concepts fit together with React's `useState` and `useEffect` hooks to "play" the animation. I won't go into the code for the entire demo, but will focus on the part that handles playing the animation.

Because we're applying an SVG `transform` to the outermost / parent "g" element, we'll create a component called `ZoomContainer.jsx` that only renders this element and its children. It will receive props for the SVG's `width` and `height`, the `start` and `end` transform tuples, and any `children`.

{% highlight jsx %}
import * as React from "react";
import * as d3 from "d3";

const ZoomContainer = (props) => {
  const {width, height, start, end, children} = props;

  // we'll update this next line soon
  let transformStr;

  return (
    <g id="zoom-container" transform={transformStr}>
      {children}
    </g>
  );
}

export default ZoomContainer;

{% endhighlight %}

So far we are:

1. passing our SVG transform string to the "g" element's `transform` attribute, and
2. passing down any React child components as children of the "g" element.

Simple enough!

Time for some hooks. First we'll set up a `useState` hook for setting and getting the transform string. This will replace the line with `let transformStr;` in the previous JSX code above. We'll provide `useState` a default value of an "identity transform" which is equivalent to no transform at all.

{% highlight js %}

// within the body of ZoomContainer

// state that handles setting the svg transform attribute string
// initially set to an "identity transform", or no transform.
const [transformStr, setTransformStr] = React.useState(
  "translate(0, 0) scale(1)"
);

{% endhighlight %}

We'll create a second `useState` hook to get and set a variable for reversing the animation. We'll be mimicking the original `interpolateZoom` demo from the D3JS docs on ObservableHQ which zooms into one shape, then back the other shape, then back to the first shape, in an endless loop. Thus we'll want a boolean value we can flip to tell the animation to run in reverse once it has finished zooming into a shape.

{% highlight js %}
// state that will replay the animation in reverse
const [forward, setForward] = React.useState(true);
{% endhighlight %}

The last variable we'll need is one that stores a reference to our zoom interpolator. We'll add this by passing `d3.interpolateZoom` the `start` and `end` props of our `ZoomContainer` component.

{% highlight js %}
// interpolator that will interpolate between the start and end zooms
const interpolator = d3.interpolateZoom(start, end);
{% endhighlight %}

Now we'll write the `useEffect` hook. This will be a longer block of code, but much of it we have already covered in the previous sections.

{% highlight jsx %}

React.useEffect(() => {
  let startTime;
  let frame;
  const duration = 3000;

  // returns a proper SVG transform attribute string
  const getTransformStr = t => {
    const view = interpolator(t);
    const k = Math.min(width, height) / view[2];
    const translate = [
      width / 2 - view[0] * k,
      height / 2 - view[1] * k
    ];
    return `translate(${translate}) scale(${k})`;
  };

  // the callback function used with requestAnimationFrame
  const ticked = timestamp => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const t = elapsed / duration;

    if (elapsed < duration) {
      // if the elapsed time is less than the duration,
      // start or continue the animation
      const transformStr = forward
        ? getTransformStr(t)
        : getTransformStr(1 - t);
      setTransformStr(transformStr);
      frame = window.requestAnimationFrame(ticked);
    } else {
      // otherwise restart the animation in reverse,
      // but wait a second so we don't have a seizure!
      setTimeout(() => {
        setForward(!forward);
      }, 1000);
    }
  };

  window.requestAnimationFrame(ticked);

  // if the component unmounts, stop the animation
  return () => window.cancelAnimationFrame(frame);
}, [forward]);
// ☝️ only fire the effect again when the value of `forward` changes

{% endhighlight %}

Notice that within the `useEffect` hook that we are utilizing our `getTransformStr` function which handles the SVG `transform` interpolation and also are using our `ticked` function with `requestAnimationFrame` from earlier. 

We've modified the `ticked` function so that it updates the value of our SVG transform string (`transformStr`) on each "tick" of the animation by calling the `getTransformStr()` function from our `useState` hook. This is important as each time this state is updated, the component will re-render. If the `forward` boolean is set to `false`, then the animation will run in reverse by passing `1 - t` to `getTransformStr` instead of `t`. This process will continue at about sixty frames per second until the elapsed amount of time exceeds the allotted duration. When that happens we'll flip the `forward` boolean via `setForward` from the other `useState` hook, which will also cause a re-render and re-start the animation. 

If the component should ever unmount, we will invoke `cancelAnimationFrame()` with the value of the current `frame` to clean things up. Finally, we pass `forward` in the arguments array to `useEffect` which tells React to only re-fire the effect when the value of `forward` changes. Phew!

That about sums up how React hooks are integrated to "play" the animation. You may find the [complete demo on Codesandbox.io](https://codesandbox.io/s/react-d3-animation-with-hooks-wz8cl). 

You will most likely not want to create an endless animation such as this in real life, but I hope this walk through and demo code gives you enough to get started with so that you can modify it to your liking or situation at hand. 

Happy animating!
