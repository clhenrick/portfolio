---
title: "Observable Notebooks for Data Viz Prototyping"
layout: page
date: 2021-02-06
teaser: "Elaborating on a prototyping process for a fellowship with Google.org"
header: no
comments: true
tags:
  - Observable Notebooks
  - Data Visualization
  - Prototyping
  - Google.org Fellowship
---

<style>
  small { 
    font-size: 0.9em;
    font-style: italic;
  }
</style>

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_prototyping_hero.jpg" width="100%" alt="Abstract hero image showing various data visualizations">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_prototyping_hero.jpg" width="100%" alt="Abstract hero image showing various data visualizations">
</noscript>

## Intro
The work discussed in this article stems from a [Google.org](https://www.google.org/) Fellowship that I was recently a part of with [Morehouse School of Medicine](https://www.msm.edu/)’s [Satcher Health Leadership Institute](https://satcherinstitute.org/). The goal of the fellowship was to help SHLI develop a "Health Equity Tracker" website that empowers Health Equity advocates with up to date public health data and data visualization dashboards. In this post I'll discuss the more technical nature of the data visualization prototyping work I did for the project that helped inform what the team built.

I'll cover:

- What Observable Notebooks are
- How I divided up my work into two types of notebooks
- How I used the Observable embed feature for user testing
- Some tips and tricks to keep in mind when prototyping

## Observable Notebooks

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_demo_lowfr.gif" width="100%" alt="">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_demo_lowfr.gif" width="100%" alt="">
</noscript>
<small>A short demonstration of live coding in a Observable Notebook</small>

I chose to use [Observable Notebooks](https://observablehq.com/) for my data exploration and visualization prototyping work, primarily for the useful features they provide when doing exploratory, data-driven work. Observable notebooks are akin to spreadsheets; they provide a non-linear, reactive JavaScript environment that allows for rapid feedback and abstracts some pesky aspects of the web, such as handling async processes. Notebook cells are similar to variables and may contain any number of things such as Markdown, structured data, functions, generators, blocks of arbitrary code, loops that evaluate at a solid 65 frames per second (ideal for animation), or “views” that reference the value of HTML inputs such as a slider or color picker. Cells are implicitly Promises that resolve/reject on their own, may depend on other cells, and will wait on a dependent cell to resolve before evaluating – hence the reactive environment.

If you are curious about trying Observable Notebooks I strongly encourage you to [check them out](https://observablehq.com/explore)! They have loads of documentation plus examples you can read, interact with, and “fork” to get started.

## Data Intake Notebooks

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_data_intake.png" width="100%" alt="A data intake notebook in Observable">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_data_intake.png" width="100%" alt="A data intake notebook in Observable">
</noscript>
<small>An example [“Data Intake” notebook](https://observablehq.com/@clhenrick/het-data-intake-u-s-chronic-disease-indicators-cdi-brfss?collection=@clhenrick/msm-fellowship-data-intake)</small>

An unavoidable part of the data visualization workflow and process is first getting to know your data and transforming it in a way that lends itself for a specific visualization type. This involves much more than knowing the data’s schema or structure and involves a bit of data science detective work. It’s looking for things that stand out, such as formatting issues, missing values, and outliers, and then sleuthing for the pertinent information you need. A dataset may have 100k rows and dozens of columns, but you may only need a couple thousand rows and several of those columns for your visualization. You might have to do a pivot table and transpose rows and columns in order to get the structure you need, or convert the data to a non-row oriented structure like a hashmap. For the web, requesting less data is better for performance, so reducing the “raw” data to the minimum data you need or using strategies such as chunking or streaming, is considered a best practice.

To facilitate and document exploring a dozen or more potential datasets, I decided to create what I coined a [“Data Intake” notebook template](https://observablehq.com/@clhenrick/het-data-intake?collection=@clhenrick/msm-fellowship-data-intake) that could be forked for each evaluated dataset. This helped me standardize the way in which I documented datasets, did data analysis, and allowed for linking to live data sources, such as RESTful APIs that return JSON. The great thing about notebooks is that they are living documentation that provide transparency into your work, and, in the context of Observable Notebooks, provide a starting point for other work. That could be riffing off your own idea to try something new (similar to creating a new branch in git), or someone else forking your work and possibly making a suggestion for how to improve it. The potential of Observable Notebooks for collaboration and as an educational tool is not to be underestimated.

## Data Visualization Prototyping Notebooks

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/beeswarm_plot.jpg" width="100%" alt="An example Beeswarm Plot / Chart">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/beeswarm_plot.jpg" width="100%" alt="An example Beeswarm Plot / Chart">
</noscript>
<small>A [“Beeswarm Plot”](https://observablehq.com/@clhenrick/visualizing-racial-ethnic-disparities-in-covid-19-deaths?collection=@clhenrick/msm-fellowship#beeswarm) showing disparities in COVID-19 deaths by race/ethnicity in U.S. counties</small>

This leads me to the second part of the work, prototyping the visualizations using the data I evaluated in the data intake notebooks. An incredibly useful feature in Observable Notebooks is the ability to [import cells from other notebooks](https://observablehq.com/@observablehq/introduction-to-imports). This means you have access to tons of arbitrary code, components, data, etc. from any public notebook in the Observable ecosystem. You may also load 3rd-party JavaScript libraries, using Observable’s own variation of `require`. For example, here is how you might load D3JS:

{% highlight JS %}
d3 = require("d3@6");
{% endhighlight %}

One common use case of an import in an Observable Notebook is utilizing HTML inputs that are configured as “views.” A “view” is similar to the concept of data binding. This type of imported component saves you from having to write the equivalent of event handlers in Observable. Instead you only need to write:

{% highlight JS %}
viewof myinput = inputType({ /* config options */ });
{% endhighlight %}

For example, here’s an example of a view that is a text input with autosuggest:

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_cell.png" width="100%" alt="An example Observable notebooks cell that outputs an html input">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_cell.png" width="100%" alt="An example Observable notebooks cell that outputs an html input">
</noscript>

Now when I have a chart that uses data for that selected state, e.g. `stateData = data.get(selectedState);`, it will react to any change in the selectedState input and re-render:

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_bar_chart_with_input.gif" width="100%" alt="A bar chart rendered by a Observable cell">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_bar_chart_with_input.gif" width="100%" alt="A bar chart rendered by a Observable cell">
</noscript>

Views can get a lot more complex, for example you can inline multiple views within Markdown or use an HTML `<form>` element that contains multiple inputs. Because [views are mutable](https://observablehq.com/@mbostock/views-are-mutable-values?collection=@observablehq/techniques), you may also [synchronize them with other views](https://observablehq.com/@mbostock/synchronized-views). In addition to views, Observable also has its own [HTML templating library](https://observablehq.com/@observablehq/htl) which borrows from [Lit HTML](https://lit-html.polymer-project.org/) and is globally available in all notebooks.

In the context of my [Data Visualization Notebooks](https://observablehq.com/collection/@clhenrick/msm-fellowship), I would first `import` the necessary data cell(s) from the corresponding Data Intake notebook, plus any other desirable cells such as constants or helper functions. I would then split up the notebook into sections using Markdown with headings for each visualization idea I had, and populate that section with cells used by the visualization which itself renders in a cell. Naming the visualization cells allowed me to use my visualizations externally from Observable Notebooks by embedding them into standalone web pages for user testing.

## Embedding Notebook Cells For User Testing

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_mad_lib_embed.gif" width="100%" alt="An example of embedding an Observable Notebook for a user research study">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_mad_lib_embed.gif" width="100%" alt="An example of embedding an Observable Notebook for a user research study">
</noscript>

<small>[An example](https://satcherinstitute.github.io/data-visualization/03_madlibs_compare/madlib-disease-states.html) of how I [embedded cells](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks) from an Observable Notebook into an external web page. ([Source Notebook](https://observablehq.com/@clhenrick/compare-chronic-diseases-in-us-states?collection=@clhenrick/msm-fellowship))</small>

When it came to user-testing my prototypes with our team’s UX Researcher, it was clear to me that Observable’s UI would be an unhelpful distraction for our testers. Thankfully you can embed cells from your notebook into just about any arbitrary webpage. This allowed me to create a [Github repository](https://github.com/SatcherInstitute/data-visualization) that contained minimal web pages with only the cells for visualizations that we were going to test. It also meant I could utilize CSS to create layouts that were not restricted to a vertical column layout.

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/observable_embed_example.jpg" width="100%" alt="An example of embedding an Observable Notebook for a user research study">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/observable_embed_example.jpg" width="100%" alt="An example of embedding an Observable Notebook for a user research study">
</noscript>
<small>Another example of a non-vertical layout when embedding Observable cells</small>

The process for [embedding cells from an Observable Notebook](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks) is very straightforward, and you have roughly two ways of doing it. Either simply `<iframe>` a single cell, or use the Observable runtime and notebook as a module to render cells into the DOM of the host page. Behind the scenes, notebooks are compiled to ES modules and may be either downloaded as an NPM package or imported directly into a `<script type="module">` in an HTML document. In order to use the downloaded or “hot linked” notebook module, you first load [Observable’s runtime library](https://github.com/observablehq/runtime) and have the runtime’s Standard Inspector inject all of the notebooks cells into the DOM. Alternately, you may [pick and choose which cells you want to render in a page](https://github.com/observablehq/notebook-download-example/blob/master/index.html), which is [what I ended up doing](https://github.com/SatcherInstitute/data-visualization/blob/master/01_observable_test/index.html#L61-L116). A word of caution: with embedding you lose Observable’s UI styling, so you’ll need to roll your own CSS for very basic stuff like typography, colors, etc. Any inline styles defined within a cell that is imported will be kept, though.

This capability essentially meant that for my entire prototyping process I did not need to set up my own development environment and rely on a module bundling tool such as Webpack, Rollup, or Parcel. I could take advantage of ES module support in modern browsers like Chrome and only use a local web server for getting things up and running on my machine to make sure they worked as expected for the notebook cell embedding process. If you do want to get fancy, you can [use Observable’s embedding technique with a JS framework like React](https://github.com/observablehq/examples/tree/main/react-dataflow). Cells imported by the runtime are observers, so you can watch for changes and do things like call React's `setState()` hook when their value changes / resolves.

## Tips and Advice

One problem that I ran into quickly with prototyping in Observable had to do with reusing cells across many notebooks, in particular for visualizations. The “Observable way” of reusing a chart is by doing something fancy when you import it. In addition to `import` you may also specify `with` in order to override the value of a cell from the imported notebook ([more on imports in Observable](https://observablehq.com/@observablehq/introduction-to-imports)). 

For example, say you import a cell called `chart` from a notebook that renders a bar chart, but you want to use your own data, not the data from the bar chart’s notebook. To do that you would override the notebook’s `data` cell with your own cell that has your more awesome data. It’s worth noting that for this to work you would need your data’s schema or structure to match that of the imported data. This type of import might look like the following:

{% highlight JS %}
import {chart as barChart}
with {my_data as data}
from "@d3/bar-chart"
{% endhighlight %}

In the code above, the original cell that renders the bar chart (called `chart`), is aliased as `barChart` and the original cell that contains the chart’s `data` is overwritten with a cell from the current notebook called `my_data`. So now when I create a cell that contains `barChart`, if all goes well, I should have a bar chart that uses data from the cell called `my_data`.

The problem with this approach is that if you need to render a chart more than one time, you need to repeat this type of import statement each time you need to render a chart, which is not very D.R.Y. (Do Not Repeat Yourself):

{% highlight JS %}
import {chart as chart1} with {my_data1 as data} from "@d3/bar-chart"
import {chart as chart2} with {my_data2 as data} from "@d3/bar-chart"
import {chart as chart3} with {my_data3 as data} from "@d3/bar-chart"
{% endhighlight %}

To solve this, I ended up making some reusable chart notebooks (such as a [reusable Choropleth Map](https://observablehq.com/@clhenrick/reusable-choropleth-map?collection=@clhenrick/custom-inputs)) that allow for importing a function that renders the chart. This makes using an approach such as *small multiples*, where you render many small charts of the same chart type showing different aspects of the same data, more feasible (be sure to take a look at [Zan Armstrong](https://www.zanarmstrong.com/)'s work on the [advantageous use of small multiples in data viz](https://www.youtube.com/watch?v=rdZZrrU62sc)).

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/marshall-project-small-multiples.png" width="100%" alt="">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/marshall-project-small-multiples.png" width="100%" alt="">
</noscript>
<small>Small multiples example showing COVID-19 mortality by race from [The Marshall Project](https://www.themarshallproject.org/2020/08/21/covid-19-s-toll-on-people-of-color-is-worse-than-we-knew)</small>

Lastly, I found that when you start importing cells from a few different notebooks, it becomes very important to be careful with naming (one of the harder things in programming!). I wish that I had come up with a good naming convention for my notebook cells earlier, maybe something similarly useful as [BEM is for CSS](https://css-tricks.com/bem-101/).

Thanks for reading and if you have any questions about any of what I've mentioned in this post please don’t hesitate to reach out to me.
