---
title: Understanding React.JS
layout: page
date: 2015-12-27
teaser: "My notes on why React.JS is such a big deal for developing web apps."
header: no
comments: true
tags: 
    - javascript
    - react.js
---

I've been hearing a lot about React.JS in the web development world as of late, and my colleauge / mentor / good friend [Eric Brelsford](https://github.com/ebrelsford) even used it recently to build a [web app](http://map.curbyourlitter.org/) that allows people to map street trash in Greenpoint, Brooklyn. However I've been slow to look into what makes React so great other than going through the [official React Tutorial](https://facebook.github.io/react/docs/tutorial.html) and messing around with it a bit. Over the holidays I finally got around to doing some research and reading up on React, and am now feeling confident that I *finally* understand why it really is such a big deal in web development. I've taken some notes on React, and attempted to put some of its core concepts into my own words, a method that I find helps me understand concepts in web-development and programming while also retaining them better.

The following notes are based on a [terrific post](http://jlongster.com/Removing-User-Interface-Complexity,-or-Why-React-is-Awesome) from [James Long](https://twitter.com/jlongster), which I originally came across via a post on [Reddit's Javascript page](https://www.reddit.com/r/javascript/comments/2uvz0x/whats_so_great_about_reactjs/). I'm not kidding, the James Long post really is terrific! He uses the core concept behind React as an inspiration to code a similar (albeit far more minimalistic) framework he calls "Bloop.JS" *from scratch*, and demos the concepts using Bloop.JS in a sidebar of the post which changes as you're reading it. Why go through the trouble of doing this? It has the benefit of using a minimal amount of code to demo the concepts behind React (Hella Applause!!!)

## Some Notes on React
Okay, so here's the main take away as I understand it: React changes how developers approach creating web applications via the traditional Model-View-Controller (MVC) framework, where logic and data are bound to HTML.

Instead of manually creating UI components by writing HTML markup or HTML templates (views) and then manipulating them with JS, eg: passing them data (models), all UI components (HTML markup) are created via classes in Javascript using HTML-like syntax referred to as JSX. (However it's not necessary to use JSX in React).

A typical application setup might involve creating a single `App` component which contains the structure & logic of the web application, then additional components for each User Interface (UI) element (eg: a navbar, button, form, etc.)

Here's the thing; components don’t have access to the app’s state but *are updated* when the app’s state changes. This is accomplished via data being passed down to the components and events being triggered up through handlers.

The entire app is re-rendered on a state change. This has the benefit of not keeping track of which individual pieces changed, which didn’t, and altering the ones that did. Read super tedious! 

React does this via a “virtual DOM”, though for the sake of simplicity the author of the article replicates this concept via the browser’s native (`requestAnimationFrame`)[] method. Though apparently React can also use this method to "paint" the DOM.

The `requestAnimationFrame` method creates an infinite while loop that allows changes to be made on the DOM at 60 frames per second, and is typically used for creating actual animations in the DOM (think games). The DOM is being re-rendered so fast that it appears as if it has remained static when no state changes are happening. As updates to the app's state happen the DOM is then continuously “repainted” with whatever state the app is in. 

A side note: this technique is referred to as **immediate mode** and was first used / discovered by game developers so that only the surface area being viewed by the user was rendered, not everything at once. This reminds me of the similar solution used to display tiles in web maps: only tiles within and just outside the map’s current bounding box are loaded.

Typically the web uses **retained mode**, where the DOM exists in memory and “gets poked at” when things are updated, eg from user interactions.

Both **immediate mode** and **retained mode** have benefits and draw backs, but a framework like React appears to have “the best of both worlds”; claims the author of the post mentioned above.
  
React's **virtual DOM** is used to determine what has changed from the actual rendered DOM. React “diffs” the virtual DOM from the rendered / actual DOM to decide which components of the actual DOM need to change, as the app’s state changes. What an elegant way to sync an app's state with a GUI!

Another benefit of this level of abstraction makes it easy to “go back in history”, eg to a previous state and then re-render the UI accordingly. The author does this by creating a sort of "to-do list" with an "undo" button. Each time you add a new item to the list, a copy of the app's state is appended to an data store (array) of states called `prevStates`. Upon hitting the undo button, `prevStates.pop()` is called to retrieve the last state prior to the current one, and then that previous state is passed to the app, re-rendering the UI!

Downsides of this approach? React apparently puts everything in the global namespace, though I'm sure there are ways around this. In the author's example `App` is created as a global, and then so are all of the components and helper functions. React also does away with the module approach, which I have become accustom to using and which I'm sure others may be disapointed by who tend to use Browserify. Though there must be a sensible way to combine both Broswerify and React?

There are still issues the author didn't addressed such as routing, data stores, and controllers; though he does mention some other 3rd party libraries to help abstract concepts that play nicely with React such as immutable data structures with ClosureScript. 

Needless to say I'm feeling a lot more inspired to actually use React for my next project, so a big thanks to James Long for writing that post!