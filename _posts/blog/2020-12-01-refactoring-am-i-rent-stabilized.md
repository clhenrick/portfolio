---
title: "Refactoring Am I Rent Stabilized"
layout: page
date: 2020-12-01
teaser: "Notes on improving the code of a five year old project."
header: no
comments: true
tags:
  - Javascript
  - Refactoring
  - Code Quality
  - Testing
---

<img class="lazy" data-original="{{site.url}}{{site.baseurl}}/images/airs01.jpg" width="100%" alt="Am I Rent Stabilized home page">
<noscript>
  <img src="{{site.url}}{{site.baseurl}}/images/airs01.jpg" width="100%" alt="Am I Rent Stabilized home page">
</noscript>

## Motivation

[_Am I Rent Stabilized?_](1) continues to be a successful project; according to Google Analytics it still gets around 1,200 views and (double that for "impressions") a month! However the last time I significantly touched the code for _AIRS_ was over five years ago, back when I was still a fledging programer and web developer. Not surprisingly, I more recently found the code difficult to reason about, making it hard to add new features, fix bugs, or make necessary improvements such as those relating to web accessibility. I realized then, that if this project were to have a chance of living on, it would need a significant refactor. In this post I outline how I refactored _AIRS_; the goals and non-goals I set for myself, decisions I made along the way, and what I learned from it. This post will read more like a design document, so apologies in advance for the lack of polish in my writing.

Part of what motivated me to do this refactor was reading [Martin Fowler](#)'s infamous book, [Refactoring](#). MF's book not only provides a wide range of strategies for refactoring code, but also does a good job at justifying why refactoring is (or for many teams should be) a central part of software development. Refactoring the source code for _AIRS_ offered a different set of challenges than my current day job as a [UX Engineer](#) where I tend to focus on prototyping UIs and data visualizations for the web. Though my prototyping work often acheives a high level of complexity, it is generally considered to be "throw away code", meaning that it never sees the light of day in the actual product. The goal of prototyping is typically to validate or invalidate a hypothesis made by UX designers, UX researchers, and project managers. Thus the implementation of a prototype is not what is important; the learnings from it or the stakeholder buy in it helps generate is.

I think there's something to be said about the importance of maintaining successful projects, or at least ones you dearly care about, versus sticking with only doing new projects on the side. I have not worked on a side project as the sole contributor in a good number of years, so I saw the appeal in doing things how I saw fit without having to spend time discussing and debating decisions with other contributors or team members. Even though side projects are still work, this can make the work a bit more enjoyable and a relief from the occasional tension and conflict inherent in team work.

## Goals
Here are the goals of the refactor I decided upon:

1. Make the code easier to reason about by improving its organization and structure
  - use the common `src/` directory approach with sub directories for related pieces, e.g. `components/`, `utils/`, `actions/`, `reducers/`,  etc.
  - reduce code bloat by aiming to keep classes and functions small (say under 300 lines)
  - aim for being DRY but try not to preemptively optimize for this. To me this means waiting to abstract code after it's apparent there's duplication, instead of trying to abstract it right away when writing it.

2. Improve code quality:
  - use ES6 syntax
  - use ES modules
  - use ESLint for JavaScript linting
  - use StyleLint for (S)CSS linting
  - use Prettier for code formatting
  - add a commit hook that runs both Prettier and ESLint so that these tools run automatically
  - write unit tests using Jest
  - achieve good test coverage (>= 75%)

3. Remove unnecessary 3rd party JS dependencies (e.g. jQuery, CartoDB.js, Leaflet, etc.)
  - many of these aren't absolutely needed for what the app does
  - some can be replaced using native browser features (e.g. `fetch`) or smaller 3rd party libraries (e.g. d3-geo)
  - although optimization isn't a goal, by reducing the amount of 3rd party JS the site should load faster for users on mobile and slow internet connections

4. Update the frontend build system and configuration to be more robust
  - the Gulp file and usage of Browserify was a bit messy and not easy to reason about, but maybe that's just because I've become so used to working with Webpack
  - Utilize Webpack as a build system with Babel for transpiling ES6+ to ES5, code splitting, code minification, source maps, Sass, etc.

5. Have Continuous Integration and automatic deploys integrated with Github
  - Use Netlify for deploys and PR preview deploys, it's so easy and helpful!
  - Set up a Github Action for a CI build on PRs that also runs the unit tests

## Non-Goals

- Port the code to a JavaScript framework. This felt like the refactoring effort would have instead become a complete rewrite of the existing code. Again, the primary goal was to untangle the existing code to make it more easy to reason about, not to use the latest, greatest, shiny tech. Besides, out of the 4 pages that make up the site, only the main page requires a lot of JavaScript, the other 3 pages are essentially static content and don't require handling things such as managing application state and data flow.

- Port the code to TypeScript. As much as I've enjoyed working with TypeScript lately, it felt like doing so would be adding more complexity to the refactoring effort than was needed. TypeScript can always be added incrementally later if I chose to do so.

- Solve all the a11y problems. There are quite a few of them that I intend to fix, and when it wasn't too much effort to do so while refactoring I went ahead and did it. For the other a11y issues I intend to file issues and fix them separately later after doing a full a11y audit.

- Optimize for performance. In MF's Refactoring, he talks about how prematurely optimizing for performance can really hurt the readability of code and thus the ability for humans to reason with it. He suggests focusing on the refactoring  first, then finding out where performance bottle necks may be occuring and to address them when necessary.

- Focus on adding new features. I don't really have any new features to add at this point anyway, so not a problem. I did end up adding autosuggest to the address search though, so I guess that counts as a new feature!

- Make it an opportunity to use a new fancy shiny piece of web tech. See my note above for why I didn't port the code to a JavaScript framework like React, Svelte, or Vue.

## Decisions

Perhaps most importantly, I chose not to use a JavaScript framework. I decided that adding a framework would be overhead that would get in the way of untangling and refactoring the existing code, which was written using a combination of jQuery and the [ES5 module pattern](#).

Ultimately I decided to:

- Keep the existing [HandlebarsJS](#) templates because it's how localization was implemented. I decided it would have added more work to port the Handlebars templates to regular HTML and use a JavaScript library such as [i18next](#) for translations without the help of a JS framework. That being said, I may end up doing this later as having the page load without relying on JavaScript [has very tangible benefits](#).

- Break up the translation JSON files by page name and two letter language code to make them easier to reason about. Previously there was one JSON locale file per HTML page, and each file contained translations for all 3 languages. Breaking them up made them easier to edit and compare.

- Organize the code methodically and consistently following the component pattern to decouple features using ES6 classes. Each interactive element on the page received its own `Component` class, and inherited from a `super class` so that components would retain similar functionality.

- Use [ReduxJS](#) for application state management. Redux is well known among the JS community, and while it is criticized for requiring a lot of boilerplate to get started, I find it to be a super useful library for managing shared application data and state. I find the Redux Dev Tools to be enormously helpful for seeing what's going on during state changes.

- Use [Webpack](#) as a module bundler with Babel, Sass, etc. Previously I was using GulpJS as a build system, but the Gulp file I had was messy and not taking advantage of bundling ES6 modules and tree shaking. I originally began rewriting the Gulp file and upgrading its dependencies, however it quickly started to feel like going down a rabbit hole. Ironically, with all the criticism Webpack seems to get for being complicated and difficult to configure, I feel that I know it well at this point from having used it in so many other projects, so decided to make the switch.

- When possible, host 3rd party JavaScript dependencies instead of relying on CDNs for them. Previously dependencies were either linked to via a CDN or copied to a directory in the git repository. Now most 3rd party dependencies will be installed using `npm` or `yarn`.

- Favor native browser APIs such as `fetch` and remove some existing JavaScript and CSS dependencies like  jQuery, CartoDBJS, and Leaflet that aren't absolutely needed. Cutting down on JS and CSS has the benefit of helping the site load faster, especially on slower or spotty network connectivity.

  - For example with the map on slide four that shows properties that likely have rent stabilized apartments, I decided to use `d3-geo` and `d3-tile` (which are now published as ES modules) with the [Carto Maps API](#) to render the map. The map is essentially what amounts to a static image (it doesn't allow for zooming, panning, click, or hover interactions) so there's no need for a full featured web mapping library like Leaflet or MapBoxGL. In fact, when I later saw [this Observable Notebook on how to make a webmap from scratch](#), I realized I could even get by without `d3-geo` and `d3-tile`! Sigh.

- However, in some cases I decided to keep an existing dependency. For example, I retained the [GSAP web animation library](#) for smooth scrolling behavior. Although there's now browser support for [native smooth scrolling](#), it isn't 100% supported by Safari and would require a polyfill for IE. While investigating what seemed like [the recommended polyfill](#), it didn't seem like it would even solve for my use case. Even with the native browser smooth scroll, you can't control the duration of the transition or its easing property like you can with [GSAP's ScrollToPlugin](#). So instead of removing GSAP I upgraded it from version 1.x to 3.x. This had the additional benefit of using GSAP and the ScrollToPlugin as ES modules, so I could incorporate them into my Webpack build system and not load them from a CDN as globals like I was previously doing.

- Write unit tests
  - Part of what MF advocates for to make the refactoring process go smoother;
  - When you need to change code later you can feel more (though not entirely!) reassured that you're not breaking anything while making changes and seeing that the tests pass
  - This was a new challenge to me, typically don't ever write tests at all!
  - It definitely made the process feel slower, ended up writing 2-3x as much code as I originally anticipated
  - I learned a lot though, deciding what to test and writing good tests can be their own sort of puzzles to solve.
  - Next time I write tests with Jest I'll definitely be faster with it thanks to putting in this work!

- Use Netlify
  - The preview deploys that you get for free with using Netlify are enormously helpful, e.g. for cross browser testing, CI/CD, or when presenting changes to clients and team members.
  - Automated builds / deploys when pushing to the main git branch
  - Hosting the site & SSL
  - It's all FREE! (until you hit some limit for build minutes I think)

## The Refactoring Process
The first step in the refactoring processed involved reviewing the existing JS code to understand how it was structured; I needed to know what each module, code block, and function was doing. Long story short, it was a mess! I had abused the [ES5 revealing module pattern](#), name spaced parts of the code unnecessarily deeply, and used very terse variable names at times which made it difficult to understand what any one part of the code was doing and how it might relate to another. I didn't do a good job modularizing the code either, there were bits of related logic spread throughout various modules which definitely wasn't a good organizational practice.

Even though I was aiming to only use vanilla JS I still had bits of jQuery in a lot of places. I teased out logic that was worth keeping and could be improved while also deciding what was worth throwing away. I mainly focused on the JS, deciding not to refactor the styles which use Sass, but I did make small changes or improvements to the Sass code when I felt it was necessary or not too big of a lift.

I began the written refactoring by first creating two entry points for Webpack, one for the main page / app, and another for the three `info/*.html` pages. This enabled [code splitting](#) (for both JS and CSS), which helped keep the bundles generated by Webpack smaller. The main (`index.html`) page is where the actual "app" is, the other pages are just static content, so they don't need to load all of the same code. A user may have just bookmarked the `why.html` page for example, so when they immediately go to it, only serve what's needed (minimal JS and CSS).

I then focused on refactoring the translation & Handlebars template loading logic. This is an important part of code to make crystal clear, as it is essentially how the entire site renders on page load and when a user toggles the language of the page.

The process is roughly:

1. Check for a language code in the browser's [Local Storage](#).
2. Check for the HTML page's base name.
3. Load the correct Handlebars template file based on the page name
4. Load the correct locale JSON file based on the language (default to English).
5. Use a dynamic `import` to grab the correct initialization script (for `main` or `info`)
6. Render the page using the Handlebars template and JSON locale
7. Invoke the initialization script to set up interactivity.

As mentioned earlier, components were created for all interactive elements on the main page that required JavaScript. An example of this are the buttons such as "Begin" and "Next" that trigger smooth scrolling to a slide further down the page.

To tackle the interactive elements, I created a base `Component` class to handle common patterns, such as adding and removing event listeners, checking for a DOM node parameter, and providing a cleanup method. [ES6 Classes](#) are definitely an improvement over JavaScript's constructor function, the previous pattern for doing classical programming in JS. For example, I ended up using getters and setters in ways that helped remind me of whether or not a class property could be overridden, and if so, how.

Here's what that class looks like:

{% highlight JS %}
/* Class that all Components which rely on a DOM node inherit from */
export class Component {
  /**
   * @param props.element The Component's DOM node. (Required)
   * @param props.store The Redux store singleton (Optional)
   */
  constructor(props = {}) {
    if ("element" in props && props.element instanceof HTMLElement) {
      this._element = props.element;
    } else {
      throw new Error("Component requires a valid DOM element prop");
    }

    if (
      "store" in props &&
      typeof props.store === "object" &&
      typeof props.store.dispatch === "function" &&
      typeof props.store.getState === "function" &&
      typeof props.store.subscribe === "function"
    ) {
      this._store = props.store;
    }

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.checkForStore = this.checkForStore.bind(this);
    this.cleanUp = this.cleanUp.bind(this);

    this.init(props);
  }

  // Do any other setup work here such as add more class properties,
  // fetch data, etc. Make sure to call this.bindEvents() here.
  // @param Props:  props are passed as an arg from the constructor.
  init(/* props */) {}

  // Add any DOM event listeners
  bindEvents() {}

  // Remove any DOM event listeners
  removeEvents() {}

  // placeholder to unsubscribe from redux store, if subscribed to
  unsubscribe() {}

  // can be used to make sure a store is passed when a component relies on it
  checkForStore() {
    if (!this.store) {
      throw new Error("Requires redux store as a prop");
    }
  }

  // call prior to removing component instance
  cleanUp() {
    this.unsubscribe();
  }

  get element() {
    return this._element;
  }

  set element(el) {
    this._element = el;
  }

  get store() {
    return this._store;
  }
}
{% endhighlight %}

And here is an example of a component that inherits from that base class:

{% highlight js %}
import { Component } from "./_componentBase";
import { goToNextSlide, goToSlideIdx } from "../action_creators";

export class AdvanceSlides extends Component {
  constructor(props) {
    super(props);
  }

  init(props) {
    super.checkForStore();

    if ("advanceToIdx" in props && typeof props.advanceToIdx === "number") {
      this.advanceToIdx = props.advanceToIdx;
    }

    if ("buttonSelector" in props && typeof props.buttonSelector === "string") {
      this.button = this.element.querySelector(props.buttonSelector);
    } else {
      throw new Error("Requires a CSS selector for its button");
    }

    this.handleClick = this.handleClick.bind(this);
    this.advanceToSlide = this.advanceToSlide.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.bindEvents();
  }

  bindEvents() {
    this.button.addEventListener("click", this.handleClick);
  }

  removeEvents() {
    this.button.removeEventListener("click", this.handleClick);
  }

  handleClick(event) {
    event.preventDefault();
    this.advanceToSlide();
  }

  advanceToSlide() {
    if (this.advanceToIdx !== undefined) {
      this.store.dispatch(goToSlideIdx(this.advanceToIdx));
    } else {
      this.store.dispatch(goToNextSlide());
    }
  }
}
{% endhighlight %}

I ended up being quite pleased with writing components this way. I found it to be simple yet flexible enough to obfuscate the need of a JavaScript framework for _AIRS_. It felt good to know that you can still make highly interactive and dynamic websites in 2020 without using a JavaScript framework 🥰.

When appropriate, I extracted a Component's corresponding HTML from the app's Handlebars template into a separate Handlebars partial and named it similar to its component class name. This helped make it clear what HTML belongs to what component and could prove to be useful in the future if I eventually do decide to port the code to a JavaScript framework or perhaps maybe use the ever so dreaded Web Components spec.

Additionally for each component class, I wrote a series of tests. Martin Fowler advocates for tests to make your code more resilient when refactoring it. One recommendation MF advocates for when writing tests that I found to be fun is to deliberately break the tests to make sure they work as expected. Or to see what happens when you deliberately use your code in unexpected ways, and to test for that. Writing tests can be a bit like solving puzzles; it's not always apparent what to test for and how to test it. Getting to know Jest and friends (e.g. JS DOM) was also a bit of a learning curve. In the end I'm glad I put in the effort, as I know when I write more tests in the future that it won't feel so foreign or difficult.

Adding Redux actions and reducers as needed, e.g.
slides: for tracking the index of the current slide
address search: for tracking the data returned by the NYC Planning Labs' geocoding API's autosuggest and search endpoints
likely RS: is the address searched by the user likely to be rent stabilized?
local tenants rights groups: list of tenants rights groups that are near the searched address

## Outcomes
The refactor of _AIRS_ ended up being over four hundred commits over a period of three or four months. Doing this in my free time was not easy, but I found that I could chip away at it here and there to slowly make progress. There were definitely some big pushes at times and at some point I had to decide when to call it "good enough" and merge the changes. I didn't get around to everything in the refactor, notably the tenants rights groups spatial search, but I plan to add that back soon. Finally, I decided on adding a Changelog file to track significant changes to the code and site. I should probably add a Code of Conduct as well for contributors, as well as a License file.

Oh the things you learn as time goes on! Looking back at my original code helped me reflect on how much I've grown as a programmer and web developer, how much the world of browsers and web development has changed, and what I consider to be important when building websites and UIs these days. The entire concept of "componentizing" your UI was just beginning to take off around 2013-15, and now in 2020 it's so entrenched in how us developers build UIs it almost seems inconceivable to do otherwise. Browsers have of course changed in the past five years as well; new APIs are being unveiled while more features become standardized across browsers. Webpack was still fairly new in 2015 and not widely used as a frontend build tool. While I've always valued User Experience, I've come to learn a lot more about it from my current job as a UX Engineer. This makes me feel more motivated to fix the accessibility issues with _AIRS_; for example very naughty things like `<div>` elements disguised as buttons.

Here are some other bits of info following the refactor:

Metrics:  
- Page load time before and after the refactor: (TODO)
- Amount (in KB) of JS before and after
  - 3rd Dependencies: (TODO)
  - Source Code: (TODO)
- Amount of CSS before and after: (TODO)
- Lighthouse score: (TODO)


Improved developer productivity:  
- Modern frontend build system
- Automated deploys and preview deploys
- CI builds
- Automatic code linting and formatting
- Unit tests

Some possible next steps:  
- Integration or end to end tests?
- Improving accessibility
- Refactoring the CSS
- Integrating a backend service to remove the need for a CARTO account

Phew, that was a lot! Thanks for reading, hopefully this post will motivate you to try to do some refactoring of your own if it's something you have yet to try out. And don't forget to read Martin Fowler's book [Refactoring](#) either, if you haven't yet done so. Happy refactoring!


[1]: https://amirentstabilized.com/ "Am I Rent Stabilized?"