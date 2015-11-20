---
title: Using CartoDB for creating data driven web pages
layout: page
date: 2015-10-07
teaser: "Using CartoDB.js, SQL API with the jQuery Data Tables API to create an interactive resource guide."
header: no
comments: true
tags:
    - data 
    - cartodb 
    - data-tables
---

## Topics Covered
- [Using CartoDB as a datastore](#what-is-cartodb)
- [Scripting your data wrangling workflow ](#scripting-your-data-wrangling-workflow)
- [Using the SQL API to load your data to your website / app](#using-the-cartodb-sql-api)
- [Using the CartoDB JS library to render data on top of an interactive web map](#using-the-cartodb-js-library)

## Background
Recently at Radish Lab I created an interactive resource guide for the [Women's City Club of New York](http://wccny.org/). The goal of the guide is

>to help individuals and organizations access needed low- or no-cost social services, programs, and resources available throughout the five boroughs of New York City. Most entries include address, phone number and website, as well as the neighborhood and community board in which the agency is located.

WCCNY asked to have the guide exist in a searchable and filterable format, so [jQuery DataTables](https://www.datatables.net/) seemed like a practical solution. Additionally because the data is geographic in nature (the majority of the data has detailed street address location information) this meant it could be mapped. As a result I decided to use [CartoDB](http://cartodb.com) to host and map the data.

You can visit the guide by clicking on the image below:
<br><br>
[![screen shot of the WCCNY Resource Guide]({{site.urlimg}}wcc-resource-guide.png)](http://resourceguide.wccny.org/)

## What is CartoDB?
Put simply [CartoDB](http://cartodb.com) is web platform that focuses on making it easy to map and analyze geospatial data. It is built on top of a suite of open source software for database management, GIS, and web-mapping. With CartoDB you can drag and drop data into its dashboard and instantly start prototyping an interactive map data-vizualization or querying your data with [SQL](https://en.wikipedia.org/wiki/SQL). They've built quite a large following in the GIS, web-development, and Cartography world, provide plenty of educational materials and tutorials to get you started, and have great customer service and support.

## Scripting Your Data Wrangling Workflow

One of the great things about using CartoDB is that it provides the full functionality of using [PostgreSQL](http://www.postgresql.org/) (also commonly referred to as Postgres), a very popular open-source relational database, and [PostGIS](http://postgis.net/), an extension for Postgres that allows for working with geospatial data --that is data that has a geometry data type. However, just because CartoDB has the ability to host geospatial data doesn't mean *you have to use it for that.* You can use it like any plain old database and then use their tools to integrate your data with your webpage *without having to set up a server running a database yourself!*

One of the common issues of working with data is having to run similar tasks repeatidly on your data, such as updating, formating, etc. This comes up quite frequently at Radish when we work with clients to create web-interactives that are data driven. Rather than using software such as Excel and having to do a lot of repeated clicking and macros running, we can write SQL code that can be executed each time we need to repeat a task. Then we can simply copy and paste the SQL code from a text editor into the SQL window in CartoDB's dashboard, and run it. You can even do this with a whole series of commands.

A simple task might be to remove any trailing white space from a field that contains text:

{% highlight sql %}
-- remove trailing whitespace
UPDATE table_name 
SET field_name = regexp_replace(field_name, '\s+$', '', 'g');
{% endhighlight %}

Or perhaps you may want to create additional columns based on existing data in a table that will be used by your web app but not displayed to the user. One such example is to simplify data from a field, such as for boroughs:

{% highlight sql %}
-- add a column to store the borough code:
ALTER TABLE table_name ADD COLUMN borough TEXT;

-- add values to the borough column
UPDATE table_name SET borough = 'BK' WHERE addressline2 ILIKE '%brooklyn%';
UPDATE table_name SET borough = 'MN' WHERE addressline2 ILIKE '%new york%';
UPDATE table_name SET borough = 'BX' WHERE addressline2 ILIKE 'bronx%';
UPDATE table_name SET borough = 'QN' WHERE addressline2 ILIKE 'queens%';
UPDATE table_name SET borough = 'SI' WHERE addressline2 ILIKE 'staten island%';
UPDATE table_name SET borough = 'N/A' WHERE addressline2 IS NULL OR addressline2 ILIKE '%n/a%';
UPDATE table_name SET borough = 'N/A' WHERE borough IS NULL;
{% endhighlight %}

Then any time you need to update the data in CartoDB you can just copy and paste your SQL code into the dashboard SQL window and re-run your workflow. As soon as you update your data in CartoDB, the changes will be reflected on any webpage you have that is using that data.

## Using the CartoDB SQL API
On top of a intuitive and easy to use dashboard, CartoDB provides a RESTful SQL API endpoint which allows you to pass SQL queries to your data tables and get back the data in JSON format. As long as your table is "public" in your account you do not need an API Key to perform `SELECT` queries. You may also perform `UPDATE`, `DELETE`, and `INSERT` queries with an API Key generated from your CartoDB account if you'd like. Just be sure to not include your API Key anywhere that is publically visible on your website!

At the time of this writing the CartoDB SQL API endpoint is in the following format:

{% highlight text %}
https://{account}.cartodb.com/api/v2/sql?q={SQL statement}&api_key={Your API key}
{% endhighlight %}

You would simply replace `{account}` with your CartoDB account name and `{SQL statement}` with your SQL query, eg:

{% highlight text %}
https://my_account_name.cartodb.com/api/v2/sql?q=SELECT * FROM my_table
{% endhighlight %}

The Response will be in JSON format and have the following structure:

{% highlight json %}
{
    "rows": [
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
        ...
        ],
    "time": 0.01,
    "fields": {...},
    "total_rows": 1649
}
{% endhighlight %}

Each row has data stored in an object with the column name as the key and that column's respective row as the value:

{% highlight json %}
{
    "nameoforganization": "Community Parents, Inc.",
    "neighborhood": "Bedford-Stuyvesant",
    "addressline1": "90 Chauncey Street",
    "addressline2": "Brooklyn, NY",
    "zipcode": "11233",
    "communityboardnumber": "3",
    "phonenumber": "718-771-4002",
    "alternativecontact": "",
    "website": "http://www.headstartsbc.org",
    "category1": "Pre-School & Childcare",
    ...
}
{% endhighlight %}

For the resource guide we are building for the Women's City Club I pass JSON data from the CartoDB SQL API to the [jQuery Data Table API](https://www.datatables.net/) to render a searchable and interactive HTML table:

{% highlight javascript %}
  // create the dataTable from the CartoDB SQL API response
  var dtable = $('#data-table').DataTable({
    ajax : {
      url : queryURIencoded,
      type : 'GET',
      dataSrc : 'rows'
    },
    order : [[0, "asc"]],
    columns : dtableColumns
  });
{% endhighlight %}

Where `queryURIencoded` is a variable containing the CartoDB SQL API endpoint with the SQL query I've provided, [URI encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI).

## Using the CartoDB JS Library
And why would they call it **Carto**DB if you couldn't make a map with it? CartoDB makes that easy with their javascript library so you can integrate your data hosted on CartoDB with popular web-mapping API's such as [Leaflet JS](https://www.datatables.net/), [Open Layers](http://openlayers.org/), and yes even Google Maps. You can read more about the library in their [documentation](http://docs.cartodb.com/cartodb-platform/cartodb-js.html) and learn how to use it from their [tutorials](http://docs.cartodb.com/tutorials/create_map_cartodbjs.html). 

For the Resource Guide we are building this is how the data being displayed on the map changes, as well as the map's zoom level and extent, after the user applies filters through the UI:

{% highlight javascript %}
function updateMap(ids) {
  var cdb_ids, sql, bbox_sql, sql_encoded, url;
  
  if (ids.length) {
    cdb_ids = ids.join(',');
    // add a "where clause" to our select query
    sql = cdbQuery + " WHERE cartodb_id IN (" + cdb_ids + ")"; 
    // write a PostGIS SQL query to get the bounding box of our features
    bbox_sql = "SELECT St_AsGeoJSON(ST_SetSRID(ST_Extent(the_geom),4326)) as table_extent FROM " + tableName + " WHERE cartodb_id IN (" + cdb_ids + ")";
    sql_encoded = encodeURI(bbox_sql);
    url = cdbEndpoint + sql_encoded;
    getBounds(url);
  
  } else {
    sql = cdbQuery + " WHERE cartodb_id = 0";
  }
  
  // update the features being displayed on the map
  features.setSQL(sql);
    
 } 

function getBounds(url) {
  // pan and zoom the map to fit the geographic bounds of the updated features 
  $.getJSON(url, function(data) {
    var json = JSON.parse(data.rows[0].table_extent),
        coords = json.coordinates[0],
        bounds = [],
        latlng;
  
    for (var i=0; i<coords.length; i++) {        
      // reverse the order of the coordinates as Leaflet likes lat lon, not lon lat!
      latlng = coords[i].reverse(); 
      bounds.push(L.latLng(latlng[0], latlng[1]));
    }
  
    map.fitBounds(L.latLngBounds(bounds));
  });
}
{% endhighlight %}
  
When the user applies filters to the dataset, the Data Tables API sends an array of ids from the filtered rows to the the `updateMap` function. The ids are then joined using using a comma as a delimiter and inserted into an SQL `WHERE` clause. A second query is created that will grab the filtered feature's geographic extent using the PostGIS functions [ST_AsGeoJSON](http://postgis.org/docs/ST_AsGeoJSON.html), [ST_SetSRID](http://postgis.refractions.net/docs/ST_SetSRID.html), and [ST_Extent](http://postgis.net/docs/ST_Extent.html). The first query eventually is passed to the CartoDB javascript library to update the features being displayed on the map. The second query is passed to the function `getBounds` which performs an AJAX request to the CartoDB SQL API endpoint. The features returned from this query are then passed to Leaflet's [map.fitBounds](http://leafletjs.com/reference.html#map-fitbounds) method which centers the map and changes the zoom level to fit the map to a specified geographic area.
  
As you can see, using CartoDB as a database to interact with for your web interactive offers a whole lot of helpful functionality. You don't have to use it specifically for mapping purposes, but it sure doesn't hurt if you are working with geospatial data. 

