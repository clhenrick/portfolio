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
    - ES6
---

One of my favorite features I've discovered recently while learning [ES6](http://es6-features.org/#Constants) are __Template Strings__ (officially known as [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)). Reason being is that using them is a huge improvement over of my previous method for writing SQL queries in Javascript, which was a huge PITA. This is something I tend to do fairly often when creating a custom web-map or data driven application, or when writing a Node.JS script to wrangle data. In either scenario I'm typically working with [CartoDB](https://cartodb.com)'s [SQL API](http://docs.cartodb.com/cartodb-platform/sql-api/) which lets you perform `GET` and `POST` requests to a PostgreSQL & PostGIS database to retrieve or update data.

It wasn't until a couple weeks ago after my colleague [Chris Wong](http://chriswhong.com/) had [tweeted about the topic](https://twitter.com/chris_whong/status/725057071855591424) that I started thinking it would be good to write a blog post about it.

![screenshot of Chris Wong's tweet]({{site.urlimg}}chris-wong-tweet-sql-js.png)

For a simple query like `SELECT * FROM some_table;` writing it out in Javascript isn't a big deal. However writing a more complex SQL query, while still keeping it human readable, is anything but fun. This is especially true for dynamically generated queries, for example using the `IN` operator on an array of values that are the result of some other process. It's really a huge headache and involves a lot of string concatenation and debugging to make sure the query is valid. Sure, there are libraries that make creating SQL queries in Javascript easier such as [Sequel](https://github.com/jeremyevans/sequel), but as far as I'm aware of they don't generate *spatial queries with PostGIS*, which is one of my go-to tools for geoprocessing or querying spatial data.

So, **template strings**. They make life easier when creating SQL queries in Javascript because they let you write out your SQL like you normally would. Here's an example of a query that does a join on two tables.

{% highlight sql %}
SELECT a.year, a.season, b.display_name
FROM table_one a, table_two b
WHERE a.id = b.transmitter AND season != 'other'
GROUP BY a.year, a.season, b.display_name
ORDER BY b.display_name, year;
{% endhighlight %}

Previously, if I wanted to keep the SQL human readable in my JS code I would've done something like:

{% highlight js %}
var tableOne = 'table_one';
var tableTwo = 'table_two';

var query = "SELECT a.year, a.season, b.display_name " +
"FROM " + tableOne + " a," + tableTwo  " b " +
"WHERE a.id = b.transmitter AND season != 'other' " +
"GROUP BY a.year, a.season, b.display_name " +
"ORDER BY b.display_name, year;"
{% endhighlight %}

You have to be really careful when doing this and not to mention it's pretty ugly, right? With ES6 template strings the above can simply become:

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


That's much easier to write, read, and to avoid syntax errors in your SQL. There's one catch though, if we were to log that template string as it is right now it would look like:

{% highlight js %}
"  SELECT a.year, a.season, b.display_name
  FROM table_one a, table_two b
  WHERE a.id = b.transmitter AND season != 'other'
  GROUP BY a.year, a.season, b.display_name
  ORDER BY b.display_name, year;"
{% endhighlight %}


That's not how we'd want to pass it off as part of the body to a `GET` request to our database. Although CartoDB's API is fairly good a removing extra white space, the newline (`\n`) characters would screw up our query once the API attempts to run it on our database. However, there's an easy way to deal with this problem: use a function that strips out those pesky `\n`'s and indentation space so that the template string becomes a single line string.

Thanks to stumbling across a terrific [blog post](https://muffinresearch.co.uk/removing-leading-whitespace-in-es6-template-strings/) by the developer Stuart Colville, that function ends up looking like:

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

It could also work in the browser without using [Babel](https://babeljs.io/) by writing it like this:

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
"SELECT a.year, a.season, b.display_name FROM table_one a, table_two b WHERE a.id = b.transmitter AND season != 'other' GROUP BY a.year, a.season, b.display_name ORDER BY b.display_name, year;"
{% endhighlight %}

Tah dah! Another neat trick that I mentioned above when using the `IN` operator with an array of values may be demonstrated as follows:

{% highlight js %}
const values = [123, 456, 789, 12];

let query = singleLineString`
  SELECT * FROM table
  WHERE cartodb_id IN (${values});
  `;

{% endhighlight%}

Using ES5 you would first have to convert your array into a string by doing something like `values.join(',');`. However with template strings *you can just pass the array in as is!* The above template string becomes:

{% highlight text %}
"SELECT * FROM table WHERE cartodb_id IN (123, 456, 789, 12);"
{% endhighlight %}

This method is especially useful when creating an `UPSERT` query on the fly. In my case I needed to run a script on a scheduler that stores the most recent data from another API in a CartoDB table and was very happy to not have to use string concatenation.

So there you have it! If you're not using ES6 with Babel yet you can still give it a try using Node.JS, on  [v4.4.2+](http://node.green/#template-literals). I encourage you to give it a try if you haven't already.

Happy SQL + JS 'ing!
