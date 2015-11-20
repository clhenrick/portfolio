---
title: Using the Module Pattern in Javascript Programming
layout: page
date: 2015-11-15
teaser: "The benefits of using the Javascript module programming pattern to build client-side, interactive, web-mapping applications."
header: no
comments: true
tags: 
    - javascript
    - web-mapping
    - programming patterns  
---

In the past handful of interactive web projects I've created I've been using the module programming pattern in Javascript to help keep my code efficient, organized, and to avoid polluting the **global name space** (more on that later). Fairly recently a friend of mine asked about how I used the module pattern as he was looking to implement it for an interactive web-map he's currently building. He forwarded me the [Adequately Good article on the subject](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) written by [Ben Cherry](https://twitter.com/bcherry) which inspired me to revisit it and write this blog post.

I was first exposed to the module pattern through my now colleague and then teacher at Parsons, [Mani Nilchiani](http://maniartstudio.com/), while I was taking the "Web Advanced" class during the second semester of my MFA program in the spring of 2014. In the class we did a deep-dive into Javascript; we learned about [**closures**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) and how they can be exploited for the module pattern. In his class we used the module pattern to build a simple, database driven, "to-do" list / web app with [Node.JS](https://nodejs.org/). This app was also used to learn the concept of [**models** and **views**](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), or the concept of tying data to user interface elements in websites. Through exploring these programming concepts I found that I enjoyed using the module pattern for developing web-projects that use interactive maps.  

After reading the Adequately Good article that my colleague sent me I was eager to try out **loose augmentation** with the module pattern. Prior to this I had used **sub-modules** which worked fairly well, though felt like at times it made my code overly complex. Perhaps **loose augmentation** would be a simpler or easier to implement.

As an example I'll show how using **loose augmentation** has been working well for a data-viz / web-mapping project that I'm current working on with some other folks, [Landscapes of Profit](https://github.com/NYC-REIC/interactive). (*side note: You can learn more about the project's motivation and methodology at [landscapesofprofit.com](http://www.landscapesofprofit.com)*). I'll also show how I used **sub-modules** for a project I created previously, [The Bushwick Community Map](http://www.bushwickcommunitymap.org).

## The Module Pattern
I'll start by showing an example of wrapping an **anonymous function** in `()`'s, aka a **closure**, which tells Javascript to call the function as soon as the script has been loaded. Right now this may seem a little abstract, but the benefit of doing this becomes more apparent as we move to the module pattern in this next example.

{% highlight javascript %}

(function() {
    // all our code goes in here...
    // the following won't be accessible 
    // outside of this anonymous function
    var myPrivateVariable = "hi!";

    function logVar() {
      console.log(myPrivateVariable);
    }

    logVar();

})();

// output from the console:
// "hi!"

{% endhighlight %}

The next step involves assigning the closure to a variable, what you might decide to call `app` (a naming convention that others reading your code will likely understand). This example, like the previous, uses another closure (function wrapped in `()`'s) which tells Javascript to call the function as soon as the script has been loaded. Again, all variables and functions declared inside the `app` are **private** or *not accessible* outside of `the function`, unless they are **returned** by the function. 

{% highlight javascript %}

var app = (function() {

    // "my" is an object that will contain our public variables
    // we will add things to this and return it at the end
    var my = {};

    var myPrivateVariable = "hi!";

    // this next variable will be accessible as we return it
    my.publicVariable = "waz up???"

    function logPrivate() {
      console.log(myPrivateVariable);
    }

    logPrivate();

    return my;

})();

// in the console the following is displayed, 
// a result of calling logPrivate() in our app:
// hi!

console.log(app.publicVariable);
// returns: "waz up!"

console.log(myPrivateVariable);
// returns: Uncaught ReferenceError: myPrivateVariable is not defined

{% endhighlight %}

If we load our code in a browser, bust open our javascript console, and type in `app.` we see that we have access to `publicVariable` but not `myPrivateVariable`. This is because we **exported** the `publicVariable` by attaching it to the object `my` and then returning `my` at the end of the code inside our function. The `myPrivateVariable` variable stays hidden within our `app` and cannot be referenced outside of the `app`. 

This helps accomplish one of the "best practices" of programming in javascript for the web, avoiding having lots of **global variables** or worse yet **implied globals**. (An implied global is what you get when you first declare a variable without the `var` in front, something to pretty much always avoid doing.) 

We can also import globals into our module as well and act on them:

{% highlight javascript %}

var app = (function(w,d,$) {
    var my = {};

    var myPrivateVariable = "hi!";

    // these next variables will be accessible as 
    // we return them in the `my` object
    my.$body = $('body');
    my.hash = w.location.href;
    my.divs = d.querySelectorAll('div');

    return my;

})(window, document, jQuery);

// use the public "$body" variable to create an h1 tag in 
// the DOM's body element that contains the text "Hello World!"
app.$body.html('<h1>Hello World!</h1>');

{% endhighlight %}

Here we are importing three **global** objects, **aliasing them**, and using them in our module. This method is clearer, faster, and less prone to bugs than using lots of global variables, which can make it difficult to isolate and reuse our code in new contexts. It also lets us shorten (or **alias**) names for imported globals if we need to, eg: `window` can be aliased as `w` for short. Another reason I like this pattern is that it lets me keep track of what globals I'm using in each of my modules, kind of like the `require()` method in Node.JS. Not to mention you don't need a third party library to implement it. Though if you are used to using Node.JS then [Browserify](http://browserify.org/) is super helpful for importing Node modules in your client side Javascript.

## Loose Augmentation vs. Sub Modules
Now back to the original point of writing this post! Previously I used the **sub-module** method with the module pattern. In the following example assume each time  `var app = app || {};`  is stated it is referring to the start of another file.

{% highlight javascript %}
// app.map.js
var app = app || {};

app.map = (function($,CDB, L) {
   // all of our code for "map" here
})(jQuery, cartodb, L);

//------ new file ------
// app.gui.js
var app = app || {};

app.gui = (function(w,d,$) {
   // all of our code for the GUI here 
})(window, document, jQuery);

{% endhighlight %}

In this example `app.map` and `app.gui` are in two separate files and contain the code for the map and user interface respectively. This is helpful when we are creating a more complex app and don't want to end up with an insanely long Javascript file. Instead we split our code into separate modules, each module lives in a separate file. The sub-module method works fairly well but I found that I wanted to try **loose augmentation** for my most recent project, [Landscapes of Profit](https://github.com/nyc-reic/interactive/). Here's an example of using loose augmentation:

{% highlight javascript %}

var app = (function(parent, $){
    
    parent.myMethod = function() {
      // a method that does something related to this module...
    };

    return parent;

})(app || {}, jQuery);

{% endhighlight %}

**Loose augmentation** works by declaring the variable `app` when we define our module function, rather than declaring it beforehand with `var app = app || {};`. We also import our app via `app || {}` into our module and alias it as `parent`. Like the earlier examples this allows us to "augment" or add things to our `app`, similar how we did with declaring `var my = {};` and returning it at the end. I've found that the benefit of this approach is that it seems to work a little better with Javascript's asynchronous nature. I ran into a problem with the sub-module pattern in coding [Am I Rent Stabilized?](https://github.com/clhenrick/am-i-rent-stabilized) where all my modules had to load in a very specific order. The approach demonstrated above seems to be a little more flexible.

In both approaches (loose augmentation and sub-modules) I've found it useful to first create one module that contains all variables that will likely need to be referenced from all other modules. As some of the variables will be created at a later point in time they are initially set to `null`. This helps with debugging as well, as if I get an error saying that a variable is `null` I know I haven't assigned it properly as javascript's default behavior is to set a variable to `undefined` if it hasn't been declared.

{% highlight javascript %}
// app.el.js
var app = (function(parent, w, d, $, L, cartodb) {

  // "el" is just an object we store our "public" variables in 
  // so we can pass them between modules
  parent.el = {
    baselayer : new L.StamenTileLayer("toner-lite"),
    sql : new cartodb.SQL({ user: 'chenrick' }),
    taxLots : "nyc_flips_pluto_150712",
    url : w.location.href,
    hashurl : null,
    map : null,
    layerSource : null,
    cdbOptions : null,
    dataLayer : null,
    queriedData: null,
    sum: null,
    tax: null,
    cartocss : null,
    featGroup : null,
    bounds : null,
    center : null,
    topPoint : null,
    centerPoint : null
  };

  return parent;

})(app || {}, window, document, jQuery, L, cartodb);

{% endhighlight %}

Then we create another module that contains all the logic for creating the map using Leaflet.JS and adding our geospatial data layer with CartoDB.JS.

{% highlight javascript %}
// app.map.js
var app = (function(parent, $, L, cartodb){
  // sets up the Leaflet Map and loads the data layer from CartoDB
  
  // reassign the name of our "public" variable container 
  // so that it is easier to reference in our code
  var el = parent.el;

  console.log(el);

  parent.map = {

    init : function() {
      //  map.init() will be called to create our map
      // parameters to pass to Leaflet, such as the map center and zoom
      var params = {
        center : [40.694631,-73.925028],
        minZoom : 9,
        maxZoom : 18,
        zoom : 15, 
        zoomControl : false,
        infoControl: false,
        attributionControl: true
      };

      el.map = new L.Map('map', params);
      el.baselayer.addTo(el.map);
      el.featureGroup = L.featureGroup().addTo(el.map);
      app.map.getCartoDB(el.map);

      new L.Control.Zoom({ position: 'bottomright' }).addTo(el.map);    
    },

    getCartoDB : function(m) {
      // cartodb layer settings for the taxlot data
      el.layerSource = {
          user_name : "chenrick",
          type : "cartodb",
          sublayers : [{
              sql : "SELECT * FROM " + el.taxLots,
              cartocss : el.cartocss.taxLots,
              interactivity: ""
          }]
      };

      // cartodb layer params
      el.cdbOptions = {
          cartodb_logo: false,
          legends: false,
          https: true,
          attributionControl: true
      };

      // create the cartodb layer and add it to the map
      cartodb.createLayer(m, el.layerSource, el.cdbOptions)
          .addTo(m)
          .on('done',function(layer) {
              layer.setZIndex(10); // make sure the cartodb layer is on top
              el.dataLayer = layer.getSubLayer(0);
          });
    }
  }

  return parent;

})(app || {}, jQuery, L, cartodb);

{% endhighlight %}

There are some other modules I won't go into at the moment, but once I have all of the code set up and working the way I want I usually have a final module that starts up the app when its function is called.

{% highlight javascript %}
// app.init.js

var app = (function(parent){
  // start up the app!  
  parent.init = function() {
    app.splitHash();
    app.map.init();
    app.eventListeners();
  }

  return parent;
  
})(app || {});
{% endhighlight %}

In the bottom of the `<body>` tag in the `.html` file where I am using the code I add a script that calls `app.init()` after all of the DOM content has been loaded. 

{% highlight html %}
<!-- the app -->
<!-- fyi these can all later be bundled into one js file for production -->
<script src="js/app.el.js"></script>
<script src="js/app.map.js"></script>
<script src="js/app.cartocss.js"></script>
<script src="js/app.circle.js"></script>
<script src="js/app.hash.js"></script>
<script src="js/app.events.js"></script>
<script src="js/app.init.js"></script>

<!-- this script starts the app after the DOM is loaded -->
<script type="text/javascript">
  jQuery(document).ready(function() {
    app.init();
  });
</script>
{% endhighlight %}

If you'd like to browse the source code of apps I've written that use either the **loose augmentation** or **sub-module** approach with the module pattern in Javascript see the following Github links:

- [Landscapes of Profit](https://github.com/nyc-reic/interactive/) :: uses loose augmentation
- [Bushwick Community Map](https://github.com/clhenrick/BushwickCommunityMap) :: uses sub-modules

Thanks for reading, and please [let me know]({{site.url}}{{base.url}}/contact/) if you have any thoughts on this post or if you found it helpful.

{% comment %}
{% highlight javascript %}
{% endhighlight %}
{% endcomment %}