---
title: Using the Module Pattern in Javascript For Web Mapping
layout: page
date: 2015-11-15
teaser: "The benefits of using the Javascript module programming pattern to build client-side interactive web mapping applications."
header: no
tags: 
    - javascript
    - web-mapping
    - programming patterns  
---

In the past handful of projects I've been developing I've been using the module programming pattern in Javascript to help keep my code more organized and avoid polluting the global name space (more on that later). Fairly recently a colleauge of mine asked about it when he was looking to implement the module pattern for an interactive web-map he's currently building. He forwarded me [a really good article he found](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) about it written by [Ben Cherry](https://twitter.com/bcherry) which inspired me to revisit it.

I was first exposed to the module pattern through my colleauge and then teacher at Parsons, [Mani Nilchiani](http://maniartstudio.com/), while I was taking the "Web Advanced" class during the second semester of my MFA program in the spring of 2014. In the class we used the module pattern to build a simple, database driven, web app with [Node.JS](#). Through playing around with this pattern I found that it also worked well for client-side development. It plays really nicely when using tools like [CartoDB](https://cartodb.com) that have taken a lot of the need for server side and database programming out of the picture.

After reading the article my colleague sent me I was eager to try out **loose augmentation** with the module pattern. Prior to this I had used **sub-modules** which worked fairly well, but I found that I was running into the problem of having to load all of my files in a very particular order rather than **asynchronously,** which is of course Javascript's and the web's true nature.

I thought I'd write about how using **loose augmentation** has been working well for a data-viz / web-mapping project I'm current working on, [Landscapes of Profit](https://github.com/NYC-REIC/interactive). (You can learn more about the project's motivation and methodology at [landscapesofprofit.com](http://www.landscapesofprofit.com)).

## The Module Pattern
This basically involves **name spacing** your entire app within a global variable, what I typically call `app`. The `app` object is a function wrapped in `()`'s which tells Javascript to call the function as soon as the script has been loaded. Everything declared inside the `app` is then **private** or *not accessible* outside of the function, unless it is **returned** by the function. Here's an example:

{% highlight javascript %}

(function() {
    // all our code goes in here...
    // the following variable won't be accessible 
    // outside of this function
    var myPrivateVariable = "hi!";    
})();

{% endhighlight %}

Right now it's a little abstract but the benefit of doing this becomes more apparent as we dive a little further into the module pattern. Next we **name space** our function so that it can be referenced under a **global variable**, thus making it a container for our code. The naming convention `app` is a commonly used one that will likely make sense to others reading your code.

{% highlight javascript %}

var app = (function() {
    // an object that will contain our public variables
    // we will add things to this and return it at the end
    var my = {};
    // all our code goes in here...
    // the following variable won't be accessible 
    // outside of this function
    var myPrivateVariable = "hi!";
    // this next variable will be accessible as we return it
    my.publicVariable = "waz up???"

    return my;

})();

{% endhighlight %}

If we load our code in a browser, bust open our javascript console, and type in `app.` we see that we have access to `publicVariable` but not `myPrivateVariable`. This is because we **export** the `publicVariable` by attaching it to the object `my` and then returning it at the end of our function. `myPrivateVariable` stays hidden within our `app` function / object (everythings really an object in javascript, remember???) and cannot be referenced outside of the `app`. 

This helps accomplish one of the "best practices" of programming in javascript for the web, avoiding having "global variables".

We can also import globals into our module as well and act on them:

{% highlight javascript %}

var app = (function(w,d,$) {
    var my = {};
    // all our code goes in here...
    // the following variable won't be accessible 
    // outside of this function
    var myPrivateVariable = "hi!";
    // these next variables will be accessible as we return them in `my`
    my.$body = $('body');
    my.hash = w.location.href;
    my.divs = d.querySelectorAll('div');

    return my;

})(window, document, jQuery);

{% endhighlight %}

Here we are importing three **global** objects, **aliasing them**, and using them in our module. This works well for a few reasons; it's clearer and faster than implied globals, and it lets us shorten (or **alias**) names for imported globals if we need to. Another reason I like it is that it lets me know what globals I'm using for each of my modules, similar to the `var mod = require('module-name');` pattern in Node.JS. Oh and you don't need a third party library like [Require.JS](#) or [Browserify.JS](#); though there are plenty of darn good reasons to use those libraries.

## Loose Augmentation vs. Sub Modules
Now back to the original point of writing this post! Previously I used the **sub-module** method with the module pattern. Assume each time  `var app = app || {};`  is stated it is referring to the start of another file.

{% highlight javascript %}
// app.map.js
var app = app || {};

app.map = (function($,CDB, L) {
   // all of our code for "map" here
})(jQuery, cartodb, L);

// new file: app.gui.js
var app = app || {};
app.gui = (function(w,d,$) {
   // all of our code for the GUI here 
})(window, document, jQuery);

{% endhighlight %}

In this example `app.map` and `app.gui` are in two separate files and contain the code for the map and GUI respectively. This works fairly well but I found that I wanted to try **loose augmentation** for my most recent project, [Landscapes of Profit](#):

{% highlight javascript %}

var app = (function(parent, $){
    
    parent.myMethod = function() {
      // a method that does something related to this module...
    };

    return parent;

})(app || {}, jQuery);

{% endhighlight %}

**Loose augmentation** works by declaring the variable `app` when we define our module function, rather than having `var app = app || {};` beforehand. We also import `app || {}` into our module and alias it as `parent`. This is like the earlier examples and allows us to "augment" or add things to our `app`, like how we did with `var my = {};`. I've found that the benefit of this approach is that it seems to work a little better with Javascript's asynchronous nature. I ran into a problem with the sub-module pattern in coding [Am I Rent Stabilized?]() where all my modules had to load in a very specific order. The approach demonstrated above seems to be a little more flexible.

If you'd like to browser examples of apps I've written that use both the **loose augmentation** or **sub-module** approach with the module pattern in Javascript feel free to browser the following code:

- [Landscapes of Profit]() :: loose augmentation
- [Bushwick Community Map]() :: sub-modules

Thanks for reading and happy module writing!


