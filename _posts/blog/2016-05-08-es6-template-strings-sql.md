---
title: ES6 Template Strings For SQL
layout: page
date: 2016-05-08
teaser: "Making SQL queries in JS using ES6 template strings."
header: no
comments: true
tags:
    - Javascript
    - SQL
    - Node.JS
---

One of my favorite features I've discovered recently while learning and using [ES6](http://es6-features.org/#Constants) are Template Strings (officially known as [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)). The reason being is that using them is a huge improvement over of my previous workflow for writing SQL queries in Javascript, which was a huge PITA. This is something I tend to do fairly often when creating a custom web-map or data driven application, or when writing a Node.JS script to wrangle data. In either scenario I'm typically working with [CartoDB](https://cartodb.com)'s [SQL API](http://docs.cartodb.com/cartodb-platform/sql-api/) which lets you perform `GET` and `POST` requests to a PostgreSQL & PostGIS database.

It wasn't until a couple weeks ago after my colleauge [Chris Wong](http://chriswhong.com/) had [tweeted about the topic](https://twitter.com/chris_whong/status/725057071855591424) that I started thinking it would be good to write a blog post on the topic of writing SQL in JS.

![screenshot of Chris Wong's tweet]({{site.urlimg}}chris-wong-tweet-sql-js.png)

For a simple query like `SELECT * FROM some_table;` writing it out in Javascript isn't a big deal. However writing a more complex SQL query, while still keeping it human readable, is anything but fun. This is especially true for dynamically generated queries, for example using the `IN` operator on an array of values coming from elsewhere in my code. It's really a huge headache and involves a lot of string concatenation and debugging to make sure the query is valid. Sure, there are libraries that make creating SQL queries in Javascript easier such as [Sequel](https://github.com/jeremyevans/sequel), but as far as I'm aware of they don't generate *spatial queries with PostGIS*, which is my go-to tool for geoprocessing spatial data. Plus chaining a bunch of functions together to output some SQL just didn't seem that intuitive to me, and ultimately like more work in the long run.

So, **template strings**. They make life easier with creating SQL in Javascript because they let you write out your SQL like you normally would. Here's an example of a query that does a join on two tables.

{% highlight sql %}
SELECT a.year, a.season, b.display_name
FROM table_one a, table_two b
WHERE a.id = b.transmitter AND season != 'other'
GROUP BY a.year, a.season, b.display_name
ORDER BY b.display_name, year;
{% endhighlight %}

Previously, if I wanted to keep the SQL human readable I would've done something like:

{% highlight js %}
var tableOne = 'table_one';
var tableTwo = 'table_two';

var query = "SELECT a.year, a.season, b.display_name " +
"FROM " + tableOne + " a," + tableTwo  " b " +
"WHERE a.id = b.transmitter AND season != 'other' " +
"GROUP BY a.year, a.season, b.display_name " +
"ORDER BY b.display_name, year;"
{% endhighlight %}

Pretty ugly, right? With ES6 template strings the above can become:

{% highlight js %}
const tableOne = 'table_one';
const tableTwo = 'table_two';

let query = `
  SELECT a.year, a.season, b.display_name
  FROM ${tableOne} a, ${tableTwo} b
  WHERE a.id = b.transmitter AND season != 'other'
  GROUP BY a.year, a.season, b.display_name
  ORDER BY b.display_name, year;
  `;
{% endhighlight %}


That's a whole lot easier to write out and makes it a whole lot easier to spot syntax errors in your SQL. There's one catch though, if we were to log that template string as it is right now it would look like:

{% highlight js %}
"  SELECT a.year, a.season, b.display_name
  FROM table_one a, table_two b
  WHERE a.id = b.transmitter AND season != 'other'
  GROUP BY a.year, a.season, b.display_name
  ORDER BY b.display_name, year;"
{% endhighlight %}


That's not how we'd want to pass it off as part of the body to a `GET` request. CartoDB's API is fairly good a removing extra white space, but the newline (`\n`) characters would screw up our query once the API attempts to run it. However, there's an easy way to deal with this problem: use a function that can strip out those pesky `\n`'s and indendation space so that the template string becomes a single line string.

Thanks to a terrific [blog post](https://muffinresearch.co.uk/removing-leading-whitespace-in-es6-template-strings/) by the developer Stuart Colville, that function ends up looking like:

{% highlight js %}
export function singleLineString(strings, ...values) {  
  // Interweave the strings with the
  // substitution vars first.
  let output = '';
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/);

  // Rip out the leading whitespace.
  return lines.map((line) => {
    return line.replace(/^\s+/gm, '');
  }).join(' ').trim();
}
{% endhighlight %}

It could also work in the browser without Babel like this:

{% highlight js %}
var singleLineString = function(strings) {
  var values = Array.prototype.slice.call(arguments, 1);

  // Interweave the strings with the
  // substitution vars first.
  var output = '';
  for (var i = 0; i < values.length; i++) {  
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  var lines = output.split(/(?:\r\n|\n|\r)/);

  // Rip out the leading whitespace.
  return lines.map(function(line) {
    return line.replace(/^\s+/gm, '');  
  }).join(' ').trim();
};
{% endhighlight %}

To apply it to the above query we'd do this:

{% highlight js %}
let query = singleLineString`
  SELECT a.year, a.season, b.display_name
  FROM ${tableOne} a, ${tableTwo} b
  WHERE a.id = b.transmitter AND season != 'other'
  GROUP BY a.year, a.season, b.display_name
  ORDER BY b.display_name, year;
  `;
{% endhighlight %}

Which then outputs a single line of text, the format we'd want it in to pass off to CartoDB's SQL API:

{% highlight js %}
"SELECT a.year, a.season, b.display_name  FROM table_one a, table_two b WHERE a.id = b.transmitter AND season != 'other' GROUP BY a.year, a.season, b.display_name ORDER BY b.display_name, year;"
{% endhighlight %}
