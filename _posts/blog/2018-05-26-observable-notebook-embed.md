---
title: Embedding An Observable Notebook
layout: page
date: 2018-05-26
teaser: "Observable: Reactive programming meets data analysis and visualization on the web"
header: no
comments: true
tags:
    - javascript
    - observable
---

Lately I've been really enjoying playing around with the new [Observable](https://beta.observablehq.com/) Javascript Notebooks created by Mike Bostock (author of D3JS), Tom McWright, and Jeremey Ashkenas. In the world of computer programming, notebooks typically combine code, visualizations, equations, and prose in a user friendly way that may be shared with others. What sets a notebook apart from a static blog post like this one is that the code in notebooks is run in real time, outputting useful stuff such as derived data and visual graphics. One of the more well known notebook formats is the [Jupyter Notebook](http://jupyter.org/), which supports a variety of programming languages such as Python, and have become very popular with Data Science folks.

Some of the main differences between Observable and Jupyter are that Observable Notebooks _run exclusively in the browser_ (no software other than a web browser is required to view or run them), _primarily use Javascript_ (although Markdown and LaTeX may also be used), and follow a _reactive programming paradigm_. This might not sound like a big deal, but it really opens doors for doing code exploration, data analysis, and data visualization on the web, not to mention being able to share you're work easily with others.

Notebooks in Observable consist of one or more (typically many) "cells" which may contain Javascript code, HTML DOM elements, Markdown, math equations, etc. Cells may also output SVG and Canvas for rendering visualizations. The reactive nature of cells in Observable means that the cells evaluate in a non-linear fashion: cells that are dependent on other cells will wait to evaluate once the cell(s) they depend on have finished evaluating. Cells do not have to evaluate from top to bottom, which from my understanding is a big difference from how Jupyter Notebooks work.

Furthermore, a lot of the idiosyncrasies of frontend web develop are abstracted away to make Javascript coding easier. For example, you may use the latest ES6/7 features in Javascript without a transpiler such as Babel. Cells in Observable work very nicely with Promises, which helps cut down on async boilerplate and mishaps. If for example cell A fetches data from an API or elsewhere on the web and cell B relies on the data returned by cell A, cell B will wait until the Promise from cell A has resolved (or rejected) before evaluating. _[More on Promises in Observable](https://beta.observablehq.com/@mbostock/introduction-to-promises)._

If you're interested in learning more I suggest stopping by the Observable website and reading some of the short introductory articles (notebooks!) like the [5 minute introduction](https://beta.observablehq.com/@mbostock/five-minute-introduction) and [Why Observable?](https://beta.observablehq.com/@mbostock/why-observable).

One of the latest features released by the Observable team is the ability to download and embed notebooks, which is what I've done below, thanks to some help from [Philippe Rivière](https://visionscarto.net/observable-jekyll/explore/2018/05/25/howto.html). Behind the scenes a notebook I've created is requesting data from a [MapD GPU database](https://www.mapd.com) and rendering visual output to an HTML Canvas element using D3JS.

Try selecting a different airline name from the dropdown menu below and you'll see the map and legend update in real time.

<p id="viewof-airline"></p>
<div class="fullwidth">
  <div id="legend"></div>
  <div id="chart"></div>
</div>

This works as follows:

First, you need to grab a link to a notebook's source code by clicking on the Ellipsis icon (`…`) and then "Download Code". I'm linking to a notebook I created called [Mapping Airline Data From a MapD Database](https://beta.observablehq.com/@clhenrick/mapping-airline-data-from-a-mapd-database), and here's the link to download that Notebook's source code:

{% highlight bash %}
https://api.observablehq.com/@clhenrick/mapping-airline-data-from-a-mapd-database.js?key=a9b1f4cfbf12cc08
{% endhighlight %}

Next, by using a `<script>` tag in your webpage you may import your notebook. Note that the type of script is not your typical `<script type="javascript">` but `<script type="module">`, which is a newer browser feature for supporting the importing of Javascript ES6 modules. This will only work in the latest web browsers, so if you're on an older version of a browser or are using Internet Explorer I'm sorry to say that you won't see the notebook embed above. _If this is the case, please upgrade your browser!_

Here's the Javascript code for this embed:

{% highlight js %}
  import {Inspector, Runtime} from "https://unpkg.com/@observablehq/notebook-runtime@1.0.1?module";
  import notebook from "https://api.observablehq.com/@clhenrick/mapping-airline-data-from-a-mapd-database.js?key=a9b1f4cfbf12cc08";

  const renders = {
    "viewof airline": "#viewof-airline",
    "legend": "#legend",
    "chart": "#chart",
  };

  Runtime.load(notebook, (variable) => {
    const selector = renders[variable.name];
    if (selector) {
      return new Inspector(document.querySelector(selector));
    }
  });
{% endhighlight %}

In the code snippet above I'm rendering cells selectively from my notebook (thanks again Phillipe!), [rather than all of them](https://beta.observablehq.com/@jashkenas/downloading-and-embedding-notebooks), so I also have to add a few DOM elements for the selected cells to mount to:

{% highlight html %}
<p id="viewof-airline"></p>
<div class="fullwidth">
  <div id="legend"></div>
  <div id="chart"></div>
</div>
{% endhighlight %}

The elements above with the `id`s are used by the Observable Runtime to mount cells to. The `div.fullwidth` simply wraps a couple of cells so that they may use the full width of the browser's viewport.

Top it off with some CSS, and 🎉🎉🎉!!!, we have Observable Notebooks embedded in our website.

{% highlight css %}
/* https://css-tricks.com/full-width-containers-limited-width-parents/ */
.fullwidth {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

/* legend styling */
path,
tick,
line {
  fill: none;
  stroke: none;
}

.label {
  font-family: sans-serif;
  font-size: 11px;
}

text {
  fill: #fff;
}
{% endhighlight %}

<script type="module">
  import {Inspector, Runtime} from "https://unpkg.com/@observablehq/notebook-runtime@1.0.1?module";
  import notebook from "https://api.observablehq.com/@clhenrick/mapping-airline-data-from-a-mapd-database.js?key=a9b1f4cfbf12cc08";

  const renders = {
    "viewof airline": "#viewof-airline",
    "legend": "#legend",
    "chart": "#chart",
  };

  Runtime.load(notebook, (variable) => {
    const selector = renders[variable.name];
    if (selector) {
      return new Inspector(document.querySelector(selector));
    }
  });
</script>


<style>
  /* https://css-tricks.com/full-width-containers-limited-width-parents/ */
  .fullwidth {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  /* legend styling */
  path,
  tick,
  line {
    fill: none;
    stroke: none;
  }

  .label {
    font-family: sans-serif;
    font-size: 16px;
  }

  text {
    fill: #fff;
  }
</style>
